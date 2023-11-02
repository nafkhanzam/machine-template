//~ deno run -A add.ts <file-path>

import * as fs from "https://deno.land/std@0.205.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.205.0/path/mod.ts";
import * as assert from "https://deno.land/std@0.205.0/assert/mod.ts";
import { moveToBackup, symlinkAll } from "./shared.ts";

const cwd = Deno.cwd();
assert.assertEquals(
  cwd,
  path.resolve(path.dirname(path.fromFileUrl(import.meta.url))),
  `You have to run in the same working directory as the add script!`
);
assert.assertEquals(
  1,
  Deno.args.length,
  `Arguments' length must be exactly one.`
);

const [targetPath] = Deno.args;
assert.assert(fs.existsSync(targetPath), `${targetPath} does not exist.`);
const stat = Deno.statSync(targetPath);
assert.assert(
  stat.isFile || stat.isDirectory,
  `${targetPath} is not a file nor a directory!`
);
const currentDate = new Date().toISOString();
const backupDir = path.join(cwd, `.backups/add-${currentDate}`);
const rootDir = path.join(cwd, `root`);
const rootPath = path.join(rootDir, targetPath);

let safe = true;

fs.ensureDirSync(rootDir);
if (fs.existsSync(rootPath)) {
  const result = confirm(
    `${rootPath} exists. Are you sure to replace it? (it will be moved to ${backupDir})`
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
