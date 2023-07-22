/**
 * `As` operation on type. Similar to the type assertion operator in typescript - `as`.
 * 
 * @description Using `@ts-ignore` can cause type loss, and most scenarios are not as comfortable as using `as`.
 * 
 * @example
 * type BetterContent<D extends { content: string }, prefix extends string> =
 *   D extends { content: infer C } ? `${prefix}: ${As<C, string>}` : never;
 * type R = BetterContent<{ content: 'xxx' }, 'content'>;
 */
export type As<OriginType, TargetType> = TargetType;

/**
 * Make partial properties in T optional
 */
export type PartialPartial<T, U extends keyof T> = Omit<T, U> & Partial<Pick<T, U>>;

/**
 * Make partial properties in T required
 */
export type PartialRequired<T, U extends keyof T> = Omit<T, U> & Required<Pick<T, U>>;
