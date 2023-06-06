import fs from "fs";
import { pr_str } from "./printer.js";
import { read_str } from "./reader.js";
import { Mal_Data } from "./types.js";
import { print, read_line } from "./util.js";

function READ(str: string): Mal_Data | null {
    return read_str(str);
}

function EVAL(x: any): any {
    return x;
}

function PRINT(data: Mal_Data): any {
    print(pr_str(data, true));
    print('\n');
}

function rep(input: string): any {
    const read_result = READ(input);
    if (read_result === null) {
        return;
    }
    const eval_result = EVAL(read_result);
    PRINT(eval_result);
}

function main(): void {
    for (; ;) {
        print("user> ");
        const input = read_line();
        console.log(input.length);
        if (input.length === 1) break;
        rep(input);
    }
}

main();
