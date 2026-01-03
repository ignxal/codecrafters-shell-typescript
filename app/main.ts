import { createInterface } from "readline";

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
    const echoContent = answer.slice(5);
    echo(echoContent);
  } else {
    console.log(`${answer}: command not found`);
  }

  return true;
}

function exit(): void {
  rl.close();
}

function echo(input: string): void {
  console.log(input);
}

function main() {
  askQuestion();
}

main();
