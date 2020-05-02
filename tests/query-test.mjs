import test from "ava";
import { prepareBackend } from "./helpers/util.mjs";

import { tripleQueries, DeclareVariable } from "SymatemQuery";

test.only("tripleQueries", async t => {
  const { writer, recordingNamespace } = await prepareBackend();

  const a1 = writer.createSymbol(recordingNamespace);
  const a2 = writer.createSymbol(recordingNamespace);
  const s1 = writer.createSymbol(recordingNamespace);
  const s2 = writer.createSymbol(recordingNamespace);
  const s3 = writer.createSymbol(recordingNamespace);

  writer.setTriple([s1, a1, s2], true);
  writer.setTriple([s2, a2, s3], true);
  //writer.setTriple([s1, a2, s3], true);

  for (const p of tripleQueries(writer, [
    [s1, a1, DeclareVariable("A")],
    [DeclareVariable("A"), a2, DeclareVariable("B")]
  ])) {
    console.log(p);
    t.deepEqual(
      p,
      new Map([
        [DeclareVariable("A"), [s2]],
        [DeclareVariable("B"), [s3]]
      ])
    );
  }
});
