import { assert } from "https://deno.land/std@0.205.0/assert/assert.ts";
import { assertEquals } from "https://deno.land/std@0.205.0/assert/assert_equals.ts";
import * as fs from "https://deno.land/std@0.205.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.205.0/path/mod.ts";
import { stub } from "https://deno.land/std@0.205.0/testing/mock.ts";
import { install } from "../scripts/install-func.ts";
import { TEST_ENV_DIR } from "./shared.ts";

const rootDirName = `root`;
fs.emptyDirSync(TEST_ENV_DIR);
Deno.chdir(TEST_ENV_DIR);
const cwd = Deno.cwd();
const rootDir = path.join(cwd, rootDirName);

function cleanup(): void {
  fs.emptyDirSync(`.`);
  fs.ensureDirSync(rootDir);
}

Deno.test(`should add a symlink on non-existing machine file`, () => {
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

Deno.test(
  `should not add a symlink on existing machine file with no response`,
  () => {
    //? Prepare
    cleanup();
    const fileName = `nested/1/a/.test-dotfile`;
    const machinePath = path.join(cwd, fileName);
    const repoPath = path.join(rootDir, machinePath);
    fs.ensureFileSync(machinePath);
    Deno.writeTextFileSync(machinePath, `test-content`);
    fs.ensureFileSync(repoPath);
    Deno.writeTextFileSync(repoPath, `test-content-in-repo`);

    //? Before
    assert(Deno.lstatSync(repoPath).isFile);
    assert(Deno.lstatSync(machinePath).isFile);

    //? Action
    const st = stub(window, "confirm", () => false);
    install();
    st.restore();

    //? After
    assert(Deno.lstatSync(repoPath).isFile);
    assert(Deno.lstatSync(machinePath).isFile);
    assertEquals(Deno.readTextFileSync(repoPath), `test-content-in-repo`);
    assertEquals(Deno.readTextFileSync(machinePath), `test-content`);
  }
);

Deno.test(
  `should add a symlink on existing machine file with yes response`,
  () => {
    //? Prepare
    cleanup();
    const fileName = `nested/1/a/.test-dotfile`;
    const machinePath = path.join(cwd, fileName);
    const repoPath = path.join(rootDir, machinePath);
    fs.ensureFileSync(machinePath);
    Deno.writeTextFileSync(machinePath, `test-content`);
    fs.ensureFileSync(repoPath);
    Deno.writeTextFileSync(repoPath, `test-content-in-repo`);

    //? Before
    assert(Deno.lstatSync(repoPath).isFile);
    assert(Deno.lstatSync(machinePath).isFile);

    //? Action
    const st = stub(window, "confirm", () => true);
    install();
    st.restore();

    //? After
    const statAfter = Deno.lstatSync(machinePath);
    assert(statAfter.isSymlink);
    assertEquals(Deno.readLinkSync(machinePath), repoPath);
    assert(fs.existsSync(repoPath));
    const stat = Deno.lstatSync(repoPath);
    assert(stat.isFile);
    assertEquals(Deno.readTextFileSync(repoPath), `test-content-in-repo`);
    assertEquals(Deno.readTextFileSync(machinePath), `test-content-in-repo`);
  }
);
