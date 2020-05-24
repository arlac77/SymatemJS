import test from "ava";
import { prepareBackend } from "./helpers/util.mjs";

test("link single symbol with data", async t => {
  const { backend, recordingNamespace, s1, s2 } = await prepareBackend({
    s: 2
  });

  const { A } = backend.placeholders(recordingNamespace, { A: "xyz" });

  const result = backend.link([[s1, s2, A]], recordingNamespace);

  t.is(result[0][0], s1);
  t.is(result[0][1], s2);
  t.is(backend.getData(result[0][2]), "xyz");

  t.deepEqual(result, backend.link([[s1, s2, A]], recordingNamespace));
});

test("link two symbols one data", async t => {
  const { backend, recordingNamespace, s1 } = await prepareBackend({
    s: 1
  });

  const { A, B } = backend.placeholders(recordingNamespace, {
    A: "xyz",
    B: undefined
  });

  const result = backend.link([[s1, A, B]], recordingNamespace);

  t.is(result[0][0], s1);
  t.is(backend.getData(result[0][1]), "xyz");

  t.deepEqual(result, backend.link([[s1, A, B]], recordingNamespace));
});

test("link several", async t => {
  const { backend, recordingNamespace, s1, s2, s3 } = await prepareBackend({
    s: 3
  });

  const { A, B } = backend.placeholders(recordingNamespace, {
    A: undefined,
    B: "xyz"
  });

  const result = backend.link(
    [
      [s1, s2, A],
      [A, s3, B]
    ],
    recordingNamespace
  );

  t.is(result[0][0], s1);
  t.is(result[0][1], s2);
  t.is(result[1][1], s3);

  t.is(backend.getData(result[1][2]), "xyz");

  t.deepEqual(
    result,
    backend.link(
      [
        [s1, s2, A],
        [A, s3, B]
      ],
      recordingNamespace
    )
  );
});
