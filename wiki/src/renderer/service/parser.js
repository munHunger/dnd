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
    let part = or([heading, bold, italic, text], tokens);
    if (part.consumed == 0) throw error;
    parts.push(part);
    tokens = tokens.slice(part.consumed);
  }
  // rule(tokens, "line", {
  //   op: or,
  //   rules: [
  //     { op: and, rules: [heading, { op: or, rules: [bold, italic, text] }] },
  //     { op: or, rules: [bold, italic, text] }
  //   ]
  // });
  return {
    class: "line",
    consumed: parts.reduce((acc, val) => acc + val.consumed, 0),
    value: parts
  };
}

function rule(input, name, rule) {
  let parts = rule.op.call(this, rule.rules, input);

  if (Array.isArray(parts)) {
    if (parts.filter(part => part.consumed === 0).length > 0)
      return { consumed: 0 };

    return {
      class: name,
      consumed: parts.reduce((acc, val) => acc + val.consumed, 0),
      value: parts
    };
  } else
    return {
      class: name,
      consumed: parts.consumed,
      value: parts.value
    };
}

function and(rules, input) {
  return rules.reduce((acc, val) => {
    if (isFunction(val)) {
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
    } else {
      let res = rule(
        input.slice(
          Math.min(acc.reduce((a, v) => a + v.consumed, 0), input.length)
        ),
        "and",
        val
      );
      if (res.consumed === 0) acc.push(res);
      else acc = acc.concat(res.value);
    }
    return acc;
  }, []);
}

function or(rules, input) {
  let res = rules
    .map(val => {
      if (isFunction(val)) return val.call(this, input);
      else {
        let res = rule(input, "or", val);
        return res;
      }
    })
    .filter(part => part.consumed > 0);
  return res.length > 0 ? res[0] : { consumed: 0 };
}

function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
  );
}

function heading(input) {
  return rule(input, "heading", {
    op: and,
    rules: [hash, text]
  });
}

function bold(input) {
  return rule(input, "bold", {
    op: or,
    rules: [
      { op: and, rules: [underscore, italic, underscore] },
      { op: and, rules: [asterix, italic, asterix] }
    ]
  });
}

function italic(input) {
  return rule(input, "italic", {
    op: or,
    rules: [
      { op: and, rules: [underscore, text, underscore] },
      { op: and, rules: [asterix, text, asterix] }
    ]
  });
}

function hash(input) {
  return {
    class: "special",
    consumed: input[0] === "#" ? 1 : 0,
    value: input[0]
  };
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
