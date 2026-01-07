import { test, expect } from "bun:test";
import * as fs from "fs/promises";
import * as path from "node:path";
import { makeTempDir, removeDir } from "./utils/tmpDir";
import { checkPathExistence } from "../app/utils/path";

test("checkPathExistence finds executable in single dir", async () => {
  const dir = await makeTempDir();
  const fname = "mycmd";
  const full = path.join(dir, fname);
  await fs.writeFile(full, "");

  const res = await checkPathExistence(dir, fname);
  expect(path.normalize(res!)).toBe(path.normalize(full));

  await removeDir(dir);
});

test("checkPathExistence returns null when not found", async () => {
  const dir = await makeTempDir();
  const res = await checkPathExistence(dir, "nope");
  expect(res).toBeNull();
  await removeDir(dir);
});
