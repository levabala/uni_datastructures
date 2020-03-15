import * as listApi from './list';

const stdin = process.openStdin();

let l = listApi.list();

stdin.addListener("data", function(d) {
  const input: string = d.toString().trim();
  const parts = input.split(" ");
  const command = parts[0];
  const args = parts
    .slice(1, parts.length)
    .map(val => (isNaN(parseInt(val)) ? val : parseInt(val)));

  const func:
    | ((...args: any[]) => any | listApi.List<any>)
    | undefined = (listApi as any)[command];
  if (!func) {
    console.log(
      "no such processor (type help to get the whole list of commands)\n"
    );
    return;
  }

  const result = func(l, ...args);
  if (listApi.isList(result)) {
    l = result;
    console.log(listApi.listToString(result));
  } else console.log(result);

  console.log();
  // console.log(listApi.listToString(l), "\n");
});
