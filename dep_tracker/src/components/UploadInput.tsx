interface UploadInputProps {
  label: string;
  name: string;
  description: string;
}

export function UploadInput({ label, name, description }: UploadInputProps) {
  <div className="max-w-lg mx-auto">
    <label
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      htmlFor={name}
    >
      {label}
    </label>
    <input
      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
      aria-describedby={`${name}_help`}
      id={name}
      type="file"
    />
    <div
      className="mt-1 text-sm text-gray-500 dark:text-gray-300"
      id={`${name}_help`}
    >
      {description}
    </div>
  </div>;
}
