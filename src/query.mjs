const _variables = {};
export function DeclareVariable(name) {
  let v = _variables[name];
  if (!v) {
    v = _variables[name] = Symbol(name);
  }

  return v;
}

export function SymatemQueryMixin(base) {
  return class SymatemQueryMixin extends base {
    *tripleQueries(tripleQueries = []) {
      const types2Mask = {
        "symbol:string:string": this.queryMasks.VMM,
        "string:string:symbol": this.queryMasks.MMV,
        "symbol:string:symbol": this.queryMasks.VMV,
        "symbol:symbol:symbol": this.queryMasks.VVV
      };

      const results = new Map();

      for (let tripleQuery of tripleQueries) {
        const mask = types2Mask[tripleQuery.map(s => typeof s).join(":")];
        //console.log(tripleQuery);

        const query = tripleQuery.map(s => {
          if (typeof s === "symbol") {
            const value = results.get(s);
            return value === undefined ? this.symbolByName.Void : value;
          }
          return s;
        });

        //console.log(mask, query);

        for (const r of this.queryTriples(mask, query)) {
          tripleQuery.forEach((s, i) => {
            if (typeof s === "symbol" && query[i] === this.symbolByName.Void) {
              results.set(s, r[i]);
            }
          });
        }
      }

      yield results;
    }
  };
}
