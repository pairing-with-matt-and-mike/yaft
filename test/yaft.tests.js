var yaft = require("../");

exports["the empty program results in an empty stack"] = function(test) {
    var result = yaft.run("");
    test.equals(result.stack.length, 0);
    test.done();
};

exports["a single number results in that number on the stack"] = function(test) {
    var result = yaft.run("42");
    test.deepEqual(result.stack, [42]);
    test.done();
};

exports["a zero results in a zero on the stack"] = function(test) {
    var result = yaft.run("0");
    test.deepEqual(result.stack, [0]);
    test.done();
};

exports["two numbers results in those numbers on the stack"] = function(test) {
    var result = yaft.run("42 47");
    test.deepEqual(result.stack, [42, 47]);
    test.done();
};

function opTest(token, expected) {
    exports[token + " two numbers, result is on stack"] = function(test) {
        var result = yaft.run("7 42 " + token);
        test.deepEqual(result.stack, [expected]);
        test.done();
    };
}

opTest("+", 49);
opTest("-", 35);
opTest("*", 294);
opTest("/", 6);

exports["empty quote puts empty quote on stack"] = function(test) {
    var result = yaft.run("[ ]");
    test.deepEqual(result.stack, [[]]);
    test.done();
};

exports["apply pops a quote off the stack"] = function(test) {
    var result = yaft.run("[ ] apply");
    test.deepEqual(result.stack, []);
    test.done();
};

exports["applied quoted plus adds two numbers"] = function(test) {
    var result = yaft.run("2 3 [ + ] apply");
    test.deepEqual(result.stack, [5]);
    test.done();
};

exports["applied quote of two pluses adds three numbers"] = function(test) {
    var result = yaft.run("1 2 3 [ + + ] apply");
    test.deepEqual(result.stack, [6]);
    test.done();
};

exports["double quote and two applys"] = function(test) {
    var result = yaft.run("2 3 [ [ + ] ] apply apply");
    test.deepEqual(result.stack, [5]);
    test.done();
};

exports["dup duplicates top item of stack"] = function(test) {
    var result = yaft.run("42 dup");
    test.deepEqual(result.stack, [42, 42]);
    test.done();
};

exports["pop removes top item of stack"] = function(test) {
    var result = yaft.run("42 pop");
    test.deepEqual(result.stack, []);
    test.done();
};

exports["swap swaps the top two items of the stack"] = function(test) {
    var result = yaft.run("42 1 swap");
    test.deepEqual(result.stack, [1, 42]);
    test.done();
};
