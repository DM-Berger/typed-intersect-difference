/**
 * Intersect two **SORTED** (ascending) arrays on a shared key `key`.
 * Assumes all values indexed by key are unique.
 * @argument arr1 first array sorted (ascending) on `key`. Its values get returned.
 * @argument arr2 second array sorted (ascending) on `key`
 * @argument idKey? the key to intersect on
 * @returns the objects of **arr1** sharing `key` values with arr2 (arr2 vals lost)
 */
export function intersect<S, K extends keyof S, T extends Pick<S, K>>(arr1: S[], arr2: T[], idKey?: K): S[] {
  if (arr1.length === 0 || arr2.length === 0) { return arr1.slice(); }

  const intersects: S[] = [];
  let i = 0;
  let j = 0;
  while (i < arr1.length && j < arr2.length) {
    const comp1 = idKey ? arr1[i][idKey] : arr1[i];
    const comp2 = idKey ? arr2[j][idKey] : arr2[j];
    if (comp1 === comp2) {
      intersects.push(arr1[i]);
      i++; j++;
    } else if (comp2 < comp1) {
      j++;
    } else {
      i++;
    }
  }

  return intersects;
}

/**
 * @type S any object with a uniquely identifying key field
 * @type K the name of the uniquely identifying key field
 * @type T any object that at least shares the same kind of uniquely 
 * identifying key field as S
 * @argument arr1 array sorted (ascending) on `key`. Its values get returned.
 * @argument arr2 second array sorted (ascending) on `key`
 * @argument idKey? the key to intersect on
 * @returns the objects of **arr1** not sharing `key` values with arr2
 */
export function difference<S, K extends keyof S, T extends Pick<S, K>>(arr1: S[], arr2: T[], idKey?: K): S[] {
  if (arr1.length === 0) { return []; }
  if (arr2.length === 0) { return arr1.slice(); }
 
  const keep: S[] = [];
 
  let [i, j] = [0, 0];
  while (i < arr1.length && j < arr2.length) {
    const comp1 = idKey ? arr1[i][idKey] : arr1[i];
    const comp2 = idKey ? arr2[j][idKey] : arr2[j];
    if (comp1 === comp2) {
      i++, j++
    } else if (comp1 < comp2) {
      keep.push(arr1[i]);
      i++;
    } else {
      j++;
    }
  }
 
  while (i < arr1.length) { keep.push(arr1[i++]); }
  return keep;
 }