import test from "ava";
import { prepareBackend } from "./helpers/util.mjs";

test("query data", async t => {
  const {
    recordingNamespace,
    backend,
    writer,
    a1,
    s1,
    s2,
    s3
  } = await prepareBackend({
    a: 1,
    s: 3
  });

  writer.setTriple([s1, a1, s2], true);
  writer.setTriple([s1, a1, s3], true);
  backend.setData(s2, "my data");
  backend.setData(s3, "not my data");

  const { A } = backend.variables(recordingNamespace, "A");

  const results = [
    ...backend.queryData([[s1, a1, A]], new Map([[A, "my data"]]))
  ];

  console.log(
    results.map(
      r => new Map([...r.entries()].map(([k, v]) => [backend.getData(k), v]))
    )
  );

  t.deepEqual(results, [new Map([[A, s2]])]);
});
