import * as fs from "https://deno.land/std@0.205.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.205.0/path/mod.ts";
import * as assert from "https://deno.land/std@0.205.0/assert/mod.ts";
import { lexistsSync, moveToBackup, symlinkAll } from "./shared.ts";

export function add(targetPath: string): void {
  const cwd = Deno.cwd();

  assert.assert(fs.existsSync(targetPath), `${targetPath} does not exist.`);
  const stat = Deno.lstatSync(targetPath);
  assert.assert(
    stat.isFile || stat.isDirectory,
    `${targetPath} is not a file nor a directory!`,
  );
  const currentDate = new Date().toISOString();
  const backupDir = path.join(cwd, `.backups/add-${currentDate}`);

  const ROOT = Deno.env.get(`ROOT`) ?? `root`;
  const rootDir = path.join(cwd, ROOT);
  const rootPath = path.join(rootDir, targetPath);

  let safe = true;

  fs.ensureDirSync(rootDir);
  if (lexistsSync(rootPath)) {
    const result = confirm(
      `${rootPath} exists. Are you sure to replace it? (it will be moved to ${backupDir})`,
    );
    if (result) {
      moveToBackup(backupDir, rootPath);
    } else {
      safe = false;
    }
  }
  if (safe) {
    fs.ensureDirSync(path.dirname(rootPath));
    fs.moveSync(targetPath, rootPath);
    symlinkAll(rootDir, rootPath, backupDir);
  }
}
