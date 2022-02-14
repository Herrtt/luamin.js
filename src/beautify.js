// usage $ node beautify.js


let inputFile = "./input.lua" // Where to grab the input file
let outputFile = "output.lua" // Where to write output


const luamin = require("./luamin")
const fs = require("fs")

fs.readFile(`${inputFile}`, "utf8", (err, src) => {
    if (err) throw err;

    fs.writeFile(outputFile, luamin.Beautify(src, {
        RenameVariables: true,
        RenameGlobals: false,
        SolveMath: true,
    }), (err) => {
        if (err) throw err;
        console.log(`saved to ${outputFile}`)
    })

})
