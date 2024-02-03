import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="container m-0 p-0 w-screen h-screen text-gray-300 font-sans flex flex-col">
      <div className="background-color: bg-green-700 w-screen h-28 flex justify-center">
        <div>
          <h1 className="pl-4 mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
              Dep
            </span>
            Tracker™
          </h1>
          <p className="text-center text-gray-900 font-extrabold">
            quickly, identify all upgrades from your dependencies!
          </p>
        </div>
      </div>
      {/* header */}
      {/* header */}

      {/* body */}
      <div className="place-self-center mt-2 bg-gray-900 text-gray-400">
        {children}
      </div>
      {/* body */}
    </div>
  );
}
