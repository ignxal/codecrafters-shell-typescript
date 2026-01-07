import * as fs from "fs/promises";
import { spawn } from "child_process";

export interface RedirectInfo {
  command: string;
  args: string[];
  outputFile: string;
}

export function hasRedirect(input: string): boolean {
  return input.includes(">") || input.includes("1>");
}

export async function parseRedirect(
  command: string,
  args: string[]
): Promise<RedirectInfo | null> {
  const fullCommand = [command, ...args].join(" ");

  const truncateMatch = fullCommand.match(/^(.+?)\s*1?>\s*(.+)$/);

  if (truncateMatch) {
    const [cmdPart, filePart] = [
      truncateMatch[1].trim(),
      truncateMatch[2].trim(),
    ];
    const parts = cmdPart.split(/\s+/);
    return {
      command: parts[0],
      args: parts.slice(1),
      outputFile: filePart,
    };
  }

  return null;
}

export async function executeWithRedirect(
  redirectInfo: RedirectInfo,
  executablePath: string
): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn(executablePath, redirectInfo.args, {
      stdio: ["inherit", "pipe", "inherit"],
    });

    let output = "";

    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    child.on("close", async (code) => {
      try {
        await fs.writeFile(redirectInfo.outputFile, output);
        resolve(code ?? 0);
      } catch (error) {
        console.error(
          `${redirectInfo.command}: ${redirectInfo.outputFile}: No such file or directory`
        );
        resolve(1);
      }
    });

    child.on("error", () => {
      console.error(`${redirectInfo.command}: command not found`);
      resolve(127);
    });
  });
}
