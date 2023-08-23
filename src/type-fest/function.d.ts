export type PromiseFn<T extends Function> = (
  ...args: Parameters<T>
) => Promise<ReturnType<T>>;

export type PromisableFn<T extends Function> = (
  ...args: Parameters<T>
) => Promise<ReturnType<T>> | ReturnType<T>;
