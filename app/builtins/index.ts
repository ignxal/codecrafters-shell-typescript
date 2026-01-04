import { echo } from "./echo";
import { type } from "./type";
import { exit } from "./exit";
import type { BuiltinFn } from "./types";

export const builtins: Record<string, BuiltinFn> = {
  echo,
  type,
  exit,
};

export const isBuiltin = (cmd: string): boolean => cmd in builtins;

export * from "./types";
