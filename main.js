/*
    Luamin.js rewritten by Herrtt#3868, originally written by Stravant(?idk)

    Send me bugs or some shit idk pls dont ask for help figure it out yourself
    ok

    // Important stuff
    // YOU NEED NODE INSTALLED TO PATH! https://nodejs.org/en/download/

    const luamin = require("./luamin") // To require the library

    // Both functions (Minify & Beautify) will return the outputted values

    <string> luamin.Minify(<string> src [, <bool> RenameVariables | false, <bool> RenameGlobals | false])
    <string> luamin.Beautify(<string> src [, <bool> RenameVariables | false, <bool> RenameGlobals | false])

    Thats all you need to know to use this.
*/



// I just wrote this quick cli program to use, no you dont have to use this
// Options

let inputFile = "./input.lua" // Where to grab the input file
let outputFile = "output.lua" // Where to write output



let option = "b" // Option, minify / beautify
let renameVariables = true
let renameGlobals = true


// Ignore this shit
const readline = require('readline');
const luamin = require("./luamin") // should be in same folder as this script
const fs = require("fs") // to read files, to install: `npm i fs`, https://www.npmjs.com/package/fs

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}


function Main() {
    fs.readFile(`${inputFile}`, "utf8", (err, src) => {
        if (err) throw err;
        
        let writeWhat
        if (option.toLowerCase() == "beautify".substr(0,option.length).toLowerCase()) {
            writeWhat = luamin.Beautify(src, renameVariables, renameGlobals)
        } else if(option.toLowerCase() == "minify".substr(0,option.length).toLowerCase()) {
            writeWhat = luamin.Minify(src, renameVariables, renameGlobals)
        } else {
            throw "No option? Gangster."
        }

        if (writeWhat != null) {
            fs.writeFile(outputFile, writeWhat, (err) => {
                if (err) throw err;
            })
        } else {
            throw("Invalid option")
        }
    })
}

let questions = [
    {
        Question: "> Type? (%opts):",
        Options: ["beautify", "minify"],
        CaseSensitive: false,
        Callback: (opt) => option=opt,
    },
    {
        Question: "> Rename Variables? (%opts):",
        Options: ["true", "false"],
        CaseSensitive: false,
        Callback: (opt) => renameVariables=opt=="true"?true:false,
        JumpIfOption: {
            Length: 1,
            Options: [1],
        },
    },
    {
        Question: "> Rename Globals (not safe)? (%opts):",
        Options: ["true", "false"],
        CaseSensitive: false,
        Callback: (opt) => renameGlobals=opt=="true"?true:false,
    },
]


async function ask(q, _callback) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: ">",
    });

    function ask(questionText) {
        return new Promise((resolve, reject) => {
          rl.question(questionText, (input) => resolve(input) ); // thanks stackoverflow
        });
    }
    
    function findshortanswer(answer0, options, caseSens=true) {
        let opts = []
        
        let answer = caseSens ? answer0 : answer0.toLowerCase()
        options.forEach((str0) => {
            let str = caseSens ? str0 : str0.toLowerCase()
             
            if (str.substr(0, answer.length) == answer) {
                opts.push(str)
            }
        })
        if (opts.length > 1) {
            return
        }
        return opts[0]
    }
    
    async function main() {
        let p = 0

        function get() {
            let g = q[p]
            p++
            return g
        }

        let wait
        while (true) {
            if (p > q.length) {
                break
            }

            let Current = get()
            if (Current != null) {
                let question = Current.Question
                let options = Current.Options
                let callback = Current.Callback
                let JumpIfOption = Current.JumpIfOption
                let RetryResponse = Current.RetryResponse || "[!] No option matched `%ans`!"
                let CaseSensitive = Current.CaseSensitive

                wait = Current
                
                let quest = question
                quest = quest.replace("%opts", options)

                async function ask1() {
                    let answer0 = await ask(quest)
                    let answer1 = findshortanswer(answer0, options, CaseSensitive)

                    if (answer1 == null) {
                        if (RetryResponse != null) {
                            let rr = RetryResponse.replace("%ans", answer0)
                            console.log(rr)
                        }
                        let answer2 = ask1()
                        return answer2
                    }
                    return answer1
                }

                let answer = await ask1()
                wait.Answer = answer

                if (callback != null) {
                    callback(answer)
                }

                if (JumpIfOption != null) {
                    let len = JumpIfOption.Length != null ? JumpIfOption.Length : 1
                    let found = false
                    JumpIfOption.Options.forEach((val) => {
                        let val1 = options[val]
                        if (val1 != null) {
                            if (answer == val1) {
                                found = true
                            }
                        }
                    })
                    if (found == true) {
                        p += len
                    }
                }
            }

            sleep(5)
        }

        rl.close()
    }
    await main()

    _callback()
}
ask(questions, () => {
    try {
        Main()
        console.log(`saved to ${outputFile}`)
    } catch(err) {
        console.log(`Failed to run program! ${err}`)
    }
})

/*
rl.question('What do you think of Node.js? ', (answer) => {
    // TODO: Log the answer in a database
    console.log(`Thank you for your valuable feedback: ${answer}`);
  
    rl.close()
});*/


