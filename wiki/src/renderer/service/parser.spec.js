const { parse, tokenize, compile } = require("./parser");

describe("Compile", () => {
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
