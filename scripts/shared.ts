import * as fs from "https://deno.land/std@0.205.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.205.0/path/mod.ts";
import * as assert from "https://deno.land/std@0.205.0/assert/mod.ts";

export function lexistsSync(filePath: string) {
  try {
    Deno.lstatSync(filePath);
    return true;
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
    return false;
  }
}

export function moveToBackup(backupDir: string, src: string): void {
  const targetBackupPath = path.join(backupDir, src);
  fs.ensureDirSync(path.dirname(targetBackupPath));
  fs.moveSync(src, targetBackupPath, { overwrite: true });
}

function symlinkFile(rootDir: string, filePath: string, backupDir: string) {
  assert.assert(filePath.startsWith(rootDir));
  const targetPath = filePath.substring(rootDir.length);
  if (lexistsSync(targetPath)) {
    const result = confirm(
      `${targetPath} exists. Are you sure to replace it? (it will be moved to ${backupDir})`,
    );
    if (!result) {
      return;
    }
    moveToBackup(backupDir, targetPath);
  }
  fs.ensureDirSync(path.dirname(targetPath));
  Deno.symlinkSync(filePath, targetPath);
}

export function symlinkAll(
  rootDir: string,
  src: string,
  backupDir: string,
): void {
  const stat = Deno.lstatSync(src);
  if (stat.isDirectory) {
    for (const f of fs.walkSync(src)) {
      if (f.isDirectory) {
        continue;
      }
      if (f.isFile) {
        symlinkFile(rootDir, f.path, backupDir);
        continue;
      }
      console.warn(`${f.path} is not a file nor a directory. Skipping...`);
    }
  } else if (stat.isFile) {
    symlinkFile(rootDir, src, backupDir);
  }
}
