import {PropsWithChildren} from "react";

export default function Layout({children}: PropsWithChildren) {
  return (
    <div className="container m-0 p-0 w-screen h-screen text-gray-300 font-sans flex flex-col">
      <div className="bg-green-700 w-screen h-32 flex justify-center pb-24">
        <div>
          <h1
            className="text-center mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
              Dep
            </span>
            Tracker™
          </h1>
          <p className="text-center text-gray-900 font-extrabold">
            quickly identify all upgradable from your dependencies!
          </p>
        </div>
      </div>
      <div className="mt-2 bg-gray-900 text-gray-400 w-screen h-screen flex items-center flex-col">
        {children}
      </div>
    </div>
  );
}
