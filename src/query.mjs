const _variables = {};

export function SymatemQueryMixin(base) {
  return class SymatemQueryMixin extends base {
    variables(...names) {
      const result = {};
      for (const name of names) {
        let v = _variables[name];
        if (!v) {
          v = _variables[name] = Symbol(name);
        }
        result[name] = v;
      }

      return result;
    }

    *tripleQueries(tripleQueries = [], initial = new Map()) {
      if (tripleQueries.length === 0) {
        yield initial;
      } else {
        const tripleQuery = tripleQueries.shift();

        const query = tripleQuery.map(s => {
          if (typeof s === "symbol") {
            const value = initial.get(s);
            return value === undefined ? this.symbolByName.Void : value;
          }
          return s;
        });

        const mask = this.queryMasks[
          tripleQuery.map(s => (typeof s === "symbol" ? "V" : "M")).join("")
        ];

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
