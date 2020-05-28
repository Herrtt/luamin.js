/*
    Stravant thing in js
    Written by Herrtt (originally by Stravant)
*/ 


// I copied some comments
// no, it was not worth it
// please leave me alone
// I tried to copy+paste all comments, but no. I got bored.
// Be happy.

const  CountTable = function(t) {
    return t.length
}
const print = console.log
const error = console.error
const assert = function(a,b) {
    if (!a) {
        throw b
    }
}

let WhiteChars = {
    ' ':true, '\n':true, '\t':true, '\r':true,
}

let EscapeForCharacter = {
    '\r': '\\r', 
    '\n': '\\n',
    '\t': '\\t',
    '"': '\\"',
    "'": "\\'",
    '\\': '\\'
}

let Main_CharacterForEscape = {
    'r': '\r', 
    'n': '\n',
    't': '\t',
    '"': '"',
    "'": "'",
    '\\': '\\',
}

const CharacterForEscape = new Proxy(Main_CharacterForEscape, { 
    get(a, b) { return parseInt(b) }
})

let AllIdentStartChars = {
    'A':true,'B':true,'C':true,'D':true,
    'E':true,'F':true,'G':true,'H':true,
    'I':true,'J':true,'K':true,'L':true,
    'M':true,'N':true,'O':true,'P':true,
    'Q':true,'R':true,'S':true,'T':true,
    'U':true,'V':true,'W':true,'X':true,
    'Y':true,'Z':true,'_':true,'a':true,
    'b':true,'c':true,'d':true,'e':true,
    'f':true,'g':true,'h':true,'i':true,
    'j':true,'k':true,'l':true,'m':true,
    'n':true,'o':true,'p':true,'q':true,
    'r':true,'s':true,'t':true,'u':true,
    'v':true,'w':true,'x':true,'y':true,
    'z':true,
}

let AllIdentChars = {
    '0':true,'1':true,'2':true,'3':true,
    '4':true,'5':true,'6':true,'7':true,
    '8':true,'9':true,'A':true,'B':true,
    'C':true,'D':true,'E':true,'F':true,
    'G':true,'H':true,'I':true,'J':true,
    'K':true,'L':true,'M':true,'N':true,
    'O':true,'P':true,'Q':true,'R':true,
    'S':true,'T':true,'U':true,'V':true,
    'W':true,'X':true,'Y':true,'Z':true,
    '_':true,'a':true,'b':true,'c':true,
    'd':true,'e':true,'f':true,'g':true,
    'h':true,'i':true,'j':true, 'k':true,
    'l':true,'m':true,'n':true,'o':true,
    'p':true,'q':true,'r':true,'s':true,
    't':true,'u':true,'v':true,'w':true,
    'x':true,'y':true,'z':true, // this was actually fucking retarded to add, pls dont do this to me
}

let Digits = {
    '0':true,'1':true,'2':true,'3':true,
    '4':true,'5':true,'6':true,'7':true,
    '8':true,'9':true,
}

let HexDigits = {
    '0':true,'1':true,'2':true,'3':true,
    '4':true,'5':true,'6':true,'7':true,
    '8':true,'9':true,

    'a':true,'b':true,'c':true,'d':true,'e':true,'f':true,
    'A':true,'B':true,'C':true,'D':true,'E':true,'F':true,
}

let Symbols = {
    '+': true, '-': true, '*': true, '/': true, '^': true, '%': true, ',': true, '{': true, '}': true, '[': true, ']': true, '(': true, ')': true, ';': true, '#': true, '.': true, ':': true,
}

let EqualSymbols = {
    '~':true, '=':true, '>':true, '<':true,
}

let Keywords = {
    'and':true,'break':true,'do':true,'else':true, 
    'elseif':true,'end':true,'false':true,'for':true,
    'function':true,'goto':true,'if':true,'in':true,
    'local':true,'nil':true,'not':true,'or':true, 
    'repeat':true,'return':true,'then':true,'true':true, 
    'until':true, 'while':true,
}

let BlockFollowKeyword = {
    'else':true, 'elseif':true, 'until':true, 'end':true
}

let UnopSet = {
    '-':true, 'not':true, '#':true,
}

let BinopSet = {
	'+':true, '-':true, '*':true, '/':true, '%':true, '^':true, '#':true,
	'..':true, '.':true, ':':true,
	'>':true, '<':true, '<=':true, '>=':true, '~=':true, '==':true,
	'and':true, 'or':true
}

let GlobalRenameIgnore = {
}
let BinaryPriority = {
    '+': [6, 6],
    '-': [6, 6],
    '*': [7, 7],
    '/': [7, 7],
    '%': [7, 7],
    '^': [10, 9],
    '..': [5, 4],
    '==': [3, 3],
    '~=': [3, 3],
    '>': [3, 3],
    '<': [3, 3],
    '>=': [3, 3],
    '<=': [3, 3],
    'and': [2, 2],
    'or': [1, 1],
}

let UnaryPriority = 8
// Eof, Ident, KeyWord, Number, String, Symbol


function CreateLuaTokenStream(text) {
    // Tracking for the current position in the buffer, and
    // the current line / character we are on

    let p = 0
    let length = text.length

    // Output buffer for tokens
    let tokenBuffer = []

    // Get a character or '' if at eof
    function look(n) {
        n = n || 0
        if (p <= length) {
            return text.substr(p + n, 1)
        } else {
            return ''
        }
    }

    function get() {
        if (p <= length) {
            let c = text.substr(p, 1)
            p++
            return c
        } else {
            return ''
        }
    }

    // Error
    function error(str) {
        let q = 0
        let line = 1
        let char = 1
        while (q <= p) {
            if (text.substr(q,1) == '\n') {
                line++
                char = 1
            } else {
                char++
            }
        }
        let i_;
        for (_ = 0; _ < tokenBuffer; _++) {
            let token = tokenBuffer[i]
            print(`${token.Type}<${token.Source}>`)
        }
        throw `file<${line}:${char}>: ${str}`
    }

    // Consume a long data with equals count of `eqcount`
    function longdata(eqcount) {
        while (true) {
            let c = get()
            if (c == '') {
                error("Unfinished long string.")
            } else if(c == ']') {
                let done = true // Until contested
                let i;
                for (i=1; i<=eqcount; i++) {
                    if (look() == '=') {
                        p++
                    } else {
                        done = false
                        break
                    }
                }
                if (done && get() == ']') {
                    return
                }
            }
        }
    }


    // Get the opening part for a long data `[` `=`` * `[`
    // Precondition: The first `[` has been consumed
    // Return: nil or the equals count

    function getopen() {
        let startp = p
        while (look() == '=') {
            p++
        }
        if (look() == '[') {
            p++
            return p - startp - 1
        } else {
            p = startp
            return
        }
    }


    // Add token
    let whiteStart = 0
    let tokenStart = 0
    let tokens = 0
    function token(type) {
        tokens++
        let tk = {
            'Type': type,
            'LeadingWhite': text.substr(whiteStart, (tokenStart - whiteStart)),
            'Source': text.substr(tokenStart, (p - tokenStart))
        }
        tokenBuffer.push(tk)

        if (tk.LeadingWhite == null) {
            throw("WHAT?!")
        }

        whiteStart = p
        tokenStart = p
        return tk
    }

    // Parse tokens loop
    while (true) {
        // Mark the whitespace start
        whiteStart = p
        while (true) {
            let c = look()
            if (c == '') {
                break
            } else if(c == '-') {
                if (look(1) == "-") {
                    p = p + 2

                    // Consume comment body
                    if (look() == "[") {

                        p++
                        let eqcount = getopen()
                        if (eqcount != null) {
                            // Long comment body
                            longdata(eqcount)
                        } else {
                            // Normal comment body
                            while (true) {
                                let c2 = get()
                                if (c2 == "" || c2 == "\n") {
                                    break
                                }
                            }
                        }
                    } else {
                        // Normal comment body
                        while (true) {
                            let c2 = get()
                            if (c2 == "" || c2 == "\n") {
                                break
                            }
                        }
                    }
                } else {
                    break
                }
            } else if(WhiteChars[c]) {
                p++
            } else {
                break
            }
        }

        let leadingWhite = text.substr(whiteStart, (p - whiteStart))
        
        // Mark the token start
        tokenStart = p

        // Switch on token type
        let c1 = get()
        if (c1 == '') {
            // End of file
            token('Eof')
            break
        } else if(c1 == '\'' || c1 == '\"') {
            // String constant
            while (true) {
                let c2 = get()
                if (c2 == '\\') {
                    let c3 = get()
                    let esc = CharacterForEscape[c3]
                    if (!esc) {
                        error(`Invalid Escape Sequence \`${c3}\`.`)
                    }
                } else if(c2 == c1) {
                    break
                }
            }
            token('String')
        } else if(AllIdentStartChars[c1]) {
            // Ident or keyword
            while (AllIdentChars[look()]) {
                p++
            }

            if (Keywords[text.substr(tokenStart, (p - tokenStart))]) {
                token("Keyword")
            } else {
                token("Ident")
            }
            
        } else if(Digits[c1] || (c1 == '.' && Digits[look()])) {
            // Number
            if (c1 == '0' && look() == 'x') {
                p++
                // Hex number
                while (HexDigits[look()]) {
                    p++
                }
            } else {
                // Normal number
                while (Digits[look()]) {
                    p++
                }

                if (look() == '.') {
                    // With decimal point
                    p++
                    while (Digits[look()]) {
                        p++
                    }
                }

                if (look() == 'e' || look() == 'E') {
                    // With exponent
                    p++
                    if (look() == '-') {
                        p++
                    }
                    while (Digits[look()]) {
                        p++
                    }
                }
            }
            token("Number")
        } else if(c1 == '[') {
            // Symbol or Long String
            let eqCount = getopen()
            if (eqCount) {
                // Long String
                longdata(eqCount)
                token("String")
            } else {
                // Symbol
                token("Symbol")
            }
        } else if(c1 == '.') {
            // Greedily consume up to 3 `.` for . / .. / ... tokens
            if (look() == '.') {
                get()
                if (look() == '.') {
                    get()
                }
            }
            token("Symbol")
        } else if(EqualSymbols[c1]) {
            if (look() == "=") {
                p++
            }
            token("Symbol")
        } else if(Symbols[c1]) {
            token("Symbol")
        } else {
            throw(`Bad symbol \`${c1}\` in source.`)
        }
    }

    return tokenBuffer
}

