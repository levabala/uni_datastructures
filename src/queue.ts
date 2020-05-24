export function errorPopEmpty() {
  return new Error(`Cannot pop empty queue`);
}

export function errorTopEmpty() {
  return new Error(`Cannot get the top element of empty queue`);
}

export function errorOverflow(length: number, capacity: number) {
  return new Error(
    `Queue overflow: capacity ${capacity} is not enough to store ${length} elements`
  );
}

export class Queue<T> {
  elements: T[];
  private maxLength_ = Infinity;

  constructor(...elements: T[]) {
    this.elements = elements;
  }

  get length() {
    return this.elements.length;
  }

  set maxLength(maxLength: number) {
    this.maxLength_ = maxLength;
  }

  get maxLength() {
    return this.maxLength_;
  }

  clear() {
    this.elements = [];
  }

  clone() {
    const q = new Queue(...this.elements);
    q.maxLength = this.maxLength;
    return q;
  }

  isEmpty() {
    return this.elements.length === 0;
  }

  get top() {
    if (this.length === 0) throw errorTopEmpty();

    return this.elements[0];
  }

  get bottom() {
    if (this.length === 0) throw errorTopEmpty();

    return this.elements[this.elements.length - 1];
  }

  pop() {
    if (this.length === 0) throw errorPopEmpty();

    return this.elements.shift();
  }

  push(value: T) {
    if (this.length === this.maxLength)
      throw errorOverflow(this.length + 1, this.maxLength);

    this.elements.push(value);

    return this;
  }
}
