import { test, expect } from "bun:test";
import * as fs from "fs/promises";
import * as path from "node:path";
import { makeTempDir, removeDir } from "./utils/tmpDir";
import { echo } from "../app/builtins/echo";
import { type } from "../app/builtins/type";
import { exit } from "../app/builtins/exit";
import { pwd } from "../app/builtins/pwd";
import { cd } from "../app/builtins/cd";

function captureLog() {
  const logs: string[] = [];
  const orig = console.log;
  console.log = (...args: any[]) => logs.push(args.join(" "));
  return () => {
    console.log = orig;
    return logs;
  };
}

function captureErr() {
  const errs: string[] = [];
  const orig = console.error;
  console.error = (...args: any[]) => errs.push(args.join(" "));
  return () => {
    console.error = orig;
    return errs;
  };
}

test("echo prints joined args", async () => {
  const restore = captureLog();
  await echo(["hello", "world"]);
  const logs = restore();
  expect(logs[0]).toBe("hello world");
});

test("exit returns correct codes and shouldExit", async () => {
  const r1 = await exit([]);
  expect(r1.exitCode).toBe(0);
  expect(r1.shouldExit).toBe(true);

  const r2 = await exit(["2"]);
  expect(r2.exitCode).toBe(2);
  expect(r2.shouldExit).toBe(true);

  const r3 = await exit(["notnum"]);
  expect(r3.exitCode).toBe(0);
  expect(r3.shouldExit).toBe(true);
});

test("pwd prints cwd", async () => {
  const restore = captureLog();
  await pwd();
  const logs = restore();
  expect(logs[0]).toBe(process.cwd());
});

test("cd to ~ uses HOME and non-existent prints error", async () => {
  const tmp = await makeTempDir();
  const origCwd = process.cwd();
  const origHome = process.env.HOME;
  process.env.HOME = tmp;

  try {
    const r = await cd(["~"]);
    expect(r.exitCode).toBe(0);
    expect(process.cwd()).toBe(path.normalize(tmp));

    const restoreErr = captureErr();
    const r2 = await cd(["does-not-exist-12345"]);
    const errs = restoreErr();
    expect(r2.exitCode).toBe(1);
    expect(errs[0]).toMatch(/cd: .*: No such file or directory/);
  } finally {
    process.env.HOME = origHome;
    process.chdir(origCwd);
    await removeDir(tmp);
  }
});

test("type identifies builtins and external paths", async () => {
  const restoreLog = captureLog();

  await type(["echo"]);
  const logs1 = restoreLog();
  expect(logs1[0]).toMatch(/echo is a shell builtin/);

  const tmp = await makeTempDir();
  const cmd = "fakecmd";
  const full = path.join(tmp, cmd);
  await fs.writeFile(full, "");
  const origPath = process.env.PATH;
  process.env.PATH = tmp;

  try {
    const r = await type([cmd]);
    const logs2 = captureLog()();
    const restoreLog2 = captureLog();
    await type([cmd]);
    const logs3 = restoreLog2();
    expect(logs3[0]).toMatch(/is .*fakecmd/);
  } finally {
    process.env.PATH = origPath;
    await removeDir(tmp);
  }
});
