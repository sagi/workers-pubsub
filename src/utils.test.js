import '@sagi.io/globalthis';
import * as utils from './utils';

describe('utils', () => {
  test('setGlobals', () => {
    const fetchImpl1 = null;
    expect(() => utils.setGlobals(fetchImpl1)).toThrow();
    const fetchImpl2 = 'not null...';
    utils.setGlobals(fetchImpl2);
    expect(globalThis.fetch).toEqual(fetchImpl2);
  });

  test('injectBaseinputs', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const fnObj = { fnName1: fn1, fnName2: fn2 };
    const baseInputs = { satoshi: 'nakamoto' };
    utils.injectBaseinputs(baseInputs, fnObj);
    expect(fn1).toHaveBeenCalledWith(baseInputs);
    expect(fn2).toHaveBeenCalledWith(baseInputs);
  });
});
