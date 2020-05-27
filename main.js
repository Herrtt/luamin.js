/*
    Luamin.js rewritten by Herrtt#3868, originally written by Stravant(?idk)

    Send me bugs or some shit idk pls dont ask for help figure it out yourself
    ok

    // Important stuff
    // YOU NEED NODE INSTALLED TO PATH! https://nodejs.org/en/download/


    const luamin = require("./luamin") // To require the library

    // Both functions (Minify & Beautify) will return the outputted values


    // Minify not added yet :(
    <string> luamin.Minify(<string> src [, <bool> RenameVariables | false, <bool> RenameGlobals | false])
    <string> luamin.Beautify(<string> src [, <bool> RenameVariables | false, <bool> RenameGlobals | false])

    Thats all you need to know to use this.
*/



// I just wrote this quick cli program to use, no you dont have to use this
// Options
let inputFile = "./input.lua" // Where to grab the input file
let outputFile = "output.lua" // Where to write output

const option = "beautify" // Option, minify / beautify
const renameVariables = true
const renameGlobals = true

// Ignore this shit
const luamin = require("./luamin") // should be in same folder as this script
const fs = require("fs") // to read files, to install: `npm i fs`, https://www.npmjs.com/package/fs

fs.readFile(`${inputFile}`, "utf8", (err, src) => {
    if (err) throw err;
    
    let writeWhat
    //try {
        if (option.toLowerCase() == "beautify".substr(0,option.length).toLowerCase()) {
            writeWhat = luamin.Beautify(src, renameVariables, renameGlobals)
        } else if(option.toLowerCase() == "minify".substr(0,option.length).toLowerCase()) {
            writeWhat = luamin.Minify(src, renameVariables, renameGlobals)
        } else {
            throw "No option? Gangster."
        }
    //} catch(err) {
    //    console.log(`Program errored! Error: ${err}`)
    //}

    if (writeWhat != null) {
        fs.writeFile(outputFile, writeWhat, (err) => {
            if (err) throw err;
            console.log("saved to output.lua");
        })
    } else {
        // ...
    }
})