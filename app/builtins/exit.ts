import type { BuiltinResult } from "./types";

export async function exit(args: string[]): Promise<BuiltinResult> {
  const code = args[0] ? parseInt(args[0], 10) : 0;

  return {
    exitCode: isNaN(code) ? 0 : code,
    shouldExit: true,
  };
}
