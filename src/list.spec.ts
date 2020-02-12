import { count, list } from './list';

describe("list", () => {
  const l1 = list(1, 2, 3);
  const l2 = list("qwe", "asd", "zxczxc", "a", "b");
  const l3 = list({ a: 123 }, { b: 456 });
  const l4 = list();

  const lists = [l1, l2, l3, l4];
  const listsInfo: Array<{ count: number }> = [
    { count: 3 },
    { count: 5 },
    { count: 2 },
    { count: 0 }
  ];

  it("count", () => {
    lists.forEach((l, i) => expect(count(l)).toEqual(listsInfo[i].count));
  });

  it("push", () => {});
});
