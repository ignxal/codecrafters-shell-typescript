import { test, expect } from "bun:test";
import { executeExternal } from "../app/executor/executor";

test("executeExternal returns 1 when PATH missing", async () => {
  const origPath = process.env.PATH;
  delete process.env.PATH;
  try {
    const r = await executeExternal("cmd", []);
    expect(r).toBe(1);
  } finally {
    process.env.PATH = origPath;
  }
});
