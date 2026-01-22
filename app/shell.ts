import { builtins } from "./builtins";
import { executeExternal } from "./executor/executor";
import { extractContent } from "./utils/parser";
import {
  hasRedirect,
  parseRedirect,
  executeWithRedirect,
} from "./executor/redirect";
import { checkPathExistence } from "./utils/path";
import * as fs from "fs/promises";
import * as readline from "readline";

export class Shell {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async run(): Promise<void> {
    while (true) {
      const input = await this.askQuestion("$ ");
      const shouldExit = await this.handleAnswer(input);

      if (shouldExit) {
        this.rl.close();
        break;
      }
    }
  }

  private askQuestion(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }

  private async handleAnswer(input: string): Promise<boolean> {
    const { command, args } = extractContent(input);

    if (!command) return false;

    if (hasRedirect(input)) {
      const redirectInfo = await parseRedirect(command, args);

      if (redirectInfo) {
        if (builtins[redirectInfo.command]) {
          const originalLog = console.log;
          const originalError = console.error;
          let output = "";

          if (redirectInfo.fd === 1) {
            console.log = (...vals: any[]) => {
              output += vals.map((v) => String(v)).join(" ") + "\n";
            };
          } else if (redirectInfo.fd === 2) {
            console.error = (...vals: any[]) => {
              output += vals.map((v) => String(v)).join(" ") + "\n";
            };
          }

          try {
            const result = await builtins[redirectInfo.command](
              redirectInfo.args
            );

            try {
              await fs.writeFile(redirectInfo.outputFile, output);
            } catch {
              originalError(
                `${redirectInfo.command}: ${redirectInfo.outputFile}: No such file or directory`
              );
              return false;
            }

            if (result.shouldExit) {
              process.exitCode = result.exitCode;
              return true;
            }

            return false;
          } finally {
            console.log = originalLog;
            console.error = originalError;
          }
        }

        if (!process.env.PATH) {
          console.error(`${redirectInfo.command}: command not found`);
          return false;
        }

        const executablePath = await checkPathExistence(
          process.env.PATH,
          redirectInfo.command
        );

        if (!executablePath) {
          console.error(`${redirectInfo.command}: command not found`);
          return false;
        }

        await executeWithRedirect(redirectInfo, executablePath);
        return false;
      }
    }

    if (builtins[command]) {
      const result = await builtins[command](args);
      if (result.shouldExit) {
        process.exitCode = result.exitCode;
        return true;
      }
    } else {
      const result = await executeExternal(command, args);

      if (result === 1) console.error(`${input}: command not found`);
    }

    return false;
  }
}
