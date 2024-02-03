import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadInput } from "./UploadInput";

export default function MainForm() {
  const mainFormSchema = Yup.object().shape({
    file: Yup.mixed()
      .required("File is required!")
      .test({
        message: "Invalid format",
        test: (file, context) => {
          const extension = file.toString().split(".").pop();
          const isValid = extension === "json";
          if (!isValid) context?.createError();
          return isValid;
        },
      }),
  });

  const formik = useFormik({
    initialValues: {
      file: "",
    },
    validationSchema: mainFormSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <Card className="md:w-[700px] bg-green-700 text-gray-900 md:ml-[500px] mt-10 ">
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
            <Button disabled={formik.isSubmitting} type="submit">
              Analyze
            </Button>
          </CardFooter>
        </form>
      </FormikProvider>
    </Card>
  );
}
