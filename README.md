# luamin.js (a.k.a. lua-format)
Luamin is a Lua Beautifier, Minifier & Uglifier, written in pure JavaScript.

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]
  [![Linux Build][ci-image]][ci-url]
  [![Windows Build][appveyor-image]][appveyor-url]
  [![Test Coverage][coveralls-image]][coveralls-url]

```
const luamin = require('lua-format')

const code = `print("hello world!")`
const source = luamin.Beautify(code, {
  RenameVariables: true,
  RenameGlobals: false,
  SolveMath: true
})
```

## Installation
Luamin is a [Node.js](https://nodejs.org/en/) module installed through [npm](https://www.npmjs.com/).
To start using Luamin, [download and install Node.js](https://nodejs.org/en/download/).

Installation is done using `npm install` command:
```bash
$ npm install lua-format
```

## Feautures
    * Prettifier
    * Minifier
    * Simplifier (SolveMath)
    * Uglifier

## Quick Start

```js
const luamin = require('lua-format')

const Code = `print("hello world!")`
const Settings = {
  RenameVariables: true,
  RenameGlobals: false,
  SolveMath: true
}

const Beautified = luamin.Beautify(Code, Settings)
const Minified = luamin.Beautify(Code, Settings)
const Uglified = luamin.Beautify(Code, Settings)
```

## License

  [ISC](LICENSE)

æ