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
  if (!list.root) return 0;

  let count = 0;
  let currentNode = list.root;

  while (currentNode) {
    console.log(count, currentNode);
    currentNode = currentNode.next;
    count++;
  }

  return count;
}

export function push<T>(list: List<T>, value: T): List<T> {
  if (!list.root) return { root: { value } };

  let lastNode = list.root;

  while (lastNode.next) {
    lastNode = lastNode.next;
  }

  lastNode.next = { value, previous: lastNode };
  return list;
}

export function shift<T>(list: List<T>, value: T): List<T> {
  if (!list.root) return { root: { value } };

  const { root } = list;
  const rootNew: ListElement<T> = { value, next: root };

  root.previous = rootNew;

  return { root: rootNew };
}

export function insert<T>(list: List<T>, value: T, index: number): List<T> {
  if (!list.root) return { root: { value } };

  let node = list.root;
  let i = 0;
  while (i < index) {
    i++;
    node = node.next;

    if (!node) throw errorIndexOutOfBound(i, index);
  }

  const newNode: ListElement<T> = { value, previous: node, next: node.next };

  if (node.next) node.next.previous = newNode;

  if (node.previous) node.previous.next = newNode;

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

  let i = 0;
  while (node) {
    if (i === index) {
      node.previous.next = node.next;
      node.next.previous = node.previous;

      return list;
    }
  }

  throw errorIndexOutOfBound(i, index);
}

export function removeByValue<T>(list: List<T>, value: T): List<T> {
  let node = list.root;
  if (!node) throw errorListIsEmpty();

  let i = 0;
  while (node) {
    if (node.value === value) {
      node.previous.next = node.next;
      node.next.previous = node.previous;

      return list;
    }
  }

  throw errorNoSuchElement(value);
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