//Removelater


function CreateLuaParser(text) {
    // Token stream and pointer into it
    let tokens = CreateLuaTokenStream(text)

    let p = 0
    function get() {
        let tok = tokens[p]
        if (p < tokens.length) {
            p++
        }
        return tok
    }
    function peek(n) {
        n = p + (n || 0)
        return tokens[n] || tokens[tokens.length - 1]
    }

    function getTokenStartPosition(token) {
        let line = 1
        let char = 0
        let tkNum = 0
        while (true) {
            let tk = tokens[tkNum]
            let text
            if (tk == token) {
                text = tk.LeadingWhite
            } else {
                text = tk.LeadingWhite + tk.Source
            }

            let i
            for (i=0; i<=text.length; i++) {
                let c = text.substr(i, 1)
                if (c == '\n') {
                    line++
                    char = 0
                } else {
                    char++
                }
            }
            
            if (tk == token) {
                break
            }
            tkNum++
        }
        return `${line}:${char+1}`
    }

    function debugMark() {
        let tk = peek()
        return `<${tk.Type} \`${tk.Source}\`> at: ${getTokenStartPosition(tk)}`
    }

    function isBlockFollow() {
        let tok = peek()
        return tok.Type == 'Eof' || (tok.Type == 'Keyword' && BlockFollowKeyword[tok.Source])   
    }

    function isUnop() {
        return UnopSet[peek().Source] || false
    }

    function isBinop() {
        return BinopSet[peek().Source] || false
    }

    function expect(type, source) {
        let tk = peek()
        if (tk.Type == type && (source == null || tk.Source == source)) {
            return get()
        } else {
            let i
            for (i=-3; i<=3; i++) {
                print(`Tokens[${i}] = \`${peek(i).Source}\``)
            }
            if (source) {
                let a = `${getTokenStartPosition(tk)}: \`${source}\` expected.`
                throw a
            } else {
                let a = `${getTokenStartPosition(tk)}: ${type} expected.`
                throw a
            }
        }
    }

    function MkNode(node) {
        let getf = node.GetFirstToken
        let getl = node.GetLastToken

        let self = node
        node.GetFirstToken = function() {
            let t = getf(self)
            assert(t)
            return t
        }

        node.GetLastToken = function() {
            let t = getl(self)
            assert(t)
            return t
        }

        return node
    }

    let block
    let expr

    function exprlist() {
        let exprList = [expr()]
        let commaList = []
        while (peek().Source == ",") {
            commaList.push(get())
            exprList.push(expr())
        }
        return [exprList, commaList]
    }

    function prefixexpr() {
        let tk = peek()
        if (tk.Source == '(') {
            let oparenTk = get()
            let inner = expr()
            let cparenTk = expect('Symbol', ')')
            let node
            node = MkNode({
                'Type': 'ParenExpr',
                'Expression': inner,
                'Token_OpenParen': oparenTk,
                'Token_CloseParen': cparenTk,
                'GetFirstToken': () => node.Token_OpenParen,
                'GetLastToken': () => node.Token_CloseParen,
            })
            return node
        } else if(tk.Type == "Ident") {
            let node
            node = MkNode({
                'Type': 'VariableExpr',
                'Token': get(),
                'GetFirstToken': () => node.Token,
                'GetLastToken': () => node.Token,
            })
            return node
        } else {
            print(debugMark())
            let a = (`${getTokenStartPosition(tk)}: Unexpected symbol. ${tk.Type} ${tk.Source}`)
            throw a
        }
    }

    function tableexpr() {
        let obrace = expect("Symbol", "{")
        let entries = []
        let seperators = []
        while (peek().Source != "}") {
            if (peek().Source == '[') {
                // Index
                let obrac = get()
                let index = expr()
                let cbrac = expect("Symbol", "]")
                let eq = expect("Symbol", "=")
                let value = expr()

                entries.push({
                    "EntryType": "Index",
                    "Index": index,
                    "Value": value,
                    "Token_OpenBracket": obrac,
                    "Token_CloseBracket": cbrac,
                    "Token_Equals": eq,
                })
            } else if(peek().Type == "Ident" && peek(1).Source == "=") {
                // Field
                let field = get()
                let eq = get()
                let value = expr()
                entries.push({
                    "EntryType": "Field",
                    "Field": field,
                    "Value": value,
                    "Token_Equals": eq,
                })
            } else {
                // Value
                let value = expr()
                entries.push({
                    "EntryType": "Value",
                    "Value": value,
                })
            }

            if (peek().Source == "," || peek().Source == ";") {
                seperators.push(get())
            } else {
                break
            }
        }

        let cbrace = expect("Symbol", "}")
        let node
        node = MkNode({
            "Type": "TableLiteral",
            "EntryList": entries,
            "Token_SeperatorList": seperators,
            "Token_OpenBrace": obrace,
            "Token_CloseBrace": cbrace,
            "GetFirstToken": () => node.Token_OpenBrace,
            "GetLastToken": () => node.Token_CloseBrace,
        })
        return node
    }


    function varlist(acceptVarg) {
        let varList = []
        let commaList = []
        if (peek().Type == "Ident") {
            varList.push(get())
        } else if(peek().Source == "..." && acceptVarg) {
            return [varList, commaList, get()]
        }
        while (peek().Source == ",") {
            commaList.push(get())
            if (peek().Source == "..." && acceptVarg) {
                return [varList, commaList, get()]
            } else {
                let id = expect("Ident")
                varList.push(id)
            }
        }
        return [varList, commaList]
    }

    function blockbody(terminator) {
        let body = block()
        let after = peek()
        if (after.Type == "Keyword" && after.Source == terminator) {
            get()
            return [body, after]
        } else {
            print(after.Type, after.Source)
            throw `${getTokenStartPosition(after)}: ${terminator} expected.`
        }
    }

    function funcdecl(isAnonymous) {
        let functionKw = get()

        let nameChain
        let nameChainSeperator

        if (!isAnonymous) {
            nameChain = []
            nameChainSeperator = []

            nameChain.push(expect("Ident"))

            while (peek().Source == ".") { 
                nameChainSeperator.push(get())
                nameChain.push(expect("Ident"))
            }

            if (peek().Source == ":") {
                nameChainSeperator.push(get())
                nameChain.push(expect("Ident"))
            }
        }

        let oparenTk = expect("Symbol", "(")

        let [argList, argCommaList, vargToken] = varlist(true)
        let cparenTk = expect("Symbol", ")")
        let [fbody, enTk] = blockbody("end")

        let node
        node = MkNode({
            "Type": (isAnonymous == true ? "FunctionLiteral" : "FunctionStat"),
            "NameChain": nameChain,
            "ArgList": argList,
            "Body": fbody,

            "Token_Function": functionKw,
            "Token_NameChainSeperator": nameChainSeperator,
            "Token_OpenParen": oparenTk,
            "Token_Varg": vargToken,
            "Token_ArgCommaList": argCommaList,
            "Token_CloseParen": cparenTk,
            "Token_End": enTk,
            "GetFirstToken": () => node.Token_Function,
            "GetLastToken": () => node.Token_End,
        })
        return node
    }

    function functionargs() {
        let tk = peek()
        if (tk.Source == "(") {
            let oparenTk = get()
            let argList = []
            let argCommaList = []
            while (peek().Source != ")") {
                argList.push(expr())
                if (peek().Source == ",") {
                    argCommaList.push(get())
                } else {
                    break
                }
            }

            let cparenTk = expect("Symbol", ")")
            let
            node = MkNode({
                "CallType": "ArgCall",
                "ArgList": argList,

                "Token_CommaList": argCommaList,
                "Token_OpenParen": oparenTk,
                "Token_CloseParen": cparenTk,
                "GetFirstToken": () => node.Token_OpenParen,
                "GetLastToken": () => node.Token_CloseParen,
            })
            return node
        } else if(tk.Source == "{") {
            let node
            node = MkNode({
                "CallType": "TableCall",
                "TableExpr": expr(),
                "GetFirstToken": () => node.TableExpr.GetFirstToken(),
                "GetLastToken": () => node.TableExpr.GetLastToken(),
            })
            return node
        } else if(tk.Type == "String") {
            let node
            node = MkNode({
                "CallType": "StringCall",
                "Token": get(),
                "GetFirstToken": "todo"
            })
            return node
        } else {
            throw "Function arguments expected."
        }
    }


    function primaryexpr() {
        let base = prefixexpr()
        assert(base, "nil prefixexpr")

        while (true) {
            let tk = peek()

            if (tk.Source == ".") {
                let dotTk = get()
                let fieldName = expect("Ident")
                let node
                node = MkNode({
                    "Type": "FieldExpr",
                    "Base": base,
                    "Field": fieldName,
                    "Token_Dot": dotTk,
                    "GetFirstToken": () => node.Base.GetFirstToken(),
                    "GetLastToken": () => node.Field,
                })
                base = node
            } else if(tk.Source == ":") {
                let colonTk = get()
                let methodName = expect("Ident")
                let fargs = functionargs()
                let node
                node = MkNode({
                    "Type": "MethodExpr",
                    "Base": base,
                    "Method": methodName,
                    "FunctionArguments": fargs,
                    "Token_Colon": colonTk,
                    "GetFirstToken": () => node.Base.GetFirstToken(),
                    "GetLastToken": () => node.FunctionArguments.GetLastToken(),
                })
                base = node
            } else if(tk.Source == "[") {
                let obrac = get()
                let index = expr()
                let cbrac = expect("Symbol", "]")
                let node
                node = MkNode({
                    "Type": "IndexExpr",
                    "Base": base,
                    "Index": index,
                    "Token_OpenBracket": obrac,
                    "Token_CloseBracket": cbrac,
                    "GetFirstToken": () => node.Base.GetFirstToken(),
                    "GetLastToken": () => node.Token_CloseBracket,
                })
                base = node
            } else if(tk.Source == "{" || tk.Source == "(" || tk.Type == "String") {
                let node
                node = MkNode({
                    "Type": "CallExpr",
                    "Base": base,
                    "FunctionArguments": functionargs(),
                    "GetFirstToken": () => node.Base.GetFirstToken(),
                    "GetLastToken": () => node.FunctionArguments.GetLastToken(),
                })
                base = node
            } else {
                return base
            }
        }
    }

    function simpleexpr() {
        let tk = peek()
        if (tk.Type == "Number") {
            let node
            node = MkNode({
                "Type": "NumberLiteral",
                "Token": get(),
                "GetFirstToken": () => node.Token,
                "GetLastToken": () => node.Token
            })

            return node
        } else if(tk.Type == "String") {
            let node
            node = MkNode({
                "Type": "StringLiteral",
                "Token": get(),
                "GetFirstToken": () => node.Token,
                "GetLastToken": () => node.Token,
            })
            return node
        } else if(tk.Source == "nil") {
            let node
            node = MkNode({
                "Type": "NilLiteral",
                "Token": get(),
                "GetFirstToken": () => node.Token,
                "GetLastToken": () => node.Token,
            })
            return node
        } else if(tk.Source == "true" || tk.Source == "false") {
            let node
            node = MkNode({
                "Type": "BooleanLiteral",
                "Token": get(),
                "GetFirstToken": () => node.Token,
                "GetLastToken": () => node.Token,
            })
            return node
        } else if(tk.Source == "...") {
            let node
            node = MkNode({
                "Type": "VargLiteral",
                "Token": get(),
                "GetFirstToken": () => node.Token,
                "GetLastToken": () => node.Token,
            })
            return node
        } else if(tk.Source == "{") {
            return tableexpr()
        } else if(tk.Source == "function") {
            return funcdecl(true)
        } else {
            return primaryexpr()
        }
    }

    function subexpr(limit) {
        let curNode
        if (isUnop()) {
            let opTk = get()
            let ex = subexpr(UnaryPriority)
            let node
            node = MkNode({
                "Type": "UnopExpr",
                "Token_Op": opTk,
                "Rhs": ex,
                "GetFirstToken": () => node.Token_Op,
                "GetLastToken": () => node.Rhs.GetLastToken(),
            })
            curNode = node
        } else {
            curNode = simpleexpr()
            assert(curNode, "nil sipleexpr")
        }

        while (isBinop() && BinaryPriority[peek().Source][0] > limit) {
            let opTk = get()
            let rhs = subexpr(BinaryPriority[opTk.Source][1])
            assert(rhs, "RhsNeeded")
            let node
            node = MkNode({
                "Type": "BinopExpr",
                "Lhs": curNode,
                "Rhs": rhs,
                "Token_Op": opTk,
                "GetFirstToken": () => node.Lhs.GetFirstToken(),
                "GetLastToken": () => node.Rhs.GetLastToken(),
            })
            curNode = node
        }
        return curNode
    }

    expr = () => subexpr(0)

    function exprstat() {
        let ex = primaryexpr()

        if (ex.Type == "MethodExpr" || ex.Type == "CallExpr") {

            let node
            node = MkNode({
                "Type": "CallExprStat",
                "Expression": ex,
                "GetFirstToken": () => node.Expression.GetFirstToken(),
                "GetLastToken": () => node.Expression.GetLastToken(),
            })
            return node
        } else {
            let lhs = [ex]
            let lhsSeperator = []
            while (peek().Source == ",") {
                lhsSeperator.push(get())
                let lhsPart = primaryexpr()
                if (lhsPart.Type == "MethodExpr" || lhsPart.Type == "CallExpr") {
                    throw "Bad left hand side of asignment"
                }
                lhs.push(lhsPart)
            }
            let eq = expect("Symbol", "=")
            let rhs = [expr()]
            let rhsSeperator = []
            while (peek().Source == ",") {
                rhsSeperator.push(get())
                rhs.push(expr())
            }

            let node
            node = MkNode({
                "Type": "AssignmentStat",
                "Rhs": rhs,
                "Lhs": lhs,
                "Token_Equals": eq,
                "Token_LhsSeperatorList": lhsSeperator,
                "Token_RhsSeperatorList": rhsSeperator,
                "GetFirstToken": () => node.Lhs[0].GetFirstToken(),
                "GetLastToken": () => node.Rhs[node.Rhs.length - 1].GetLastToken(),
            })
        }
    }

    function ifstat() {
        let ifKw = get()
        let condition = expr()
        let thenKw = expect("Keyword", "then")
        let ifBody = block()
        let elseClauses = []
        while (peek().Source == "elseif" || peek().Source == "else") {
            let elseifKw = get()
            let elseifCondition
            let elseifThenKw
            if (elseifKw.Source == "elseif") {
                elseifCondition = expr()
                elseifThenKw = expect("Keyword", "then")
            }
            let elseifBody = block()
            elseClauses.push({
                "Condition": elseifCondition,
                "Body": elseifBody,

                "ClauseType": elseifKw.Source,
                "Token": elseifKw,
                "Token_Then": elseifThenKw,
            })
            if (elseifKw.Source == "else") {
                break
            }
        }
        let enKw = expect("Keyword", "end")
        let node
        node = MkNode({
            "Type": "IfStat",
            "Condition": condition,
            "Body": ifBody,
            "ElseClauseList": elseClauses,
            
            "Token_If": ifKw,
            "Token_Then": thenKw,
            "Token_End": enKw,
            "GetFirstToken": () => node.Token_If,
            "GetLastToken": () => node.Token_End,
        })
        return node
    }


    function dostat() {
        let doKw = get()
        let [body, enKw] = blockbody("end")
        
        let node
        node = MkNode({
            "Type": "DoStat",
            "Body": body,
            
            "Token_Do": doKw,
            "Token_End": enKw,
            "GetFirstToken": () => node.Token_Do,
            "GetLastToken": () => node.Token_End,
        })
        return node
    }

    function whilestat() {
        let whileKw = get()
        let condition = expr()
        let doKw = expect("Keyword", "do")
        let [body, enKw] = blockbody("end")

        let node
        node = MkNode({
            "Type": "WhileStat",
            "Condition": condition,
            "Body": body,
            
            "Token_While": whileKw,
            "Token_Do": doKw,
            "Token_End": enKw,
            "GetFirstToken": () => node.Token_While,
            "GetLastToken": () => node.Token_End,
        })
        return node
    }

    function forstat() {
        let forKw = get()
        let [loopVars, loopVarCommas] = varlist()
        let node = []
        if (peek().Source == "=") {
            let eqTk = get()
            let [exprList, exprCommaList] = exprlist()
            if (exprList.length < 2 || exprList.length > 3) {
                throw "Expected 2 or 3 values for range bounds"
            }
            let doTk = expect("Keyword", "do")
            let [body, enTk] = blockbody("end")
            let node
            node = MkNode({
                "Type": "NumericForStat",
                "VarList": loopVars,
                "RangeList": exprList,
                "Body": body,
                
                "Token_For": forKw,
                "Token_VarCommaList": loopVarCommas,
                "Token_Equals": eqTk,
                "Token_RangeCommaList": exprCommaList,
                "Token_Do": doTk,
                "Token_End": enTk,
                "GetFirstToken": () => node.Token_For,
                "GetLastToken": () => node.Token_End,
            })
            return node
        } else if(peek().Source == "in") {
            let inTk = get()
            let [exprList, exprCommaList] = exprlist()
            let doTk = expect("Keyword", "do")
            let [body, enTk] = blockbody("end")
            let node
            node = MkNode({
                "Type": "GenericForStat",
                "VarList": loopVars,
                "GeneratorList": exprList,
                "Body": body,

                "Token_For": forKw,
                "Token_VarCommaList": loopVarCommas,
                "Token_In": inTk,
                "Token_GeneratorCommaList": exprCommaList,
                "Token_Do": doTk,
                "Token_End": enTk,
                "GetFirstToken": () => node.Token_For,
                "GetLastToken": () => node.Token_End
            })
            return node
        }
    }

    function repeatstat() {
        let repeatKw = get()
        let [body, untilTk] = blockbody("until")
        let condition = expr()

        let node
        node = MkNode({
            "Type": "RepeatStat",
            "Body": body,
            "Condition": condition,

            "Token_Repeat": repeatKw,
            "Token_Until": untilTk,
            "GetFirstToken": () => node.Token_Repeat,
            "GetLastToken": () => node.Condition.GetLastToken(),
        })
        return node
    }

    function localdecl() {
        let localKw = get()
        if (peek().Source == "function") {
            let funcStat = funcdecl(false)
            if (funcStat.NameChain.length > 1) {
                throw getTokenStartPosition(funcStat.Token_NameChainSeperator[0]) + ": `(` expected."
            }

            let node
            node = MkNode({
                "Type": "LocalFunctionStat",
                "FunctionStat": funcStat,
                "Token_Local": localKw,
                "GetFirstToken": () => node.Token_Local,
                "GetLastToken": () => node.FunctionStat.GetLastToken(),
            })
            return node
        } else if(peek().Type == "Ident") {
            let [varList, varCommaList] = varlist()
            let exprList = []
            let exprCommaList = []
            let eqToken
            if (peek().Source == "=") {
                eqToken = get()
                let [exprList1, exprCommaList1] = exprlist()
                exprList = exprList1
                exprCommaList = exprCommaList1
            }

            let node
            node = MkNode({
                "Type": "LocalVarStat",
                "VarList": varList,
                "ExprList": exprList,
                "Token_Local": localKw,
                "Token_Equals": eqToken,
                "Token_VarCommaList": varCommaList,
                "Token_ExprCommaList": exprCommaList,
                "GetFirstToken": () => node.Token_Local,
                "GetLastToken": function() {
                    if (node.ExprList.length > 0) {
                        return node.ExprList[node.ExprList.length - 1].GetLastToken()
                    } else {
                        return node.VarList[node.VarList.length - 1]
                    }
                },
            })
            return node
        } else {
            throw "`function` or ident expected"
        }
    }

    function retstat() {
        let returnKw = get()
        let exprList
        let commaList
        if (isBlockFollow() || peek().Source == ";") {
            exprList = []
            commaList = []
        } else {
            [exprList, commaList] = exprlist()
        }
        let self
        self = {
            "Type": "ReturnStat",
            "ExprList": exprList,
            "Token_Return": returnKw,
            "Token_CommaList": commaList,
            "GetFirstToken": () => self.Token_Return,
            "GetLastToken": function() {
                if (self.ExprList.length > 0) {
                    return self.ExprList[self.ExprList.length- 1].GetLastToken()
                } else {
                    return self.Token_Return
                }
            },
        }
        return self
    }

    function breakstat() {
        let breakKw = get()
        let self
        self = {
            "Type": "BreakStat",
            "Token_Break": breakKw,
            "GetFirstToken": () => self.Token_Break,
            "GetLastToken": () => self.Token_Break,
        }
        return self
    }

    function statement() {
        let tok = peek()
        if (tok.Source == "if") {
            return [false, ifstat()]
        } else if(tok.Source == "while") {
            return [false, whilestat()]
        } else if(tok.Source == "do") {
            return [false, dostat()]
        } else if(tok.Source == "for") {
            return [false, forstat()]
        } else if(tok.Source == "repeat") {
            return [false, repeatstat()]
        } else if(tok.Source == "function") {
            return [false, funcdecl(false)]
        } else if(tok.Source == "local") {
            return [false, localdecl()]
        } else if(tok.Source == "return") {
            return [true, retstat()]
        } else if(tok.Source == "break") {
            return [true, breakstat()]
        } else {
            return [false, exprstat()]
        }
    }

    block = function() {
        let statements = []
        let semicolons = []
        let isLast = false

        let thing
        while (!isLast && !isBlockFollow()) {
            if (thing && thing == peek()) {
                print(`INFINITE LOOP POSSIBLE ON STATEMENT ${thing.Source} :`,thing)
            }
            thing = peek()

            let [isLast, stat] = statement()
            if (stat) statements.push(stat);

            let next = peek()
            if (next.Type == "Symbol" && next.Source == ";") {
                semicolons[statements.length - 1] = get()
            }
        }

        let node
        node = {
            "Type": "StatList",
            "StatementList": statements,
            "SemicolonList": semicolons,
            "GetFirstToken": function() {
                if (node.StatementList.length == 0) {
                    return
                } else {
                    return node.StatementList[0].GetFirstToken()
                }
            },
            "GetLastToken": function() {
                if (node.StatementList.length == 0) {
                    return
                } else if(node.SemicolonList[node.StatementList.length - 1]) {
                    return node.SemicolonList[node.StatementList.length - 1]
                } else {
                    return node.StatementList[node.StatementList.length - 1].GetLastToken()
                }
            },
        }
        return node
    }

    return block()
}

