import Stack from './stack';

const stdin = process.openStdin();

const s = new Stack(Infinity);

const help: Record<keyof Stack<any>, string> = {
  _topElement: "private field for storing reference for the top element",
  capacity: "max length",
  clear: "() => Stack // clears the stack",
  clone: "() => Stack // clones the stack",
  isEmpty: "() => boolean // returns true if empty (false otherwise)",
  length: "() => number // current amount of elements",
  pop: "() => Element // removes and returns the top element",
  push: "(element) => Stack // adds new top element",
  top: "() => Element // returns a value of the top element",
  toString: "() => string // print the stack",
  setCapacity: "(capacity) => Stack // sets provided capacity for the stack"
};

console.log("------ stack using script ------");
console.log('type: "<COMMAND_NAME> <ARG1> <ARG2> ... <ARGN>"');
console.log(
  'or "help" to get the whole list of commands or "help <COMMAND_NAME>" to get help for specific command'
);
console.log();

stdin.addListener("data", function(d) {
  const input: string = d.toString().trim();
  const parts = input.split(" ");
  const command = parts[0];
  const args = parts
    .slice(1, parts.length)
    .map(val => (isNaN(parseInt(val)) ? val : parseInt(val)));

  if (command === "help") {
    const funcName = args[0];
    if (funcName) console.log(help[funcName as keyof Stack<any>]);
    else console.log(help);

    console.log();
    return;
  }

  const func = command in s ? (command as keyof Stack<any>) : undefined;
  if (!func) {
    console.log(
      "no such processor (type help to get the whole list of commands)\n"
    );
    return;
  }

  try {
    const result = (s[func] as any)(...args);
    if (result instanceof Stack) console.log(s.toString());
    else console.log(result);
  } catch (e) {
    console.log("ERROR:", e.message);
  }

  console.log();
});
