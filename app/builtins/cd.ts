import type { BuiltinResult } from "./types";
import process from "node:process";

export async function cd(args: string[]): Promise<BuiltinResult> {
  if (args.length === 0) return { exitCode: 0 };
  let path = args[0];

  if (path === "~") path = process.env.HOME!;

  try {
    process.chdir(path);
    return { exitCode: 0 };
  } catch {
    console.log(`cd: ${path}: No such file or directory`);
  }

  return { exitCode: 1 };
}
