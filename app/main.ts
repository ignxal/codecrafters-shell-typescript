import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion() {
  rl.question("$ ", (answer) => {
    if (answer === "exit") {
      rl.close();
      return;
    }

    if (answer.startsWith("echo ")) {
      const echoContent = answer.slice(5);
      echo(echoContent);
      askQuestion();
      return;
    }

    console.log(`${answer}: command not found`);
    askQuestion();
  });
}

function echo(input: string): void {
  return console.log(input);
}

askQuestion();
