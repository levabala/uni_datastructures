export interface ListElement<T> {
  previous?: ListElement<T>;
  next?: ListElement<T>;
  value: T;
}

export interface List<T> {
  root?: ListElement<T>;
}

export function list<T>(...elements: Array<T>): List<T> {
  if (!elements.length) return {};

  let root: ListElement<T> = { value: elements[0] };
  let nodePrevious = root;
  for (let i = 1; i < elements.length; i++) {
    const value = elements[i];
    const nodeCurrent: ListElement<T> = { value, previous: nodePrevious };
    nodePrevious.next = nodeCurrent;
    nodePrevious = nodeCurrent;
  }

  return { root };
}

export function count<T>(list: List<T>): number {
  list = clone(list);

  if (!list.root) return 0;

  let count = 1;
  let currentNode = list.root;

  while (currentNode.next) {
    currentNode = currentNode.next;
    count++;
  }

  return count;
}

export function push<T>(list: List<T>, value: T): List<T> {
  if (!list.root) return { root: { value } };
  list = clone(list);

  let lastNode = list.root as ListElement<T>;

  while (lastNode.next) {
    lastNode = lastNode.next;
  }

  lastNode.next = { value, previous: lastNode };
  return list;
}

export function shift<T>(list: List<T>, value: T): List<T> {
  if (!list.root) return { root: { value } };
  list = clone(list);

  const { root } = list;
  const rootNew: ListElement<T> = { value, next: root };

  (root as ListElement<T>).previous = rootNew;

  return { root: rootNew };
}

export function insert<T>(list: List<T>, value: T, index: number): List<T> {
  if (!list.root) return { root: { value } };

  if (index === 0) return shift(list, value);

  list = clone(list);

  let node = list.root as ListElement<T>;
  let i = 0;
  while (++i < index) {
    if (!node.next) throw errorIndexOutOfBound(count(list), index);

    node = node.next;
  }

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

export function find<T>(list: List<T>, value: T): number {
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

export function remove<T>(list: List<T>, index: number): List<T> {
  let node = list.root;
  if (!node) throw errorListIsEmpty();

  list = clone(list);

  let i = 0;
  while (node) {
    if (i === index) {
      if (node.previous) node.previous.next = node.next;
      if (node.next) node.next.previous = node.previous;

      return list;
    }
    i++;
    node = node.next;
  }

  throw errorIndexOutOfBound(i, index);
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

export function removeByValue<T>(list: List<T>, value: T): List<T> {
  let node = list.root;
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

export function clone<T>(listOriginal: List<T>): List<T> {
  return list(...toArray(listOriginal));
}

export function errorIndexOutOfBound(capacity: number, index: number) {
  return new Error(`Capacity ${capacity} is not enough to access ${index}`);
}

export function errorNoSuchElement(value: any) {
  return new Error(`List doesn't contain "${value}"`);
}

export function errorListIsEmpty() {
  return new Error(`List if empty`);
}
