import {Dependency} from "@/api/registry.api.ts";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import SemVer from "semver";
import {GiUpgrade} from "react-icons/gi";

interface GalleryProps {
  galleryData: Array<Dependency>;
}

export default function Gallery({galleryData}: GalleryProps) {
  const cards = galleryData.map(data => {
    const current = data.currentVersion.replace(/\^/, "");
    const latest = data.latestVersion;
    const upgradable = SemVer.gt(latest, current);

    return (
      <Card key={data.packageName} className="h-auto max-w-full bg-gray-800 text-white hover:bg-gray-600">
        <CardHeader>
          <CardTitle className="inline-flex items-center justify-normal">{data.packageName}{upgradable ? <GiUpgrade className="text-yellow-400 text-sm ml-1" /> : ""}</CardTitle>
          {data.author ? <CardDescription>by: {data.author}</CardDescription> : ''}
        </CardHeader>
        <CardContent>
          <ul>
            <li className="text-yellow-400 text-sm inline-flex items-center justify-between">Project Version: {data.currentVersion}{upgradable ? <GiUpgrade className="text-sm ml-1" /> : ""}</li>
            <li className='text-sm'>Latest Version: <b>{data.latestVersion}</b></li>
          </ul>
        </CardContent>
        <CardFooter>
          <p>License: <b>{data.license}</b></p>
        </CardFooter>
      </Card>
    )
  })
  return (

    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {cards}
      {/*<div>*/}
      {/*  <img className="h-auto max-w-full rounded-lg"*/}
      {/*       src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg" alt=""/>*/}
      {/*</div>*/}
    </div>
  )
}