import * as listApi from './list';

const stdin = process.openStdin();

let l = listApi.list();

const help: Record<string, string> = {
  list: "() => List // creates new empty list",
  count: "() => number // counts elements in the list",
  push: "(element) => List // add provided element to the end of the list",
  unshift: "(element) => List // add provided element to the start of the list",
  pop: "() => List // removes the last element from the list",
  shift: "() => List // removes the first element from the list",
  insert: "(element, index) => List // inserts provided element at the index",
  get: "(index) => any // returns list node's value at the index",
  remove: "(index) => List // removes an element at the index",
  removeByValue:
    "(element) => List // removes the first element equals to provided element",
  findIndex: "(element) => number // returns index of provided element"
};

console.log("------ list using script ------");
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
    if (funcName) console.log(help[funcName]);
    else console.log(help);

    console.log();
    return;
  } else if (command === "list") {
    l = listApi.list();
    console.log();
    return;
  }

  const func:
    | ((...args: any[]) => any | listApi.List<any>)
    | undefined = (listApi as any)[command];
  if (!func) {
    console.log(
      "no such processor (type help to get the whole list of commands)\n"
    );
    return;
  }

  try {
    const result = func(l, ...args);
    if (listApi.isList(result)) {
      l = result;
      console.log(listApi.listToString(result));
    } else console.log(result);
  } catch (e) {
    console.log("ERROR:", e.message);
  }

  console.log();
  // console.log(listApi.listToString(l), "\n");
});
