import { BinTree } from './binTree';

describe("binTree", () => {
  it("add", () => {
    const tree = new BinTree(9);
    tree.add(4);
    tree.add(6);
    tree.add(3);
    tree.add(12);
    tree.add(33);
    tree.add(-5);
    tree.add(-7);
    tree.add(11);

    console.log();
    console.log();
    console.log(tree.toString());
  });
});
