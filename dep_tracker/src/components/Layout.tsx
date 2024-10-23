import {PropsWithChildren} from "react";

export default function Layout({children}: PropsWithChildren) {
  return (
    <div className="container m-0 p-0 w-screen h-screen text-gray-300 font-sans flex flex-col">
      {/* header */}
      <div className="background-color: bg-green-700 w-screen h-32 flex justify-center pb-24 text-center">
        <div>
          <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
              Dep
            </span>
            Tracker™
          </h1>
          <p className="text-gray-900 font-extrabold">
            quickly identify all upgradable dependencies from your project!
          </p>
        </div>
      </div>
      {/* header */}

      {/* body */}
      <div className="mt-2 bg-gray-900 text-gray-400 w-screen max-w-screen h-screen flex justify-center items-center">
        {children}
      </div>
      {/* body */}
    </div>
  );
}
