import { Dependency } from "@/api/registry.api.ts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import SemVer from "semver";
import { GiUpgrade } from "react-icons/gi";
import { ReactElement, useState, useEffect } from "react";

interface GalleryProps {
  galleryData: Array<Dependency>;
  buttons: ReactElement;
}

export default function Gallery({ galleryData, buttons }: GalleryProps) {
  const [displayData, setDisplayData] = useState(galleryData);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setDisplayData(galleryData);
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [galleryData]);

  const cards = displayData.map((data) => {
    const current = data.currentVersion.replace(/\^/, "");
    const latest = data.latestVersion;
    const upgradable = SemVer.gt(latest, current);

    return (
      <Card
        key={data.packageName}
        className={`h-auto max-w-full bg-gray-800 text-white hover:bg-gray-600 transition-all duration-300 ease-in-out transform ${
          isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        <CardHeader>
          <CardTitle className="inline-flex items-center justify-normal">
            {data.packageName}
            {upgradable ? <GiUpgrade className="text-yellow-400 text-sm ml-1" /> : ""}
          </CardTitle>
          {data.author ? <CardDescription>by: {data.author}</CardDescription> : ""}
        </CardHeader>
        <CardContent>
          <ul>
            <li className="text-yellow-400 text-sm inline-flex items-center justify-between">
              Project Version: {data.currentVersion}
              {upgradable ? <GiUpgrade className="text-sm ml-1" /> : ""}
            </li>
            <li className="text-sm">
              Latest Version: <b>{data.latestVersion}</b>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <p>
            License: <b>{data.license}</b>
          </p>
        </CardFooter>
      </Card>
    );
  });

  return (
    <div>
      {buttons}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{cards}</div>
    </div>
  );
}
