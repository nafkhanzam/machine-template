import * as fs from "https://deno.land/std@0.205.0/fs/mod.ts";
import * as assert from "https://deno.land/std@0.205.0/assert/mod.ts";

export function symlinkAll(
  rootDir: string,
  srcDir: string,
  backup?: { fn: (path: string) => void; dir: string }
): void {
  for (const f of fs.walkSync(srcDir)) {
    assert.assert(f.path.startsWith(rootDir));
    const targetPath = f.path.substring(rootDir.length);
    if (f.isDirectory) {
      continue;
    }
    if (f.isFile) {
      if (fs.existsSync(targetPath)) {
        let backupMsg = "";
        if (backup?.dir) {
          backupMsg = ` (it will be moved to ${backup.dir})`;
        }
        const result = confirm(
          `${targetPath} exists. Are you sure to replace it?${backupMsg}`
        );
        if (!result) {
          continue;
        }
        backup?.fn(targetPath);
      }
      fs.ensureSymlinkSync(f.path, targetPath);
      continue;
    }
    alert(`${f.path} is not a file nor a directory. Fix this!`);
  }
}
