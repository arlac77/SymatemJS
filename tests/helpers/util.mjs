import {
  Diff,
  SymbolInternals,
  RelocationTable,
  RustWasmBackend
} from "SymatemJS";

import { SymatemQueryMixin } from "@symatem/query";

export async function prepareBackend(options = {}) {
  const BackendClass = SymatemQueryMixin(RustWasmBackend);
  const backend = await new BackendClass();

  const repositoryNamespace = SymbolInternals.identityOfSymbol(
    backend.createSymbol(backend.metaNamespaceIdentity)
  );
  const modalNamespace = SymbolInternals.identityOfSymbol(
    backend.createSymbol(backend.metaNamespaceIdentity)
  );
  const recordingNamespace = SymbolInternals.identityOfSymbol(
    backend.createSymbol(backend.metaNamespaceIdentity)
  );

  const rt = RelocationTable.create();
  RelocationTable.set(rt, recordingNamespace, modalNamespace);

  const writer = new Diff(backend, repositoryNamespace, rt);

  const symbols = {};

  Object.entries(options).forEach(([name, number]) => {
    for (let n = 1; n <= number; n++) {
      let key = `${name}${n}`;
      symbols[key] = writer.createSymbol(recordingNamespace);
    }
  });

  return {
    ...symbols,
    writer,
    backend,
    recordingNamespace,
    repositoryNamespace,
    modalNamespace
  };
}
