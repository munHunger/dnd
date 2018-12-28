const specialChars = "#*_@[] ".split("");
function parse(input) {
  if (!Array.isArray(input.value)) return { md: input, tags: [] };
  let prepared = input.value.map(val => parse(val));
  let tags = prepared
    .map(val => val.tags)
    .reduce((acc, val) => acc.concat(val), []);
  if (input.class === "tag")
    return {
      md: input,
      tags: input.value
        .reduce((acc, val) => {
          if (val.class === "special") acc.push("");
          else acc[acc.length - 1] += val.value;
          return acc;
        }, [])
        .filter(t => t.length > 0)
    };
  input.value = prepared
    .map(val => val.md)
    .map(val => {
      if (val.class === "italic" && input.class === "bold") val.class = "text";
      return val;
    })
    .filter(val => val && val.class !== "special" && val.class !== "tag")
    .reduce((acc, val) => {
      if (
        acc.length > 0 &&
        acc[acc.length - 1].class === "text" &&
        val.class === "text"
      )
        acc[acc.length - 1].value += val.value;
      else acc.push(val);
      return acc;
    }, []);
  return { md: input, tags: tags };
}

function tokenize(line) {
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
    op: or,
    rules: [
      heading,
      {
        op: onceOrMore,
        rules: [{ op: or, rules: [tag, bold, italic, chars(/.*/, false)] }]
      }
    ]
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
  if (!isFunction(rules[0])) res = res.value ? res.value : [{ consumed: 0 }];
  else res = [res];
  let consumed = res.reduce((acc, val) => acc + val.consumed, 0);
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
    rules: [
      chars(/^#$/, true),
      {
        op: onceOrMore,
        rules: [{ op: or, rules: [bold, italic, chars(/.*/, false)] }]
      }
    ]
  });
}

function bold(input) {
  return rule(input, "bold", {
    op: or,
    rules: [
      { op: and, rules: [chars(/^_$/, true), italic, chars(/^_$/, true)] },
      { op: and, rules: [chars(/^\*$/, true), italic, chars(/^\*$/, true)] }
    ]
  });
}

function italic(input) {
  return rule(input, "italic", {
    op: or,
    rules: [
      {
        op: and,
        rules: [
          chars(/^_$/, true),
          { op: onceOrMore, rules: [chars(/^[^_]*$/, false)] },
          chars(/^_$/, true)
        ]
      },
      {
        op: and,
        rules: [
          chars(/^\*$/, true),
          { op: onceOrMore, rules: [chars(/^[^*]*$/, false)] },
          chars(/^\*$/, true)
        ]
      }
    ]
  });
}

function tag(input) {
  return rule(input, "tag", {
    op: and,
    rules: [
      chars(/^@$/, true),
      chars(/^[a-zA-Z]*$/, false),
      {
        op: onceOrMore,
        rules: [
          {
            op: and,
            rules: [
              chars(/^\[$/, true),
              {
                op: onceOrMore,
                rules: [chars(/^[^\][]]*/, false)]
              },
              chars(/^\]$/, true)
            ]
          }
        ]
      }
    ]
  });
}

function chars(regex, isSpecial) {
  return input => {
    if (input.length == 0 || !regex.test(input[0])) return { consumed: 0 };
    return {
      class: isSpecial ? "special" : "text",
      consumed: 1,
      value: input[0]
    };
  };
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
  chars,
  tag
};
