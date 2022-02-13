// usage $ node minify.js

let inputFile = "./input.lua" // Where to grab the input file
let outputFile = "output.lua" // Where to write output

let renameVariables = true
let renameGlobals = false
let solveMath = false

const luamin = require("./luamin")
const fs = require("fs")

fs.readFile(`${inputFile}`, "utf8", (err, src) => {
    if (err) throw err;

    let opts = {
        RenameVariables: renameVariables,
        RenameGlobals: renameGlobals,
        SolveMath: solveMath,
    }
    
    let writeWhat = luamin.Minify(src, opts)
    fs.writeFile(outputFile, writeWhat, (err) => {
        if (err) throw err;
        console.log(`saved to ${outputFile}`)
    })
})
