
import { ValueOf } from 'type-fest';

type DefaultEventMap = Record<string | symbol, {
  args?: any[];
}>;

declare class _TypedEventEmitter3<
  EventMap extends DefaultEventMap = DefaultEventMap,
  /** 默认为严格模式, 严格模式下, 未声明的EventName会报ts类型错误 */
  Strict extends boolean = true,
  // @ts-ignore
  EventTypes extends string | symbol = keyof EventMap,
  _EventName = Strict extends true ? keyof EventMap : (keyof EventMap | (string | symbol & {})),
> {
  static prefixed: string | boolean;

  /**
   * Return an array listing the events for which the emitter has registered
   * listeners.
   */
  eventNames(): Array<_EventName>;

  /**
   * Return the listeners registered for a given event.
   */
  listeners(event: _EventName): Array<_TypedEventEmitter3.ListenerFn<EventMap>>;

  /**
   * Return the number of listeners listening to a given event.
   */
  listenerCount(event: _EventName): number;

  /**
   * Calls each of the listeners registered for a given event.
   */
  emit<
    EventName extends _EventName,
    Args = EventName extends EventTypes ? ValueOf<EventMap>['args'] : any[],
  >(event: EventName, ...args: Args extends any[] ? Args: []): boolean;

  /**
   * Add a listener for a given event.
   */
  on<EventName extends _EventName>(
    event: EventName,
    fn: _TypedEventEmitter3.ListenerFn<EventMap, Strict, _EventName, EventName>,
    context?: any,
  ): this;
  addListener<EventName extends _EventName>(
    event: EventName,
    fn: _TypedEventEmitter3.ListenerFn<EventMap, Strict, _EventName, EventName>,
    context?: any,
  ): this;

  /**
   * Add a one-time listener for a given event.
   */
  once<EventName extends _EventName>(
    event: EventName,
    fn: _TypedEventEmitter3.ListenerFn<EventMap, Strict, _EventName, EventName>,
    context?: any,
  ): this;

  /**
   * Remove the listeners of a given event.
   */
  removeListener<EventName extends _EventName>(
    event: EventName,
    fn: _TypedEventEmitter3.ListenerFn<EventMap, Strict, _EventName, EventName>,
    context?: any,
    once?: boolean,
  ): this;
  off<EventName extends _EventName>(
    event: EventName,
    fn: _TypedEventEmitter3.ListenerFn<EventMap, Strict, _EventName, EventName>,
    context?: any,
    once?: boolean,
  ): this;

  /**
   * Remove all listeners, or those of the specified event.
   */
  removeAllListeners(event?: EventTypes): this;
}

declare namespace _TypedEventEmitter3 {
  export interface ListenerFn<
    EventMap extends DefaultEventMap = DefaultEventMap,
    Strict extends boolean = true,
    _EventName = Strict extends true ? keyof EventMap : (keyof EventMap | (string | symbol & {})),
    EventName extends _EventName = any,
    EventTypes extends keyof EventMap = keyof EventMap,
    Args = EventName extends EventTypes ? EventMap[EventName]['args'] : any[],
  > {
    (...args: Args extends any[] ? Args : []): void;
  }

  export interface EventEmitterStatic<EventMap extends DefaultEventMap = DefaultEventMap> {
    new(): _TypedEventEmitter3<EventMap>;
  }

  export const EventEmitter: EventEmitterStatic;
}

// @ts-ignore
export class _Class_TypedEventEmitter3<EventMap, Strict extends boolean = true> extends _TypedEventEmitter3<EventMap, Strict> {};

// @ts-ignore
type TypedEventEmitter3<EventMap, Strict extends boolean = true> = _TypedEventEmitter3<EventMap, Strict>;

export default TypedEventEmitter3;
