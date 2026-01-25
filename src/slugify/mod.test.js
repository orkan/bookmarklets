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
      arg: { url: 'https://a.aaa/', img: '' },
      exp: { url: 'https://a.aaa', img: '', all: 'a.aaa -  -  -  -' },
    },
    '#02 host path - - | -': {
      arg: { url: 'https://a.aaa/b-b_b+b', img: '' },
      exp: { url: 'https://a.aaa/b-b_b+b', img: '', all: 'a.aaa - b-b_b+b -  -  -' },
    },
    '#03 host - queery - | -': {
      arg: { url: 'https://a.aaa/?c=cc', img: '' },
      exp: { url: 'https://a.aaa?c=cc', img: '', all: 'a.aaa -  - c=cc -  -' },
    },
    '#04 host - - hash | -': {
      arg: { url: 'https://a.aaa/#ddd', img: '' },
      exp: { url: 'https://a.aaa#ddd', img: '', all: 'a.aaa -  -  - ddd -' },
    },
    '#05 host - - - | image.ext?1:2*3"4<5>6|': {
      arg: { url: 'https://a.aaa/', img: 'eee.ext?1:2*3"4<5>6|' },
      exp: {
        url: 'https://a.aaa',
        img: 'eee.ext 1 2 3 4 5 6',
        all: 'a.aaa -  -  -  - eee.ext 1 2 3 4 5 6',
      },
    },
    '#06 host path queery - | -': {
      arg: { url: 'https://a.aaa/bbb?c=cc', img: '' },
      exp: { url: 'https://a.aaa/bbb?c=cc', img: '', all: 'a.aaa - bbb - c=cc -  -' },
    },
    '#07 host path queery hash | -': {
      arg: { url: 'https://a.aaa/bbb?c=cc#ddd', img: '' },
      exp: { url: 'https://a.aaa/bbb?c=cc#ddd', img: '', all: 'a.aaa - bbb - c=cc - ddd -' },
    },
    '#08 host path queery hash | image': {
      arg: { url: 'https://a.aaa/bbb?c=cc#ddd', img: 'eee' },
      exp: { url: 'https://a.aaa/bbb?c=cc#ddd', img: 'eee', all: 'a.aaa - bbb - c=cc - ddd - eee' },
    },
    '#09 host path - - | path/image.ext': {
      arg: { url: 'https://a.aaa/bb-b', img: 'path/eee.ext' },
      exp: { url: 'https://a.aaa/bb-b', img: 'eee.ext', all: 'a.aaa - bb-b -  -  - eee.ext' },
    },
    '#10 host path - hash | host://path/image.ext': {
      arg: { url: 'https://a.aaa/bbb#ddd', img: 'host://path/eee.ext' },
      exp: { url: 'https://a.aaa/bbb#ddd', img: 'eee.ext', all: 'a.aaa - bbb -  - ddd - eee.ext' },
    },
    '#11 host - queery hash | host://path/image/': {
      arg: { url: 'https://a.aaa/?ccc#ddd', img: 'host://path/eee/' },
      exp: { url: 'https://a.aaa?ccc#ddd', img: 'eee', all: 'a.aaa -  - ccc - ddd - eee' },
    },
    '#12 host path queery - | host://path/image/?a=b': {
      arg: { url: 'https://a.aaa/bbb?ccc', img: 'host://path/eee/?a=b' },
      exp: { url: 'https://a.aaa/bbb?ccc', img: 'eee', all: 'a.aaa - bbb - ccc -  - eee' },
    },
    '#13 host - - - | host://path': {
      arg: { url: 'https://aaa', img: 'https://eee' },
      exp: { url: 'https://aaa', img: 'eee', all: 'aaa -  -  -  - eee' },
    },
    '#14 host - - - | image': {
      arg: { url: 'https://aaa', img: 'eee' },
      exp: { url: 'https://aaa', img: 'eee', all: 'aaa -  -  -  - eee' },
    },
  },
  (data) => {
    // encode()
    const enc = mod.encode(data.arg.url, data.arg.img);
    expect(enc.all).toEqual(data.exp.all);
    // decode()
    const dec = mod.decode(enc.all);
    expect(dec.url).toEqual(data.exp.url);
    expect(dec.img).toEqual(data.exp.img);
  }
);
