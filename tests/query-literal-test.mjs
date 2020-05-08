import test from "ava";
import { prepareBackend } from "./helpers/util.mjs";

test("query with literal", async t => {
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
  backend.setData(s2, "my data");

  writer.setTriple([s1, a1, s3], true);
  backend.setData(s3, "not my data");

  const { D } = backend.placeholders(recordingNamespace, { D: "my data" });

  const results = [...backend.query([[s1, a1, D]])];

  console.log(
    results.map(
      r => new Map([...r.entries()].map(([k, v]) => [backend.getData(k), v]))
    )
  );

  t.deepEqual(results, [new Map([[D, s2]])]);
});
