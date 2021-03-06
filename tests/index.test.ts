import { difference, intersect } from "../index";
import { shuffle } from "./shuffle";

function randInt(max: number) {
  return Math.floor(max * Math.random());
}

function sorter(a: number, b: number) {
  return a - b;
}

function buildIntersectables(length1: number, length2: number, maxVal: number):
  [Array<{id: number}>, Array<{id: number}>] {
  if (length1 > maxVal || length2 > maxVal) {
    throw new Error("Lengths must be less than maxVal");
  }
  let ids1 = [];
  let ids2 = [];
  for (let i = 0; i < maxVal; i++) {
    ids1.push(i);
    ids2.push(i);
  }

  shuffle(ids1);
  shuffle(ids2);

  [ids1, ids2] = [ids1.slice(0, length1), ids2.slice(0, length2)];
  const a1 = ids1.sort(sorter).map(id => ({id}));
  const a2 = ids2.sort(sorter).map(id => ({id}));

  return [a1, a2];
}

describe("Intersection of sorted arrays: ", () => {
  it("Intersects two empties", () => {
    const [a1, a2] = buildIntersectables(0, 0, 10);
    expect(intersect(a1, a2, "id")).toEqual([]);
  });

  it("Intersects one empty", () => {
    const [a1, a2] = buildIntersectables(0, randInt(10), 10);
    expect(intersect(a1, a2, "id")).toEqual([]);
    expect(intersect(a1, a1, "id")).toEqual([]);
  });

  it("Intersects specific arrays", () => {
    const a1 = [3, 5, 9].map(i => ({id: i}));
    const a2 = [1, 2, 3, 5, 11, 14].map(i => ({id: i}));
    expect(intersect(a1, a2, "id")).toEqual([3, 5].map(i => ({id: i})));
  });

  it("Subtracts plain specific arrays", () => {
    const a1 = [3, 5, 9];
    const a2 = [1, 2, 3, 5, 11, 14];
    expect(intersect(a2, a1)).toEqual([3, 5]);
    expect(intersect(a1, a2)).toEqual([3, 5]);
    expect(intersect(a1, a1)).toEqual([3, 5, 9]);
    expect(intersect(a2, a2)).toEqual([1, 2, 3, 5, 11, 14]);

    const as1 = ["aardvark", "cat", "moose"];
    const as2 = ["moose", "panda", "zebra"];
    expect(intersect(as1, as2)).toEqual(["moose"]);
    expect(intersect(as2, as1)).toEqual(["moose"]);
    expect(intersect(as1, as1)).toEqual(as1);
    expect(intersect(as2, as2)).toEqual(as2);
  });

  it("Intersects specific arrays sharing only one property", () => {
    const a1 = [3, 5, 9].map(i => ({id: i, val: String(i)}));
    const a2 = [1, 2, 3, 5, 11, 14].map(i => ({id: i, date: new Date(i)}));
    expect(intersect(a1, a2, "id")).toEqual([3, 5].map(i => ({id: i, val: String(i)})));
  });

  it("Intersects random simple arrays", () => {
    for (let i = 0; i < 100; i++) {
      const [a1, a2] = buildIntersectables(10 + randInt(20), 10 + randInt(10), 30);

      const ids1 = a1.map(item => item.id);
      const ids2 = new Set(a2.map(item => item.id));

      const uniqueIds = [];
      for (const id of ids1) {
        if (ids2.has(id)) {
          uniqueIds.push(id);
        }
      }

      const setIntersected = uniqueIds.sort(sorter).map(id => ({id}));

      let intersected = intersect(a1, a2, "id");
      if (intersected === null) { return; }

      intersected = intersected.slice();
      expect(intersected.length).toBeLessThanOrEqual(Math.min(a1.length, a2.length));

      expect(intersected).toEqual(setIntersected);
    }
  });

  it("Intersects random complex arrays", () => {
    for (let i = 0; i < 100; i++) {
      const [arr1, arr2] = buildIntersectables(10 + randInt(20), 10 + randInt(10), 30);
      const a1 = arr1.map(item => ({
        id: item.id,
        str: `${item.id}${Date.now()}`,
        val: item.id + 10 * Math.random(),
      }));
      const a2 = arr2.map(item => ({
        date: new Date(),
        id: item.id,
        salad: `${Math.floor(10 * Math.random())}salad`,
      }));

      const set1 = new Set(a1);
      const set2 = new Set(a2.map(item => item.id));

      const setIntersected = [];
      for (const item of set1) {
        if (set2.has(item.id)) {
          setIntersected.push(item);
        }
      }

      let intersected = intersect(a1, a2, "id");
      if (intersected === []) { return; }

      intersected = intersected.slice();
      expect(intersected.length).toBeLessThanOrEqual(Math.min(a1.length, a2.length));

      expect(intersected).toEqual(setIntersected);
    }
  });
});

function buildSubtractables(length1: number, length2: number, maxVal: number):
  [Array<{id: number}>, Array<{id: number}>] {
  if (length1 > maxVal || length2 > maxVal) {
    throw new Error("Lengths must be less than maxVal");
  }
  let ids1 = [];
  let ids2 = [];
  for (let i = 0; i < maxVal; i++) {
    ids1.push(i);
    ids2.push(i);
  }

  shuffle(ids1);
  shuffle(ids2);

  [ids1, ids2] = [ids1.slice(0, length1), ids2.slice(0, length2)];
  const a1 = ids1.sort(sorter).map(id => ({id}));
  const a2 = ids2.sort(sorter).map(id => ({id}));

  return [a1, a2];
}

