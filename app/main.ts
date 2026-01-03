import { createInterface } from "readline";

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

function type(input: string): void {
  const content = extractContent(input, "type ");
  if (BUILTIN_COMMANDS.includes(content)) {
    return console.log(`${content} is a shell builtin`);
  }

  console.log(`${content}: not found`);
}

function extractContent(command: string, prefix: string): string {
  return command.split(prefix)[1];
}

function main() {
  askQuestion();
}

main();
