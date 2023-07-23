import { IsValue, Negate } from ".";

export type IsReadonlyArray<Arr extends readonly unknown[]> = Arr extends unknown[] ? false : true;

export type IsWritableArray<Arr extends readonly unknown[]> = Negate<IsReadonlyArray<Arr>>;

/**
 * Map template
 */
type MapTemplate<Arr extends readonly unknown[]> =
  Arr extends readonly [infer Head, ...infer Rest]
    ? [Head, ...MapTemplate<Rest>]
    : Arr extends readonly [infer Item]
      ? [Item]
      // 1. 传入的是 [] 2. 递归到最后为[]
      : Arr extends readonly []
        ? []
        // 传入的是 number[] 之类的
        : Arr;

/**
 * filter out `never` and `void`
 * 
 * @example
 * type OriginalArr = [1, '', false, number, string, boolean, symbol, {}, object, Error, null, undefined, never, void];
 * type Arr = PureArray<OriginalArr>; // [1, "", false, number, string, boolean, symbol, {}, object, Error, null, undefined]
 */
export type PureArray<Arr extends readonly unknown[]> =
  Arr extends readonly [infer Head, ...infer Rest]
    ? IsValue<Head> extends true ? [Head, ...PureArray<Rest>] : PureArray<Rest>
    : Arr extends readonly [infer Item]
      ? IsValue<Item> extends true ? [Item] : []
      // 1. 传入的是 [] 2. 递归到最后为[]
      : Arr extends readonly []
        ? []
        // 传入的是 number[] 之类的
        : Arr;
