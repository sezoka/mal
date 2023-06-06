export enum Token_Type {
    error = "<invalid>",
    eof = "EOF",

    tilda_at = "~@",
    left_bracket = "[",
    right_bracket = "]",
    left_brace = "{",
    right_brace = "}",
    left_paren = "(",
    right_paren = ")",
    quote = "'",
    grave = "`",
    tilda = "~",
    caret = "^",
    at = "@",
    string = "string",
    number = "number",
    symbol = "symbol",
    keyword = "keyword",
    true = "true",
    false = "false",
    nil = "nil",
}

export class Token {
    type: Token_Type = Token_Type.error;
    literal: string = "";
}

export class Tokenizer {
    src = "";
    position = 0;
}

const keywords = new Map([
    ["true", Token_Type.true],
    ["false", Token_Type.false],
    ["nil", Token_Type.nil,]
]);

function is_at_end(t: Tokenizer): boolean {
    return t.src[t.position] === '\0';
}

function peek(t: Tokenizer): string {
    return t.src[t.position];
}

function peek_next(t: Tokenizer): string {
    if (t.src.length <= t.position + 1) return '\0';
    return t.src[t.position + 1];
}

function is_whitespace(c: string): boolean {
    return c === ' ' || c === '\n' || c === '\r' || c === '\t' || c === ',';
}

function skip_whitespaces_and_commas(t: Tokenizer): void {
    while (!is_at_end(t)) {
        if (is_whitespace(peek(t))) {
            t.position += 1;
        } else if (peek(t) === ";") {
            while (peek(t) !== '\n' || is_at_end(t)) t.position += 1;
        } else {
            return;
        }
    }
}

function make_error(msg: string): Token {
    const token = new Token();
    token.type = Token_Type.error;
    token.literal = msg;
    return token;
}

function parse_string(t: Tokenizer, token: Token): Token {
    t.position += 1;

    const string_builder: string[] = [];

    const try_escape = (c: string, insert: string) => {
        if (peek_next(t) === c) {
            t.position += 2;
            string_builder.push(insert);
            return true;
        }
        return false;;
    }

    for (; ;) {
        while (!is_at_end(t) && peek(t) !== '\\' && peek(t) !== '"') {
            string_builder.push(peek(t));
            t.position += 1;
        }

        if (peek(t) === '\\') {

            if (try_escape('"', '"')) continue;
            if (try_escape('\\', '\\')) continue;
            if (try_escape('n', '\n')) continue;

            return make_error("Error: invalid escape character");
        }

        if (peek(t) === '"') break;
        if (is_at_end(t)) return make_error("unbalanced string");
    }

    token.literal = string_builder.join("");
    t.position += 1;
    token.type = Token_Type.string;

    return token;
}

function parse_number(t: Tokenizer, token: Token): Token {
    const start = t.position;
    t.position += 1;

    while (is_digit(peek(t))) t.position += 1;

    if (peek(t) === '.' && is_digit(peek_next(t))) {
        t.position += 2;
        while (is_digit(peek(t))) t.position += 1;
    }

    token.type = Token_Type.number;
    token.literal = t.src.slice(start, t.position);

    return token;
}

function is_special_char(c: string): boolean {
    return " []{}()'\"`,;\0\n\r".includes(c);
}


function match_symbol(literal: string): Token_Type {
    return keywords.get(literal) ?? Token_Type.symbol;
}

function parse_identifier(t: Tokenizer, token: Token): Token {
    let start = t.position;
    let is_keyword = false;

    if (peek(t) === ':') {
        is_keyword = true;
        start += 1;
    }

    while (!is_special_char(peek(t))) t.position += 1;

    const literal = t.src.slice(start, t.position);

    if (is_keyword) {
        token.type = Token_Type.keyword;
        token.literal = literal;
        return token;
    }

    token.type = match_symbol(literal);
    if (token.type === Token_Type.symbol) {
        token.literal = literal;
    }

    return token;
}

function is_digit(c: string): boolean {
    return '0' <= c && c <= '9';
}

function next_token(t: Tokenizer): Token {
    skip_whitespaces_and_commas(t);

    let token = new Token();

    if (is_at_end(t)) {
        token.type = Token_Type.eof;
        return token;
    }

    const c = peek(t);
    switch (c) {
        case '[': token.type = Token_Type.left_bracket; break;
        case ']': token.type = Token_Type.right_bracket; break
        case '{': token.type = Token_Type.left_brace; break;
        case '}': token.type = Token_Type.right_brace; break;
        case '(': token.type = Token_Type.left_paren; break;
        case ')': token.type = Token_Type.right_paren; break;
        case '\'': token.type = Token_Type.quote; break;
        case '`': token.type = Token_Type.grave; break;
        case '~':
            if (peek_next(t) === '@') {
                t.position += 1;
                token.type = Token_Type.tilda_at;
            }
            else {
                token.type = Token_Type.tilda;
            }
            break;
        case '^': token.type = Token_Type.caret; break;
        case '@': token.type = Token_Type.at; break;
        case '"': return parse_string(t, token);
        default:
            if (is_digit(c) || (c === '-' && is_digit(peek_next(t)))) {
                return parse_number(t, token);
            } else {
                return parse_identifier(t, token);
            }
    }

    t.position += 1;

    return token;
}

export function tokenize(str: string): Token[] {
    const t = new Tokenizer();
    t.src = str;

    const tokens: Token[] = [];

    for (; ;) {
        const token = next_token(t);
        tokens.push(token);
        if (token.type === Token_Type.eof) break;
        if (token.type === Token_Type.error) {
            console.error(token.literal);
            const eof = new Token();
            eof.type = Token_Type.eof;
            return [eof];
        }

    }

    return tokens;
}
