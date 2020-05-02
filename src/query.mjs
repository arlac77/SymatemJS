const _variables = {};
export function DeclareVariable(name) {
  let v = _variables[name];
  if (!v) {
    v = _variables[name] = Symbol(name);
  }

  return v;
}

export function* tripleQueries(backend, tripleQueries = []) {
  const types2Mask = {
    "symbol:string:string": backend.queryMasks.VMM,
    "string:string:symbol": backend.queryMasks.MMV,
    "symbol:string:symbol": backend.queryMasks.VMV,
    "symbol:symbol:symbol": backend.queryMasks.VVV
  };

  const results = new Map();

  for (let tripleQuery of tripleQueries) {
    tripleQuery
      .filter(s => typeof s === "symbol" && !results.get(s))
      .forEach(s => results.set(s, []));

    const mask = types2Mask[tripleQuery.map(s => typeof s).join(":")];
    //console.log(tripleQuery);

    const query = tripleQuery.map(s => {
      if(typeof s === "symbol") {
        const value = results.get(s);
        return value.length ? value[0] : backend.symbolByName.Void; }
      return s;}
    );

    console.log(mask, query);
    
    for (const r of backend.queryTriples(mask, query)) {
      tripleQuery.forEach((s, i) => {
        if (typeof s === "symbol" && query[i] === backend.symbolByName.Void) {
          results.get(s).push(r[i]);
        }
      });
    }
  }

  yield results;
}
