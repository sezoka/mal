import { as_hash_map, as_int, as_list, as_symbol, as_vector, make_hash_map, make_int, make_lambda, make_list, make_vector, Mal_Data, Mal_HashMap, Mal_Lambda, Mal_List, Mal_Type, Mal_Vector, } from "./types.js";
import { Env, env_get, env_set } from "./env.js";
import { pr_str } from "./printer.js";
import { read_str } from "./reader.js";
import { print, read_line } from "./util.js";

// type Environment = Map<string, Mal_Data>;

function READ(str: string): Mal_Data | null {
    return read_str(str);
}

function EVAL(data: Mal_Data, env: Env): Mal_Data | null {
    if (data.type === Mal_Type.list) {
        const list_data = data.value as Mal_Data[];
        if (list_data.length === 0) return data;

        if (list_data[0].value === "def!") {
            const key = as_symbol(list_data[1]);
            const value = EVAL(list_data[2], env);
            if (value === null) return null;
            env_set(env, key, value);
            return value;
        }

        if (list_data[0].value === "let*") {
            const new_env = new Env();
            new_env.outer = env;

            const bindings_list = as_list(list_data[1]);
            for (let i = 0; i < bindings_list.length - 1; i += 2) {
                const key = as_symbol(bindings_list[i]);
                const value = EVAL(bindings_list[i + 1], new_env);
                if (value === null) return null;
                env_set(new_env, key, value);
            }

            return EVAL(list_data[2], new_env);
        }

        const evaluated_list = eval_ast(data, env);
        if (evaluated_list === null) return null;

        const evaluated_list_data = evaluated_list.value as Mal_Data[];
        const first_elem = evaluated_list_data[0];
        if (first_elem.type !== Mal_Type.lambda) {
            console.error("Error: trying to call non-callable");
            return null;
        }

        const lambda = first_elem.value as Mal_Lambda;
        const args_list = evaluated_list_data.slice(1);
        return lambda(args_list, env);
    } else {
        return eval_ast(data, env);
    }
}

function PRINT(data: Mal_Data): any {
    print(pr_str(data, true));
    print('\n');
}

function eval_ast(data: Mal_Data, env: Env): Mal_Data | null {
    if (data.type === Mal_Type.symbol) {
        const symbol_str = data.value as string;
        const env_val = env_get(env, symbol_str);
        if (env_val === null) {
            console.error(`value of symbol '${symbol_str}' not found`);
            return null;
        } else {
            return env_val;
        }
    } else if (data.type === Mal_Type.hash_map) {
        const hash_map = as_hash_map(data);
        const evaluated_hash_map: Mal_HashMap = new Map();
        for (const [k, v] of hash_map) {
            const evaluated_key = EVAL(k, env);
            if (evaluated_key === null) return null;
            const evaluated_value = EVAL(v, env);
            if (evaluated_value === null) return null;
            evaluated_hash_map.set(evaluated_key, evaluated_value);
        }
        return make_hash_map(evaluated_hash_map);
    } else if (data.type === Mal_Type.vector) {
        const vector_data = as_vector(data);
        const evaluated_vec_data: Mal_Vector = new Array(vector_data.length);
        for (let i = 0; i < vector_data.length; i += 1) {
            const evaluated = EVAL(vector_data[i], env);
            if (evaluated === null) return null;
            evaluated_vec_data[i] = evaluated;
        }
        return make_vector(evaluated_vec_data);


    } else if (data.type === Mal_Type.list) {
        const list_data = as_list(data);
        const evaluated_list_data: Mal_List = new Array(list_data.length);
        for (let i = 0; i < list_data.length; i += 1) {
            const evaluated = EVAL(list_data[i], env);
            if (evaluated === null) return null;
            evaluated_list_data[i] = evaluated;
        }

        return make_list(evaluated_list_data);
    } else {
        return data;
    }
}

function init_environment(): Env {
    const env: Env = new Env();
    env_set(env, "+", make_lambda((args: Mal_List) => {
        let sum = 0;
        for (const val of args) sum += as_int(val);
        return make_int(sum);
    }));

    env_set(env, "-", make_lambda((args: Mal_List) => {
        let dif = as_int(args[0]) * 2;
        for (const val of args) dif -= as_int(val);
        return make_int(dif);
    }));

    env_set(env, "*", make_lambda((args: Mal_List) => {
        let mul = 1;
        for (const val of args) mul *= as_int(val);
        return make_int(mul);
    }));

    env_set(env, "/", make_lambda((args: Mal_List) => {
        let div = as_int(args[0]) ** 2;
        for (const val of args) div /= as_int(val);
        return make_int(div);
    }));

    return env;
}

function rep(input: string, env: Env): void {

    const read_result = READ(input);
    if (read_result === null) {
        console.log("Reading error");
        return;
    }

    const eval_result = EVAL(read_result, env);
    if (eval_result === null) {
        return;
    }

    PRINT(eval_result);
}

function main(): void {
    const env = init_environment();
    for (; ;) {
        print("user> ");
        const input = read_line();
        if (input.length === 1) break;
        rep(input, env);
    }
}

main();
