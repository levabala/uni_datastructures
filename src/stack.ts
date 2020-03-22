export interface StackElement<T> {
  value: T;
  prev: StackElement<T> | undefined;
}

export function errorOverflow(length: number, capacity: number) {
  return new Error(
    `Stack overflow: capacity ${capacity} is not enough to store ${length} elements`
  );
}

export function errorPopEmpty() {
  return new Error(`Cannot pop empty stack`);
}

export default class Stack<T> {
  _topElement: StackElement<T> | undefined = undefined;
  capacity: number;
  length = 0;

  constructor(capacity: number, ...elements: T[]) {
    this.capacity = capacity;

    elements.forEach(el => this.push(el));
  }

  push(value: T): Stack<T> {
    if (this.length + 1 > this.capacity)
      throw errorOverflow(this.length + 1, this.capacity);

    const newTop: StackElement<T> = {
      value,
      prev: this._topElement
    };

    this._topElement = newTop;
    this.length++;

    return this;
  }

  pop(): T {
    if (!this._topElement) throw errorPopEmpty();

    const { value, prev } = this._topElement;

    this._topElement = prev;
    this.length--;

    return value;
  }

  top(): T {
    if (!this._topElement) throw errorPopEmpty();

    return this._topElement.value;
  }

  isEmpty(): boolean {
    return !this._topElement;
  }

  clear(): Stack<T> {
    this._topElement = undefined;
    this.length = 0;

    return this;
  }

  clone(): Stack<T> {
    const newStack = new Stack<T>(this.capacity);
    newStack._topElement = this._topElement;
    newStack.length = this.length;

    return newStack;
  }
}
