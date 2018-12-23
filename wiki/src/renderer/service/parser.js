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
      } else acc.data += (acc.data.length > 0 ? "\n" : "") + val;
      return acc;
    },
    { data: "", info: [] }
  );
}

module.exports = { parse };
