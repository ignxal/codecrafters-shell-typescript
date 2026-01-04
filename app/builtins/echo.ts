import type { BuiltinResult } from "./types";

export async function echo(args: string[]): Promise<BuiltinResult> {
  console.log(args.join(" "));

  return { exitCode: 0 };
}
