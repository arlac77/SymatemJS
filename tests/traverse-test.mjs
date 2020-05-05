import test from "ava";
import { prepareBackend } from "./helpers/util.mjs";

test("tripleQueries", async t => {
  const {
    recordingNamespace,
    backend,
    writer,
    a1,
    s1,
    s2,
    s3,
    s4,
    s5
  } = await prepareBackend({
    a: 1,
    s: 5
  });

  writer.setTriple([s1, a1, s2], true);
  writer.setTriple([s2, a1, s3], true);
  writer.setTriple([s3, a1, s4], true);
  writer.setTriple([s4, a1, s5], true);

  const { A, B } = backend.variables(recordingNamespace, "A", "B");

  const results = [];

  for (const r of backend.traverse([
    [A, a1, B]
  ]
,
   new Map([[A,s1]]),
   new Map([[B,A]])
   )) {
    results.push(r);
  }

  console.log(results.map(r => new Map([...r.entries()].map(([k,v]) => [backend.getData(k),v]))));

  t.deepEqual(results, [
    new Map([
      [A, s1],
      [B, s2]
    ]),
    new Map([
      [A, s2],
      [B, s3]
    ]),
    new Map([
      [A, s3],
      [B, s4]
    ]),
    new Map([
      [A, s4],
      [B, s5]
    ])
  ]);
});
