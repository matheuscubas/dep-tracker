import { useField } from "formik";
import { MdError } from "react-icons/md";

interface UploadInputProps {
  label: string;
  name: string;
  description: string;
}

export function UploadInput({ label, name, description }: UploadInputProps) {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className="max-w-lg mx-auto">
      <label
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        htmlFor={name}
      >
        {label}
      </label>
      <input
        className={`block w-full text-sm text-gray-900 border ${
          hasError ? "border-red-500 border-2" : "border-gray-300"
        } rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`}
        {...field}
        aria-describedby={`${name}_help`}
        id={name}
        type="file"
      />
      {hasError ? (
        <p className="text-sm text-red-900 text-left flex font-bold">
          <span>
            <MdError className="mt-1 ml-1" />
          </span>
          <span> {meta.error}!</span>
        </p>
      ) : null}
      <div
        className="mt-1 text-sm text-gray-900 dark:text-gray-300"
        id={`${name}_help`}
      >
        {description}
      </div>
    </div>
  );
}
