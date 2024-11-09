export interface RegistryApiResponse {
  name: string;
  version: string;
  type: string;
  description: string;
  keywords: string[];
  repository: Repository;
  funding: Funding;
  license: string;
  author: Author;
  main: string;
  scripts: Scripts;
  _id: string;
  gitHead: string;
  bugs: Bugs;
  homepage: string;
  _nodeVersion: string;
  _npmVersion: string;
  dist: Dist;
  _npmUser: NpmUser;
  directories: Directories;
  maintainers: NpmUser[];
  _npmOperationalInternal: NpmOperationalInternal;
  _hasShrinkwrap: boolean;
}

export interface NpmOperationalInternal {
  host: string;
  tmp: string;
}

export interface NpmUser {
  name: string;
  email: string;
}

export interface Author {
  name: string;
  email: string;
  url: string;
}

export interface Bugs {
  url: string;
}

export interface Directories {}

export interface Dist {
  integrity: string;
  shasum: string;
  tarball: string;
  fileCount: number;
  unpackedSize: number;
  signatures: Signature[];
}

export interface Signature {
  keyid: string;
  sig: string;
}

export interface Funding {
  type: string;
  url: string;
}

export interface Repository {
  type: string;
  url: string;
  directory: string;
}

export interface Scripts {
  postinstall: string;
}

export interface Dependency {
  author?: string;
  currentVersion: string;
  description: string;
  keywords: string[];
  latestVersion: string;
  license: string;
  maintainers: string[];
  packageName: string;
}

export async function getDependenciesWithVersion(
  dependencies: Record<string, string>
): Promise<Array<Dependency>> {
  const packages: Array<string> = Object.keys(dependencies);
  const packagesWithVersion: Array<Dependency> = [];

  for (const package_name of packages) {
    const response: RegistryApiResponse = await getPackageInfo(package_name);

    const filteredResult: Dependency = {
      packageName: response.name,
      description: response.description,
      author: response.author?.name,
      maintainers: response.maintainers.map((npmUser) => npmUser.name),
      latestVersion: response.version,
      currentVersion: dependencies[package_name],
      license: response.license,
      keywords: response.keywords,
    };
    packagesWithVersion.push(filteredResult);
  }

  return packagesWithVersion;
}

export async function getPackageInfo(
  package_name: string
): Promise<RegistryApiResponse> {
  const url: string = `https://registry.npmjs.org/${package_name}/latest`;
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw response;
    }

    return response.json();
  });
}
