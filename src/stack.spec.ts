import Stack, { errorOverflow, errorPopEmpty, errorTopEmpty, StackElement } from './stack';

describe("stack", () => {
  const s1 = new Stack(Infinity, 1, 2, 3);

  const s20 = 1;
  const s21 = "2";
  const s23 = { val: 3 };
  const s2 = new Stack<number | string | { val: number }>(
    Infinity,
    s20,
    s21,
    s23
  );

  const s3 = new Stack<any>(Infinity);

  it("constructor", () => {
    const el2: StackElement<number> = {
      value: 1,
      prev: undefined
    };

    const el1: StackElement<number> = {
      value: 2,
      prev: el2
    };

    const el0: StackElement<number> = {
      value: 3,
      prev: el1
    };

    const s1Exp = new Stack<number>(Infinity);
    s1Exp._topElement = el0;
    s1Exp.length = 3;

    expect(s1).toEqual(s1Exp);
  });

  it("push", () => {
    const s1Exp = new Stack(Infinity)
      .push(1)
      .push(2)
      .push(3);
    const s2Exp = new Stack(Infinity)
      .push(1)
      .push("2")
      .push({ val: 3 });

    expect(s1Exp).toEqual(s1);
    expect(s2Exp).toEqual(s2);
  });

  it("push overflow", () => {
    expect(() => new Stack(0).push("asd")).toThrow(errorOverflow(1, 0));
    expect(() => new Stack(1).push("asd").push("qwe")).toThrow(
      errorOverflow(2, 1)
    );
  });

  it("pop", () => {
    const el2: StackElement<number> = {
      value: 1,
      prev: undefined
    };

    const el1: StackElement<number> = {
      value: 2,
      prev: el2
    };

    const s1Exp = new Stack<number>(Infinity);
    s1Exp._topElement = el1;
    s1Exp.length = 2;

    const s1Real = s1.clone();
    const popped = s1Real.pop();

    expect(popped).toEqual(3);
    expect(s1Real).toEqual(s1Exp);
  });

  it("pop empty list", () => {
    expect(() => s3.clone().pop()).toThrow(errorPopEmpty());
  });

  it("top", () => {
    expect(s1.top).toEqual(3);
    expect(s2.top).toEqual(s23);
  });

  it("top empty list", () => {
    expect(() => s3.top()).toThrow(errorTopEmpty());
  });

  it("isEmpty", () => {
    expect(s1.isEmpty()).toBeFalse();
    expect(s3.isEmpty()).toBeTrue();
  });

  it("clear", () => {
    expect(s1.clone().clear()).toEqual(s3);
    expect(s3.clone().clear()).toEqual(s3);
  });

  it("clone", () => {
    expect(s1.clone()).toEqual(s1);
    expect(s3.clone()).toEqual(s3);
  });

  it("toString", () => {
    expect(s1.toString()).toEqual("(3/Infinity) 1 - 2 - 3");
    expect(s3.toString()).toEqual("(0/Infinity) empty");
    expect(new Stack(2).toString()).toEqual("(0/2) empty");
  });

  it("setCapacity", () => {
    expect(s1.clone().setCapacity(5).capacity).toEqual(5);
  });
});
