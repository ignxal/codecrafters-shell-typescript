import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";

export async function makeTempDir(prefix = "ct-") {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
  return dir;
}

export async function removeDir(dir: string) {
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch {}
}
