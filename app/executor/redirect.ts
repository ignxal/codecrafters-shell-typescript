import * as fs from "fs/promises";
import { spawn } from "child_process";

export interface RedirectInfo {
  command: string;
  args: string[];
  outputFile: string;
  fd: number; // 1 = stdout (>), 2 = stderr (2>)
}

export function hasRedirect(input: string): boolean {
  return />/.test(input);
}

export async function parseRedirect(
  command: string,
  args: string[]
): Promise<RedirectInfo | null> {
  const fullCommand = [command, ...args].join(" ");

  const truncateMatch = fullCommand.match(/^(.+?)\s+((1|2)?>)\s*(.+)$/);

  if (truncateMatch) {
    const operator = truncateMatch[2].trim();
    const filePart = truncateMatch[4];
    const cmdPart = truncateMatch[1].trim();

    const parts = cmdPart.split(/\s+/);

    const fd = operator.startsWith("2") ? 2 : 1;

    return {
      command: parts[0],
      args: parts.slice(1),
      outputFile: filePart,
      fd,
    };
  }

  return null;
}

export async function executeWithRedirect(
  redirectInfo: RedirectInfo,
  executablePath: string
): Promise<number> {
  return new Promise((resolve) => {
    const stdio: Array<any> = [
      "inherit",
      redirectInfo.fd === 1 ? "pipe" : "inherit",
      redirectInfo.fd === 2 ? "pipe" : "inherit",
    ];

    const child = spawn(executablePath, redirectInfo.args, { stdio });

    let output = "";

    if (redirectInfo.fd === 1) {
      child.stdout.on("data", (data) => {
        output += data.toString();
      });
    } else if (redirectInfo.fd === 2) {
      child.stderr.on("data", (data) => {
        output += data.toString();
      });
    }

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
