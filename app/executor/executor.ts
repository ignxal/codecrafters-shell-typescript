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

  const programArgCount = args.length + 1;
  const lines: string[] = [];
  lines.push(
    `Program was passed ${programArgCount} args (including program name).`
  );
  lines.push(`Arg #0 (program name): ${command}`);
  args.forEach((x, i) => {
    lines.push(`Arg #${i + 1}: ${x}`);
  });

  const programSignature = args.length
    ? `${command} ${args.join(" ")}`
    : command;

  console.log(
    lines.join("\n") +
      `

Program Signature: ${programSignature}`
  );

  const result = spawnSync(path, args, {
    stdio: "inherit",
    shell: false,
  });

  return result.status ?? 1;
}
