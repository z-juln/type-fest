import { IRPCOptions } from '@mixer/postmessage-rpc';
import { IsUnknown } from 'type-fest';
import { _Class_TypedEventEmitter3 } from './eventemitter3';

type EventMap = Record<string, {
  isPromise?: true;
  params?: object;
  data?: any;
}>;
type _ExposeMap = EventMap;
type _CallMap = EventMap;

declare class _TypedRPC<
  ExposeMap extends _ExposeMap,
  CallMap extends _CallMap,
  /** 默认为严格模式, 严格模式下, 未声明的EventName会报ts类型错误 */
  Strict extends boolean = true,
  _ExposeName = Strict extends true ? keyof ExposeMap : (keyof ExposeMap | (string & {})),
  _CallName = Strict extends true ? keyof CallMap : (keyof CallMap | (string & {})),
> {
  readonly isReady: Promise<void>;
  /**
   * Creates a new RPC instance. Note: you should use the `rpc` singleton,
   * rather than creating this class directly, in your controls.
   */
  constructor(options: IRPCOptions);
  /**
   * Create instantiates a new RPC instance and waits until it's ready
   * before returning.
   */
  create(options: IRPCOptions): Promise<_TypedRPC<ExposeMap, CallMap, Strict>>;
  /**
   * Attaches a method callable by the other window, to this one. The handler
   * function will be invoked with whatever the other window gives us. Can
   * return a Promise, or the results directly.
   */
  expose<
    EventName extends _ExposeName,
    EventHasType extends (EventName extends keyof ExposeMap ? true : false),
    Params extends (
      EventHasType extends true
        // @ts-ignore
        ? ExposeMap[EventName]['params']
        : any
    ),
    Data extends (
      EventHasType extends true
        // @ts-ignore
        ? ExposeMap[EventName]['data']
        : any
    ),
    // @ts-ignore
    IsPromise extends ExposeMap[EventName]['isPromise'],
    HandlerReturnValue extends (IsPromise extends true ? Promise<Data> : Data),
  >(
    method: EventName,
    handler:
      EventHasType extends true
        ? IsUnknown<Params> extends true
          ? () => HandlerReturnValue
          : (params: Params) => HandlerReturnValue
        : (params: any) => any,
  ): this;
  call<
    EventName extends _CallName,
    EventHasType extends (EventName extends keyof CallMap ? true : false),
    Params extends (
      EventHasType extends true
        // @ts-ignore
        ? CallMap[EventName]['params']
        : object
    ),
    Data extends (
      EventHasType extends true
        // @ts-ignore
        ? CallMap[EventName]['data']
        : object
    ),
  >(
    method: EventName,
    params: unknown extends Params ? object : Params,
    waitForReply?: true,
  ): Promise<unknown extends Data ? void : Data>;
  call<
    EventName extends _CallName,
    EventHasType extends (EventName extends keyof CallMap ? true : false),
    Params extends (
      EventHasType extends true
        // @ts-ignore
        ? CallMap[EventName]['params']
        : object
    ),
  >(
    method: EventName,
    params: unknown extends Params ? object : Params,
    waitForReply: false,
  ): void;
  /**
   * Tears down resources associated with the RPC client.
   */
  destroy(): void;
  /**
   * Returns the protocol version that the remote client implements. This
   * will return `undefined` until we get a `ready` event.
   */
  remoteVersion(): string | undefined;
}

type TypedRPC<
  EventMap extends _ExposeMap,
  CallMap extends _CallMap,
  Strict extends boolean = true,
> = _TypedRPC<
  EventMap,
  CallMap,
  Strict
>;

export default TypedRPC;
