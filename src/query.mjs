export function SymatemQueryMixin(base) {
  return class SymatemQueryMixin extends base {

/*
    initPredefinedSymbols() {
      super.initPredefinedSymbols();
      this.registerNamespaces({ Query: ["Placeholder", "Literal"] });
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

    literals(ns, literals) {
      const result = this.variables(ns, ...Object.keys(literals));

      for (const [name, value] of Object.entries(literals)) {
        const ds = this.createSymbol(ns);
        this.setData(ds, value);
        this.setTriple([result[name], this.symbolByName.Value, ds], true);
      }
      return result;
    }

    isVariable(symbol) {
      return this.getTriple([
        symbol,
        this.symbolByName.Void,
        this.symbolByName.Void
      ]);
    }

    getLiteralData(symbol) {
      for (const r of this.queryTriples(this.queryMasks.MMV, [
        symbol,
        this.symbolByName.Value,
        this.symbolByName.Void
      ])) {
        return this.getData(r[2]);
      }
    }

    /**
     * Execute SPARQL like query
     * The symbol table can be filled with plain symbols variables or literals
     * symbols as defined with variable()
     * ```js
     * const ns = ...
     * const s1,s2,s3 = ...
     * const {A,B,C} = backend.variables(ns,'A','B','C');
     * const {D} = backend.literals(ns,{D: "my data"});
     * for(const result of backend.query([
     *   [A, s1, B],
     *   [B, s2, C],
     *   [C, s3, D]
     * ])) {
     *  result.get('A') // symbol for placeholder 'A'
     *  result.get('D') // symbol for literal 'D'
     * }
     * ```
     * @param {Symbol[][]} queries
     * @param {Map<Variable,Symbol>} initial
     * @return {Iterator<Map<Variable,Symbol>>}
     */
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

          let found = true;

          query.forEach((s, i) => {
            if (isVariable[i]) {
              const literalData = this.getLiteralData(s);
              if (
                literalData !== undefined &&
                literalData !== this.getData(r[i])
              ) {
                found = false;
              } else {
                results.set(s, r[i]);
              }
            }
          });
          if (found) {
            yield* this.query(queries.slice(1), results);
          }
        }
      }
    }

    /**
     * Traverse the graph by applying query over and over again.
     * After each iteration mapping results back into initial (by using result2initial)
     * @param {Symbol[][]} queries
     * @param {Map<Variable,Symbol>} initial
     * @param {Map<Variable,Variable>} result2initial
     * @return {Iterator<Map<Variable,Symbol>>}
     */
    *traverse(queries, initial, result2initial) {
      for (const result of this.query(queries, initial)) {
        yield result;
        initial = new Map(
          [...result2initial.entries()].map(([k, v]) => [v, result.get(k)])
        );

        yield* this.traverse(queries, initial, result2initial);
      }
    }
  };
}
