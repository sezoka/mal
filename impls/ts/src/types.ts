
export enum Mal_Type {
    list,
    int,
    symbol,
    nil,
    bool,
    string,
    keyword,
    vector,
    hash_map,
    lambda,
}

export class Mal_Data {
    type: Mal_Type = Mal_Type.list;
    value: Mal_Value = null;
}

export type Mal_Lambda = (args: Mal_List) => Mal_Data;

export type Mal_List = Mal_Data[];

export type Mal_Vector = Mal_Data[];

export type Mal_HashMap = Map<Mal_Data, Mal_Data>;

export type Mal_Value = Mal_Data[] | Map<Mal_Data, Mal_Data> | number | null | boolean | string | Mal_Lambda;

export function as_list(data: Mal_Data): Mal_List {
    return data.value as Mal_List;
}

export function as_vector(data: Mal_Data): Mal_Vector {
    return data.value as Mal_List;
}

export function as_hash_map(data: Mal_Data): Mal_HashMap {
    return data.value as Mal_HashMap;
}

export function as_int(data: Mal_Data): number {
    return data.value as number;
}

export function make_lambda(fn: Mal_Lambda): Mal_Data {
    return make_data(Mal_Type.lambda, fn);
}

export function make_int(val: number): Mal_Data {
    return make_data(Mal_Type.int, val);
}

export function make_hash_map(map: Mal_HashMap): Mal_Data {
    return make_data(Mal_Type.hash_map, map);
}

export function make_list(list_data: Mal_List): Mal_Data {
    return make_data(Mal_Type.list, list_data);
}

export function make_vector(list_data: Mal_Vector): Mal_Data {
    return make_data(Mal_Type.vector, list_data);
}

export function make_data(type: Mal_Type, val: Mal_Value): Mal_Data {
    return { type: type, value: val };
}
