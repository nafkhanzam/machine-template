//~ deno run -A install.ts

import * as assert from "https://deno.land/std@0.205.0/assert/mod.ts";
import * as path from "https://deno.land/std@0.205.0/path/mod.ts";
import { install } from "./install-func.ts";

const cwd = Deno.cwd();
assert.assertEquals(
  cwd,
  path.resolve(path.dirname(path.fromFileUrl(import.meta.url))),
  `You have to run in the same working directory as the add script!`
);

install();
