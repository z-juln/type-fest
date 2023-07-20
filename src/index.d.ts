export type * from 'type-fest';

/**
 * Make partial properties in T optional
 */
export type PartialPartial<T, U extends keyof T> = Omit<T, U> & Partial<Pick<T, U>>;

/**
 * Make partial properties in T required
 */
export type PartialRequired<T, U extends keyof T> = Omit<T, U> & Required<Pick<T, U>>;

export type { default as TypedRPC } from './better-typed/rpc';
export type { default as TypedEventemitter3 } from './better-typed/eventemitter3';
