import { test, expect } from "bun:test";
import * as events from "events";
import * as child from "child_process";
import * as fs from "fs/promises";
import {
  hasRedirect,
  parseRedirect,
  executeWithRedirect,
} from "../app/executor/redirect";

test("hasRedirect detects > and 1>", () => {
  expect(hasRedirect("echo hi > out")).toBe(true);
  expect(hasRedirect("echo hi 1> out")).toBe(true);
  expect(hasRedirect("echo hi")).toBe(false);
});

test("parseRedirect extracts command, args, and file", async () => {
  const info = await parseRedirect("echo", ["hello", ">", "output.txt"]);
  expect(info).not.toBeNull();
  expect(info!.command).toBe("echo");
  expect(info!.args).toEqual(["hello"]);
  expect(info!.outputFile).toBe("output.txt");

  const info2 = await parseRedirect("echo", ["hello", "1>", "output.txt"]);
  expect(info2).not.toBeNull();
  expect(info2!.outputFile).toBe("output.txt");
});

class MockChild extends events.EventEmitter {
  stdout = new events.EventEmitter();
}

import { makeTempDir, removeDir } from "./utils/tmpDir";
import * as path from "node:path";

async function runExecuteWithRedirectTest(shouldWrite = true) {
  const tmp = await makeTempDir();
  const scriptPath = path.join(tmp, "echoscript.js");
  await fs.writeFile(scriptPath, 'console.log("hello")');

  const redirectInfo = {
    command: "echo",
    args: [scriptPath],
    outputFile: "testout.txt",
  };

  try {
    if (!shouldWrite) {
      // Use a non-existent directory to force write failure
      redirectInfo.outputFile = path.join(tmp, "no-dir", "testout.txt");
    }

    // Use the current node/bun executable to run the script
    const code = await executeWithRedirect(redirectInfo as any, process.execPath);

    if (shouldWrite) {
      expect(code).toBe(0);
      const out = await fs.readFile(redirectInfo.outputFile, "utf8");
      expect(out).toBe("hello\n");
    } else {
      expect(code).toBe(1);
    }
  } finally {
    try {
      await fs.unlink("testout.txt");
    } catch {}
    await removeDir(tmp);
  }
}

test("executeWithRedirect writes stdout to file", async () => {
  await runExecuteWithRedirectTest(true);
});

test("executeWithRedirect handles write failures", async () => {
  await runExecuteWithRedirectTest(false);
});