function VisitAst(ast, visitors) {
    let ExprType = {
		'BinopExpr': true, 'UnopExpr': true, 
		'NumberLiteral': true, 'StringLiteral': true, 'NilLiteral': true, 'BooleanLiteral': true, 'VargLiteral': true,
		'FieldExpr': true, 'IndexExpr': true,
		'MethodExpr': true, 'CallExpr': true,
		'FunctionLiteral': true,
		'VariableExpr': true,
		'ParenExpr': true,
		'TableLiteral': true,
    }

    let StatType = {
		'StatList': true,
		'BreakStat': true,
		'ReturnStat': true,
		'LocalVarStat': true,
		'LocalFunctionStat': true,
		'FunctionStat': true,
		'RepeatStat': true,
		'GenericForStat': true,
		'NumericForStat': true,
		'WhileStat': true,
		'DoStat': true,
		'IfStat': true,
		'CallExprStat': true,
		'AssignmentStat': true,
    }

    for (var [visitorSubject, visitor] of Object.entries(visitors)) {
        if (!StatType[visitorSubject] && !ExprType[visitorSubject]) {
            throw `Invalid visitor target: \`${visitorSubject}\``
        }
    }


    function preVisit(exprOrStat) {
        if (exprOrStat != null) {
            let visitor = visitors[exprOrStat.Type]
            if (typeof(visitor) == "function") {
                return visitor(exprOrStat)
            } else if(visitor && visitor.Pre) {
                return visitor.Pre(exprOrStat)
            }
        }
    }

    function postVisit(exprOrStat) {
        let visitor = visitors[exprOrStat.Type]
        if (visitor && typeof(visitor) == "object" && visitor.Post) {
            return visitor.Post(exprOrStat)
        }
    }

    let visitExpr
    let visitStat

    visitExpr = function(expr) {
        if (preVisit(expr)) {
            return
        }

        if (expr.Type == "BinopExpr") {
            visitExpr(expr.Lhs)
            visitExpr(expr.Rhs)
        } else if(expr.Type == "UnopExpr") {
            visitExpr(expr.Rhs)
        } else if(expr.Type == "NumberLiteral" || expr.Type == "StringLiteral"
                || expr.Type == "NilLiteral" || expr.Type == "BooleanLiteral"
                || expr.Type == "VargLiteral") 
        {
            //No
        } else if(expr.Type == "FieldExpr") {
            visitExpr(expr.Base)
        } else if(expr.Type == "IndexExpr") {
            visitExpr(expr.Base)
            visitExpr(expr.Index)
        } else if(expr.Type == "MethodExpr" || expr.Type == "CallExpr") {
            visitExpr(expr.Base)
            if (expr.FunctionArguments.CallType == "ArgCall") {
                expr.FunctionArguments.ArgList.forEach((argExpr, index) => {
                    visitExpr(argExpr)
                })
            } else if(expr.FunctionArguments.CallType == "TableCall") {
                visitExpr(expr.FunctionArguments.TableExpr)
            }
        } else if(expr.Type == "FunctionLiteral") {
            visitStat(expr.Body)
        } else if(expr.Type == "VariableExpr") {
            // no
        } else if(expr.Type == "ParenExpr") {
            visitExpr(expr.Expression)
        } else if(expr.Type == "TableLiteral") {
            expr.EntryList.forEach((entry, index) => {
                if (entry.EntryType == "Field") {
                    visitExpr(entry.Value)
                } else if(entry.EntryType == "Index") {
                    visitExpr(entry.Index)
                    visitExpr(entry.Value)
                } else if(entry.EntryType == "Value") {
                    visitExpr(entry.Value)
                } else {
                    throw "unreachable"
                }
            })
        } else {
            throw `unreachable, type: ${expr.Type}: ${expr}`
        }
        postVisit(expr)
    }

    visitStat = function(stat) {
        if (preVisit(stat)) {
            return
        }

        if (stat.Type == "StatList") {
            stat.StatementList.forEach((ch, index) => {
                if (ch != null) {
                    visitStat(ch)
                }
            })
        } else if(stat.Type == "BreakStat") {
            // no
        } else if(stat.Type == "ReturnStat") {
            stat.ExprList.forEach((expr, index) => {
                visitExpr(expr)
            })
        } else if(stat.Type == "LocalVarStat") {
            if (stat.Token_Equals) {
                stat.ExprList.forEach((expr, index) => {
                    visitExpr(expr)
                })
            }
        } else if(stat.Type == "LocalFunctionStat") {
            visitStat(stat.FunctionStat.Body)
        } else if(stat.Type == "FunctionStat") {
            visitStat(stat.Body)
        } else if(stat.Type == "RepeatStat") {
            visitStat(stat.Body)
            visitExpr(stat.Condition)
        } else if(stat.Type == "GenericForStat") {
            stat.GeneratorList.forEach((expr, index) => {
                visitExpr(expr)
            })
            visitStat(stat.Body)
        } else if(stat.Type == "NumericForStat") {
            stat.RangeList.forEach((expr, index) => {
                visitExpr(expr)
            })
            visitStat(stat.Body)
        } else if(stat.Type == "WhileStat") {
            visitExpr(stat.Condition)
            visitStat(stat.Body)
        } else if(stat.Type == "DoStat") {
            visitStat(stat.Body)
        } else if(stat.Type == "IfStat") {
            visitExpr(stat.Condition)
            visitStat(stat.Body)
            stat.ElseClauseList.forEach((clause) => {
                if (clause.Condition) {
                    visitExpr(clause.Condition)
                }
                visitStat(clause.Body)
            })
        } else if(stat.Type == "CallExprStat") {
            visitExpr(stat.Expression)
        } else if(stat.Type == "AssignmentStat") {
            stat.Lhs.forEach((ex) => {
                visitExpr(ex)
            })
            stat.Rhs.forEach((ex) => {
                visitExpr(ex)
            })
        } else {
            throw "unreachable"
        }
        postVisit(stat)
    }
    
    if (StatType[ast.Type]) {
        visitStat(ast)
    } else {
        visitExpr(ast)
    }
}

