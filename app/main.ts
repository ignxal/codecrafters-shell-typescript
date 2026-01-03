import { createInterface } from "readline";
import * as fs from "fs/promises";
import { constants } from "fs";

const BUILTIN_COMMANDS = ["exit", "echo", "type"];

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion() {
  rl.question("$ ", (answer) => {
    const askAgain = handleAnswer(answer);
    if (askAgain) askQuestion();
  });
}

function handleAnswer(answer: string): boolean {
  if (answer === "exit") {
    exit();
    return false;
  } else if (answer.startsWith("echo ")) {
    echo(answer);
  } else if (answer.startsWith("type ")) {
    type(answer);
  } else {
    console.log(`${answer}: command not found`);
  }

  return true;
}

function exit(): void {
  rl.close();
}

function echo(input: string): void {
  const content = extractContent(input, "echo ");
  console.log(content);
}

async function type(input: string): Promise<void> {
  const content = extractContent(input, "type ");

  if (BUILTIN_COMMANDS.includes(content)) {
    return console.log(`${content} is a shell builtin`);
  }

  if (process.env.PATH) {
    const path = await checkPathExistence(process.env.PATH);
    if (path) return console.log(`${content} is ${path}`);
  }

  return console.log(`${content}: not found`);
}

async function checkPathExistence(path: string): Promise<string | null> {
  if (!path) return null;

  const paths = path.split(":");

  for (const p of paths) {
    try {
      await fs.access(p, constants.F_OK | constants.X_OK);
      return p;
    } catch {
      continue;
    }
  }

  return null;
}

function extractContent(command: string, prefix: string): string {
  return command.split(prefix)[1];
}

function main() {
  askQuestion();
}

main();
