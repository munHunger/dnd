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
  let result = rule(tokens, "line", {
    op: onceOrMore,
    rules: [
      {
        op: or,
        rules: [
          {
            op: and,
            rules: [heading, { op: or, rules: [bold, italic, text] }]
          },
          { op: or, rules: [bold, italic, text] }
        ]
      }
    ]
  });
  result = rule(tokens, "line", {
    op: onceOrMore,
    rules: [{ op: or, rules: [bold, italic, text] }]
  });
  return result;
}

function rule(input, name, rule) {
  let parts = rule.op.call(this, rule.rules, input);

  if (parts.filter(part => part.consumed === 0).length > 0)
    return { consumed: 0 };

  return {
    class: name,
    consumed: parts.reduce((acc, val) => acc + val.consumed, 0),
    value: parts
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
        undefined,
        val
      );
      if (res.consumed === 0) acc.push(res);
      else acc = acc.concat(res.value);
    }
    return acc;
  }, []);
}

function onceOrMore(rules, input) {
  let res = isFunction(rules[0])
    ? rules[0].call(this, input)
    : rule(input, undefined, rules[0]);
  let consumed = res.consumed;
  if (!isFunction(rules[0])) res = res.value ? res.value : [{ consumed: 0 }];
  else res = [res];
  if (consumed > 0 && input.length - consumed > 0) {
    let rec = onceOrMore(rules, input.slice(consumed));
    return res.concat(rec.filter(r => r.consumed > 0));
  }
  return res;
}

function or(rules, input) {
  let res = rules
    .map(val => {
      if (isFunction(val)) return val.call(this, input);
      else {
        let r = rule(input, undefined, val);
        if (r.value && r.value.filter(part => part.consumed == 0).length == 0) {
          return r.value;
        } else return { consumed: 0 };
      }
    })
    .filter(part => Array.isArray(part) || part.consumed > 0);
  if (res.length > 0) return Array.isArray(res[0]) ? res[0] : [res[0]];
  else return [{ consumed: 0 }];
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

module.exports = {
  tokenize,
  parse,
  compile,
  rule,
  and,
  or,
  onceOrMore,
  italic,
  bold,
  text,
  underscore
};
