/*
 * This file is part of the @orkans/utilsjs package.
 * Copyright (c) 2023-2026 Orkan <orkans+utilsjs@gmail.com>
 */
import * as utils from '@orkans/utilsjs';

/**
 * arrPadR()
 */
utils.testDataSet(
  'arrPadR()',
  {
    'arr[2] -> pad[4]': {
      arr: [1, 2],
      out: [1, 2, 0, 0],
      pad: 4,
      str: 0,
    },
    'arr[2] -> pad[2]': {
      arr: [1, 2],
      out: [1, 2],
      pad: 2,
      str: 0,
    },
  },
  (data) => {
    expect(utils.arrPadR(data.arr, data.pad, data.str)).toEqual(data.out);
  }
);

/**
 * arrRepeat()
 */
utils.testDataSet(
  'arrRepeat()',
  {
    'len 0': {
      arr: ['a', 'b'],
      out: [],
      len: 0,
    },
    'len 1': {
      arr: ['a', 'b'],
      out: ['a', 'b'],
      len: 1,
    },
    'len 2': {
      arr: ['a', 'b'],
      out: ['a', 'b', 'a', 'b'],
      len: 2,
    },
  },
  (data) => {
    expect(utils.arrRepeat(data.arr, data.len)).toEqual(data.out);
  }
);

/**
 * arrShuffle()
 */
test('arrShuffle()', () => {
  const arr = ['a', 'b', 1, 56];
  const out = utils.arrShuffle([...arr]);
  arr.sort();
  out.sort();
  expect(arr).toEqual(out);
});

/**
 * pathBasename()
 */
utils.testDataSet(
  'pathBasename()',
  {
    '1: /a.txt': {
      var: '/a.txt',
      out: 'a.txt',
    },
    '2: /a/b.txt': {
      var: '/a/b.txt',
      out: 'b.txt',
    },
    '3: D:/a/b/c': {
      var: 'D:/a/b/c',
      out: 'c',
    },
    '4: info.doc': {
      var: 'info.doc',
      out: 'info.doc',
    },
  },
  (data) => {
    expect(utils.pathBasename(data.var)).toEqual(data.out);
  }
);

/**
 * objNested()
 */
test('objNested()', () => {
  const obj = {};
  utils.objNested(obj, ['a', 'b', 'c'], ['valA', 'valB']);
  const out = {
    a: {
      b: {
        c: ['valA', 'valB'],
      },
    },
  };
  expect(obj).toEqual(out);
});

/**
 * objMap()
 */
test('objMap()', () => {
  const tmp = { a: 1, b: 2, c: 3 };
  const out = { a: 'a1', b: 'b2', c: 'c3' };
  const obj = utils.objMap(tmp, (v, k) => k + v);
  expect(obj).toEqual(out);

  // Check for original object
  utils.objMap(tmp, (v, k, o) => expect(o).toEqual(tmp));
});

/**
 * objReduce()
 */
test('objReduce()', () => {
  const obj = {
    a: 'valA',
    b: 'valB',
    c: 'valC',
  };
  const out = utils.objReduce({ ...obj, d: 'valD' }, Object.keys(obj));
  expect(out).toEqual(obj);
});

/**
 * rand()
 */
test('rand()', () => {
  expect(utils.rand() >= 0).toBeTruthy();
  expect(utils.rand() <= 1).toBeTruthy();
  expect(utils.rand(22) === 22).toBeTruthy();
  expect(22 <= utils.rand(22, 44) <= 44).toBeTruthy();
});
