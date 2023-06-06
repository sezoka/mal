import { tokenize, Token, Token_Type } from "./tokenizer.js";
import { Mal_Data, Mal_Type } from "./types.js";

class Reader {
    tokens: Token[] = [];
    position = 0;
}

function next_token(r: Reader): Token {
    if (is_at_end(r)) return peek_token(r);
    const curr_token = r.tokens[r.position];
    r.position += 1;
    return curr_token;
}

function is_at_end(r: Reader): boolean {
    return r.tokens[r.position].type === Token_Type.eof;
}

function peek_token(r: Reader): Token {
    return r.tokens[r.position]
}

function reader_error(msg: string) {
    console.error(msg);
}

function make_list(data: Mal_Data[]): Mal_Data {
    const list = new Mal_Data();
    list.type = Mal_Type.list;
    list.value = data;
    return list;
}

function read_list(r: Reader): Mal_Data | null {
    next_token(r);
    const list_data: Mal_Data[] = [];

    while (peek_token(r).type !== Token_Type.right_paren) {
        const form = read_form(r);
        if (form === null) break;

        list_data.push(form);
    }

    if (peek_token(r).type === Token_Type.eof) {
        reader_error("reader error: found EOF whilie reading list");
        return null;
    }

    next_token(r);

    return make_list(list_data);
}

function read_atom(r: Reader): Mal_Data | null {
    const token = next_token(r);
    if (token.type === Token_Type.eof) return null;

    const data = new Mal_Data();
    switch (token.type) {
        case Token_Type.number:
            data.type = Mal_Type.int;
            data.value = parseInt(token.literal);
            break;
        case Token_Type.symbol:
            data.type = Mal_Type.symbol;
            data.value = token.literal;
            break
        case Token_Type.nil:
            data.type = Mal_Type.nil;
            data.value = null;
            break;
        case Token_Type.true:
            data.value = true;
            data.type = Mal_Type.bool;
            break;
        case Token_Type.false:
            data.value = false;
            data.type = Mal_Type.bool;
            break;
        case Token_Type.string:
            data.value = token.literal;
            data.type = Mal_Type.string;
            break;
        case Token_Type.keyword:
            data.value = token.literal;
            data.type = Mal_Type.keyword;
            break;
    }

    return data;
}

function read_form(r: Reader): Mal_Data | null {
    const token = peek_token(r);

    if (token.type === Token_Type.left_paren) {
        return read_list(r);
    } else {
        return read_atom(r);
    }
}

export function read_str(str: string): Mal_Data | null {
    const r = new Reader();
    r.tokens = tokenize(str);
    return read_form(r);
}