function AddVariableInfo(ast) {
    let globalVars = []
    let currentScope

    let locationGenerator = 0
    function markLocation() {
        locationGenerator++
        return locationGenerator
    }

    function pushScope() {
        currentScope = {
            "ParentScope": currentScope,
            "ChildScopeList": [],
            "VariableList": [],
            "BeginLocation": markLocation(),
        }
        if (currentScope.ParentScope) {
            currentScope.Depth = currentScope.ParentScope.Depth + 1
            currentScope.ParentScope.ChildScopeList.push(currentScope)
        } else {
            currentScope.Depth = 1
        }
        let self = currentScope
        currentScope.GetVar = function(varName){
            self.VariableList.forEach((_var) => {
                if (_var.Name == varName) {
                    return _var
                }
            })
            if (self.ParentScope) {
                return self.ParentScope.GetVar(varName)
            } else {
                globalVars.forEach((_var) => {
                    if (_var.Name == varName) {
                        return _var
                    }
                })
            }
        }
    }

    function popScope() {
        let scope = currentScope

        scope.EndLocation = markLocation()

        scope.VariableList.forEach((v) => {
            v.ScopeEndLocation = scope.EndLocation
        })

        currentScope = scope.ParentScope
        return scope
    }
    pushScope()

    function addLocalVar(name, setNameFunc, localInfo) {
        assert(localInfo, "MIssing localInfo")
        assert(name, "Missing local var name")
        let _var = {
            "Type": "Local",
            "Name": name,
            "RenameList": [setNameFunc],
            "AssignedTo": false,
            "Info": localInfo,
            "UseCount": 0,
            "Scope": currentScope,
            "BeginLocation": markLocation(),
            "EndLocation": markLocation(),
            "ReferenceLocationList": [markLocation()],
        }
        _var.Rename = function(newName) {
            _var.Name = newName
            _var.RenameList.forEach((renameFunc) => {
                renameFunc(newName)
            })
        }

        _var.Reference = function() {
            _var.UseCount++
        }
        currentScope.VariableList.push(_var)
        return _var
    }

    function getGlobalVar(name) {
        globalVars.forEach((_var) => {
            if (_var.Name == name) {
                return _var
            }
        })

        let _var = {
            "Type": "Global",
            "Name": name,
            "RenameList": [],
            "AssignedTo": false,
            "UseCount": 0,
            "Scope": null,
            "BeginLocation": markLocation(),
            "EndLocation": markLocation(),
            "ReferenceLocationList": [],
        }

        _var.Rename = function(newName) {
            _var.Name = newName
            _var.RenameList.forEach((renameFunc) => {
                renameFunc(newName)
            })
        }

        _var.Reference = function() {
            _var.UseCount++
        }
        globalVars.push(_var)

        return _var
    }


    function addGlobalReference(name, setNameFunc) {
        assert(name, "Missing var name")
        let _var = getGlobalVar(name)
        _var.RenameList.push(setNameFunc)
        return _var
    }

    function getLocalVar(scope, name) {
        let i
        for (i=scope.VariableList.length-1; i>=0; i--) {
            if (scope.VariableList[i].Name == name) {
                return scope.VariableList[i]
            }
        }

        if (scope.ParentScope) {
            let _var = getLocalVar(scope.ParentScope, name)
            if (_var) {
                return _var
            }
        }

        return
    }

    function referenceVariable(name, setNameFunc) {
        assert(name, "Missing var name")
        let _var = getLocalVar(currentScope, name)
        if (_var) {
            _var.RenameList.push(setNameFunc)
        } else {
            _var = addGlobalReference(name, setNameFunc)
        }

        let curLocation = markLocation()
        _var.EndLocation = curLocation
        _var.ReferenceLocationList.push(_var.EndLocation)
        return _var
    }

    let visitor = {}
    visitor.FunctionLiteral = {

        "Pre": function(expr) {
            pushScope()
            expr.ArgList.forEach((ident, index) => {
                let _var = addLocalVar(ident.Source, function(name) {
                    ident.Source = name
                }, {
                    "Type": "Argument",
                    "Index": index,
                })
            })
        },

        "Post": function(expr) {
            popScope()
        },
    }

    visitor.VariableExpr = function(expr) {
        expr.Variable = referenceVariable(expr.Token.Source, function(newName) {
            expr.Token.Source = newName
        })
    }

    visitor.StatList = {
        "Pre": function(stat) {
            pushScope()
        },

        "Post": function(stat) {
            if (!stat.SkipPop) {
                popScope()
            }
        },
    }

    visitor.LocalVarStat = {
        "Post": function(stat) {
    
            stat.VarList.forEach((ident, varNum) => {
                addLocalVar(ident.Source, function(name) {
                    stat.VarList[varNum].Source = name
                }, {
                    "Type": "Local",
                })
            })
        },
    }

    visitor.LocalFunctionStat = {
        "Pre": function(stat) {
            addLocalVar(stat.FunctionStat.NameChain[0].Source, function(name) {
                stat.FunctionStat.NameChain[0].Source = name
            }, {
                "Type": "LocalFunction",
            })

            pushScope()

            stat.FunctionStat.ArgList.forEach((ident, index) => {
                addLocalVar(ident.Source, function(name) {
                    ident.Source = name
                }, {
                    "Type": "Argument",
                    "Index": index,
                })
            })
        },

        "Post": function() {
            popScope()
        }
    }

    visitor.FunctionStat = {
        "Pre": function(stat) {
            let nameChain = stat.NameChain
            let _var
            if (nameChain.length == 1) {
                if (getLocalVar(currentScope, nameChain[0].Source)) {
                    _var = referenceVariable(nameChain[0].Source, function(name) {
                        nameChain[0].Source = name
                    })
                } else {
                    _var = addGlobalReference(nameChain[0].Source, function(name) {
                        nameChain[0].Source = name
                    })
                }
            } else {
                _var = referenceVariable(nameChain[0].Source, function(name) {
                    nameChain[0].Source = name
                })
            }
            _var.AssignedTo = true
            pushScope()
            stat.ArgList.forEach((ident, index) => {
                addLocalVar(ident.Source, function(name) {
                    ident.Source = name
                }, {
                    "Type": "Argument",
                    "Index": index,
                })
            })
        },

        "Post": function() {
            popScope()
        }
    }

    visitor.GenericForStat = {
        "Pre": function(stat) {

            stat.GeneratorList.forEach((ex) => {
                VisitAst(ex, visitor)
            })

            pushScope()
            stat.VarList.forEach((ident, index) => {
                addLocalVar(ident.Source, function(name) {
                    ident.Source = name
                }, {
                    "Type": "ForRange",
                    "Index": index,
                })
            })
            VisitAst(stat.Body, visitor)
            popScope()
            return true
        }
    }

    visitor.NumericForStat = {
        "Pre": function(stat) {
            stat.RangeList.forEach((ex) => {
                VisitAst(ex, visitor)
            })

            pushScope()
            stat.VarList.forEach((ident, index) => {
                addLocalVar(ident.Source, function(name) {
                    ident.Source = name
                }, {
                    "Type": "ForRange",
                    "Index": index,
                })
            })
            VisitAst(stat.Body, visitor)
            popScope()
            return true
        }
    }

    visitor.RepeatStat = {
        "Pre": function(stat) {
            stat.Body.SkipPop = true
        },
        "Post": function(stat) {
            popScope()
        }
    }
    visitor.AssignmentStat = {
        "Post": function(stat) {
            stat.Lhs.forEach((ex) => {
                if (ex.Variable) {
                    ex.Variable.AssignedTo = true
                }
            })
        }
    }
    VisitAst(ast, visitor)
    return [globalVars, popScope()]
}

