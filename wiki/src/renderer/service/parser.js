function parse(input) {
  return input.reduce(
    (acc, val) => {
      if (val.startsWith("@")) {
        let list = [];
        let tmp = val;
        let start = tmp.indexOf("[");
        let end = tmp.indexOf("]");
        while (start >= 0 && end >= 0) {
          list.push(tmp.substring(start + 1, end));
          tmp = tmp.substring(end + 1);
          start = tmp.indexOf("[");
          end = tmp.indexOf("]");
        }
        acc.info.push({ name: list[0], data: list.splice(1) });
      } else {
        acc.data.push(parseMD(val));
      }
      return acc;
    },
    { data: [], info: [] }
  );
}

function tokenize(line) {
  let specialChars = "#*_".split("");
  return line.split("").reduce((acc, val) => {
    if (
      specialChars.indexOf(val) > -1 ||
      acc.length == 0 ||
      (acc[acc.length - 1].length == 1 &&
        specialChars.indexOf(acc[acc.length - 1]) > -1)
    )
      acc.push(val);
    else acc[acc.length - 1] += val;
    return acc;
  }, []);
}

function compile(tokens) {
  let parts = [];
  while (tokens.length > 0) {
    let part = [bold(tokens), italic(tokens), text(tokens)].filter(
      part => part.consumed > 0
    )[0];
    if (part.consumed == 0) throw error;
    parts.push(part);
    tokens = tokens.slice(part.consumed);
  }
  return {
    class: "line",
    consumed: parts.reduce((acc, val) => acc + val.consumed, 0),
    value: parts
  };
}

function bold(input) {
  let parts = andRules([underscore, italic, underscore], input);
  if (parts.filter(part => part.consumed === 0).length > 0)
    return { consumed: 0 };
  return {
    class: "bold",
    consumed: parts.reduce((acc, val) => acc + val.consumed, 0),
    value: parts
  };
}

function italic(input) {
  let parts = andRules([underscore, text, underscore], input);
  if (parts.filter(part => part.consumed === 0).length > 0)
    return { consumed: 0 };
  return {
    class: "italic",
    consumed: parts.reduce((acc, val) => acc + val.consumed, 0),
    value: parts
  };
}

//Create an AND operation of rules
function andRules(rules, input) {
  return rules.reduce((acc, val) => {
    if (acc.length == 0) acc.push(val.call(this, input));
    else
      acc.push(
        val.call(
          this,
          input.slice(
            Math.min(acc.reduce((a, v) => a + v.consumed, 0), input.length)
          )
        )
      );
    return acc;
  }, []);
}

function asterix(input) {
  return {
    class: "special",
    consumed: input[0] === "*" ? 1 : 0,
    value: input[0]
  };
}

function underscore(input) {
  return {
    class: "special",
    consumed: input[0] === "_" ? 1 : 0,
    value: input[0]
  };
}

function text(input) {
  return { class: "text", consumed: 1, value: input[0] };
}

function replace(list, pattern, replacement) {}

function parseMD(line, test) {
  let c = "text";
  if (line.startsWith("# ")) {
    c = "h1";
    line = line.substring(2);
  } else if (/\*.*\*/gm.test(line)) {
    c = "italic";
    line = line.substring(1, line.length - 1);
  }
  let ret = { class: c, text: line };
  if (test && JSON.stringify(ret) === JSON.stringify(test)) return ret;
  else {
    child = parseMD(line, ret);
    if (child.class === "text") return ret;
    return { class: c, next: child };
  }
}

module.exports = { tokenize, parse, compile };
