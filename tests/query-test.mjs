import test from "ava";
import { prepareBackend } from "./helpers/util.mjs";

import { DeclareVariable } from "SymatemQuery";

test("tripleQueries", async t => {
  const {
    backend,
    writer,
    a1,
    a2,
    a3,
    s1,
    s2,
    s3,
    s4,
    s5
  } = await prepareBackend({
    a: 3,
    s: 5
  });

  writer.setTriple([s1, a1, s2], true);
  writer.setTriple([s2, a2, s3], true);
  writer.setTriple([s3, a3, s4], true);
  writer.setTriple([s3, a3, s5], true);

  const results = [];

  for (const r of backend.tripleQueries([
    [s1, a1, DeclareVariable("A")],
    [DeclareVariable("A"), a2, DeclareVariable("B")],
    [DeclareVariable("B"), a3, DeclareVariable("C")]
  ])) {
    results.push(r);
  }

  console.log(results);

  t.deepEqual(results, [
    new Map([
      [DeclareVariable("A"), s2],
      [DeclareVariable("B"), s3],
      [DeclareVariable("C"), s4]
    ]),
    new Map([
      [DeclareVariable("A"), s2],
      [DeclareVariable("B"), s3],
      [DeclareVariable("C"), s5]
    ])
  ]);
});