function PrintAst(ast) {
    let printStat
    let printExpr
    let buffer = ''
    function printt(tk) {
        if (tk.LeadingWhite == null || tk.Source == null) {
            throw `Bad token: tk=${tk} | lwhite=${tk.LeadingWhite} | source=${tk.Source}`
        }
        buffer = `${buffer}${tk.LeadingWhite}${tk.Source}`
    }
    printExpr = function(expr) {
        if (expr.Type == "BinopExpr") {
            printExpr(expr.Lhs)
            printt(expr.Token_Op)
            printExpr(expr.Rhs)
        } else if(expr.Type == "UnopExpr") {
            printt(expr.Token_Op)
            printExpr(expr.Rhs)
        } else if(
                expr.Type == "NumberLiteral" || expr.Type == "StringLiteral"
                || expr.Type == "NilLiteral" || expr.Type == "BooleanLiteral"
                || expr.Type == "VargLiteral") 
        {
            printt(expr.Token)
        } else if(expr.Type == "FieldExpr") {
            printExpr(expr.Base)
            printt(expr.Token_Dot)
            printt(expr.Field)
        } else if(expr.Type == "IndexExpr") {
            printExpr(expr.Base)
            printt(expr.Token_OpenBracket)
            printExpr(expr.Index)
            printt(expr.Token_CloseBracket)
        } else if(expr.Type == "MethodExpr" || expr.Type == "CallExpr") {
            printExpr(expr.Base)
            if (expr.Type == "MethodExpr") {
                printt(expr.Token_Colon)
                printt(expr.Method)
            }
            if (expr.FunctionArguments.CallType == "StringCall") {
                printt(expr.FunctionArguments.Token)
            } else if(expr.FunctionArguments.CallType == "ArgCall") {
                printt(expr.FunctionArguments.Token_OpenParen)
                expr.FunctionArguments.ArgList.forEach((argExpr, index) => {
                    printExpr(argExpr)
                    let sep = expr.FunctionArguments.Token_CommaList[index]
                     if (sep != null) {
                        printt(sep)
                    }
                })
                printt(expr.FunctionArguments.Token_CloseParen)
            } else if(expr.FunctionArguments.CallType == "TableCall") {
                printExpr(expr.FunctionArguments.TableExpr)
            }
        } else if(expr.Type == "FunctionLiteral") {
            printt(expr.Token_Function)
            printt(expr.Token_OpenParen)
            expr.ArgList.forEach((arg, index) => {
                printt(arg)
                let comma = expr.Token_ArgCommaList[index]
                if (comma != null) {
                    printt(comma)
                }
            })
            if (expr.Token_Varg != null) {
                printt(expr.Token_Varg)
            }
            printt(expr.Token_CloseParen)
            printStat(expr.Body)
            printt(expr.Token_End)
        } else if(expr.Type == "VariableExpr") {
            printt(expr.Token)
        } else if(expr.Type == "ParenExpr") {
            printt(expr.Token_OpenParen)
            printExpr(expr.Expression)
            printt(expr.Token_CloseParen)
        } else if(expr.Type == "TableLiteral") {
            printt(expr.Token_OpenBrace)
            expr.EntryList.forEach((entry, index) => {
                if (entry.EntryType == "Field") {
                    printt(entry.Field)
                    printt(entry.Token_Equals)
                    printExpr(entry.Value)
                } else if(entry.EntryType == "Index") {
                    printt(entry.Token_OpenBracket)
                    printExpr(entry.Index)
                    printt(entry.Token_CloseBracket)
                    printt(entry.Token_Equals)
                    printExpr(entry.Value)
                } else if(entry.EntryType == "Value") {
                    printExpr(entry.Value)
                } else {
                    throw "unreachable"
                }
                let sep = expr.Token_SeperatorList[index]
                 if (sep != null) {
                    printt(sep)
                }
            })
            printt(expr.Token_CloseBrace)
        } else {
            throw `unreachable, type: ${expr.Type}: ${expr}`
        }
    }
    printStat = function(stat) {
        if (stat == null) {
            throw `STAT IS NIL! ${stat}`
        }

        if (stat.Type == "StatList") {
            stat.StatementList.forEach((ch, index) => {
                printStat(ch)
                if (stat.SemicolonList[index]) {
                    printt(stat.SemicolonList[index])
                }
            })

        } else if(stat.Type == "BreakStat") {
            printt(stat.Token_Break)
        } else if(stat.Type == "ReturnStat") {
            printt(stat.Token_Return)
            stat.ExprList.forEach((expr, index) => {
                printExpr(expr)
                if (stat.Token_CommaList[index]) {
                    printt(stat.Token_CommaList[index])
                }
            })
        } else if(stat.Type == "LocalVarStat") {
            printt(stat.Token_Local)
            stat.VarList.forEach((_var, index) => {
                printt(_var)
                let comma = stat.Token_VarCommaList[index]
                if (comma != null) {
                    printt(comma)
                }
            })
            if (stat.Token_Equals != null) {
                printt(stat.Token_Equals)
                stat.ExprList.forEach((expr, index) => {
                    printExpr(expr)
                    let comma = stat.Token_ExprCommaList[index]
                     if (comma != null) {
                        printt(comma)
                    }
                })
            }
        } else if(stat.Type == "LocalFunctionStat") {
            printt(stat.Token_Local)
            printt(stat.FunctionStat.Token_Function)
            printt(stat.FunctionStat.NameChain[0])
            printt(stat.FunctionStat.Token_OpenParen)
            stat.FunctionStat.ArgList.forEach((arg, index) => {
                printt(arg)
                let comma = stat.FunctionStat.Token_ArgCommaList[index]
                 if (comma != null) {
                    printt(comma)
                }
            })
            if (stat.FunctionStat.Token_Varg) {
                printt(stat.FunctionStat.Token_Varg)
            }
            printt(stat.FunctionStat.Token_CloseParen)
            printStat(stat.FunctionStat.Body)
            printt(stat.FunctionStat.Token_End)
        } else if(stat.Type == "FunctionStat") {
            printt(stat.Token_Function)
            stat.NameChain.forEach((part, index) => {
                printt(part)
                let sep = stat.Token_NameChainSeperator[index]
                 if (sep != null) {
                    printt(sep)
                }
            })
            printt(stat.Token_OpenParen)
            stat.ArgList.forEach((arg, index) => {
                printt(arg)
                let comma = stat.Token_ArgCommaList[index]
                 if (comma != null) {
                    printt(comma)
                }
            })
            if (stat.Token_Varg) {
                printt(stat.Token_Varg)
            }
            printt(stat.Token_CloseParen)
            printStat(stat.Body)
            printt(stat.Token_End)
        } else if(stat.Type == "RepeatStat") {
            printt(stat.Token_Repeat)
            printStat(stat.Body)
            printt(stat.Token_Until)
            printExpr(stat.Condition)
        } else if(stat.Type == "GenericForStat") {
            printt(stat.Token_For)
            stat.VarList.forEach((_var, index) => {
                printt(_var)
                let sep = stat.Token_VarCommaList[index]
                 if (sep != null) {
                    printt(sep)
                }
            })
            printt(stat.Token_In)
            stat.GeneratorList.forEach((expr, index) => {
                printExpr(expr)
                let sep = stat.Token_GeneratorCommaList[index]
                 if (sep != null) {
                    printt(sep)
                }
            })
            printt(stat.Token_Do)
            printStat(stat.Body)
            printt(stat.Token_End)
        } else if(stat.Type == "NumericForStat") {
            printt(stat.Token_For)
            stat.VarList.forEach((_var, index) => {
                printt(_var)
                let sep = stat.Token_VarCommaList[index]
                 if (sep != null) {
                    printt(sep);
                }
            })
            printt(stat.Token_Equals)
            stat.RangeList.forEach((expr, index) => {
                printExpr(expr)
                let sep = stat.Token_RangeCommaList[index]
                 if (sep != null) {
                    printt(sep)
                }
            })
            printt(stat.Token_Do)
            printStat(stat.Body)
            printt(stat.Token_End)
        } else if(stat.Type == "WhileStat") {
            printt(stat.Token_While)
            printExpr(stat.Condition)
            printt(stat.Token_Do)
            printStat(stat.Body)
            printt(stat.Token_End)
        } else if(stat.Type == "DoStat") {
            printt(stat.Token_Do)
            printStat(stat.Body)
            printt(stat.Token_End)
        } else if(stat.Type == "IfStat") {
            printt(stat.Token_If)
            printExpr(stat.Condition)
            printt(stat.Token_Then)
            printStat(stat.Body)
            stat.ElseClauseList.forEach((clause) => {
                printt(clause.Token)
                if (clause.Condition) {
                    printExpr(clause.Condition)
                    printt(clause.Token_Then)
                }
                printStat(clause.Body)
            })
            printt(stat.Token_End)
        } else if(stat.Type == "CallExprStat") {
            printExpr(stat.Expression)
        } else if(stat.Type == "AssignmentStat") {
            stat.Lhs.forEach((ex, index) => {
                printExpr(ex)
                let sep = stat.Token_LhsSeperatorList[index]
                 if (sep != null) {
                    printt(sep)
                }
            })
            printt(stat.Token_Equals)
            stat.Rhs.forEach((ex, index) => {
                printExpr(ex)
                let sep = stat.Token_RhsSeperatorList[index]
                if (sep) printt(sep);
            })
        } else {
            assert(false, "unreachable")
        }
    }
    printStat(ast)
    
    return buffer
}

