let inputFile = "./input.lua" // Where to grab the input file
let outputFile = "output.lua" // Where to write output



let option = "b" // Option, minify / beautify
let renameVariables = true
let renameGlobals = false
let solveMath = false

const luamin = require("./luamin") // should be in same folder as this script
const fs = require("fs") // to read files, to install: `npm i fs`, https://www.npmjs.com/package/fs

function Main() {
    fs.readFile(`${inputFile}`, "utf8", (err, src) => {
        if (err) throw err;

        let opts = {
            RenameVariables: renameVariables,
            RenameGlobals: renameGlobals,
            SolveMath: solveMath,
        }
        
        let writeWhat
        //try {
            if (option.toLowerCase() == "beautify".substr(0,option.length).toLowerCase()) {
                writeWhat = luamin.Beautify(src, opts)
            } else if(option.toLowerCase() == "minify".substr(0,option.length).toLowerCase()) {
                writeWhat = luamin.Minify(src, opts)
            } else if(option.toLowerCase() == "uglify".substr(0,option.length).toLowerCase()) {
                writeWhat = luamin.Uglify(src, opts)
            } else {
                throw "No option? Gangster."
            }
        //} catch (err) {
        //    throw(`FAILED ${err}:${err.stack}`)
        //}

        if (writeWhat != null) {
            fs.writeFile(outputFile, writeWhat, (err) => {
                if (err) throw err;
                console.log(`saved to ${outputFile}`)
            })
        } else {
            throw("something went wront!")
        }
    })
}

Main(9)