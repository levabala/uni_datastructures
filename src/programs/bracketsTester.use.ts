import { testBrackets } from './bracketsTester';

const stdin = process.openStdin();
stdin.addListener("data", function(d) {
  const input: string = d.toString().trim();
  const brackets = Array.from(input);

  console.log(testBrackets(brackets) ? "valid" : "invalid");
  console.log();
});
