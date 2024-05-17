import { Dependencies } from '../components/MainForm';

export interface RegisteryApiResponse {
    name:                    string;
    version:                 string;
    type:                    string;
    description:             string;
    keywords:                string[];
    repository:              Repository;
    funding:                 Funding;
    license:                 string;
    author:                  Author;
    main:                    string;
    scripts:                 Scripts;
    _id:                     string;
    gitHead:                 string;
    bugs:                    Bugs;
    homepage:                string;
    _nodeVersion:            string;
    _npmVersion:             string;
    dist:                    Dist;
    _npmUser:                NpmUser;
    directories:             Directories;
    maintainers:             NpmUser[];
    _npmOperationalInternal: NpmOperationalInternal;
    _hasShrinkwrap:          boolean;
}

export interface NpmOperationalInternal {
    host: string;
    tmp:  string;
}

export interface NpmUser {
    name:  string;
    email: string;
}

export interface Author {
    name:  string;
    email: string;
    url:   string;
}

export interface Bugs {
    url: string;
}

export interface Directories {
}

export interface Dist {
    integrity:    string;
    shasum:       string;
    tarball:      string;
    fileCount:    number;
    unpackedSize: number;
    signatures:   Signature[];
}

export interface Signature {
    keyid: string;
    sig:   string;
}

export interface Funding {
    type: string;
    url:  string;
}

export interface Repository {
    type:      string;
    url:       string;
    directory: string;
}

export interface Scripts {
    postinstall: string;
}

export class Convert {
    public static toRegisteryApiResponse(json: string): RegisteryApiResponse {
        return JSON.parse(json);
    }

    public static RegisteryApiResponseToJson(value: RegisteryApiResponse): string {
        return JSON.stringify(value);
    }
}

export interface dependency {
  name: string,
  version: string;
}

export async function getDependenciesWithVersion(dependencies: Dependencies) {
  const packages: Array<string> = Object.keys(dependencies);
  const packagesWithVersion: Array<dependency> = []
  
  for (const package_name of packages) {
    const response: RegisteryApiResponse = await getPackageInfo(package_name)
    const filteredResult: dependency = { name: response.name, version: response.version }
    packagesWithVersion.push(filteredResult)
  }

  console.log(packagesWithVersion);
  
  return packagesWithVersion;
}

export async function getPackageInfo(package_name:string) {
  const url: string = `https://registry.npmjs.org/${package_name}/latest`
  return fetch(url)
    .then(value => value.json());
}
