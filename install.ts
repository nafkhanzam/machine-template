//~ deno run -A install.ts

import * as fs from "https://deno.land/std@0.205.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.205.0/path/mod.ts";
import * as assert from "https://deno.land/std@0.205.0/assert/mod.ts";

const cwd = Deno.cwd();
assert.assertEquals(
  cwd,
  path.resolve(path.dirname(path.fromFileUrl(import.meta.url))),
  `You have to run in the same working directory as the install script!`
);
const currentDate = new Date().toISOString();
const backupDir = path.join(cwd, `.backups/${currentDate}`);
const rootDir = path.join(cwd, `root`);

function moveToBackup(src: string): void {
  const targetBackupPath = path.join(backupDir, src);
  fs.ensureFileSync(targetBackupPath);
  fs.moveSync(src, targetBackupPath, { overwrite: true });
}

fs.ensureDirSync(rootDir);
for (const f of fs.walkSync(rootDir)) {
  const targetPath = f.path.substring(rootDir.length);
  if (f.isDirectory) {
    continue;
  }
  if (f.isFile) {
    if (fs.existsSync(targetPath)) {
      const result = confirm(
        `${targetPath} exists. Are you sure to replace it? (it will be moved to ${backupDir})`
      );
      if (!result) {
        continue;
      }
      moveToBackup(targetPath);
    }
    fs.ensureSymlinkSync(f.path, targetPath);
    continue;
  }
  alert(`${f.path} is not a file nor a directory. Fix this!`);
}
