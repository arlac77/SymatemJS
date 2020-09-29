import {
  Diff,
  SymbolInternals,
  Repository,
  RustWasmBackend
} from "@symatem/core";

import { SymatemQueryMixin } from "@symatem/query";

export async function prepareBackend(options = {}) {
  const BackendClass = SymatemQueryMixin(RustWasmBackend);
  const backend = await new BackendClass();

  const repositoryNamespace = SymbolInternals.identityOfSymbol(
    backend.createSymbol(backend.metaNamespaceIdentity)
  );
  const recordingNamespace = SymbolInternals.identityOfSymbol(
    backend.createSymbol(backend.metaNamespaceIdentity)
  );

  const repository = new Repository(backend, backend.createSymbol(repositoryNamespace));

  const writer = new Diff(repository);

  const symbols = {};

  Object.entries(options).forEach(([name, number]) => {
    for (let n = 1; n <= number; n++) {
      const key = `${name}${n}`;
      symbols[key] = writer.createSymbol(recordingNamespace);
    }
  });

  return {
    ...symbols,
    writer,
    backend,
    recordingNamespace,
    repositoryNamespace,
    repository
  };
}
