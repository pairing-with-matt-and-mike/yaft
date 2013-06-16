var yaft = require("../");

function yaftTest(desc, program, expected) {
    exports[desc] = function(test) {
        var result = yaft.run(program);
        test.deepEqual(result.stack, expected);
        test.done();
    };
}

yaftTest("the empty program results in an empty stack",
         "", []);

yaftTest("a single number results in that number on the stack",
         "42", [42]);

yaftTest("a zero results in a zero on the stack",
        "0", [0]);

yaftTest("two numbers results in those numbers on the stack",
         "42 47", [42, 47]);

function opTest(token, expected) {
    yaftTest(token + " two numbers, result is on stack", "42 7 " + token, [expected]);
}

opTest("+", 49);
opTest("-", 35);
opTest("*", 294);
opTest("/", 6);

yaftTest("empty quote puts empty quote on stack",
         "[ ]", [[]]);

yaftTest("apply pops a quote off the stack",
         "[ ] apply", []);

yaftTest("applied quoted plus adds two numbers",
         "2 3 [ + ] apply", [5]);

yaftTest("applied quote of two pluses adds three numbers",
         "1 2 3 [ + + ] apply", [6]);

yaftTest("in an application of [ + - ] plus happens first",
         "3 2 1 [ + - ] apply", [0]);

yaftTest("double quote and two applys",
         "2 3 [ [ + ] ] apply apply", [5]);

yaftTest("dup duplicates top item of stack",
         "42 dup", [42, 42]);

yaftTest("pop removes top item of stack",
         "42 pop", []);

yaftTest("swap swaps the top two items of the stack",
         "42 1 swap", [1, 42]);

yaftTest("clear empties the stack",
         "1 2 3 4 5 6 7 8 9 clear", []);

yaftTest("true results in true on the stack",
         "true", [true]);

yaftTest("false results in false on the stack",
         "false", [false]);

yaftTest("if true leaves result of true branch at top of stack",
         "[ 2 ] [ 1 ] true if", [1]);

yaftTest("if false leaves result of false branch at top of stack",
         "[ 2 ] [ 1 ] false if", [2]);

yaftTest("eq tests for equality, 1 and 1 are equal",
         "1 1 eq", [true]);

yaftTest("eq tests for equality, 1 and 2 are not equal",
         "1 2 eq", [false]);

yaftTest("1 is less than 2",
         "1 2 <", [true]);

yaftTest("2 is not less than 1",
         "2 1 <", [false]);

yaftTest("1 is not less than 1",
         "1 1 <", [false]);

yaftTest("1 is not greater than 2",
         "1 2 >", [false]);

yaftTest("2 is greater than 1",
         "2 1 >", [true]);

yaftTest("1 is not greater than 1",
         "1 1 >", [false]);

yaftTest("1 is less than or equal to 2",
         "1 2 <=", [true]);

yaftTest("2 is not less than or equal to 1",
         "2 1 <=", [false]);

yaftTest("1 is less than or equal to 1",
         "1 1 <=", [true]);

yaftTest("1 is not greater than or equal to 2",
         "1 2 >=", [false]);

yaftTest("2 is greater than or equal to 1",
         "2 1 >=", [true]);

yaftTest("1 is greater than or equal to 1",
         "1 1 >=", [true]);

yaftTest("quote lifts top of stack in to a quote",
         "1 quote", [[1]]);

yaftTest("dip temporarily removes top of stack, and applies a quote",
         "1 2 [ pop ] dip", [2]);

yaftTest("def creates a new function",
         "[ + ] f def 1 2 f", [3]);

yaftTest("def creates a reusable function",
         "[ + ] f def 1 2 3 f f", [6]);

yaftTest("dup-ed quotes are independent of the original",
         "1 2 3 [ + ] dup dip apply", [6]);

yaftTest("{ } pushes an empty object on to the stack",
         "{ }", [{}]);

yaftTest("{ a 1 } pushes the object {a: 1} on to the stack",
         "{ a 1 }", [{a: 1}]);

yaftTest("{ b [ ] } pushes the object {b: []} on to the stack",
         "{ b [ ] }", [{b: []}]);
