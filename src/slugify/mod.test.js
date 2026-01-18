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
      out: { all: 'a.aaa -  -  -  -' },
    },
    '#02 host path - - | -': {
      url: 'https://a.aaa/b-b_b+b',
      img: '',
      out: { all: 'a.aaa - b-b_b+b -  -  -' },
    },
    '#03 host - queery - | -': {
      url: 'https://a.aaa/?c=cc',
      img: '',
      out: { all: 'a.aaa -  - c=cc -  -' },
    },
    '#04 host - - hash | -': {
      url: 'https://a.aaa/#ddd',
      img: '',
      out: { all: 'a.aaa -  -  - ddd -' },
    },
    '#05 host - - - | image': {
      url: 'https://a.aaa/',
      img: 'eee',
      out: { all: 'a.aaa -  -  -  - eee' },
    },
    '#06 host path queery - | -': {
      url: 'https://a.aaa/bbb?c=cc',
      img: '',
      out: { all: 'a.aaa - bbb - c=cc -  -' },
    },
    '#07 host path queery hash | -': {
      url: 'https://a.aaa/bbb?c=cc#ddd',
      img: '',
      out: { all: 'a.aaa - bbb - c=cc - ddd -' },
    },
    '#08 host path queery hash | image': {
      url: 'https://a.aaa/bbb?c=cc#ddd',
      img: 'eee',
      out: { all: 'a.aaa - bbb - c=cc - ddd - eee' },
    },
    '#09 host path - - | image': {
      url: 'https://a.aaa/bbb',
      img: 'eee',
      out: { all: 'a.aaa - bbb -  -  - eee' },
    },
    '#10 host path - hash | image': {
      url: 'https://a.aaa/bbb#ddd',
      img: 'eee',
      out: { all: 'a.aaa - bbb -  - ddd - eee' },
    },
    '#11 host - queery - hash | image': {
      url: 'https://a.aaa/?ccc#ddd',
      img: 'eee',
      out: { all: 'a.aaa -  - ccc - ddd - eee' },
    },
    '#12 host path queery - - | image': {
      url: 'https://a.aaa/bbb?ccc',
      img: 'eee',
      out: { all: 'a.aaa - bbb - ccc -  - eee' },
    },
    '#13 host path - - - | image': {
      url: 'https://a.aaa/bbb',
      img: 'eee',
      out: { all: 'a.aaa - bbb -  -  - eee' },
    },
  },
  (data) => {
    // encode()
    const enc = mod.encode(data.url, data.img);
    expect(enc.all).toEqual(data.out.all);
    // decode()
    const dec = mod.decode(enc.all);
    expect(dec.url).toEqual(data.url);
    expect(dec.img).toEqual(data.img);
  }
);
