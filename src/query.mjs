export function SymatemQueryMixin(base) {
  return class SymatemQueryMixin extends base {
    variables(ns, ...names) {
      const result = {};

      for (const name of names) {
        const s = this.createSymbol(ns);
        this.setData(s, name);
        this.setTriple(
          [s, this.symbolByName.Void, this.symbolByName.Void],
          true
        );
        result[name] = s;
      }
      return result;
    }

    isVariable(symbol) {
      for (const r of this.queryTriples(this.queryMasks.MMM, [
        symbol,
        this.symbolByName.Void,
        this.symbolByName.Void
      ])) {
        return true;
      }
      return false;
    }

    *tripleQueries(tripleQueries = [], initial = new Map()) {
      if (tripleQueries.length === 0) {
        yield initial;
      } else {
        const tripleQuery = tripleQueries.shift();

        const isVariable = tripleQuery.map(s => this.isVariable(s));

        const query = tripleQuery.map((s, i) => {
          if (isVariable[i]) {
            const value = initial.get(s);
            return value === undefined ? this.symbolByName.Void : value;
          }
          return s;
        });

        const mask = this.queryMasks[
          isVariable.map(f => (f ? "V" : "M")).join("")
        ];

        for (const r of this.queryTriples(mask, query)) {
          const results = new Map(initial);

          tripleQuery.forEach((s, i) => {
            if (isVariable[i] && query[i] === this.symbolByName.Void) {
              results.set(s, r[i]);
            }
          });
          yield* this.tripleQueries(tripleQueries, results);
        }
      }
    }
    
     /**
      * Traverse the graph by applying tripleQuery over and over again.
      * After each iteration papping results back into query (by using result2input)
      * @param {Symbol[][]} queries
      * @param {Map<Variable,Symbol>} initial
      * @param {Map<Variable,Variable>} result2input
      * @return {Map<Variable,Symbol>}
      */
    *traverse(queries, initial, result2intput) {
      for(const result of this.tripleQueries(queries, initial) {
        yield result;
        initial = new Map([...result2input.entries()].map(([k,v]) => [v,result.get(v)]));
      }
    }
  };
}
