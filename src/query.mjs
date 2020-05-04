const _variables = {};

export function SymatemQueryMixin(base) {
  return class SymatemQueryMixin extends base {
    variable(name) {
      let v = _variables[name];
      if (!v) {
        v = _variables[name] = Symbol(name);
      }

      return v;
    }

    *tripleQueries(tripleQueries = [], initial = new Map()) {
      if (tripleQueries.length === 0) {
        yield initial;
      } else {
        const types2Mask = {
          "symbol:string:string": this.queryMasks.VMM,
          "string:string:symbol": this.queryMasks.MMV,
          "symbol:string:symbol": this.queryMasks.VMV,
          "symbol:symbol:symbol": this.queryMasks.VVV
        };

        const tripleQuery = tripleQueries.shift();

        const mask = types2Mask[tripleQuery.map(s => typeof s).join(":")];

        const query = tripleQuery.map(s => {
          if (typeof s === "symbol") {
            const value = initial.get(s);
            return value === undefined ? this.symbolByName.Void : value;
          }
          return s;
        });

        for (const r of this.queryTriples(mask, query)) {
          const results = new Map(initial);

          tripleQuery.forEach((s, i) => {
            if (typeof s === "symbol" && query[i] === this.symbolByName.Void) {
              results.set(s, r[i]);
            }
          });
          yield* this.tripleQueries(tripleQueries, results);
        }
      }
    }
  };
}
