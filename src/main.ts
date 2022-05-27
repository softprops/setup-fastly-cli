import { setFailed, info, addPath, getInput } from "@actions/core";
import * as exec from "@actions/exec";
import * as tc from "@actions/tool-cache";
import * as http from "@actions/http-client";
import * as os from "os";

const TOOL = "fastly-cli";

export async function install(version: string, osPlat: string) {
  const toolPath = tc.find(TOOL, version) || (await download(version, osPlat));

  addPath(toolPath);
}

export function downloadUrl(version: string, osPlat: string): string {
  return `https://github.com/fastly/cli/releases/download/${version}/${fileName(
    version,
    osPlat
  )}`;
}

async function download(version: string, osPlat: string): Promise<string> {
  const url = downloadUrl(version, osPlat);
  const downloadPath = await tc.downloadTool(url);
  const extPath =
    osPlat == "win32"
      ? tc.extractZip(downloadPath)
      : tc.extractTar(downloadPath);

  info(`Downloading and extracting ${url}`);
  return await tc.cacheDir(await extPath, TOOL, version);
}

export function fileName(version: string, osPlat: string): string {
  const platform = osPlat === "win32" ? "windows" : osPlat;
  const ext = osPlat === "win32" ? "zip" : "tar.gz";

  return `fastly_${version}_${platform}-amd64.${ext}`;
}

async function run() {
  try {
    const version = getInput("version") || (await latestVersion());
    if (!version) {
      throw new Error("Failed to resolve latest version");
    }

    await install(version, os.platform());

    const doConfigure = process.env.SKIP_CONFIGURE == undefined;
    if (doConfigure) {
      const fastlyToken = `${process.env.FASTLY_API_TOKEN}`;
      if (fastlyToken == "") {
        throw new Error("Expected FASTLY_API_TOKEN to not be empty");
      }

      await exec.exec("fastly", ["configure", "--token", fastlyToken]);
    }
  } catch (error) {
    setFailed((error as Error).message);
  }
}

async function latestVersion(): Promise<string | undefined> {
  const url = `https://api.github.com/repos/fastly/cli/releases/latest`;
  const client = new http.HttpClient("setup-fastly-cli");
  const resp = (await client.getJson<{ tag_name: string }>(url)).result;
  return resp?.tag_name;
}

if (require.main === module) {
  run();
}
