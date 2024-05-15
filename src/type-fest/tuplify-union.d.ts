import { UnionToIntersection } from "type-fest";

type LastOf<T> =
  UnionToIntersection<T extends any ? () => T : never> extends () => (infer R) ? R : never
type Push<T extends any[], V> = [...T, V];

/**
 * Union to tuple, but You can't rely on the ordering of a union type.
 * It's an implementation detail of the compiler;
 * since X | Y is equivalent to Y | X, the compiler feels free to change one to the other.
 * @example
 * ```typescript
 * type abc = 'a' | 'b' | 'c';
 * type t = TuplifyUnion<abc>; // ["a", "b", "c"]
 * ```
 */
export type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> =
  true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>
