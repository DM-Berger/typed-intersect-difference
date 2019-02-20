/**
 * Intersect two **SORTED** (ascending) arrays on a shared key `key`.
 * Assumes all values indexed by key are unique.
 * @template S, T, K
 * @template {object} S - indexable by key K
 * @template {object} T - indexable by key K and typeof T[K] == typeof S[K]
 * @template {string} K - must index objects of both type S and type T
 * @argument arr1 first array sorted (ascending) on `key`. Its values get returned.
 * @argument arr2 second array sorted (ascending) on `key`
 * @argument idKey? the key to intersect on
 * @returns the objects of **arr1** sharing `key` values with arr2 (arr2 vals lost)
 */
export function intersect<S, K extends keyof S, T extends Pick<S, K>>(arr1: S[], arr2: T[], idKey?: K): S[] {
  if (arr1.length === 0 || arr2.length === 0) { return []; }
  if (!idKey && !validArgTypes<S, K, T>(arr1, arr2)) {
    throw new Error("values indexed by idKey must be sortable");
  }

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
 * Computes the set difference (A / B or A - B) of two **SORTED**
 * (ascending) arrays on a shared key `key`. Assumes all values
 * indexed by key `key` are unique.
 * @template S, T, K
 * @template {object} S - indexable by key K
 * @template {object} T - indexable by key K and typeof T[K] == typeof S[K]
 * @template {string} K - must index objects of both type S and type T
 * @argument arr1 array sorted (ascending) on `key`. Its values get returned.
 * @argument arr2 second array sorted (ascending) on `key`
 * @argument idKey? the key to intersect on
 * @returns the objects of **arr1** not sharing `key` values with arr2
 */
export function difference<S, K extends keyof S, T extends Pick<S, K>>(arr1: S[], arr2: T[], idKey?: K): S[] {
  if (arr1.length === 0) { return []; }
  if (arr2.length === 0) { return arr1.slice(); }
  if (!idKey && !validArgTypes<S, K, T>(arr1, arr2)) {
    throw new Error("values indexed by idKey must be sortable");
  }

  const keep: S[] = [];

  let [i, j] = [0, 0];
  while (i < arr1.length && j < arr2.length) {
    const comp1 = idKey ? arr1[i][idKey] : arr1[i];
    const comp2 = idKey ? arr2[j][idKey] : arr2[j];
    if (comp1 === comp2) {
      i++, j++;
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

function validArgTypes<S, K extends keyof S, T extends Pick<S, K>>(arr1: S[], arr2: T[]): boolean {
  const type1 = typeof arr1[0];
  const type2 = typeof arr2[0];
  const inst1 = arr1[0] instanceof Date;
  const inst2 = arr2[0] instanceof Date;
  const validTypes =
    (type1 === type2) &&
    (inst1 === inst2) &&
    (type1 === "string" || type1 === "number");
  return validTypes;
}
