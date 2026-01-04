import type { BuiltinResult } from "./types";

export async function pwd(): Promise<BuiltinResult> {
  console.log(process.cwd());

  return { exitCode: 0 };
}
