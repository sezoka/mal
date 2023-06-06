import { Mal_Data, Mal_Type } from "./types.js";

function escape_str(str: string): string {
    const string_builder = [];

    for (const c of str) {
        switch (c) {
            case '\n': string_builder.push('\\n'); break;
            case '\\': string_builder.push('\\\\'); break;
            case '"': string_builder.push('\\"'); break;
            default: string_builder.push(c);
        }
    }

    return string_builder.join("");
}

export function pr_str(data: Mal_Data, print_readably: boolean): string {
    switch (data.type) {
        case Mal_Type.keyword: return ":" + data.value as string;
        case Mal_Type.int: return (data.value as number).toString();
        case Mal_Type.nil: return "nil";
        case Mal_Type.string: return '"' + escape_str(data.value as string) + '"';
        case Mal_Type.bool: return (data.value as boolean).toString();
        case Mal_Type.symbol: return data.value as string;
        case Mal_Type.hash_map: {
            const hash_map = data.value as Map<Mal_Data, Mal_Data>;
            const string_builder = [];
            for (const [k, v] of hash_map) {
                string_builder.push(pr_str(k, true));
                string_builder.push(pr_str(v, true));
            }
            return "{" + string_builder.join(" ") + "}";
        };
        case Mal_Type.vector: {
            const vector = data.value as Mal_Data[];
            const string_builder = new Array(vector.length);
            for (let i = 0; i < vector.length; i += 1) {
                string_builder[i] = pr_str(vector[i], true);
            }
            return "[" + string_builder.join(" ") + "]";
        }
        case Mal_Type.list: {
            const list = data.value as Mal_Data[];
            const string_builder = new Array(list.length);
            for (let i = 0; i < list.length; i += 1) {
                string_builder[i] = pr_str(list[i], true);
            }
            return "(" + string_builder.join(" ") + ")";
        }
    }
}
