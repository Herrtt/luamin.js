# luamin.js
Lua Beautifier & Minfier, written in JavaScript.
Originally written by Stravant, rewritten by Herrtt#3868

###### Required to use (cli version)
> node.js (https://nodejs.org/en/download/)

###### How to use?

#### In Command Line

Download and extract this project
Paste your script in *input.lua*
& Run in cmd or open the !run.bat
```
node main.js
```

Voila, your script has appeared in *output.lua*

#### As a module

Download **luamin.js** and paste it in desired folder.

```
// Everything should explain itself.
const src = `print("Hello World!")`

let options = {
  RenameVariables: true, // Should it change the variable names? (L_1_, L_2_, ...)
  RenameGlobals: false, // Not safe, rename global variables? (G_1_, G_2_, ...) (only works if RenameVariables is set to true)
  SolveMath: true, // Solve math? (local a = 1 + 1 => local a = 2, etc.)
}

const luamin = require("./luamin") // Require the module

const beautified_src = luamin.Beautify(src, options)
const minified_src = luamin.Minify(src, options)
```
