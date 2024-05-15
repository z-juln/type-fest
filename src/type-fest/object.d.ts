import { IsUnknown, ValueOf } from 'type-fest';
import { TuplifyUnion } from './tuplify-union';

type TupleOrArray = readonly [...unknown[]];

/**
 * An object or an array.
 */
export type Spreadable = object | TupleOrArray;

type InnerDeepKeysOfSpreadable<
  Obj extends Record<any, any>,
  Keys extends string | number | symbol = keyof Obj,
> = ValueOf<{
  [K in Keys]: Obj[K] extends Spreadable
    ? InnerDeepKeysOfSpreadable<Obj[K]>
    : K;
}>;

/**
 * Get all keys of an spreadable type recursively.
 * @example
 * ```ts
 * type Obj = {
 *   0: string;
 *   a: {
 *     b: {
 *       c: string;
 *       d: string;
 *     };
 *   };
 *   e: string;
 *   f: string;
 *   [Symbol.hasInstance]: 0;
 * };
 * type Keys = DeepKeysOfObjectFormula<Obj>; // `Keys` equivalent to 0 | 'c' | 'd' | 'f' | Symbol.hasInstance;
 */
export type DeepKeysOfSpreadable<Obj extends Record<any, any>> = InnerDeepKeysOfSpreadable<Obj>;

/**
 * Merge multiple objects
 * @example
 * ```ts
 * type O1 = {
 *   a: 'a';
 *   c: 'c';
 *   d: {
 *     d1: 0;
 *   };
 *   e: 'e';
 *   f: 'f1';
 * };
 * type O2 = {
 *   b: 'b';
 *   c: 'c';
 *   d: {
 *     d2: 1;
 *   };
 *   e: { e: 'e'; };
 *   f: 'f2';
 * };
 * type Res = MergeObjects<[O1, O2, ...]>; // { a?: 'a'; b?: 'b'; c: 'c'; d: { d1?: 0; d2?: 1; }; e: 'e' | { e: 'e'; }; f: 'f1' | 'f2'; };
 * ```
 */
export type MergeObjects<Objects extends object[]> =
  Objects extends [infer O1, infer O2, ...infer Others]
    ? Others extends []
      ? MergeTwoObjects<O1, O2>
      // @ts-ignore
      : MergeTwoObjects<O1, MergeObjects<[O2, ...Others]>>
    : never;

type MergeTwoObjects<O1 = {}, O2 = {}> = Omit<{
  [K in (keyof O1 | keyof O2)]?:
    // @ts-ignore
    IsUnknown<O1[K]> extends true
      // @ts-ignore
      ? O2[K]
      // @ts-ignore
      : IsUnknown<O2[K]> extends true
        // @ts-ignore
        ? O1[K]
        : (O1 & O2)[K];
}, keyof (O1 | O2)> & {
  [K in keyof (O1 | O2)]: MergeValue<K, O1, O2>;
};

type IsExtendObject<T> = T extends object ? true : false;

type MergeValue<
    K extends string | number | symbol,
    O1,
    O2,
    // @ts-ignore
    V1 = O1[K],
    // @ts-ignore
    V2 = O2[K],
> =
    IsUnknown<V1> extends true
        ? V2
        : IsUnknown<V1> extends true
            ? unknown
            : (
              IsExtendObject<V1> | IsExtendObject<V2> extends true ? MergeTwoObjects<V1, V2> : V1 | V2
            );

/**
 * Merge multiple objects
 * @example
 * ```ts
 * type O1 = {
 *   a: 'a';
 *   c: 'c';
 *   d: {
 *     d1: 0;
 *   };
 *   e: 'e';
 *   f: 'f1';
 * };
 * type O2 = {
 *   b: 'b';
 *   c: 'c';
 *   d: {
 *     d2: 1;
 *   };
 *   e: { e: 'e'; };
 *   f: 'f2';
 * };
 * type Res = MixedTuple<O1 | O2>; // { a?: 'a'; b?: 'b'; c: 'c'; d: { d1?: 0; d2?: 1; }; e: 'e' | { e: 'e'; }; f: 'f1' | 'f2'; };
 * ```
 */
// @ts-ignore
export type MixedTuple<T extends object> = MergeObjects<[...TuplifyUnion<T>, ...TuplifyUnion<T>]>;
