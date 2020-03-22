import {
  clone,
  count,
  errorIndexOutOfBound,
  errorListIsEmpty,
  errorNoSuchElement,
  findIndex,
  firstNode,
  get,
  getNode,
  getNodeNonStrict,
  insert,
  isList,
  lastNode,
  list,
  listToString,
  listToStringWithLinks,
  pop,
  push,
  remove,
  removeByValue,
  shift,
  toArray,
  unshift,
} from './list';

describe("list", () => {
  const obj1: Record<string, number> = { a: 123 };
  const obj2: Record<string, number> = { b: 456 };
  const obj3: Record<string, number> = { c: 789 };

  const l1 = list(1, 2, 3);
  const l2 = list("qwe", "asd", "zxczxc", "a", "b");
  const l3 = list({ a: 123 }, { b: 456 });
  const l4 = list();
  const l5 = list(obj1, obj2, obj3);
  const l6 = list(0);

  interface TestData {
    args: Array<any>;
    expected: any;
  }

  function testFunc(func: any, { args, expected }: TestData): void {
    expect(func(...args)).toEqual(expected);
  }

  it("isList", () => {
    expect(isList(l1)).toBeTrue();
    expect(isList({})).toBeFalse();
  });

  it("removeByValue", () => {
    const testData: TestData[] = [
      { args: [l1, 2], expected: list(1, 3) },
      { args: [l2, "b"], expected: list("qwe", "asd", "zxczxc", "a") },
      { args: [l3, { a: 123 }], expected: list({ a: 123 }, { b: 456 }) },
      { args: [l5, obj1], expected: list(obj2, obj3) },
      { args: [l5, obj2], expected: list(obj1, obj3) },
      { args: [l5, obj3], expected: list(obj1, obj2) }
    ];

    testData.forEach(data => testFunc(removeByValue, data));

    expect(() => removeByValue(l4, 2)).toThrow(errorListIsEmpty());
  });

  it("pop", () => {
    const testData: TestData[] = [
      { args: [l1], expected: list(1, 2) },
      { args: [l2], expected: list("qwe", "asd", "zxczxc", "a") },
      { args: [l4], expected: list() },
      { args: [l6], expected: list() }
    ];

    testData.forEach(data => testFunc(pop, data));
  });

  it("get", () => {
    const testData: TestData[] = [
      { args: [l1, 0], expected: 1 },
      { args: [l1, 1], expected: 2 },
      { args: [l1, 2], expected: 3 }
    ];

    testData.forEach(data => testFunc(get, data));
  });

  it("firstNode", () => {
    const testData: TestData[] = [
      { args: [l1], expected: l1.root },
      { args: [l2], expected: l2.root }
    ];

    testData.forEach(data => testFunc(firstNode, data));

    expect(() => firstNode(l4)).toThrow(errorListIsEmpty());
  });

  it("toArray", () => {
    const testData: TestData[] = [
      { args: [l1], expected: [1, 2, 3] },
      { args: [l2], expected: ["qwe", "asd", "zxczxc", "a", "b"] }
    ];

    testData.forEach(data => testFunc(toArray, data));
  });

  it("shift", () => {
    const testData: TestData[] = [
      { args: [l1], expected: list(2, 3) },
      { args: [l2], expected: list("asd", "zxczxc", "a", "b") },
      { args: [l4], expected: list() },
      { args: [l6], expected: list() }
    ];

    testData.forEach(data => testFunc(shift, data));
  });

  it("listToString", () => {
    const testData: TestData[] = [
      { args: [l1], expected: "1 <-> 2 <-> 3" },
      { args: [l2], expected: "qwe <-> asd <-> zxczxc <-> a <-> b" }
    ];

    testData.forEach(data => testFunc(listToString, data));
  });

  it("lastNode", () => {
    const testData: TestData[] = [
      { args: [l1], expected: l1.root?.next?.next },
      { args: [l2], expected: l2.root?.next?.next?.next?.next }
    ];

    testData.forEach(data => testFunc(lastNode, data));

    expect(() => lastNode(l4)).toThrow(errorListIsEmpty());
  });

  it("getNodeNonStrict", () => {
    const testData: TestData[] = [
      { args: [l1, 2], expected: l1.root?.next?.next },
      { args: [l1, 1], expected: l1.root?.next },
      { args: [l3, 1], expected: l3.root?.next },
      { args: [l1, 3], expected: undefined }
    ];

    testData.forEach(data => testFunc(getNodeNonStrict, data));
  });

  it("getNode", () => {
    const testData: TestData[] = [
      { args: [l1, 2], expected: l1.root?.next?.next },
      { args: [l1, 1], expected: l1.root?.next },
      { args: [l3, 1], expected: l3.root?.next }
    ];

    testData.forEach(data => testFunc(getNode, data));

    expect(() => getNode(l1, 99)).toThrow(errorIndexOutOfBound(3, 99));
  });

  it("errors", () => {
    expect(errorIndexOutOfBound(1, 3).message).toEqual(
      "Capacity 1 is not enough to access 3"
    );
    // expect(errorInvalidList().message).toEqual("List is invalid");
    expect(errorListIsEmpty().message).toEqual("List is empty");
    expect(errorNoSuchElement("qwe").message).toEqual(
      'List doesn\'t contain "qwe"'
    );
  });

  it("clone", () => {
    const testData: TestData[] = [
      { args: [l1], expected: list(1, 2, 3) },
      { args: [l2], expected: list("qwe", "asd", "zxczxc", "a", "b") }
    ];

    testData.forEach(data => testFunc(clone, data));
  });

  it("listToStringWithLinks", () => {
    const testData: TestData[] = [
      { args: [l1], expected: "1 (none, 2), 2 (1, 3), 3 (2, none)" }
    ];

    testData.forEach(data => testFunc(listToStringWithLinks, data));
  });

  it("count", () => {
    const testData: TestData[] = [
      { args: [l1], expected: 3 },
      { args: [l2], expected: 5 },
      { args: [l3], expected: 2 },
      { args: [l4], expected: 0 }
    ];

    testData.forEach(data => testFunc(count, data));
  });

  it("push", () => {
    const testData: TestData[] = [
      { args: [l1, 4], expected: list(1, 2, 3, 4) },
      {
        args: [l2, "c"],
        expected: list("qwe", "asd", "zxczxc", "a", "b", "c")
      },
      {
        args: [l3, { c: 789 }],
        expected: list({ a: 123 }, { b: 456 }, { c: 789 })
      },
      { args: [l4, null], expected: list(null) }
    ];

    testData.forEach(data => testFunc(push, data));
  });

  it("unshift", () => {
    const testData: TestData[] = [
      { args: [l1, 4], expected: list(4, 1, 2, 3) },
      {
        args: [l2, "c"],
        expected: list("c", "qwe", "asd", "zxczxc", "a", "b")
      },
      {
        args: [l3, { c: 789 }],
        expected: list({ c: 789 }, { a: 123 }, { b: 456 })
      },
      { args: [l4, null], expected: list(null) }
    ];

    testData.forEach(data => testFunc(unshift, data));
  });

  it("insert", () => {
    const testData: TestData[] = [
      { args: [l1, 4, 0], expected: list(4, 1, 2, 3) },
      { args: [l1, 4, 1], expected: list(1, 4, 2, 3) },
      { args: [l1, 4, 2], expected: list(1, 2, 4, 3) },
      { args: [l1, 4, 3], expected: list(1, 2, 3, 4) },
      { args: [l4, 9, 0], expected: list(9) },
      { args: [l4, 9, 1], expected: list(9) },
      { args: [l1, 9, 9], expected: list(1, 2, 3, 9) }
    ];

    // console.log("expected:", listToStringWithLinks(list(1, 2, 3, 4)));

    testData.forEach(data => testFunc(insert, data));
  });

  it("findIndex", () => {
    const testData: TestData[] = [
      { args: [l1, 1], expected: 0 },
      { args: [l1, 2], expected: 1 },
      { args: [l1, 3], expected: 2 },
      { args: [l1, 4], expected: -1 },
      { args: [l4, 4], expected: -1 }
    ];

    testData.forEach(data => testFunc(findIndex, data));
  });

  it("remove", () => {
    const testData: TestData[] = [
      { args: [l1, 0], expected: list(2, 3) },
      { args: [l1, 1], expected: list(1, 3) },
      { args: [l1, 2], expected: list(1, 2) }
    ];

    testData.forEach(data => testFunc(remove, data));

    expect(() => remove(l4, 0)).toThrow(errorListIsEmpty());
  });
});
