import { errorOverflow, errorPopEmpty, errorTopEmpty, Queue } from './queue';

describe("queue", () => {
  const q3el1 = { asd: "123" };
  const q3el2 = [1, 2];
  const q3el3 = [3, 4];

  const q1 = new Queue(1, 2, 3, 4, 5);
  const q2 = new Queue<object>(q3el1, q3el2);
  const q3 = new Queue<any>();

  it("length", () => {
    expect(q1.length).toEqual(5);
    expect(q2.length).toEqual(2);
    expect(q3.length).toEqual(0);

    expect(q1.clone().push(6).length).toEqual(6);
  });

  it("maxLength", () => {
    expect(q1.maxLength).toEqual(Infinity);

    const qq = q1.clone();
    qq.maxLength = 7;
    expect(qq.maxLength).toEqual(7);

    qq.push(6);
    qq.push(7);
    expect(() => qq.push(8)).toThrow(errorOverflow(8, 7));
  });

  it("clear", () => {
    const qq = q1.clone();
    qq.clear();

    expect(qq.elements).toEqual([]);
  });

  it("isEmpty", () => {
    expect(q1.isEmpty()).toBeFalse();
    expect(q3.isEmpty()).toBeTrue();
  });

  it("top", () => {
    expect(q1.top).toEqual(1);
    expect(q2.top).toEqual(q3el1);
    expect(() => q3.top).toThrow(errorTopEmpty());
  });

  it("bottom", () => {
    expect(q1.bottom).toEqual(5);
    expect(q2.bottom).toEqual(q3el2);
    expect(() => q3.bottom).toThrow(errorTopEmpty());
  });

  it("pop", () => {
    const q1a = q1.clone();
    expect(q1a.pop()).toEqual(1);
    expect(q1a.elements).toEqual([2, 3, 4, 5]);

    const q2a = q2.clone();
    expect(q2a.pop()).toEqual(q3el1);
    expect(q2a.elements).toEqual([q3el2]);

    expect(() => q3.pop()).toThrow(errorPopEmpty());
  });

  it("push", () => {
    const q1a = q1.clone().push(6);
    expect(q1a.elements).toEqual([1, 2, 3, 4, 5, 6]);

    const q2a = q2.clone().push(q3el3);
    expect(q2a.elements).toEqual([q3el1, q3el2, q3el3]);

    const q3a = q3.clone().push(null);
    expect(q3a.elements).toEqual([null]);
  });
});
