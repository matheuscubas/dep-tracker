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
import React, {ChangeEvent, ReactElement, useEffect, useRef, useState} from "react";
import Table from "./Table";
import Gallery from "@/components/Gallery.tsx";
import {FaThList} from "react-icons/fa";
import {BsFillGridFill} from "react-icons/bs";
import SemVer from "semver";
import {MainFormButton} from "@/components/MainForm/Button.tsx";
import {LuLoader2} from "react-icons/lu";
import {Pagination} from "@/components/Pagination.tsx";
import SearchBar from "@/components/SearchBar.tsx";

interface PackageJson {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export interface FilterButtonsProps {
  setState: React.Dispatch<React.SetStateAction<string>>;
  currentState: string;
}

interface ToggleButtonsProps {
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filter: string;
  viewMode: string;
  searchTerm: string;
}

interface DisplayNavBarProps {
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  viewMode: ViewMode;
  filter: string;
  searchTerm: string;
  filteredData: Array<Dependency>;
  getPaginatedData: (arr: Array<Dependency>) => Array<Dependency>;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setIsTransitioning: React.Dispatch<React.SetStateAction<boolean>>;
  isTransitioning: boolean;
  itemsPerPage: number;
}

enum ViewMode {
  LIST = 'list',
  GRID = 'grid',
}

function FilterButtons({setState, currentState}: FilterButtonsProps): ReactElement {
  return (
    <div className="inline-flex shadow-sm text-xs md:text-sm" role="group">
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

function ToggleButtons({
                         setFilter,
                         filter,
                         setViewMode,
                         viewMode,
                         searchTerm,
                         setSearchTerm
                       }: ToggleButtonsProps): ReactElement {
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => setSearchTerm(e.target.value.toLowerCase());

  return (
    <div className="md:flex md:justify-between items-center shadow-sm mx-10 mb-1" role="group">
      <FilterButtons setState={setFilter} currentState={filter}/>
      <SearchBar setSearchTerm={handleChange} searchTerm={searchTerm}/>
      <div className="content-center flex">
        <p className="font-bold text-white content-center mr-2 text-xs md:text-sm md:hidden md:invisible">Display:</p>
        <Button disabled={viewMode === ViewMode.LIST} onClick={() => setViewMode(ViewMode.LIST)}
                className="text-2xl hover:text-gray-600"><FaThList/></Button>
        <Button disabled={viewMode === ViewMode.GRID} onClick={() => setViewMode(ViewMode.GRID)}
                className="text-2xl hover:text-gray-600"><BsFillGridFill/></Button>
        <Button onClick={() => location.reload()}
                className="hover:text-gray-600">New Package</Button>
      </div>
    </div>
  )
}

function DisplayData({
                       viewMode,
                       filter,
                       setViewMode,
                       setFilter,
                       filteredData,
                       getPaginatedData,
                       currentPage,
                       totalPages,
                       setCurrentPage,
                       setIsTransitioning,
                       itemsPerPage,
                       searchTerm,
                       setSearchTerm
                     }: DisplayNavBarProps): ReactElement {
  const paginatedData = getPaginatedData(filteredData);
  let dataToRender: Array<Dependency> = [];

  if (searchTerm) {
    dataToRender = paginatedData.filter(dependency => dependency.packageName.toLowerCase().includes(searchTerm));
  }
  dataToRender = dataToRender.length > 0 ? dataToRender : paginatedData

  return (<>
    {viewMode === ViewMode.LIST ? <Table tableData={dataToRender}
                                         buttons={<ToggleButtons setFilter={setFilter}
                                                                 setViewMode={setViewMode}
                                                                 filter={filter}
                                                                 viewMode={viewMode}
                                                                 searchTerm={searchTerm}
                                                                 setSearchTerm={setSearchTerm}/>}/> :
      <Gallery galleryData={dataToRender}
               buttons={<ToggleButtons setFilter={setFilter}
                                       setViewMode={setViewMode}
                                       filter={filter}
                                       viewMode={viewMode}
                                       searchTerm={searchTerm}
                                       setSearchTerm={setSearchTerm}/>}/>}
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={filteredData.length}
      itemsPerPage={itemsPerPage}
      onPageChange={(page: number) => {
        setIsTransitioning(true);
        setCurrentPage(page);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }}
    />
  </>)

}

export default function MainForm() {
  const data = useRef<Array<Dependency>>([]);
  const [filteredData, setFilteredData] = useState<Array<Dependency>>([]);
  const [filter, setFilter] = useState<string>('');
  const hasData: boolean = data.current.length > 0;
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
  const devDependenciesKeys = useRef<Array<string>>([]);
  const dependenciesKeys = useRef<Array<string>>([]);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = window.innerWidth > 768 ? 6 : 3;
  const [searchTerm, setSearchTerm] = useState<string>('');

  const getPaginatedData = (data: Array<Dependency>): Array<Dependency> => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const mainFormSchema = Yup.object().shape({
    file: Yup.mixed<File>()
      .required("File is required!")
      .test({
        message: "Invalid format or File",
        test: (file, context) => {
          const extension = file.name.toString().split(".").pop();
          const isPackageJson = file.name.toString().startsWith('package')
          const isValid = extension === "json" && isPackageJson;
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
    onSubmit: ({file}): void => {
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        if (!e.target?.result) return;

        const packageJson = e.target.result as string;
        const {dependencies, devDependencies}: PackageJson = JSON.parse(packageJson);

        if (!dependencies || !devDependencies) {
          formik.setFieldError('file', "The provided file's content is not in the expected package.json format");
          formik.setSubmitting(false);
          return;
        }

        devDependenciesKeys.current = Object.keys(devDependencies);
        dependenciesKeys.current = Object.keys(dependencies);

        const projectDependencies: Record<string, string> = {
          ...dependencies,
          ...devDependencies,
        };

        const result: Array<Dependency> = await getDependenciesWithVersion(
          projectDependencies
        );

        data.current = result;
        setFilteredData(result);
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
          const current = dependency?.currentVersion?.replace(/\^/, "");
          const latest = dependency?.latestVersion;
          if (latest && current) {
            return SemVer.gt(latest, current);
          } else {
            return false
          }
        })
        break;
      default:
        filteredResult = data.current;
        break;
    }

    setCurrentPage(1)
    setFilteredData(filteredResult)
  }
  useEffect(handleFilterChange, [filter]);

  return (
    <>
      {hasData ? (
        <DisplayData viewMode={viewMode}
                     filter={filter}
                     setViewMode={setViewMode}
                     setFilter={setFilter}
                     setCurrentPage={setCurrentPage}
                     currentPage={currentPage}
                     getPaginatedData={getPaginatedData}
                     filteredData={filteredData}
                     totalPages={totalPages}
                     setIsTransitioning={setIsTransitioning}
                     isTransitioning={isTransitioning}
                     itemsPerPage={itemsPerPage}
                     searchTerm={searchTerm}
                     setSearchTerm={setSearchTerm}/>
      ) : (
        <Card className="md:w-[700px] bg-green-700 text-gray-900 py-10 my-auto">
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
