import * as fs from "fs/promises";
import { constants } from "fs";
import * as path from "node:path";

export async function checkPathExistence(
  pathEnv: string,
  filename: string
): Promise<string | null> {
  if (!pathEnv) return null;

  const paths = pathEnv.split(path.delimiter);

  for (const p of paths) {
    const fullPath = p.endsWith("/") ? `${p}${filename}` : `${p}/${filename}`;
    try {
      await fs.access(fullPath, constants.F_OK | constants.X_OK);
      return fullPath;
    } catch {
      continue;
    }
  }

  return null;
}
