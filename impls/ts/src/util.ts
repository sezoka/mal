import fs from "fs";

export function read_line(): string {
    const buffer = Buffer.alloc(1024);
    const stdin = fs.openSync("/dev/stdin", "r");
    const len = fs.readSync(stdin, buffer, 0, buffer.byteLength, null);
    const line = buffer.toString('utf8').slice(0, len + 1);
    fs.closeSync(stdin);
    return line;
}

export function print(...args: any) {
    const str = args.join(" ");
    const stdout = fs.openSync("/dev/stdout", "w");
    fs.writeSync(stdout, str);
    fs.closeSync(stdout);
}


