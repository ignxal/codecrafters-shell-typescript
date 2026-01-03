import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion() {
  rl.question("$ ", (answer) => {
    console.log(`${answer}: command not found`);
    askQuestion();
  });
}
askQuestion();
