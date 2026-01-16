/*
 * This file is part of the @orkans/utilsjs package.
 * Copyright (c) 2023-2026 Orkan <orkans+utilsjs@gmail.com>
 */

/**
 * Right pad to desired Array {length} with {fill} values.
 */
export function arrPadR(arr, length, fill) {
  return arr.concat(Array(length - arr.length).fill(fill));
}

/**
 * Repeat array multiple times.
 * @link https://stackoverflow.com/questions/54935273/how-to-repeat-an-array-n-times
 */
export function arrRepeat(arr, repeats) {
  return Array(repeats).fill(arr).flat();
}

/**
 * Shuffle array.
 *
 * Algorithm: Fisher-Yates (aka Knuth) Shuffle
 * Visualization: http://bost.ocks.org/mike/shuffle/
 * @link https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
export function arrShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = rand(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Returns trailing name component of path.
 * @link https://stackoverflow.com/questions/3820381/need-a-basename-function-in-javascript
 */
export function pathBasename(path) {
  return path.split(/[\\/]/).pop();
}

/**
 * Dynamically create nested objects using object names given by an array.
 * @link // https://stackoverflow.com/questions/5484673/javascript-how-to-dynamically-create-nested-objects-using-object-names-given-by
 * Example:
 * objNested(obj, ["a", "b", "c"], ['valA', 'valB']);
 * obj = {
 *     "a": {
 *         "b": {
 *             "c": [
 *                 "valA",
 *                 "valB"
 *             ]
 *         }
 *     }
 * }
 */
export function objNested(base, names, value = null) {
  for (let i = 0; i < names.length; i++) {
    base = base[names[i]] = i == names.length - 1 ? value : {};
  }
}

/**
 * Map over Object.
 * @link // https://stackoverflow.com/questions/14810506/map-function-for-objects-instead-of-arrays
 *
 * @param callbackFn A function to execute for each object entry.
 * Its return value will replace previous object entry.
 * The function is called with the following arguments:
 * - value: The value of current object entry.
 * - index: The index of current object entry.
 * - object: The original object.
 */
export function objMap(o, callbackFn) {
  return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, callbackFn(v, k, o)]));
}

/**
 * Create object with selected props only.
 */
export function objReduce(obj, keys) {
  const out = {};
  keys.forEach((key) => {
    if (obj.hasOwnProperty(key)) {
      out[key] = obj[key];
    }
  });
  return out;
}

/**
 * Get random integer between two values (inclusive).
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
 */
export function rand(min = 0, max = 1) {
  min = Math.ceil(min);
  max = Math.floor(Math.max(min, max));
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

/**
 * Sleep X seconds.
 */
export async function sleep(sec) {
  await usleep(sec * 1000);
}

/**
 * Sleep X miliseconds.
 */
export async function usleep(ms) {
  await new Promise((resolve) =>
    setTimeout(() => {
      resolve(1);
    }, ms)
  );
}

/*
 * ============================================================================
 * TESTS
 * ============================================================================
 */

/**
 * Run tests over data set.
 *
 * @param title Test description
 * @param obj Data set
 * @param func Tests callback with each data item as arg
 */
export function testDataSet(title, obj, func) {
  describe(title, () => {
    for (const k in obj) {
      test(`With data set: ${k}`, () => {
        func(obj[k]);
      });
    }
  });
}
