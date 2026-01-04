import { echo } from "./echo";
import { type } from "./type";
import { exit } from "./exit";
import { pwd } from "./pwd";
import { cd } from "./cd";
import type { BuiltinFn } from "./types";

export const builtins: Record<string, BuiltinFn> = {
  echo,
  type,
  exit,
  pwd,
  cd,
};

export const isBuiltin = (cmd: string): boolean => cmd in builtins;

export * from "./types";
