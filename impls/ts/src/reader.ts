import { tokenize, Token, Token_Type } from "./tokenizer.js";
import { Mal_Data, Mal_Type, Mal_Value } from "./types.js";

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
    return make_mal_data(Mal_Type.list, list_data);
}

function read_vector(r: Reader): Mal_Data | null {
    next_token(r);
    const vector_data: Mal_Data[] = [];

    while (peek_token(r).type !== Token_Type.right_bracket) {
        const form = read_form(r);
        if (form === null) break;

        vector_data.push(form);
    }

    if (peek_token(r).type === Token_Type.eof) {
        reader_error("reader error: found EOF whilie reading vector");
        return null;
    }

    next_token(r);
    return make_mal_data(Mal_Type.vector, vector_data);
}

function read_hash_map(r: Reader): Mal_Data | null {
    next_token(r);
    const hash_map = new Map();

    while (peek_token(r).type !== Token_Type.right_brace) {
        const key = read_form(r);
        if (key === null) break;

        if (peek_token(r).type === Token_Type.right_brace) break;
        const value = read_form(r);
        if (value === null) break;

        hash_map.set(key, value);
    }

    if (peek_token(r).type === Token_Type.eof) {
        reader_error("reader error: found EOF whilie reading hash map");
        return null;
    }

    next_token(r);
    return make_mal_data(Mal_Type.hash_map, hash_map);
}

function make_mal_data(type: Mal_Type, value: Mal_Value): Mal_Data {
    return { type, value };
}

function read_atom(r: Reader): Mal_Data | null {
    const token = next_token(r);
    if (token.type === Token_Type.eof) return null;

    const data = new Mal_Data();
    switch (token.type) {
        case Token_Type.nil: return make_mal_data(Mal_Type.nil, null);
        case Token_Type.true: return make_mal_data(Mal_Type.bool, true);
        case Token_Type.false: return make_mal_data(Mal_Type.bool, false);
        case Token_Type.number: return make_mal_data(Mal_Type.int, token.literal);
        case Token_Type.string: return make_mal_data(Mal_Type.string, token.literal);
        case Token_Type.symbol: return make_mal_data(Mal_Type.symbol, token.literal);
        case Token_Type.keyword: return make_mal_data(Mal_Type.keyword, token.literal);
    }

    return data;
}

function read_form(r: Reader): Mal_Data | null {
    const token = peek_token(r);

    if (token.type === Token_Type.left_paren) {
        return read_list(r);
    } else if (token.type === Token_Type.left_brace) {
        return read_hash_map(r);
    } else if (token.type === Token_Type.left_bracket) {
        return read_vector(r);
    } else {
        return read_atom(r);
    }
}

export function read_str(str: string): Mal_Data | null {
    const r = new Reader();
    r.tokens = tokenize(str);
    return read_form(r);
}
