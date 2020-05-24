import { Queue } from '../queue';

function* x2x3x5() {
  const q2 = new Queue(2);
  const q3 = new Queue(3);
  const q5 = new Queue(5);

  yield 1;

  while (true) {
    q2.push(q2.bottom + 2);
    q3.push(q3.bottom + 3);
    q5.push(q5.bottom + 5);

    const qes = [q2, q3, q5];

    const minIndex = qes.reduce(
      (acc, q, i) => (q.top < qes[acc].top ? i : acc),
      0
    );

    const q = qes[minIndex];
    const val = q.pop();

    qes.forEach((q) => (q.top === val ? q.pop() : null));

    yield val;
  }
}

const gen = x2x3x5();

for (let i = 0; i < 16; i++) console.log(`${i}: ${gen.next().value}`);
