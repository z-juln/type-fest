import { expectError } from 'tsd';
import TypedRPC from "../../src/better-typed/rpc";

interface MyEventMap {
  'load-error': {
    data: Error;
  };
  'close': {
  };
  'result': {
    data: {
      mask: string;
      cutImg: string;
    };
  };
  'fetch': {
    isPromise: true;
    params: {
      data: any;
      space?: string | number;
    };
    data: {
      code: 200;
      data: Object;
    };
  };
}

const rpc: TypedRPC<MyEventMap> = {} as any;

// test1: expose
// EventName有代码提示
rpc.expose('load-error', () => {
  return new Error('load-error');
});
rpc.expose('result', () => {
  return {
    mask: 'xxx',
    cutImg: 'xxx',
  };
});
rpc.expose('fetch', async ({ space = 2 }) => {
  return {
    code: 200,
    data: {
      a: 1,
    },
  };
});
// params不对, 代码报错
expectError(
  rpc.expose('fetch', async ({ space = 2, a: number }) => {
    return {
      code: 200,
      data: {
        a: 1,
      },
    };
  })
);
// returnType不对, 代码报错
expectError(
  rpc.expose('fetch', async ({ space = 2 }) => {
    return {
      code: 200,
    };
  })
);
// isPromise设置为true时, returnValue必须是promise, 代码报错
expectError(
  rpc.expose('fetch', ({ space = 2 }) => {
    return {
      code: 200,
      data: { a: 1 },
    };
  })
);
// 1. 严格模式下, 未声明的eventName, 代码报错
expectError(
  (rpc as TypedRPC<MyEventMap>).expose('unkown', (a: any) => a)
);
// 2. 非严格模式下, 未声明的eventName, handler为: (params: any） => Promise<any> | any)
(rpc as TypedRPC<MyEventMap, false>).expose('unkown', a => a);

// test2: call
// EventName有代码提示
// 无params时, params必须为object (rpc本来就是object类型)
rpc.call('close', {});
// 不传waitForReply时, 返回值为promise<Data>
rpc.call('close', {})
  .then(() => {
    
  });
// 传waitForReply=false时, 返回值为void, 代码报错
expectError(
  rpc.call('close', {}, false)
    .then(() => {
      
    })
);
// params不对, 代码报错
expectError(
  rpc.call('fetch', {})
);
rpc.call('fetch', {
  data: { a: 1 },
});
