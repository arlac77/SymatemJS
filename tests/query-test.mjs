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

  const results = [];

  for (const r of backend.tripleQueries([
    [s1, a1, backend.variable("A")],
    [backend.variable("A"), a2, backend.variable("B")],
    [backend.variable("B"), a3, backend.variable("C")]
  ])) {
    results.push(r);
  }

  console.log(results);

  t.deepEqual(results, [
    new Map([
      [backend.variable("A"), s2],
      [backend.variable("B"), s3],
      [backend.variable("C"), s4]
    ]),
    new Map([
      [backend.variable("A"), s2],
      [backend.variable("B"), s3],
      [backend.variable("C"), s5]
    ])
  ]);
});
