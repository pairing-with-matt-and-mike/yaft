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
    }
};

if (require.main === module) {
    repl();
}
