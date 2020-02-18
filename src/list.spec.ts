import {
  clone,
  count,
  errorIndexOutOfBound,
  errorInvalidList,
  errorListIsEmpty,
  errorNoSuchElement,
  findIndex,
  getNode,
  insert,
  list,
  listToStringWithLinks,
  push,
  remove,
  unshift,
} from './list';

// getNodeNonStrict,
// iterable,
// lastNode,
// listIterator,
// listToString,
// shift,
// toArray,
// firstNode,
// get,
// pop,
// removeByValue

describe("list", () => {
  const l1 = list(1, 2, 3);
  const l2 = list("qwe", "asd", "zxczxc", "a", "b");
  const l3 = list({ a: 123 }, { b: 456 });
  const l4 = list();

  // const lists = [l1, l2, l3, l4];

  interface TestData {
    args: Array<any>;
    expected: any;
  }

  function testFunc(func: any, { args, expected }: TestData): void {
    expect(func(...args)).toEqual(expected);
  }

  it("getNode", () => {
    const testData: TestData[] = [
      { args: [l1, 2], expected: l1.root?.next?.next },
      { args: [l1, 1], expected: l1.root?.next },
      { args: [l3, 1], expected: l3.root?.next }
    ];

    testData.forEach(data => testFunc(getNode, data));
  });

  it("errors", () => {
    expect(errorIndexOutOfBound(1, 3).message).toEqual(
      "Capacity 1 is not enough to access 3"
    );
    expect(errorInvalidList().message).toEqual("List is invalid");
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
      { args: [l1, 4, 3], expected: list(1, 2, 3, 4) }
    ];

    // console.log("expected:", listToStringWithLinks(list(1, 2, 3, 4)));

    testData.forEach(data => testFunc(insert, data));
  });

  it("findIndex", () => {
    const testData: TestData[] = [
      { args: [l1, 1], expected: 0 },
      { args: [l1, 2], expected: 1 },
      { args: [l1, 3], expected: 2 }
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
  });
});
