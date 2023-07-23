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
 * @example
 * type OriginalArr = [1, ''];
 * type Arr = ReadonlyArray<OriginalArr>; // readonly [1, '']
 */
export type ReadonlyArray<Arr extends readonly unknown[]> = readonly [...Arr];

type PureWritableArray<Arr extends readonly unknown[]> =
  Arr extends readonly [infer Head, ...infer Rest]
    ? IsValue<Head> extends true ? [Head, ...PureWritableArray<Rest>] : [...PureArray<Rest>]
    : Arr extends readonly [infer Item]
      ? IsValue<Item> extends true ? [Item] : []
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
 * 
 * type ReadonlyOriginalArr = readonly [1, 2, never, void];
 * type ReadonlyArr = PureArray<ReadonlyOriginalArr>; // readonly [1, 2]
 */
export type PureArray<Arr extends readonly unknown[]> = IsReadonlyArray<Arr> extends true ? ReadonlyArray<PureWritableArray<Arr>> : PureWritableArray<Arr>;
