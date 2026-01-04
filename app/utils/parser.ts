// ...existing code...
interface ParsedCommand {
  command: string;
  args: string[];
}

export function extractContent(input: string): ParsedCommand {
  const tokens: string[] = [];
  let token = "";
  let inSingleQuote = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    console.log(`current ch: ${ch}`);

    if (ch === "'") {
      inSingleQuote = !inSingleQuote;
      console.log(`SINGLE QUOTE ACTIVE: ${inSingleQuote}`);
      continue;
    }

    if (!inSingleQuote && /\s/.test(ch)) {
      if (token.length > 0) {
        tokens.push(token);
        token = "";
      }

      continue;
    }

    token += ch;
  }

  if (token.length > 0) tokens.push(token);

  const command = tokens[0] || "";
  const args = tokens.slice(1);
  return { command, args };
}
