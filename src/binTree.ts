export interface BinTreeNode<T> {
  value: T;
  depth: number;
  offset: number;
  left?: BinTreeNode<T>;
  right?: BinTreeNode<T>;
}

export class ErrorValueAlreadyExists extends Error {
  constructor() {
    super("Value already exists");
  }
}

export class ErrorValueNotExists extends Error {
  constructor() {
    super("Value not exists");
  }
}

enum GoMode {
  LNR,
  NLR,
  LRN,
}

export class BinTree<T> {
  root: BinTreeNode<T>;

  constructor(initValue: T) {
    const root: BinTreeNode<T> = {
      value: initValue,
      depth: 0,
      offset: 0,
    };

    this.root = root;
  }

  get nodesCount() {
    let counter = 0;

    this.lnr(() => counter++);

    return counter;
  }

  get maxDepth() {
    let maxDepth = 0;

    this.lnr(({ depth }) => (maxDepth = Math.max(depth, maxDepth)));

    return maxDepth;
  }

  add(value: T): BinTree<T> {
    const closestNode = this.findClosestNode(value);

    if (closestNode.value == value) throw new ErrorValueAlreadyExists();

    const newNode = { value, depth: closestNode.depth + 1 };
    if (value > closestNode.value)
      closestNode.right = { ...newNode, offset: closestNode.offset * 2 + 1 };
    else closestNode.left = { ...newNode, offset: closestNode.offset * 2 };

    return this;
  }

  remove(value: T): BinTree<T> {
    const node = this.findClosestNode(value);

    if (node.value !== value) throw new ErrorValueNotExists();

    // collecting values from branches
    const valuesToMove: T[] = [];

    this.lrn((node) => {
      valuesToMove.push(node.value);

      // terminating node for garbarage collector
      node.left = undefined;
      node.right = undefined;
    }, node);

    // removing last node (because of LRN it will be our targeted node)
    valuesToMove.splice(valuesToMove.length - 1, 1);

    // re-adding subvalues
    valuesToMove.forEach((val) => this.add(val));

    return this;
  }

  lnr(
    callback: (node: BinTreeNode<T>) => void,
    currentNode = this.root
  ): BinTree<T> {
    this.go(callback, GoMode.LNR, currentNode);

    return this;
  }

  nlr(
    callback: (node: BinTreeNode<T>) => void,
    currentNode = this.root
  ): BinTree<T> {
    this.go(callback, GoMode.NLR, currentNode);

    return this;
  }

  lrn(
    callback: (node: BinTreeNode<T>) => void,
    currentNode = this.root
  ): BinTree<T> {
    this.go(callback, GoMode.LRN, currentNode);

    return this;
  }

  get leftOffset() {
    let counter = 0;
    let currentNode = this.root;

    while (currentNode.left) {
      currentNode = currentNode.left;
      counter++;
    }

    return counter;
  }

  /*

                    *
                   / \
                  /   \
                 *     *
                / \   / \
               *   * *   *


private 

                          *
                         / \
                        /   \
                       /     \
                      /       \
                     /         \
                    *           *         
                   / \         / \
                  /   \       /   \
                 *     *     *     *
                / \   / \   / \   / \
               *   * *   * *   * *   *          
*/

  toString() {
    const maxDepth = this.maxDepth;

    const widthes = new Array(maxDepth + 1)
      .fill(null)
      .reduce((acc: number[]) => [...acc, acc[acc.length - 1] * 2 + 1], [0])
      .reverse();

    const maxWidth = widthes[0];

    const getLayers = () => {
      console.log(widthes);

      const layers: (BinTreeNode<T> | undefined)[][] = [];

      this.lnr((node) => {
        if (!layers[node.depth])
          layers[node.depth] = new Array(maxWidth).fill(undefined);

        layers[node.depth][
          widthes[node.depth + 1] +
            node.offset * 2 ** (maxDepth - node.depth + 1)
        ] = node;
      });

      return layers;
    };

    const gaps = new Array<number>(maxDepth)
      .fill(0)
      .reduce((acc) => [...acc, acc[acc.length - 1] * 2], [1])
      .map((val) => val - 1)
      .reverse();
    console.log(gaps);

    const layers = getLayers();

    const lines = layers.reduce((acc: string[], layer, i) => {
      const ar = new Array(gaps[i])
        .fill(null)
        .map(() => new Array<string>(maxWidth).fill("  "))
        .map((line) => line.join(""));

      return [
        ...acc,
        layer
          .map((val) =>
            val === undefined
              ? "."
              : ((val.value as any).toString() as string).padStart(2)
          )
          .join("  "),
        ...ar,
      ];
    }, []);

    return lines.join("\n");
  }

  private go(
    callback: (node: BinTreeNode<T>) => void,
    mode: GoMode,
    currentNode = this.root
  ) {
    if (mode === GoMode.NLR) callback(currentNode);

    if (currentNode.left) this.go(callback, mode, currentNode.left);

    if (mode === GoMode.LNR) callback(currentNode);

    if (currentNode.right) this.go(callback, mode, currentNode.right);

    if (mode === GoMode.LRN) callback(currentNode);
  }

  private findClosestNode(value: T): BinTreeNode<T> {
    let currentNode = this.root;

    // a bunch of if-else
    while (true) {
      if (value > currentNode.value)
        if (currentNode.right) currentNode = currentNode.right;
        else return currentNode;
      else if (value < currentNode.value)
        if (currentNode.left) currentNode = currentNode.left;
        else return currentNode;
      else return currentNode;
    }
  }
}