function FormatAst(ast) {
    let formatStat
    let formatExpr
    let currentIndent = 0
    function applyIndent(token) {
        let indentString = `\n${"\t".repeat(currentIndent)}`
        if (token.LeadingWhite == '' || (token.LeadingWhite.substr(-indentString.length, -1) != indentString)) {
            //token.LeadingWhite = token.LeadingWhite.replace("\n?[\t ]*$") // Todo:Remove all \n & \t at end of string
            // idk string patterns :(

            let newstr = ""
            let i
            let last
            for (i=token.LeadingWhite.length; i>=0; i--) {
                let cur = token.LeadingWhite.substr(i, 1)
                if (cur == "" || cur.match(/\s/g)) {
                } else {
                    newstr = token.LeadingWhite.substr(0,i+1)
                    break
                }
            }

            token.LeadingWhite = `${newstr}${indentString}`
        }
    }

    applyIndent({"LeadingWhite": "\nlol\t\n\t\t", "Source":"ok"})

    function indent() {
        currentIndent++
    }
    function undent() {
        currentIndent--
        assert(currentIndent >= 0, "Undented too far")
    }

    function leadingChar(tk) {
        if (tk.LeadingWhite.length > 0) {
            return tk.LeadingWhite.substr(0,1)
        } else {
            return tk.Source.substr(0,1)
        }
    }

    function padToken(tk) {
        if (!WhiteChars[leadingChar(tk)]) {
            tk.LeadingWhite = ' ' + tk.LeadingWhite
        }
    }

    function padExpr(expr) {
        padToken(expr.GetFirstToken())
    }

    function formatBody(openToken, bodyStat, closeToken) {
        indent()
        formatStat(bodyStat)
        undent()
        applyIndent(closeToken)
    }

    formatExpr = function(expr) {
        if (expr.Type == "BinopExpr") {
            formatExpr(expr.Lhs)
            formatExpr(expr.Rhs)
            if (expr.Token_Op.Source == "..") {

            } else {
                padExpr(expr.Rhs)
                padToken(expr.Token_Op)
            }
        } else if(expr.Type == "UnopExpr") {
            formatExpr(expr.Rhs)
        } else if(expr.Type == "NumberLiteral" || expr.Type == "StringLiteral"
                || expr.Type == "NilLiteral" || expr.Type == "BooleanLiteral"
                || expr.Type == "VargLiteral")
        {
            // no
        } else if(expr.Type == "FieldExpr") {
            formatExpr(expr.Base)
        } else if(expr.Type == "IndexExpr") {
            formatExpr(expr.Base)
            formatExpr(expr.Index)
        } else if(expr.Type == "MethodExpr" || expr.Type == "CallExpr") {
            formatExpr(expr.Base)
            if (expr.Type == "MethodExpr") {

            }
            if (expr.FunctionArguments.CallType == "StringCall") {

            } else if(expr.FunctionArguments.CallType == "ArgCall") {
                expr.FunctionArguments.ArgList.forEach((argExpr, index) => {
                    formatExpr(argExpr)
                    if (index > 0) {
                        padExpr(argExpr)
                    }
                    let sep = expr.FunctionArguments.Token_CommaList[index]
                     if (sep != null) {

                    }
                })

            } else if(expr.FunctionArguments.CallType == "TableCall") {
                formatExpr(expr.FunctionArguments.TableExpr)
            }
        } else if(expr.Type == "FunctionLiteral") {
            expr.ArgList.forEach((arg, index) => {
                if (index > 0) {
                    padToken(arg)
                }
                let comma = expr.Token_ArgCommaList[index]
                if (comma != null) {

                }
            })

            if (expr.ArgList.length > 0 && expr.Token_Varg != null) {
                padToken(expr.Token_Varg)
            }
            formatBody(expr.Token_CloseParen, expr.Body, expr.Token_End)
        } else if(expr.Type == "VariableExpr") {
            // no
        } else if(expr.Type == "ParenExpr") {
            formatExpr(expr.Expression)
        } else if(expr.Type == "TableLiteral") {
            if (expr.EntryList.length == 0) {

            } else {
                indent()
                expr.EntryList.forEach((entry, index) => {
                    if (entry.EntryType == "Field") {
                        applyIndent(entry.Field)
                        padToken(entry.Token_Equals)
                        formatExpr(entry.Value)
                        padExpr(entry.Value)
                    } else if(entry.EntryType == "Index") {
                        applyIndent(entry.Token_OpenBracket)
                        formatExpr(entry.Index)

                        padToken(entry.Token_Equals)
                        formatExpr(entry.Value)
                        padExpr(entry.Value)
                    } else if(entry.EntryType == "Value") {
                        formatExpr(entry.Value)
                        applyIndent(entry.Value.GetFirstToken())
                    } else {
                        assert(false, "unreachable")
                    }
                    let sep = expr.Token_SeperatorList[index]
                     if (sep != null) {

                    }
                })
                undent()
                applyIndent(expr.Token_CloseBrace)
            }
        } else {
            assert(false, `unreachable, type: ${expr.Type}:${expr}`)
        }
    }

    formatStat = function(stat) {
        if (stat.Type == "StatList") {
            stat.StatementList.forEach((stat, index) => {
                formatStat(stat)
                applyIndent(stat.GetFirstToken())
            })
        } else if(stat.Type == "BreakStat") {
            // no
        } else if(stat.Type == "ReturnStat") {
            
            stat.ExprList.forEach((expr, index) => {
                formatExpr(expr)
                padExpr(expr)
                if (stat.Token_CommaList[index]) {

                }
            })
        } else if(stat.Type == "LocalVarStat") {
            stat.VarList.forEach((_var, index) => {
                padToken(_var)
                let comma = stat.Token_VarCommaList[index]
                if (comma != null) {

                }
            })
            if (stat.Token_Equals) {
                padToken(stat.Token_Equals)
                
                stat.ExprList.forEach((expr,index) => {
                    formatExpr(expr)
                    padExpr(expr)
                    let comma = stat.Token_ExprCommaList[index]
                })
            }
        } else if(stat.Type == "LocalFunctionStat") {
            padToken(stat.FunctionStat.Token_Function)
            padToken(stat.FunctionStat.NameChain[0])

            stat.FunctionStat.ArgList.forEach((arg, index) => {
                if (index > 0) {
                    padToken(arg)
                }
                let comma = stat.FunctionStat.Token_ArgCommaList[index]
            })

            if (stat.FunctionStat.ArgList.length > 0 && stat.FunctionStat.Token_Varg) {
                padToken(stat.FunctionStat.Token_Varg)
            }

            formatBody(stat.FunctionStat.Token_CloseParen, stat.FunctionStat.Body, stat.FunctionStat.Token_End)
        } else if(stat.Type == "FunctionStat") {
            stat.NameChain.forEach((part, index) => {
                if (index == 0) {
                    padToken(part)
                }
                let sep = stat.Token_NameChainSeperator[index]
                if (sep != null) {

                }
            })

            stat.ArgList.forEach((arg, index) => {
                if (index > 0) {
                    padToken(arg)
                }
                let comma = stat.Token_ArgCommaList[index]
                if (comma != null) {

                }
            })

            if (stat.ArgList.length > 0 && stat.Token_Varg) {
                padToken(stat.Token_Varg)
            }

            formatBody(stat.Token_CloseParen, stat.Body, stat.Token_End)
        } else if(stat.Type == "RepeatStat") {
            formatBody(stat.Token_Repeat, stat.Body, stat.Token_Until)
            formatExpr(stat.Condition)
            padExpr(stat.Condition)
        } else if(stat.Type == "GenericForStat") {
            stat.VarList.forEach((_var, index) => {
                padToken(_var)
                let sep = stat.Token_VarCommaList[index]
                 if (sep != null) {

                }
            })
            padToken(stat.Token_In)
            stat.GeneratorList.forEach((expr, index) => {
                formatExpr(expr)
                padExpr(expr)
                let sep = stat.Token_GeneratorCommaList[index]
                 if (sep != null) {

                }
            })
            padToken(stat.Token_Do)
            formatBody(stat.Token_Do, stat.Body, stat.Token_End)
        } else if(stat.Type == "NumericForStat") {
            stat.VarList.forEach((_var, index) => {
                padToken(_var)
                let sep = stat.Token_VarCommaList[index]
                 if (sep != null) {

                }
            })
            padToken(stat.Token_Equals)
            stat.RangeList.forEach((expr, index) => {
                formatExpr(expr)
                padExpr(expr)
                let sep = stat.Token_RangeCommaList[index]
                 if (sep != null) {

                }
            })
            padToken(stat.Token_Do)
            formatBody(stat.Token_Do, stat.Body, stat.Token_End)
        } else if(stat.Type == "WhileStat") {
            formatExpr(stat.Condition)
            padExpr(stat.Condition)
            padToken(stat.Token_Do)
            formatBody(stat.Token_Do, stat.Body, stat.Token_End)
        } else if(stat.Type == "DoStat") {
            formatBody(stat.Token_Do, stat.Body, stat.Token_End)
        } else if(stat.Type == "IfStat") {
            formatExpr(stat.Condition)
            padExpr(stat.Condition)
            padToken(stat.Token_Then)

            let lastBodyOpen = stat.Token_Then
            let lastBody = stat.Body

            stat.ElseClauseList.forEach((clause) => {
                formatBody(lastBodyOpen, lastBody, clause.Token)
                lastBodyOpen = clause.Token

                if (clause.Condition) {
                    formatExpr(clause.Condition)
                    padExpr(clause.Condition)
                    padToken(clause.Token_Then)
                    lastBodyOpen = clause.Token_Then
                }
                lastBody = clause.Body
            })

            formatBody(lastBodyOpen, lastBody, stat.Token_End)
        } else if(stat.Type == "CallExprStat") {
            formatExpr(stat.Expression)
        } else if(stat.Type == "AssignmentStat") {
            stat.Lhs.forEach((ex, index) => {
                formatExpr(ex)
                if (index > 0) {
                    padExpr(ex)
                }
                let sep = stat.Token_LhsSeperatorList[index]
                 if (sep != null) {

                }
            })
            padToken(stat.Token_Equals)
            stat.Rhs.forEach((ex, index) => {
                formatExpr(ex)
                padExpr(ex)
                let sep = stat.Token_RhsSeperatorList[index]
                 if (sep != null) {

                }
            })
        } else {
            assert(false, "Unreachable")
        }
    }

    formatStat(ast)
}

