import { checkPathExistence } from "../utils/path";
import { isBuiltin } from ".";
import type { BuiltinResult } from "./types";

export async function type(args: string[]): Promise<BuiltinResult> {
  if (args.length === 0) return { exitCode: 0 };

  const cmd = args[0];

  if (isBuiltin(cmd)) {
    console.log(`${cmd} is a shell builtin`);
    return { exitCode: 0 };
  }

  if (process.env.PATH) {
    const path = await checkPathExistence(process.env.PATH, cmd);
    if (path) {
      console.log(`${cmd} is ${path}`);
      return { exitCode: 0 };
    }
  }

  console.error(`${cmd}: not found`);
  return { exitCode: 1 };
}
