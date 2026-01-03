import { createInterface } from "readline";
import { checkPathExistence } from "./utils/path";
import { extractContent } from "./utils/parser";

const BUILTIN_COMMANDS = ["exit", "echo", "type"];

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function askQuestion() {
  rl.question("$ ", async (answer) => {
    const askAgain = await handleAnswer(answer);
    if (askAgain) askQuestion();
  });
}

async function handleAnswer(answer: string): Promise<boolean> {
  if (answer === "exit") {
    exit();
    return false;
  } else if (answer.startsWith("echo ")) {
    echo(answer);
  } else if (answer.startsWith("type ")) {
    await type(answer);
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
    const path = await checkPathExistence(process.env.PATH, content);
    if (path) return console.log(`${content} is ${path}`);
  }

  return console.log(`${content}: not found`);
}

function main() {
  askQuestion();
}

main();
