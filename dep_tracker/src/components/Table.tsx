import { Dependency } from "@/api/registry.api";
import { GiUpgrade } from "react-icons/gi";
import SemVer from "semver";

interface TableProps {
  tableData: Array<Dependency>;
}

export default function Table({ tableData }: TableProps) {
  const rows = tableData.map((dependency: Dependency) => {
    const current = dependency.currentVersion.replace(/\^/, "");
    const latest = dependency.latestVersion;
    const upgradable = SemVer.gt(latest, current);

    return (
      <tr
        className="odd:bg-gray-900  even:bg-gray-800 border-b border-gray-700 hover:bg-gray-600  text-white"
        key={dependency.packageName}
      >
        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
          <p className="flex">
            {dependency.packageName + ""}
            {upgradable ? <GiUpgrade className="text-yellow-400" /> : ""}
          </p>
        </th>
        <td className="px-6 py-4">{dependency.description}</td>
        <td className="px-6 py-4">{dependency.author}</td>
        <td className="px-6 py-4">{dependency.maintainers}</td>
        <td className="px-6 py-4">{dependency.keywords}</td>
        <td className="px-6 py-4">{dependency.license}</td>
        <td className={"px-6 py-4" + upgradable ? "text-yellow-400" : ""}>
          {dependency.currentVersion}
        </td>
        <td className={"px-6 py-4" + upgradable ? "text-yellow-400" : ""}>
          {dependency.latestVersion}
        </td>
      </tr>
    );
  });

  const headers = [
    "Package Name",
    "Description",
    "Author",
    "Maintainers",
    "Keywords",
    "License",
    "Current Version",
    "Latest Version",
  ].map((header, index) => {
    return (
      <th scope="col" className="px-6 py-3" key={index}>
        {header}
      </th>
    );
  });

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-10">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>{headers}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}
