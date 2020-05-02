import test from "ava";
import { prepareBackend } from "./helpers/util.mjs";

import { DeclareVariable } from "SymatemQuery";

test("tripleQueries", async t => {
  const { backend, writer, recordingNamespace } = await prepareBackend();

  const a1 = writer.createSymbol(recordingNamespace);
  const a2 = writer.createSymbol(recordingNamespace);
  const a3 = writer.createSymbol(recordingNamespace);
  const s1 = writer.createSymbol(recordingNamespace);
  const s2 = writer.createSymbol(recordingNamespace);
  const s3 = writer.createSymbol(recordingNamespace);
  const s4 = writer.createSymbol(recordingNamespace);

  writer.setTriple([s1, a1, s2], true);
  writer.setTriple([s2, a2, s3], true);
  writer.setTriple([s3, a3, s4], true);

  for (const p of backend.tripleQueries([
    [s1,                   a1, DeclareVariable("A")],
    [DeclareVariable("A"), a2, DeclareVariable("B")],
    [DeclareVariable("B"), a3, DeclareVariable("C")]
  ])) {
    console.log(p);
    t.deepEqual(
      p,
      new Map([
        [DeclareVariable("A"), s2],
        [DeclareVariable("B"), s3],
        [DeclareVariable("C"), s4]
      ])
    );
  }
});
