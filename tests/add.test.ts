import * as fs from "https://deno.land/std@0.205.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.205.0/path/mod.ts";
import { TEST_ENV_DIR } from "./shared.ts";
import { assert } from "https://deno.land/std@0.205.0/assert/assert.ts";
import { add } from "../add-func.ts";

const rootDirName = `root`;
fs.emptyDirSync(TEST_ENV_DIR);
Deno.chdir(TEST_ENV_DIR);
const cwd = Deno.cwd();
const rootDir = path.join(cwd, rootDirName);
fs.ensureDirSync(rootDir);

Deno.test(
  `should add existing root file and not existing repository file`,
  () => {
    const fileName = `.test-dotfile`;
    const machinePath = path.join(cwd, fileName);
    const repoPath = path.join(rootDir, fileName);
    assert(!fs.existsSync(repoPath));
    fs.ensureFileSync(machinePath);
    add(machinePath);
    assert(fs.existsSync(repoPath));
  }
);
