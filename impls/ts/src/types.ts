
export enum Mal_Type {
    list,
    int,
    symbol,
    nil,
    bool,
    string,
    keyword,
}

export class Mal_Data {
    type: Mal_Type = Mal_Type.list;
    value: Mal_Value = null;
}

export type Mal_Value = Mal_Data[] | number | null | boolean | string;
