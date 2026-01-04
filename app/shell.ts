import { builtins } from "./builtins";
import { executeExternal } from "./executor/executor";
import { extractContent } from "./utils/parser";
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

    if (builtins[command]) {
      const result = await builtins[command](args);
      if (result.shouldExit) {
        process.exitCode = result.exitCode;
        return true;
      }
    } else {
      const result = await executeExternal(command, args);

      if (result === 1) console.log(`${input}: command not found`);
    }

    return false;
  }
}
