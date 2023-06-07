import { Mal_Data } from "./types.js";



export class Env {
    outer: Env | null = null;
    data: Map<string, Mal_Data> = new Map();
}

export function env_set(env: Env, key: string, value: Mal_Data): void {
    env.data.set(key, value);
}

export function env_find(env: Env, key: string): Env | null {
    if (env.data.has(key)) {
        return env;
    } else if (env.outer !== null) {
        return env_find(env.outer, key);
    } else {
        return null;
    }
}

export function env_get(env: Env, key: string): Mal_Data | null {
    const key_owner = env_find(env, key);
    if (key_owner === null) return null;
    return key_owner.data.get(key)!;
}
