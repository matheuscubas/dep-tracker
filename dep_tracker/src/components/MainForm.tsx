import {FormikProvider, useFormik} from "formik";
import * as Yup from "yup";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {UploadInput} from "./UploadInput";
import {Dependency, getDependenciesWithVersion} from "../api/registry.api";
import React, {ReactElement, useEffect, useRef, useState} from "react";
import Table from "./Table";
import Gallery from "@/components/Gallery.tsx";
import {FaThList} from "react-icons/fa";
import {BsFillGridFill} from "react-icons/bs";
import SemVer from "semver";
import {MainFormButton} from "@/components/MainForm/Button.tsx";
import {LuLoader2} from "react-icons/lu";

interface PackageJson {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export interface Dependencies {
  [key: string]: string;
}

export interface FilterButtonsProps {
  setState: React.Dispatch<React.SetStateAction<string>>;
  currentState: string;
}

interface ToggleButtonsProps {
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
  filter: string;
  viewMode: string;
}

interface DisplayNavBarProps {
  viewMode: ViewMode;
  filter: string;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  filteredData: Array<Dependency>;
}

enum ViewMode {
  LIST = 'list',
  GRID = 'grid',
}

function FilterButtons({setState, currentState}: FilterButtonsProps): ReactElement {
  return (
    <div className="inline-flex shadow-sm" role="group">
      <p className="font-bold text-white content-center mr-2">Filters:</p>
      <MainFormButton onClick={() => setState('')}
                      disabled={currentState === ''}
                      className="rounded-s-lg border">All</MainFormButton>
      <MainFormButton onClick={() => setState('upgradable')}
                      disabled={currentState === 'upgradable'}
                      className="border-t border-b">Upgradable</MainFormButton>
      <MainFormButton onClick={() => setState('dependency')}
                      disabled={currentState === 'dependency'}
                      className="border-t border-b">Dependency</MainFormButton>
      <MainFormButton onClick={() => setState('devDependency')}
                      disabled={currentState === 'devDependency'}
                      className="rounded-e-lg">DevDependency</MainFormButton>
    </div>);
}

function ToggleButtons({setFilter, filter, setViewMode, viewMode}: ToggleButtonsProps): ReactElement {
  return (
    <div className="flex justify-between items-center shadow-sm mx-10 mb-1" role="group">
      <FilterButtons setState={setFilter} currentState={filter}/>
      <div>
        <Button disabled={viewMode === ViewMode.LIST} onClick={() => setViewMode(ViewMode.LIST)}
                className="text-2xl hover:text-gray-600"><FaThList/></Button>
        <Button disabled={viewMode === ViewMode.GRID} onClick={() => setViewMode(ViewMode.GRID)}
                className="text-2xl hover:text-gray-600"><BsFillGridFill/></Button>
      </div>
    </div>
  )
}

function DisplayData({viewMode, filter, setViewMode, setFilter, filteredData}: DisplayNavBarProps): ReactElement {
  return (viewMode === ViewMode.LIST ? <Table tableData={filteredData}
                                              buttons={<ToggleButtons setFilter={setFilter} setViewMode={setViewMode}
                                                                      filter={filter} viewMode={viewMode}/>}/> :
    <Gallery galleryData={filteredData}
             buttons={<ToggleButtons setFilter={setFilter} setViewMode={setViewMode} filter={filter}
                                     viewMode={viewMode}/>}/>)
}

export default function MainForm() {
  const data = useRef<Array<Dependency>>([]);
  const [filteredData, setFilteredData] = useState<Array<Dependency>>([]);
  const [filter, setFilter] = useState<string>('');
  const hasData: boolean = data.current.length > 0;
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
  const devDependenciesKeys = useRef<Array<string>>([]);
  const dependenciesKeys = useRef<Array<string>>([]);

  const mainFormSchema = Yup.object().shape({
    file: Yup.mixed<File>()
      .required("File is required!")
      .test({
        message: "Invalid format",
        test: (file, context) => {
          const extension = file.name.toString().split(".").pop();
          const isValid = extension === "json";
          if (!isValid) context?.createError();

          return isValid;
        },
      }),
  });

  const formik = useFormik({
    initialValues: {
      file: undefined,
    },
    validationSchema: mainFormSchema,
    onSubmit: ({file}) => {
      const reader = new FileReader();
      if (!file) return;
      reader.onload = async (e) => {
        if (!e.target?.result) return;

        const packageJson = e.target.result as string;
        const {dependencies, devDependencies}: PackageJson =
          JSON.parse(packageJson);

        devDependenciesKeys.current = Object.keys(devDependencies);
        dependenciesKeys.current = Object.keys(dependencies);

        const projectDependencies: Dependencies = {
          ...dependencies,
          ...devDependencies,
        };

        try {
          const result: Array<Dependency> = await getDependenciesWithVersion(
            projectDependencies
          );

          data.current = result;
          setFilteredData(result);
        } catch (error: unknown) {
          // ADD ERROR HANDLING COMPONENT
          if (error instanceof Response) {
            console.log(
              `${error.url
                .replace("https://registry.npmjs.org/", "")
                .replace("/latest", "")}:`,
              await error.json()
            );
          }

          if (error instanceof TypeError) {
            console.log(error);
          }
        }
      };
      reader.readAsText(file, "UTF-8");
    },
  });

  const handleFilterChange = () => {
    setFilteredData(data.current)
    let filteredResult: Array<Dependency>

    switch (filter) {
      case "devDependency":
        filteredResult = data.current.filter((dependency) => {
          return devDependenciesKeys.current.includes(dependency.packageName)
        })
        break;
      case "dependency":
        filteredResult = data.current.filter((dependency) => {
          return dependenciesKeys.current.includes(dependency.packageName)
        })
        break;
      case "upgradable":
        filteredResult = data.current.filter((dependency) => {
          const current = dependency.currentVersion.replace(/\^/, "");
          const latest = dependency.latestVersion;

          return SemVer.gt(latest, current);
        })
        break;
      default:
        filteredResult = data.current;
        break;
    }

    setFilteredData(filteredResult)
  }
  useEffect(handleFilterChange, [filter]);

  return (
    <>
      {hasData ? (
        <DisplayData viewMode={viewMode} filter={filter} setViewMode={setViewMode} setFilter={setFilter}
                     filteredData={filteredData}/>
      ) : (
        <Card className="md:w-[700px] bg-green-700 text-gray-900 py-10">
          <CardHeader>
            <CardTitle>Upload your package.json file</CardTitle>
            <CardDescription className="text-gray-900">
              this will check your dependencies!
            </CardDescription>
          </CardHeader>
          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
              <CardContent>
                <UploadInput
                  label="Package"
                  name="file"
                  description="Upload your package.json file to analyze your dependencies"
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                {formik.isSubmitting ? <Button disabled>
                  <LuLoader2 className="mr-2 h-4 w-4 animate-spin"/>
                  Please wait..
                </Button> : <Button
                  disabled={formik.isSubmitting}
                  type="submit"
                  onClick={formik.submitForm}
                >
                  Analyze
                </Button>
                }
              </CardFooter>
            </form>
          </FormikProvider>
        </Card>
      )}
    </>
  );
}
