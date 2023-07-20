import { IRPCOptions } from '@mixer/postmessage-rpc';
import { IsUnknown } from 'type-fest';
import TypedEventEmitter3 from './eventemitter3';

type DefaultEventMap<EventName extends string = string> = Record<EventName, {
  isPromise?: true;
  params?: object;
  data?: any;
}>;

declare class _TypedRPC<
  EventMap extends DefaultEventMap = DefaultEventMap,
  /** 默认为严格模式, 严格模式下, 未声明的EventName会报ts类型错误 */
  Strict extends boolean = true,
  _EventName = Strict extends true ? keyof EventMap : (keyof EventMap | (string & {})),
// @ts-ignore
> extends TypedEventEmitter3<EventMap> {
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
  create(options: IRPCOptions): Promise<_TypedRPC<EventMap, Strict>>;
  /**
   * Attaches a method callable by the other window, to this one. The handler
   * function will be invoked with whatever the other window gives us. Can
   * return a Promise, or the results directly.
   */
  expose<
    EventName extends _EventName,
    EventHasType extends (EventName extends keyof EventMap ? true : false),
    Params extends (
      EventHasType extends true
        // @ts-ignore
        ? EventMap[EventName]['params']
        : any
    ),
    Data extends (
      EventHasType extends true
        // @ts-ignore
        ? EventMap[EventName]['data']
        : any
    ),
    // @ts-ignore
    IsPromise extends EventMap[EventName]['isPromise'],
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
    EventName extends _EventName,
    EventHasType extends (EventName extends keyof EventMap ? true : false),
    Params extends (
      EventHasType extends true
        // @ts-ignore
        ? EventMap[EventName]['params']
        : object
    ),
    Data extends (
      EventHasType extends true
        // @ts-ignore
        ? EventMap[EventName]['data']
        : object
    ),
  >(
    method: EventName,
    params: unknown extends Params ? object : Params,
    waitForReply?: true,
  ): Promise<unknown extends Data ? void : Data>;
  call<
    EventName extends _EventName,
    EventHasType extends (EventName extends keyof EventMap ? true : false),
    Params extends (
      EventHasType extends true
        // @ts-ignore
        ? EventMap[EventName]['params']
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

// @ts-ignore
type TypedRPC<EventMap, Strict extends boolean = true> = _TypedRPC<EventMap, Strict>;

export default TypedRPC;
