export function SymatemQueryMixin(base) {
  return class SymatemQueryMixin extends base {

    /*
    initPredefinedSymbols()
    {
      super.initPredefinedSymbols();

      this.registerSymbolsInNamespace(ns, ['Placeholder']);
    }
    */

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

    *query(queries = [], initial = new Map()) {
      if (queries.length === 0) {
        yield initial;
      } else {
        const query = queries[0].map(s =>
          initial.get(s) ? initial.get(s) : s
        );
        const isVariable = query.map(s => this.isVariable(s));

        const mask = this.queryMasks[
          isVariable.map(f => (f ? "V" : "M")).join("")
        ];

        for (const r of this.queryTriples(mask, query)) {
          const results = new Map(initial);

          query.forEach((s, i) => {
            if (isVariable[i]) {
              results.set(s, r[i]);
            }
          });
          yield* this.query(queries.slice(1), results);
        }
      }
    }

    /**
     * Traverse the graph by applying query over and over again.
     * After each iteration mapping results back into query (by using result2input)
     * @param {Symbol[][]} queries
     * @param {Map<Variable,Symbol>} initial
     * @param {Map<Variable,Variable>} result2input
     * @return {Map<Variable,Symbol>}
     */
    *traverse(queries, initial, result2input) {
      for (const result of this.query(queries, initial)) {
        yield result;
        initial = new Map(
          [...result2input.entries()].map(([k, v]) => [v, result.get(k)])
        );

        /*
        console.log(queries);
        console.log(
          "R",
          new Map([...result.entries()].map(([k, v]) => [this.getData(k), v]))
        );
        console.log(
          "I",
          new Map([...initial.entries()].map(([k, v]) => [this.getData(k), v]))
        );*/

        yield* this.traverse(queries, initial, result2input);
      }
    }
  };
}
