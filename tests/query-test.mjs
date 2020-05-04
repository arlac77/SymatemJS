import test from "ava";
import { prepareBackend } from "./helpers/util.mjs";

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

  const { A, B, C } = backend.variables("A", "B", "C");

  const results = [];

  for (const r of backend.tripleQueries([
    [s1, a1, A],
    [A, a2, B],
    [B, a3, C]
  ])) {
    results.push(r);
  }

  console.log(results);

  t.deepEqual(results, [
    new Map([
      [A, s2],
      [B, s3],
      [C, s4]
    ]),
    new Map([
      [A, s2],
      [B, s3],
      [C, s5]
    ])
  ]);
});
