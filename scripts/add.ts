//~ deno run -A add.ts <file-path>

import * as assert from "https://deno.land/std@0.205.0/assert/mod.ts";
import { add } from "./add-func.ts";

assert.assertEquals(
  1,
  Deno.args.length,
  `Arguments' length must be exactly one: \`./add <file-path>\``
);

const [targetPath] = Deno.args;

add(targetPath);
