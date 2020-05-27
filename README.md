# luamin.js
Lua Beautifier & Minfier, written in JavaScript.
Originally written by Stravant, rewritten by Herrtt#3868

###### Required to use
> node.js (https://nodejs.org/en/download/)
> iq above 20

###### How to use?

#### In Command Line

Download and extract this page
Paste your script in *input.lua*
Run in cmd
```
node main.js
```

Voila, your script has appeared in *output.lua*

#### As a module

Download **luamin.js** and paste it

```
// Everything should explain itself.
const src = `print("Hello World!")`

// Two options, should it change the variable names &or global names (not safe)? 'L_1_', 'L_2_', etc.
const renameVariables = true
const renameGlobals = false // May error if set to true


const luamin = require("./luamin") // Require the module

const beautified_src = luamin.Beautify(src, renameVariables, renameGlobals)
const minified_src = luamin.Minify(src, renameVariables, renameGlobals)
```
