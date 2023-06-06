"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.print = void 0;
const fs_1 = __importDefault(require("fs"));
function read_line() {
    const buffer = Buffer.alloc(1024);
    const stdin = fs_1.default.openSync("/dev/stdin", "r");
    const len = fs_1.default.readSync(stdin, buffer, 0, buffer.byteLength, null);
    const line = buffer.toString('utf8').slice(0, len + 1);
    fs_1.default.closeSync(stdin);
    return line;
}
function print(...args) {
    const str = args.join(" ");
    const stdout = fs_1.default.openSync("/dev/stdout", "w");
    fs_1.default.writeSync(stdout, str);
    fs_1.default.closeSync(stdout);
}
exports.print = print;
function READ(x) {
}
function EVAL(x) {
}
function PRINT(x) {
    print(x);
}
function rep(input) {
    READ(input);
    EVAL(input);
    PRINT(input);
}
function main() {
    for (;;) {
        print("user> ");
        const input = read_line();
        if (input.length === 0)
            break;
        rep(input);
    }
}
main();
