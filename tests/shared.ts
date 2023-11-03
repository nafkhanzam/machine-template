import * as fs from "https://deno.land/std@0.205.0/fs/mod.ts";

export const TEST_ENV_DIR = `.test-env`;

export function init(): void {
  if (!Deno.cwd().endsWith(TEST_ENV_DIR)) {
    fs.emptyDirSync(TEST_ENV_DIR);
    Deno.chdir(TEST_ENV_DIR);
  }
}

export function cleanup(rootDir: string): void {
  fs.emptyDirSync(`.`);
  fs.ensureDirSync(rootDir);
}
