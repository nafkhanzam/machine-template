import * as fs from "https://deno.land/std@0.205.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.205.0/path/mod.ts";
import { TEST_ENV_DIR } from "./shared.ts";
import { assert } from "https://deno.land/std@0.205.0/assert/assert.ts";
import { add } from "../scripts/add-func.ts";
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

Deno.test(
  `should add existing machine file and not existing repository file`,
  () => {
    //? Prepare
    cleanup();
    const fileName = `nested/1/a/.test-dotfile`;
    const machinePath = path.join(cwd, fileName);
    const repoPath = path.join(rootDir, machinePath);
    fs.ensureFileSync(machinePath);
    Deno.writeTextFileSync(machinePath, `test-content`);

    //? Before
    const statBefore = Deno.lstatSync(machinePath);
    assert(statBefore.isFile);
    assert(!fs.existsSync(repoPath));

    //? Action
    add(machinePath);

    //? After
    const statAfter = Deno.lstatSync(machinePath);
    assert(statAfter.isSymlink);
    assert(fs.existsSync(repoPath));
    const stat = Deno.lstatSync(repoPath);
    assert(stat.isFile);
  }
);

Deno.test(`should not add non-existing machine file`, () => {
  //? Prepare
  cleanup();
  const fileName = `nested/1/a/.test-dotfile`;
  const machinePath = path.join(cwd, fileName);
  const repoPath = path.join(rootDir, machinePath);

  //? Before
  assert(!fs.existsSync(repoPath));
  assert(!fs.existsSync(machinePath));

  //? Action
  assertThrows(() => add(machinePath));

  //? After
  assert(!fs.existsSync(repoPath));
  assert(!fs.existsSync(machinePath));
});

Deno.test(
  `should replace machine file to exisiting repo file yes response`,
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
    const statBefore = Deno.lstatSync(machinePath);
    assert(statBefore.isFile);
    assertEquals(Deno.readTextFileSync(machinePath), `test-content`);
    assert(fs.existsSync(repoPath));
    assertEquals(Deno.readTextFileSync(repoPath), `test-content-in-repo`);

    //? Action
    const st = stub(window, "confirm", () => true);
    add(machinePath);
    st.restore();

    //? After
    const statAfter = Deno.lstatSync(machinePath);
    assert(statAfter.isSymlink);
    assert(fs.existsSync(repoPath));
    const stat = Deno.lstatSync(repoPath);
    assert(stat.isFile);
    assertEquals(Deno.readTextFileSync(repoPath), `test-content`);
  }
);

Deno.test(
  `should not replace machine file to exisiting repo file on no response`,
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
    const statBefore = Deno.lstatSync(machinePath);
    assert(statBefore.isFile);
    assertEquals(Deno.readTextFileSync(machinePath), `test-content`);
    assert(fs.existsSync(repoPath));
    assertEquals(Deno.readTextFileSync(repoPath), `test-content-in-repo`);

    //? Action
    const st = stub(window, "confirm", () => false);
    add(machinePath);
    st.restore();

    //? After
    const statAfter = Deno.lstatSync(machinePath);
    assert(statAfter.isFile);
    assertEquals(Deno.readTextFileSync(machinePath), `test-content`);
    assert(fs.existsSync(repoPath));
    const stat = Deno.lstatSync(repoPath);
    assert(stat.isFile);
    assertEquals(Deno.readTextFileSync(repoPath), `test-content-in-repo`);
  }
);
