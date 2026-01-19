/*
 * This file is part of the @orkans/bookmarklets package.
 * Copyright (c) 2026 Orkan <orkans+bookmarklets@gmail.com>
 */
import * as utils from '../../node_modules/@orkans/utilsjs/src/utils.js';
import * as mod from './mod.js';

utils.testDataSet(
  'Enc+Dec',
  {
    '#01 host - - - | -': {
      url: 'https://a.aaa/',
      img: '',
      exp: { all: 'a.aaa -  -  -  -', img: '', img: '' },
    },
    '#02 host path - - | -': {
      url: 'https://a.aaa/b-b_b+b',
      img: '',
      exp: { all: 'a.aaa - b-b_b+b -  -  -', img: '' },
    },
    '#03 host - queery - | -': {
      url: 'https://a.aaa/?c=cc',
      img: '',
      exp: { all: 'a.aaa -  - c=cc -  -', img: '' },
    },
    '#04 host - - hash | -': {
      url: 'https://a.aaa/#ddd',
      img: '',
      exp: { all: 'a.aaa -  -  - ddd -', img: '' },
    },
    '#05 host - - - | image.ext?1:2*3\"4<5>6|': {
      url: 'https://a.aaa/',
      img: 'eee.ext?1:2*3\"4<5>6|',
      exp: { all: 'a.aaa -  -  -  - eee.ext 1 2 3 4 5 6', img: 'eee.ext 1 2 3 4 5 6' },
    },
    '#06 host path queery - | -': {
      url: 'https://a.aaa/bbb?c=cc',
      img: '',
      exp: { all: 'a.aaa - bbb - c=cc -  -', img: '' },
    },
    '#07 host path queery hash | -': {
      url: 'https://a.aaa/bbb?c=cc#ddd',
      img: '',
      exp: { all: 'a.aaa - bbb - c=cc - ddd -', img: '' },
    },
    '#08 host path queery hash | image': {
      url: 'https://a.aaa/bbb?c=cc#ddd',
      img: 'eee',
      exp: { all: 'a.aaa - bbb - c=cc - ddd - eee', img: 'eee' },
    },
    '#09 host path - - | image/eee.ext': {
      url: 'https://a.aaa/bb-b',
      img: 'image/eee.ext',
      exp: { all: 'a.aaa - bb-b -  -  - eee.ext', img: 'eee.ext' },
    },
    '#10 host path - hash | host://image/eee.ext': {
      url: 'https://a.aaa/bbb#ddd',
      img: 'host://image/eee.ext',
      exp: { all: 'a.aaa - bbb -  - ddd - eee.ext', img: 'eee.ext' },
    },
    '#11 host - queery hash | host://image/eee/': {
      url: 'https://a.aaa/?ccc#ddd',
      img: 'host://image/eee/',
      exp: { all: 'a.aaa -  - ccc - ddd - eee', img: 'eee' },
    },
    '#12 host path queery - | host://image/eee/?a=b': {
      url: 'https://a.aaa/bbb?ccc',
      img: 'host://image/eee/?a=b',
      exp: { all: 'a.aaa - bbb - ccc -  - eee', img: 'eee' },
    },
  },
  (data) => {
    // encode()
    const enc = mod.encode(data.url, data.img);
    expect(enc.all).toEqual(data.exp.all);
    // decode()
    const dec = mod.decode(enc.all);
    expect(dec.url).toEqual(data.url);
    expect(dec.img).toEqual(data.exp.img);
  }
);
