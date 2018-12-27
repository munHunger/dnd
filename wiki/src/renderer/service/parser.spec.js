const {
  tokenize,
  compile,
  text,
  underscore,
  and,
  or,
  onceOrMore,
  italic,
  bold
} = require("./parser");

describe("Compile", () => {
  describe("Atomics", () => {
    describe("Text", () => {
      it("classifies text as is", () =>
        expect(text(["qwer"])).toEqual({
          class: "text",
          consumed: 1,
          value: "qwer"
        }));
      it("doesn't consume empty input", () =>
        expect(text([])).toEqual({ consumed: 0 }));
    });
    describe("Underscore", () => {
      it("consumes underscore as special", () =>
        expect(underscore(["_"])).toEqual({
          class: "special",
          consumed: 1,
          value: "_"
        }));
      it("doesn't consume text", () =>
        expect(underscore(["u"])).toEqual({
          class: "special",
          consumed: 0,
          value: "u"
        }));
    });
  });

  describe("Operations", () => {
    describe("And", () => {
      describe("Using atomics", () => {
        it("returns a list of results from atomic rules", () => {
          expect(and([text, underscore], ["aqwe", "as"])).toEqual([
            {
              class: "text",
              consumed: 1,
              value: "aqwe"
            },
            {
              class: "special",
              consumed: 0,
              value: "as"
            }
          ]);
        });
        it("moves the array pointer per consumed rule", () => {
          expect(and([text, underscore], ["aqwe", "_"])).toEqual([
            {
              class: "text",
              consumed: 1,
              value: "aqwe"
            },
            {
              class: "special",
              consumed: 1,
              value: "_"
            }
          ]);
          expect(and([underscore, text], ["aqwe", "_"])).toEqual([
            {
              class: "special",
              consumed: 0,
              value: "aqwe"
            },
            {
              class: "text",
              consumed: 1,
              value: "aqwe"
            }
          ]);
        });
      });
      describe("Using operations", () => {
        it("Flat maps the result", () => {
          expect(
            and(
              [underscore, { op: and, rules: [text, underscore] }],
              ["_", "a", "_"]
            )
          ).toEqual([
            {
              class: "special",
              consumed: 1,
              value: "_"
            },
            {
              class: "text",
              consumed: 1,
              value: "a"
            },
            {
              class: "special",
              consumed: 1,
              value: "_"
            }
          ]);
        });
      });
    });
    describe("Or", () => {
      it("returns a list even if nothing is found", () => {
        expect(or([underscore], ["a"])).toEqual([{ consumed: 0 }]);
      });
      describe("Using atomics", () => {
        it("returns the first matching rule", () => {
          expect(or([text, underscore], ["aqwe"])).toEqual([
            {
              class: "text",
              consumed: 1,
              value: "aqwe"
            }
          ]);
          expect(or([underscore, text], ["aqwe"])).toEqual([
            {
              class: "text",
              consumed: 1,
              value: "aqwe"
            }
          ]);
        });
      });
      describe("Using operations", () => {
        it("Flat maps the result", () => {
          expect(
            or([underscore, { op: or, rules: [underscore, text] }], ["a"])
          ).toEqual([
            {
              class: "text",
              consumed: 1,
              value: "a"
            }
          ]);
        });
      });
    });
    describe("Once or more", () => {
      describe("Using atomics", () => {
        it("can consume only one", () => {
          expect(onceOrMore([underscore], ["_"])).toEqual([
            {
              class: "special",
              consumed: 1,
              value: "_"
            }
          ]);
        });

        it("iterates until it can't consume", () => {
          expect(onceOrMore([underscore], ["_", "_", "qwe"])).toEqual([
            {
              class: "special",
              consumed: 1,
              value: "_"
            },
            {
              class: "special",
              consumed: 1,
              value: "_"
            }
          ]);
        });
        it("only runns the first rule", () => {
          expect(onceOrMore([underscore, text], ["_", "_", "qwe"])).toEqual([
            {
              class: "special",
              consumed: 1,
              value: "_"
            },
            {
              class: "special",
              consumed: 1,
              value: "_"
            }
          ]);
        });
      });
      describe("Using operations", () => {
        it("works recursivly", () => {
          expect(
            onceOrMore(
              [{ op: onceOrMore, rules: [underscore] }],
              ["_", "_", "qwe"]
            )
          ).toEqual([
            {
              class: "special",
              consumed: 1,
              value: "_"
            },
            {
              class: "special",
              consumed: 1,
              value: "_"
            }
          ]);
        });
        it("flatmaps result", () => {
          expect(
            onceOrMore([{ op: or, rules: [underscore] }], ["_", "_", "qwe"])
          ).toEqual([
            {
              class: "special",
              consumed: 1,
              value: "_"
            },
            {
              class: "special",
              consumed: 1,
              value: "_"
            }
          ]);
        });
      });
    });
  });

  describe("Rules", () => {
    describe("Italics", () => {
      it("parses '_a_' as italic", () => {
        expect(italic(["_", "a", "_"])).toEqual({
          class: "italic",
          consumed: 3,
          value: [
            {
              class: "special",
              consumed: 1,
              value: "_"
            },
            {
              class: "text",
              consumed: 1,
              value: "a"
            },
            {
              class: "special",
              consumed: 1,
              value: "_"
            }
          ]
        });
      });
    });
    describe("Bold", () => {
      it("parses '__a__' as bold", () => {
        expect(bold(["_", "_", "a", "_", "_"])).toEqual({
          class: "bold",
          consumed: 5,
          value: [
            {
              class: "special",
              consumed: 1,
              value: "_"
            },
            {
              class: "italic",
              consumed: 3,
              value: [
                {
                  class: "special",
                  consumed: 1,
                  value: "_"
                },
                {
                  class: "text",
                  consumed: 1,
                  value: "a"
                },
                {
                  class: "special",
                  consumed: 1,
                  value: "_"
                }
              ]
            },
            {
              class: "special",
              consumed: 1,
              value: "_"
            }
          ]
        });
      });
    });
  });

  it("parses a single non special entry as text", () =>
    expect(compile(["hello"])).toEqual({
      class: "line",
      consumed: 1,
      value: [{ class: "text", consumed: 1, value: "hello" }]
    }));
  it("parses a single special entry as text", () =>
    expect(compile(["_"])).toEqual({
      class: "line",
      consumed: 1,
      value: [{ class: "text", consumed: 1, value: "_" }]
    }));
  it("parses text followed by special as text", () =>
    expect(compile(["q", "_"])).toEqual({
      class: "line",
      consumed: 2,
      value: [
        { class: "text", consumed: 1, value: "q" },
        { class: "text", consumed: 1, value: "_" }
      ]
    }));
  it("parses '_' followed by text as text", () =>
    expect(compile(["_", "w"])).toEqual({
      class: "line",
      consumed: 2,
      value: [
        { class: "text", consumed: 1, value: "_" },
        { class: "text", consumed: 1, value: "w" }
      ]
    }));
  it("parses '_ab_' as italic", () =>
    expect(compile(["_", "ab", "_"])).toEqual({
      class: "line",
      consumed: 3,
      value: [
        {
          class: "italic",
          consumed: 3,
          value: [
            { class: "special", consumed: 1, value: "_" },
            { class: "text", consumed: 1, value: "ab" },
            { class: "special", consumed: 1, value: "_" }
          ]
        }
      ]
    }));
  it("parses '*ab*' as italic", () =>
    expect(compile(["*", "ab", "*"])).toEqual({
      class: "line",
      consumed: 3,
      value: [
        {
          class: "italic",
          consumed: 3,
          value: [
            { class: "special", consumed: 1, value: "*" },
            { class: "text", consumed: 1, value: "ab" },
            { class: "special", consumed: 1, value: "*" }
          ]
        }
      ]
    }));
  it("parses '__ab__' as bold", () =>
    expect(compile(["_", "_", "ab", "_", "_"])).toEqual({
      class: "line",
      consumed: 5,
      value: [
        {
          class: "bold",
          consumed: 5,
          value: [
            { class: "special", consumed: 1, value: "_" },
            {
              class: "italic",
              consumed: 3,
              value: [
                { class: "special", consumed: 1, value: "_" },
                { class: "text", consumed: 1, value: "ab" },
                { class: "special", consumed: 1, value: "_" }
              ]
            },
            { class: "special", consumed: 1, value: "_" }
          ]
        }
      ]
    }));
  it("parses 'qe__ab__' as bold", () =>
    expect(compile(["qe", "_", "_", "ab", "_", "_"])).toEqual({
      class: "line",
      consumed: 6,
      value: [
        { class: "text", consumed: 1, value: "qe" },
        {
          class: "bold",
          consumed: 5,
          value: [
            { class: "special", consumed: 1, value: "_" },
            {
              class: "italic",
              consumed: 3,
              value: [
                { class: "special", consumed: 1, value: "_" },
                { class: "text", consumed: 1, value: "ab" },
                { class: "special", consumed: 1, value: "_" }
              ]
            },
            { class: "special", consumed: 1, value: "_" }
          ]
        }
      ]
    }));
  it("parses '__ab__a_s' as bold", () =>
    expect(compile(["_", "_", "ab", "_", "_", "a", "_", "s"])).toEqual({
      class: "line",
      consumed: 8,
      value: [
        {
          class: "bold",
          consumed: 5,
          value: [
            { class: "special", consumed: 1, value: "_" },
            {
              class: "italic",
              consumed: 3,
              value: [
                { class: "special", consumed: 1, value: "_" },
                { class: "text", consumed: 1, value: "ab" },
                { class: "special", consumed: 1, value: "_" }
              ]
            },
            { class: "special", consumed: 1, value: "_" }
          ]
        },
        { class: "text", consumed: 1, value: "a" },
        { class: "text", consumed: 1, value: "_" },
        { class: "text", consumed: 1, value: "s" }
      ]
    }));
  it("parses '#asd' as heading", () =>
    expect(compile(["#", "asd"])).toEqual({
      class: "line",
      consumed: 2,
      value: [
        {
          class: "heading",
          consumed: 2,
          value: [
            { class: "special", consumed: 1, value: "#" },
            {
              class: "text",
              consumed: 1,
              value: "asd"
            }
          ]
        }
      ]
    }));
  it("doesn't parse 'a#sd' as heading", () =>
    expect(compile(["a", "#", "sd"])).toEqual({
      class: "line",
      consumed: 3,
      value: [
        { class: "text", consumed: 1, value: "a" },
        { class: "text", consumed: 1, value: "#" },
        { class: "text", consumed: 1, value: "sd" }
      ]
    }));
  it("parses '#as_qw_' as heading with italics", () =>
    expect(compile(["#", "as", "_", "qw", "_"])).toEqual({
      class: "line",
      consumed: 5,
      value: [
        {
          class: "heading",
          consumed: 5,
          value: [
            { class: "special", consumed: 1, value: "#" },
            {
              class: "text",
              consumed: 1,
              value: "as"
            },
            {
              class: "italic",
              consumed: 3,
              value: [
                { class: "special", consumed: 1, value: "_" },
                { class: "text", consumed: 1, value: "qw" },
                { class: "special", consumed: 1, value: "_" }
              ]
            }
          ]
        }
      ]
    }));
});

describe("Tokenize", () => {
  it("returns non special characters as a group", () =>
    expect(tokenize("abc")).toEqual(["abc"]));
  it("recognizes '_' as special", () =>
    expect(tokenize("abc_qwe")).toEqual(["abc", "_", "qwe"]));
  it("can be surrounded by special characters", () =>
    expect(tokenize("_abc_")).toEqual(["_", "abc", "_"]));
  it("recognizes '*' as special", () =>
    expect(tokenize("abc*")).toEqual(["abc", "*"]));
  it("recognizes '#' as special", () =>
    expect(tokenize("#*")).toEqual(["#", "*"]));
});
