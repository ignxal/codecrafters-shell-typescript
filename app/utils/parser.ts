export function extractContent(command: string, prefix: string): string {
  return command.split(prefix)[1];
}
