import wu from 'wu';

export interface ListElement<T> {
  previous?: ListElement<T>;
  next?: ListElement<T>;
  value: T;
}

export interface List<T> {
  root?: ListElement<T>;
}

export function errorIndexOutOfBound(capacity: number, index: number) {
  return new Error(`Capacity ${capacity} is not enough to access ${index}`);
}

export function errorNoSuchElement(value: any) {
  return new Error(`List doesn't contain "${value}"`);
}

export function errorListIsEmpty() {
  return new Error(`List is empty`);
}

export function errorInvalidList() {
  return new Error(`List is invalid`);
}

export function list<T>(...elements: Array<T>): List<T> {
  if (!elements.length) return {};

  const root: ListElement<T> = { value: elements[0] };
  let nodePrevious = root;
  for (let i = 1; i < elements.length; i++) {
    const value = elements[i];
    const nodeCurrent: ListElement<T> = { value, previous: nodePrevious };
    nodePrevious.next = nodeCurrent;
    nodePrevious = nodeCurrent;
  }

  return { root };
}

export function toArray<T>(list: List<T>): T[] {
  const elements = [];
  let currentNode = list.root;

  while (currentNode) {
    elements.push(currentNode.value);
    currentNode = currentNode.next;
  }

  return elements;
}

export function clone<T>(listOriginal: List<T>): List<T> {
  return list(...toArray(listOriginal));
}

export function* listIterator<T>(list: List<T>) {
  let node = list.root;
  // let index = 0;
  while (node) {
    yield node;
    // index++;
    node = node.next;
  }
}

export function iterable<T>(list: List<T>) {
  return wu(listIterator(list));
}

export function count<T>(list: List<T>): number {
  list = clone(list);

  if (!list.root) return 0;

  const iterator = iterable(list);
  const count = iterator.reduce(count => count + 1, 0);

  return count;
}

export function getNodeNonStrict<T>(
  list: List<T>,
  index: number
): ListElement<T> | undefined {
  let node = list.root;
  let i = 0;

  while (node) {
    if (index === i) return node;

    i++;
    node = node.next;
  }

  return undefined;
}

export function getNode<T>(list: List<T>, index: number): ListElement<T> {
  const res = getNodeNonStrict(list, index);

  if (!res) throw errorIndexOutOfBound(count(list), index);
  else return res;
}

export function get<T>(list: List<T>, index: number): T {
  return getNode(list, index).value;
}

export function firstNode<T>(list: List<T>): ListElement<T> {
  if (!list.root) throw errorListIsEmpty();

  return list.root;
}

export function lastNode<T>(list: List<T>): ListElement<T> {
  if (!list.root) throw errorListIsEmpty();

  const lastNode = iterable(list).find(node => !node.next);
  if (!lastNode) throw errorInvalidList();

  return lastNode;
}

export function push<T>(list: List<T>, value: T): List<T> {
  if (!list.root) return { root: { value } };
  list = clone(list);

  const last = lastNode(list);

  last.next = { value, previous: last };
  return list;
}

export function unshift<T>(list: List<T>, value: T): List<T> {
  if (!list.root) return { root: { value } };
  list = clone(list);

  const { root } = list;
  const rootNew: ListElement<T> = { value, next: root };

  (root as ListElement<T>).previous = rootNew;

  return { root: rootNew };
}

export function insert<T>(list: List<T>, value: T, index: number): List<T> {
  if (!list.root) return { root: { value } };

  if (index === 0) return unshift(list, value);

  list = clone(list);

  const node = getNodeNonStrict(list, index - 1);
  if (!node) return push(list, value);

  const newNode: ListElement<T> = {
    value,
    previous: node
  };

  if (node.next) newNode.next = node.next;

  // if (node.next) node.next.previous = newNode;
  if (node.next) node.next.previous = newNode;
  node.next = newNode;

  return list;
}

export function findIndex<T>(list: List<T>, value: T): number {
  let index = -1;
  let node = list.root;

  if (!node) return index;

  while (node) {
    index++;
    if (node.value === value) return index;

    node = node.next;
  }

  return index;
}

// remove the first element
export function shift<T>(list: List<T>): List<T> {
  list = clone(list);

  if (!list.root || !list.root.next) return {};

  delete list.root.next.previous;
  list.root = list.root.next;
  return list;
}

// remove the last element
export function pop<T>(list: List<T>): List<T> {
  list = clone(list);

  if (!list.root || !list.root.next) return {};

  const last = lastNode(list);
  delete last.previous?.next;

  return list;
}

export function remove<T>(list: List<T>, index: number): List<T> {
  if (!list.root) throw errorListIsEmpty();

  if (index === 0) return shift(list);

  list = clone(list);

  // "nth" temporary is missing in wu typings
  const node = (iterable(list) as any).nth(index) as ListElement<T>;
  if (node.previous)
    if (node.next) node.previous.next = node.next;
    else delete node.previous.next;

  if (node.next) node.next.previous = node.previous;

  return list;
}

export function removeByValue<T>(list: List<T>, value: T): List<T> {
  const node = list.root;
  if (!node) throw errorListIsEmpty();

  list = clone(list);

  while (node) {
    if (node.value === value) {
      if (node.previous) node.previous.next = node.next;
      if (node.next) node.next.previous = node.previous;

      return list;
    }
  }

  throw errorNoSuchElement(value);
}

export function listToString<T>(list: List<T>): string {
  return toArray(list).join(" <-> ");
}

export function listToStringWithLinks<T>(list: List<T>): string {
  const arr = [];

  let currentNode = list.root;

  while (currentNode) {
    arr.push(
      `${currentNode.value} (${
        currentNode.previous ? currentNode.previous.value : "none"
      }, ${currentNode.next ? currentNode.next.value : "none"})`
    );
    currentNode = currentNode.next;
  }

  return arr.join(", ");
}

// TODO: configure eslint
// TODO: fix insert function
