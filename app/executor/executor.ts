import { spawnSync } from "child_process";
import { checkPathExistence } from "../utils/path";

export async function executeExternal(
  command: string,
  args: string[]
): Promise<number> {
  const path = await checkPathExistence(command, "");

  if (!path) {
    return 127;
  }

  const result = spawnSync(path, args, {
    stdio: "inherit",
    shell: false,
  });

  return result.status ?? 1;
}