describe("Subtraction of sorted arrays: ", () => {
  it("Subtracts two empties", () => {
    const [a1, a2] = buildSubtractables(0, 0, 10);
    expect(difference(a1, a2, "id")).toEqual([]);
  });

  it("Subtracts one empty", () => {
    for (let i = 0; i < 10; i++) {
      const [a1, a2] = buildSubtractables(0, randInt(10), 10);
      expect(difference(a1, a1, "id")).toEqual([]);
      expect(difference(a1, a2, "id")).toEqual([]);
      expect(difference(a2, a1, "id")).toEqual(a2);
    }
  });

  it("Subtracts specific arrays", () => {
    const a1 = [3, 5, 9].map(i => ({id: i}));
    const a2 = [1, 2, 3, 5, 11, 14].map(i => ({id: i}));
    expect(difference(a2, a1, "id")).toEqual([1, 2, 11, 14].map(i => ({id: i})));
    expect(difference(a1, a2, "id")).toEqual([9].map(i => ({id: i})));
  });

  it("Subtracts plain specific arrays", () => {
    const a1 = [3, 5, 9];
    const a2 = [1, 2, 3, 5, 11, 14];
    expect(difference(a2, a1)).toEqual([1, 2, 11, 14]);
    expect(difference(a1, a2)).toEqual([9]);
    expect(difference(a1, a1)).toEqual([]);

    const as1 = ["aardvark", "cat", "moose"];
    const as2 = ["moose", "panda", "zebra"];
    expect(difference(as1, as2)).toEqual(["aardvark", "cat"]);
    expect(difference(as2, as1)).toEqual(["panda", "zebra"]);
  });

  it("Subtracts specific arrays sharing only one property", () => {
    const a1 = [3, 5, 9].map(i => ({id: i, val: String(i)}));
    const a2 = [1, 2, 3, 5, 11, 14].map(i => ({id: i, date: new Date(i)}));
    expect(difference(a2, a1, "id")).toEqual([1, 2, 11, 14].map(i => ({id: i, date: new Date(i)})));
  });

  it("Subtracts random simple arrays", () => {
    for (let i = 0; i < 100; i++) {
      const [a1, a2] = buildSubtractables(10 + randInt(20), 10 + randInt(10), 30);

      const ids2 = new Set(a2.map(item => item.id));

      const uniques = [];
      for (const item of a1) {
        if (!ids2.has(item.id)) {
          uniques.push(item);
        }
      }

      // let setDifferenced = uniques.sort(sorter);

      let differenced = difference(a1, a2, "id");
      if (differenced === []) { return; }

      differenced = differenced.slice();

      expect(differenced).toEqual(uniques);
    }
  });

  it("Subtracts random complex arrays", () => {
    for (let i = 0; i < 100; i++) {
      const [arr1, arr2] = buildSubtractables(10 + randInt(20), 10 + randInt(10), 30);
      const a1 = arr1.map(item => ({
        id: item.id,
        str: `${item.id}${Date.now()}`,
        val: item.id + 10 * Math.random(),
      }));
      const a2 = arr2.map(item => ({
        date: new Date(),
        id: item.id,
        salad: `${Math.floor(10 * Math.random())}salad`,
      }));

      const set2 = new Set(a2.map(item => item.id));

      const uniques = [];
      for (const item of a1) {
        if (!set2.has(item.id)) {
          uniques.push(item);
        }
      }

      let differenced = difference(a1, a2, "id");
      if (differenced === []) { return; }

      differenced = differenced.slice();

      expect(differenced).toEqual(uniques);
    }
  });
});

describe("Errors on mismatched types with no key", () => {
  it("Errors on bad plain arrays", async () => {
    const a1 = [3, 5, 9].map(id => ({id}));
    const a2 = [1, 2, 5, 8, 9, 10].map(id => ({id}));
    const s1 = ["a", "b", "c", "d"].map(id => ({id}));
    const s2 = ["b", "d", "j", "z"].map(id => ({id}));
    const d1: Date[] = [];
    const d2: Date[] = [];
    for (let i = 0; i < 4; i++) {
      await new Promise(resolve => {
        setTimeout(() => {
          d1.push(new Date());
          if (i >= 2) { // ensure some intersection
            const d = new Date();
            d1.push(d);
            d2.push(d);
          }
          resolve();
        }, 100 * Math.random());
      });
    }
    for (let i = 0; i < 3; i++) {
      await new Promise(resolve => {
        setTimeout(() => {
          d2.push(new Date());
          resolve();
        }, 100 * Math.random());
      });
    }
    const dId1 = d1.map(id => ({id}));
    const dId2 = d2.map(id => ({id}));

    expect(() => intersect(a1, a2)).toThrowError("values indexed by idKey must be sortable");
    expect(() => intersect(s1, s2)).toThrowError("values indexed by idKey must be sortable");
    expect(() => intersect(dId1, dId2)).toThrowError("values indexed by idKey must be sortable");

    expect(() => difference(a1, a2)).toThrowError("values indexed by idKey must be sortable");
    expect(() => difference(s1, s2)).toThrowError("values indexed by idKey must be sortable");
    expect(() => difference(dId1, dId2)).toThrowError("values indexed by idKey must be sortable");
  });
});
