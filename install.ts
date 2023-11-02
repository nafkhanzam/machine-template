//~ deno run -A install.ts

import * as fs from "https://deno.land/std@0.205.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.205.0/path/mod.ts";
import * as assert from "https://deno.land/std@0.205.0/assert/mod.ts";
import { symlinkAll } from "./shared.ts";

const cwd = Deno.cwd();
assert.assertEquals(
  cwd,
  path.resolve(path.dirname(path.fromFileUrl(import.meta.url))),
  `You have to run in the same working directory as the install script!`
);
const currentDate = new Date().toISOString();
const backupDir = path.join(cwd, `.backups/install-${currentDate}`);
const rootDir = path.join(cwd, `root`);

fs.ensureDirSync(rootDir);
symlinkAll(rootDir, rootDir, backupDir);
