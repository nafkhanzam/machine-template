import * as fs from "https://deno.land/std@0.205.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.205.0/path/mod.ts";
import { TEST_ENV_DIR } from "./shared.ts";
import { assert } from "https://deno.land/std@0.205.0/assert/assert.ts";
import { install } from "../scripts/install-func.ts";
import { assertThrows } from "https://deno.land/std@0.205.0/assert/assert_throws.ts";
import { stub } from "https://deno.land/std@0.205.0/testing/mock.ts";
import { assertEquals } from "https://deno.land/std@0.205.0/assert/assert_equals.ts";

const rootDirName = `root`;
fs.emptyDirSync(TEST_ENV_DIR);
Deno.chdir(TEST_ENV_DIR);
const cwd = Deno.cwd();
const rootDir = path.join(cwd, rootDirName);

function cleanup(): void {
  fs.emptyDirSync(`.`);
  fs.ensureDirSync(rootDir);
}

Deno.test(`should add a symlink on non-existing file.`, () => {
  //? Prepare
  cleanup();
  const fileName = `nested/1/a/.test-dotfile`;
  const machinePath = path.join(cwd, fileName);
  const repoPath = path.join(rootDir, machinePath);
  fs.ensureFileSync(repoPath);
  Deno.writeTextFileSync(repoPath, `test-content`);

  //? Before
  const statBefore = Deno.lstatSync(repoPath);
  assert(statBefore.isFile);
  assert(!fs.existsSync(machinePath));

  //? Action
  install();

  //? After
  const statAfter = Deno.lstatSync(machinePath);
  assert(statAfter.isSymlink);
  assertEquals(Deno.readLinkSync(machinePath), repoPath);
  assert(fs.existsSync(repoPath));
  const stat = Deno.lstatSync(repoPath);
  assert(stat.isFile);
});
