[![npm](https://img.shields.io/npm/v/@symatem/query.svg)](https://www.npmjs.com/package/@symatem/query)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![minified size](https://badgen.net/bundlephobia/min/@symatem/query)](https://bundlephobia.com/result?p=@symatem/query)
[![downloads](http://img.shields.io/npm/dm/@symatem/query.svg?style=flat-square)](https://npmjs.org/package/@symatem/query)
[![Build Status](https://travis-ci.com/arlac77/SymatemQuery.svg?branch=master)](https://travis-ci.com/arlac77/SymatemQuery)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/SymatemQuery.git)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/SymatemQuery/badge.svg)](https://snyk.io/test/github/arlac77/SymatemQuery)
[![codecov.io](http://codecov.io/github/arlac77/SymatemQuery/coverage.svg?branch=master)](http://codecov.io/github/arlac77/SymatemQuery?branch=master)
[![Coverage Status](https://coveralls.io/repos/arlac77/SymatemQuery/badge.svg)](https://coveralls.io/r/arlac77/SymatemQuery)

# @symatem/query

queries within SymatemJS

```js
import { SymatemQueryMixin } from "@symatem/query";

...

const backend = await new SymatemQueryMixin(RustWasmBackend);

const {isa} = myRootSymbols;
const { A, baseType } = backend.placeholders(recordingNamespace, {A:undefined, baseType: 'baseType'});

for(const result of backend.query([
    [A, isa, B],
    [B, isa, baseType]
    ]))
    {
        console.log(result.get(A),result.get(B));
    }
```

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## Table of Contents

# license

BSD-2-Clause
