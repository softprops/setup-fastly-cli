import { fileName, downloadUrl } from "../src/main";
import * as assert from "assert";

describe("main", () => {
  describe("fileName", () => {
    it("generates linux file names", () => {
      assert.equal(fileName("1.0", "linux"), "fastly_1.0_linux-amd64.tar.gz");
    });
    it("generates osx file names", () => {
      assert.equal(fileName("1.0", "darwin"), "fastly_1.0_darwin-amd64.tar.gz");
    });
    it("generates windows file names", () => {
      assert.equal(fileName("1.0", "win32"), "fastly_1.0_windows-amd64.zip");
    });
  });
  describe("downloadUrl", () => {
    it("generates urls for downloading cli", () => {
      assert.equal(
        downloadUrl("1.0", "linux"),
        "https://github.com/fastly/cli/releases/download/1.0/fastly_1.0_linux-amd64.tar.gz"
      );
    });
  });
});
