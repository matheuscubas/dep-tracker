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
import { UploadInput } from "./UploadInput";
import { Dependency, getDependenciesWithVersion } from "../api/registry.api";
import { useState } from "react";
import Table from "./Table";
import Gallery from "@/components/Gallery.tsx";
import { FaThList } from "react-icons/fa";
import { BsFillGridFill } from "react-icons/bs";

interface packageJson {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export interface Dependencies {
  [key: string]: string;
}

export default function MainForm() {
  const [tableData, setTableData] = useState<Array<Dependency>>([]);
  const hasTable: boolean = tableData.length > 0;
  const [viewMode, setViewMode] = useState<string>('list');
  const toggleButtons = (
    <div className="flex justify-end items-center rounded-md shadow-sm mr-10" role="group">
      <Button disabled={viewMode === 'list'} onClick={() => setViewMode('list')} className="text-2xl hover:text-gray-600"><FaThList /></Button>
      <Button disabled={viewMode === 'grid'} onClick={() => setViewMode('grid')} className="text-2xl hover:text-gray-600"><BsFillGridFill /></Button>
    </div>
  )
  const view = viewMode === "list" ? <Table tableData={tableData} buttons={toggleButtons}/> : <Gallery galleryData={tableData} buttons={toggleButtons}/>

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

        const projectDependencies: Dependencies = {
          ...dependencies,
          ...devDependencies,
        };

        try {
          const result: Array<Dependency> = await getDependenciesWithVersion(
            projectDependencies
          );

          setTableData(result);
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

  return (
    <>
      {hasTable ? (
        view
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
