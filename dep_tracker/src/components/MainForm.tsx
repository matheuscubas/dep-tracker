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

interface packageJson {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export interface Dependencies {
  [key: string]: string;
}

interface filterButtonsProps {
  setState: React.Dispatch<React.SetStateAction<string>>;
  currentState: string;
}

interface toggleButtonsProps {
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  setViewMode: React.Dispatch<React.SetStateAction<string>>;
  filter: string;
  viewMode: string;
}

function FilterButtons({setState, currentState}: filterButtonsProps): ReactElement {
  return (
    <div className="inline-flex shadow-sm" role="group">
      <p className="font-bold text-white content-center mr-2">Filters:</p>
      <Button onClick={() => setState('')}
              className="px-4 py-2 text-sm font-medium text-blue-700 bg-white rounded-[0rem] border border-gray-200 rounded-s-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
              disabled={currentState === ''}>All</Button>
      <Button onClick={() => setState('upgradable')}
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white rounded-[0rem] border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
              disabled={currentState === 'upgradable'}>Upgradable</Button>
      <Button onClick={() => setState('dependency')}
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white rounded-[0rem] border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
              disabled={currentState === 'dependency'}>Dependency</Button>
      <Button onClick={() => setState('devDependency')}
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border rounded-[0rem] border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
              disabled={currentState === 'devDependency'}>DevDependency</Button>
    </div>);
}

function ToggleButtons({setFilter, filter, setViewMode, viewMode}: toggleButtonsProps): ReactElement {
  return (
    <div className="flex justify-between items-center shadow-sm mx-10 mb-1" role="group">
      <FilterButtons setState={setFilter} currentState={filter}/>
      <div>
        <Button disabled={viewMode === 'list'} onClick={() => setViewMode('list')}
                className="text-2xl hover:text-gray-600"><FaThList/></Button>
        <Button disabled={viewMode === 'grid'} onClick={() => setViewMode('grid')}
                className="text-2xl hover:text-gray-600"><BsFillGridFill/></Button>
      </div>
    </div>
  )
}

export default function MainForm() {
  const data = useRef<Array<Dependency>>([]);
  const [filteredData, setFilteredData] = useState<Array<Dependency>>([]);
  const [filter, setFilter] = useState<string>('');
  const hasData: boolean = data.current.length > 0;
  const [viewMode, setViewMode] = useState<string>('list');
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
        const {dependencies, devDependencies}: packageJson =
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
        viewMode === "list" ? <Table tableData={filteredData}
                                     buttons={<ToggleButtons setFilter={setFilter} setViewMode={setViewMode} filter={viewMode} viewMode={viewMode}/>}/> :
          <Gallery galleryData={filteredData}
                   buttons={<ToggleButtons setFilter={setFilter} setViewMode={setViewMode} filter={viewMode} viewMode={viewMode}/>}/>
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
                <Button
                  disabled={formik.isSubmitting}
                  type="submit"
                  onClick={formik.submitForm}
                >
                  Analyze
                </Button>
              </CardFooter>
            </form>
          </FormikProvider>
        </Card>
      )}
    </>
  );
}
