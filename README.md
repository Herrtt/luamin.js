![luamin-logo](https://github.com/Herrtt/luamin.js/blob/master/img/luamin_logo.png?raw=true)

# luamin.js (a.k.a. lua-format)
Luamin is a Lua Beautifier, Minifier & Uglifier, written in pure JavaScript.
Supports Lua 5.1 - 5.4, FiveM hashed strings & a touch of Luau

```js
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
const Minified = luamin.Minify(Code, Settings)
const Uglified = luamin.Uglify(Code, Settings)
```

## Example output

### Beautifier (with *SolveMath* & *RenameGlobals* enabled)

input:
```lua
local IiIiiIi = 0; IiiiIiI = 'hi' .. ' mom'; iIIIiI = 5 + 2;
```

output:
```lua
local L_1_ = 0;
G_1_ = "hi mom";
G_2_ = 7;
```

### Minifier (with *RenameGlobals* enabled)

input:
```lua
local L_1_ = 0;
G_1_ = "hi mom";
G_2_ = 7;
```

output:
```lua
local c=0;a="hi mom"b=7
```

## License

  [ISC](LICENSE)