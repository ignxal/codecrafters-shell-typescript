// ...existing code...
interface ParsedCommand {
  command: string;
  args: string[];
}

export function extractContent(input: string): ParsedCommand {
  const tokens: string[] = [];
  let token = "";
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let prevBackSlash = false;

  const pushToken = () => {
    if (token.length > 0) {
      tokens.push(token);
      token = "";
    }
  };

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (!prevBackSlash) {
      if (ch === "'" && !inDoubleQuote) {
        inSingleQuote = !inSingleQuote;
        continue;
      }

      if (ch === '"' && !inSingleQuote) {
        inDoubleQuote = !inDoubleQuote;
        continue;
      }

      if (ch === "\\" && !inSingleQuote) {
        prevBackSlash = true;
        continue;
      }

      if (!inSingleQuote && !inDoubleQuote && /\s/.test(ch)) {
        pushToken();
        continue;
      }
    }

    token += ch;
    prevBackSlash = false;
  }

  pushToken();

  const command = tokens[0] || "";
  const args = tokens.slice(1);
  return { command, args };
}
