export type PromiseFn<T extends (...args: any) => any> = (
  ...args: Parameters<T>
) => Promise<ReturnType<T>>;

export type PromisableFn<T extends (...args: any) => any> = (
  ...args: Parameters<T>
) => Promise<ReturnType<T>> | ReturnType<T>;
