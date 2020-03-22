import Stack from '../stack';

export function testBrackets(bracketsRaw: string[]): boolean {
  if (!bracketsRaw.length) return false;

  enum BracketType {
    Parenthese,
    Square,
    Curly
  }

  enum State {
    Opened,
    Closed
  }

  const bracketMap: Record<string, [BracketType, State]> = {
    "[": [BracketType.Square, State.Opened],
    "]": [BracketType.Square, State.Closed],
    "(": [BracketType.Parenthese, State.Opened],
    ")": [BracketType.Parenthese, State.Closed],
    "{": [BracketType.Curly, State.Opened],
    "}": [BracketType.Curly, State.Closed]
  };

  const s = new Stack<[BracketType, State]>(Infinity);

  let index = 0;
  let bracketRaw = bracketsRaw[index];
  while (bracketRaw) {
    const bracket = bracketMap[bracketRaw];

    // check if it's a bracket
    if (!bracket) return false;

    const [bracketType, bracketState] = bracket;

    if (!s.isEmpty() && s.top()[0] === bracketType)
      if (s.top()[1] === State.Opened && bracketState === State.Closed) s.pop();
      else s.push(bracket);
    else s.push(bracket);

    bracketRaw = bracketsRaw[++index];
  }

  return s.isEmpty();
}
