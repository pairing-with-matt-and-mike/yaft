exports.run = run;

function run(program) {

    var stack = [];

    var tokens = tokenise(program);

    evaluate(tokens, stack);

    return {
        stack: stack
    };
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

function evaluate(tokens, stack) {
    while (tokens.length > 0) {
        var token = tokens[tokens.length - 1];
        if (functions[token]) {
            functions[token](tokens, stack);
        } else if (token === "[") {
            quote(tokens, stack);
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

function quote(tokens, stack) {
    tokens.pop();
    var token;
    var quoteTokens = [];
    while ("]" !== (token = tokens.pop())) {
        quoteTokens.push(token);
    }
    stack.push(quoteTokens);
};

// [ 2 3 + ]