function StripAst(ast) {
    let stripStat
    let stripExpr
    function stript(token) {
        token.LeadingWhite = ''
    }

    function joint(tokenA, tokenB) {
        stript(tokenB)
        let lastCh = tokenA.Source.substr(-1,1)
        let firstCh = tokenA.Source.substr(1,1)

        if ((lastCh == "-" && firstCh == "-") || (AllIdentChars[lastCh] && AllIdentChars[firstCh])) {
            tokenB.LeadingWhite = ' '
        } else {
            tokenB.LeadingWhite = ""
        }
    }

    function bodyjoint(open, body, close) {
        stripStat(body)
        stript(close)
        let bodyFirst = body.GetFirstToken()
        let bodyLast = body.GetLastToken()
        if (bodyFirst != null) {
            joint(open, bodyFirst)
            joint(bodyLast, close)
        } else {
            joint(open, close)
        }
    }

    stripExpr = function(expr) {
        // Todo
    }
    
    stripStat = function(stat) {
        // Todo
    }

    stripStat(ast)
}


let idGen = 0
let VarDigits = []


let i
for (i="a".charCodeAt(); i<="z".charCodeAt(); i++) VarDigits.push(String.fromCharCode(i));
for (i="A".charCodeAt(); i<="Z".charCodeAt(); i++) VarDigits.push(String.fromCharCode(i));
for (i="0".charCodeAt(); i<="9".charCodeAt(); i++) VarDigits.push(String.fromCharCode(i));
VarDigits.push("_")

