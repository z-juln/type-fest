import { expectError } from 'tsd';
import TypedEventEmitter3 from '../../src/better-typed/eventemitter3';

interface MyEventMap {
  'load-error': {
    args: [Error];
  };
  'close': {
  };
  'result': {
    args: [
      result1: number,
      result2: string,
      result3: null,
    ];
  };
}

const ee: TypedEventEmitter3<MyEventMap> = {} as any;

// test1: on、once、addListener、emit、off、removeListener、removeAllListeners、listenerCount  
// EventName有代码提示
// 参数为空
ee.on('close', (...args) => {

});
// 参数Error
ee.once('load-error', (err) => {

});
// 参数[result1: number, result2: string, result3: null]
ee.addListener('result', (...args) => {

});
ee.removeListener('result', (...args) => {

});
ee.removeAllListeners('close');
ee.emit('close');
ee.off('close', () => {});
ee.listenerCount('close');
// 1. 严格模式下, 未声明的eventName, 代码报错
expectError(
  (ee as TypedEventEmitter3<MyEventMap>).on('unkown', (a: any) => a)
);
// 2. 非严格模式下, 未声明的eventName, handler为: (params: any） => Promise<any> | any)
(ee as TypedEventEmitter3<MyEventMap, false>).on('unkown', a => a);

