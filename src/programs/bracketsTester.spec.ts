import { testBrackets } from './bracketsTester';

describe("bracketsTester", () => {
  function test(bracketsRaw: string, validity: boolean) {
    expect(testBrackets(Array.from(bracketsRaw))).toEqual(validity);
  }

  it("works", () => {
    const valid = "(), {}, [{}], (){}[], [[]], [()[]()][]".split(", ");
    valid.forEach(s => test(s, true));

    const invalid = "], )(, []{), (], ([)]".split(", ");
    invalid.forEach(s => test(s, false));

    test("", false);
    test("qwdmiasdmfoaimef", false);
  });
});
