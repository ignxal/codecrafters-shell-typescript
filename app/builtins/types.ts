export interface BuiltinResult {
  exitCode: number;
  shouldExit?: boolean;
}

export type BuiltinFn = (args: string[]) => Promise<BuiltinResult>;