let VarStartDigits = []
for (i="a".charCodeAt(); i<="z".charCodeAt(); i++) VarStartDigits.push(String.fromCharCode(i));
for (i="A".charCodeAt(); i<="Z".charCodeAt(); i++) VarStartDigits.push(String.fromCharCode(i));


function indexToVarName(index) {
    let id = ""
    let d = index % VarStartDigits.length
    index = (index - d) / VarStartDigits.length
    id = `${id}${VarStartDigits[d + 1]}`
    while (index > 0) {
        let d = index % VarDigits.length
        index = (index - d) / VarDigits.length
        id = `${id}${VarDigits[d+1]}`
    }
    return id
}

function genNextVarName() {
    let varToUse = idGen
    idGen++
    return indexToVarName(varToUse)
}

function genVarName() {
    let varName = genNextVarName()
    while (Keywords[varName]) {
        varName = genNextVarName()
    }
    return varName
}

function MinifyVariables(globalScope, rootScope) {
    let externalGlobals = []

    let temporaryIndex = 0
    globalScope.forEach((_var) => {
        if (_var.AssignedTo) {
            _var.Rename(`_TMP_${temporaryIndex}_`)
            temporaryIndex++
        } else {
            externalGlobals[_var.Name] = true
        }
    })

    function temporaryRename(scope) {
        scope.VariableList.forEach((_var) => {
            _var.Rename(`_TMP_${temporaryIndex}_`)
            temporaryIndex++
        })
        scope.ChildScopeList.forEach((childScope) => {
            temporaryRename(childScope)
        })
    }

    let nextFreeNameIndex = 0
    globalScope.forEach((_var) => {
        if (_var.AssignedTo) {
            let varName = ""
            varName = indexToVarName(nextFreeNameIndex)
            nextFreeNameIndex++
            while (Keywords[varName] || externalGlobals[varName]) {
                varName = indexToVarName(nextFreeNameIndex)
                nextFreeNameIndex++ 
            }
            _var.Rename(varName)
        }
    })

    rootScope.FirstFreeName = nextFreeNameIndex
    function doRenameScope(scope) {
        scope.VariableList.forEach((_var) => {
            let varName = ''
            varName = indexToVarName(scope.FirstFreeName)
            scope.FirstFreeName++
            while (Keywords[varName] || externalGlobals[varName]) {
                varName = indexToVarName(scope.FirstFreeName)
                scope.FirstFreeName++
            }
            _var.Rename(varName)
        })
        scope.ChildScopeList.forEach((childScope) => {
            childScope.FirstFreeName = scope.FirstFreeName
            doRenameScope(childScope)
        })
    }
    doRenameScope(rootScope)
}

function MinifyVariables_2(globalScope, rootScope, renameGlobals) {
    let globalUsedNames = []
    for (var [kw, _] of Object.entries(Keywords)) {
        globalUsedNames[kw] = true
    }

    let allVariables = []
    let allLocalVariables = []
    
    globalScope.forEach((_var) => {
        if (_var.AssignedTo && renameGlobals) {
            allVariables.push(_var)
        } else {
            globalUsedNames[_var.Name] = true
        }
    })

    function addFrom(scope) {
        scope.VariableList.forEach((_var) => {
            allVariables.push(_var)
            allLocalVariables.push(_var)
        })
        scope.ChildScopeList.forEach((childScope) => {
            addFrom(childScope)
        })
    }
    addFrom(rootScope)

    allVariables.forEach((_var) => {
        _var.UsedNameArray = []
    })

    allVariables.sort((a, b) => a - b)

    let nextValidNameIndex = 0
    let varNamesLazy = []

    function varIndexToValidName(i) {
        let name = varNamesLazy[i]
        if (name == null) {
            name = indexToVarName(nextValidNameIndex)
            nextValidNameIndex++
            while (globalUsedNames[name]) {
                name = indexToVarName(nextValidNameIndex)
                nextValidNameIndex++  
            }
            varNamesLazy[i] = name
        }
        return name
    }

    allVariables.forEach((_var, _) => {
        _var.Renamed = true
        
        let i = 0
        while (_var.UsedNameArray[i]) {
            i++
        }

        _var.Rename(varIndexToValidName(i))

        if (_var.Scope) {

            allVariables.forEach((otherVar) => {
                if (!otherVar.Renamed) {
                    if (!otherVar.Scope || otherVar.Scope.Depth < _var.Scope.Depth) {
                        otherVar.ReferenceLocationList.some((refAt) => {
                            if (refAt >= _var.BeginLocation && refAt <= _var.ScopeEndLocation) {
                                otherVar.UsedNameArray[i] = true
                                return true
                            }
                            return false
                        })
                    } else if(otherVar.Scope.Depth > _var.Scope.Depth) {
                        _var.ReferenceLocationList.some((refAt) => {
                            if (refAt >= otherVar.BeginLocation && refAt <= otherVar.ScopeEndLocation) {
                                otherVar.UsedNameArray[i] = true
                                return true
                            }
                            return false
                        })
                    } else {
                        if (_var.BeginLocation < otherVar.EndLocation && _var.EndLocation > otherVar.BeginLocation) {
                           otherVar.UsedNameArray[i] = true
                        }
                    }
                }
            })
        } else {
            allVariables.forEach((otherVar) => {
                if (!otherVar.Renamed) {
                    if (otherVar.Type == "Global") {
                        otherVar.UsedNameArray[i] = true
                    } else if(otherVar.Type == "Local") {

                        _var.ReferenceLocationList.some((refAt) => {
                            if (refAt >= otherVar.BeginLocation && refAt <= otherVar.ScopeEndLocation) {
                                otherVar.UsedNameArray[i] = true
                                return true
                            }

                            return false
                        })
                    } else {
                        throw "Unreachable"
                    }
                }
            })
        }
    })
}

function BeautifyVariables(globalScope, rootScope, renameGlobals) {
    let externalGlobals = []
     globalScope.forEach((_var) => {
        if (!_var.AssignedTo || !renameGlobals) {
            externalGlobals[_var.Name] = true
        }
    })

    let localNumber = 1
    let globalNumber = 1
    function setVarName(_var, name) {
        _var.Name = name
        _var.RenameList.forEach((setter) => {
            setter(name)
        })
    }
    if (renameGlobals) {
        globalScope.forEach((_var) => {
            if (_var.AssignedTo) {
                setVarName(_var, `G_${globalNumber}_`)
                globalNumber++
            }
        })
    }

    function modify(scope) {
        scope.VariableList.forEach((_var) => {
            let name = `L_${localNumber}_`
            if (_var.Info.Type == "Argument") {
                name = `${name}arg${_var.Info.Index}`
            } else if(_var.Info.Type == "LocalFunction") {
                name = `${name}func`
            } else if(_var.Info.Type == "ForRange") {
                name = `${name}forvar${_var.Info.Index}`
            }
            setVarName(_var, name)
            localNumber++
        })
        scope.ChildScopeList.forEach((scope1) => {
            modify(scope1)
        })
    }
    
    modify(rootScope)
}

// hi

let signatur = `--[[\n\tcode beautified using luamin.js, Herrtt#3868\n--]]`


module.exports.Minify = function(scr, renameVars, renameGlobals) {
    let ast = CreateLuaParser(scr)
    let [glb, root] = AddVariableInfo(ast)

    if (renameVars) {
        MinifyVariables_2(glb, root, renameGlobals)
    }

    StripAst(ast)

    let result = PrintAst(ast)

    return result
}

module.exports.Beautify = function(scr, renameVars, renameGlobals) {
    let ast = CreateLuaParser(scr)
    let [glb, root] = AddVariableInfo(ast)

    if (renameVars) {
        BeautifyVariables(glb, root, renameGlobals)
    }
    FormatAst(ast)
    let result = PrintAst(ast)
    result = `${signatur}\n\n${result}`

    return result
}