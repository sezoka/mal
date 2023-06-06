import fs from "fs";
function read_line() {
    var buffer = Buffer.alloc(1024);
    var stdin = fs.openSync("/dev/stdin", "r");
    var len = fs.readSync(stdin, buffer, 0, buffer.byteLength, null);
    var line = buffer.toString("utf8").slice(0, len + 1);
    fs.closeSync(stdin);
    return line;
}
export function print() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    var str = args.join(" ");
    var stdout = fs.openSync("/dev/stdout", "w");
    fs.writeSync(stdout, str);
    fs.closeSync(stdout);
}
function READ(x) {}
function EVAL(x) {}
function PRINT(x) {
    print(x);
}
function rep(input) {
    READ(input);
    EVAL(input);
    PRINT(input);
}
function main() {
    for(;;){
        print("user> ");
        var input = read_line();
        if (input.length === 0) break;
        rep(input);
    }
}
main();
