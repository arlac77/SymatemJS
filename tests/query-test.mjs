import test from "ava";
import { prepareBackend } from "./helpers/util.mjs";

test("query", async t => {
  const {
    recordingNamespace,
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

  const { A, B, C } = backend.placeholders(recordingNamespace, ["A", "B", "C"]);

  const results = [
    ...backend.query([
      [s1, a1, A],
      [A, a2, B],
      [B, a3, C]
    ])
  ];

  console.log(
    results.map(
      r => new Map([...r.entries()].map(([k, v]) => [backend.getData(k), v]))
    )
  );

  t.truthy(results.find(r => r.get(A) === s2 && r.get(B) === s3 && r.get(C) === s4));
  t.truthy(results.find(r => r.get(A) === s2 && r.get(B) === s3 && r.get(C) === s5));
});

test("query with initial", async t => {
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

  const { A, B } = backend.placeholders(recordingNamespace, ["A", "B"]);

  const results = [...backend.query([[A, a1, B]], new Map([[A, s2]]))];

  console.log(
    results.map(
      r => new Map([...r.entries()].map(([k, v]) => [backend.getData(k), v]))
    )
  );

  t.deepEqual(results, [
    new Map([
      [A, s2],
      [B, s3]
    ])
  ]);
});
