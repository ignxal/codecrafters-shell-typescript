import { spawnSync } from "child_process";
import { checkPathExistence } from "../utils/path";

export async function executeExternal(
  command: string,
  args: string[]
): Promise<number> {
  if (!process.env.PATH) {
    return 1;
  }

  const path = await checkPathExistence(process.env.PATH, command);

  if (!path) {
    return 1;
  }

  const result = spawnSync(path, args, {
    stdio: "inherit",
    shell: false,
    argv0: command,
  });

  return result.status ?? 1;
}
