const {
  tokenize,
  compile,
  and,
  or,
  onceOrMore,
  italic,
  bold,
  chars,
  tag
} = require("./parser");

describe("Compile", () => {
  describe("Operations", () => {
    describe("And", () => {
      describe("Using atomics", () => {
        it("returns a list of results from atomic rules", () => {
          expect(
            and([chars(/.*/, false), chars(/_/, true)], ["aqwe", "as"])
          ).toEqual([
            {
              class: "text",
              consumed: 1,
              value: "aqwe"
            },
            { consumed: 0 }
          ]);
        });
        it("moves the array pointer per consumed rule", () => {
          expect(
            and([chars(/.*/, false), chars(/_/, true)], ["aqwe", "_"])
          ).toEqual([
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
          expect(
            and([chars(/_/, true), chars(/.*/, false)], ["aqwe", "_"])
          ).toEqual([
            { consumed: 0 },
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
              [
                chars(/_/, true),
                { op: and, rules: [chars(/.*/, false), chars(/_/, true)] }
              ],
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
        expect(or([chars(/_/, true)], ["a"])).toEqual([{ consumed: 0 }]);
      });
      describe("Using atomics", () => {
        it("returns the first matching rule", () => {
          expect(or([chars(/.*/, false), chars(/_/, true)], ["aqwe"])).toEqual([
            {
              class: "text",
              consumed: 1,
              value: "aqwe"
            }
          ]);
          expect(or([chars(/_/, true), chars(/.*/, false)], ["aqwe"])).toEqual([
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
            or(
              [
                chars(/_/, true),
                { op: or, rules: [chars(/_/, true), chars(/.*/, false)] }
              ],
              ["a"]
            )
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
          expect(onceOrMore([chars(/_/, true)], ["_"])).toEqual([
            {
              class: "special",
              consumed: 1,
              value: "_"
            }
          ]);
        });

        it("iterates until it can't consume", () => {
          expect(onceOrMore([chars(/_/, true)], ["_", "_", "qwe"])).toEqual([
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
          expect(
            onceOrMore(
              [chars(/_/, true), chars(/.*/, false)],
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
      });
      describe("Using operations", () => {
        it("works recursivly", () => {
          expect(
            onceOrMore(
              [{ op: onceOrMore, rules: [chars(/_/, true)] }],
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
            onceOrMore(
              [{ op: or, rules: [chars(/_/, true)] }],
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
      it("parses '_a b_' as italic", () => {
        expect(italic(["_", "a", " ", "b", "_"])).toEqual({
          class: "italic",
          consumed: 5,
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
              class: "text",
              consumed: 1,
              value: " "
            },
            {
              class: "text",
              consumed: 1,
              value: "b"
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
    describe("Tag", () => {
      it("maps out a tag", () => {
        expect(tag(["@", "info", "[", "data", "]"])).toEqual({
          class: "tag",
          consumed: 5,
          value: [
            {
              class: "special",
              consumed: 1,
              value: "@"
            },
            {
              class: "text",
              consumed: 1,
              value: "info"
            },
            {
              class: "special",
              consumed: 1,
              value: "["
            },
            {
              class: "text",
              consumed: 1,
              value: "data"
            },
            {
              class: "special",
              consumed: 1,
              value: "]"
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
