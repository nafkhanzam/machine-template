//~ deno run -A install.ts

import * as fs from "https://deno.land/std@0.205.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.205.0/path/mod.ts";
import { symlinkAll } from "./shared.ts";

export function install(): void {
  const cwd = Deno.cwd();
  const currentDate = new Date().toISOString();
  const backupDir = path.join(cwd, `.backups/install-${currentDate}`);

  const ROOT = Deno.env.get(`ROOT`) ?? `root`;
  const rootDir = path.join(cwd, ROOT);

  fs.ensureDirSync(rootDir);
  symlinkAll(rootDir, rootDir, backupDir);
}
