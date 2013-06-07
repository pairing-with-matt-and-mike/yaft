exports.run = run;

function run(program) {

    var stack = [];

    var tokens = tokenise(program);

    var ast = parse(tokens);

    evaluate(ast, stack);

    return {
        stack: stack
    };
}

function repl() {
    var readline = require('readline');
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    var stack = [];
    rl.on("line", function(line) {
        var tokens = tokenise(line);
        var ast = parse(tokens);
        evaluate(ast, stack);
        console.log(stack);
    }).on('close', function() {
        process.exit(0);
    });
}

function tokenise(program) {
    if (program) {
        var tokens = program.split(/ /);
        tokens.reverse();
        return tokens;
    } else {
        return [];
    }
}

function parse(tokens) {
    var ast = [];
    while (tokens.length) {
        var token = tokens.pop();
        if (token === "[") {
            var quote = parse(tokens);
            ast.push(quote);
        } else if ("]" === token) {
            return ast;
        } else {
            ast.push(token);
        }
    }
    ast.reverse();
    return ast;
}

function evaluate(tokens, stack) {
    while (tokens.length > 0) {
        var token = tokens[tokens.length - 1];
        if (Object.prototype.toString.call(token) === '[object Array]') {
            tokens.pop();
            stack.push(token);
        } else if (functions[token]) {
            functions[token](tokens, stack);
        } else {
            tokens.pop();
            stack.push(parseInt(token, 10));
        }
    }
}

function binop(op) {
    return function(tokens, stack) {
        tokens.pop();
        return stack.push(op(stack.pop(), stack.pop()));
    };
};

var functions = {
    "+": binop(function(a, b) { return a + b; }),
    "-": binop(function(a, b) { return a - b; }),
    "*": binop(function(a, b) { return a * b; }),
    "/": binop(function(a, b) { return a / b; }),
    "apply": function(tokens, stack) {
        tokens.pop();
        evaluate(stack.pop(), stack);
    },
    "dup": function(tokens, stack) {
        tokens.pop();
        var token = stack.pop();
        stack.push(token);
        stack.push(token);
    },
    "pop": function(tokens, stack) {
        tokens.pop();
        stack.pop();
    },
    "swap": function(tokens, stack) {
        tokens.pop();
        var a = stack.pop();
        var b = stack.pop();
        stack.push(a);
        stack.push(b);
    },
    "clear": function(tokens, stack) {
        tokens.pop();
        stack.length = 0;
    },
    "true": function(tokens, stack) {
        tokens.pop();
        stack.push(true);
    },
    "false": function(tokens, stack) {
        tokens.pop();
        stack.push(false);
    },
    "if": function(tokens, stack) {
        tokens.pop();
        var c = stack.pop();
        var t = stack.pop();
        var f = stack.pop();
        evaluate(c ? t : f, stack);
    }
};

if (require.main === module) {
    repl();
}
