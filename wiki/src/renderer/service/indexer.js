const fs = require("fs");
const { parse, compile, tokenize } = require("@/service/parser");

function indexFolder(folder) {
  return fs.readdirSync(folder).map(item => {
    var file = folder + "/" + item;
    if (fs.statSync(file).isFile()) return indexFile(file);
    else return indexFolder(file);
  });
}

function indexFile(path) {
  let compiled = fs
    .readFileSync(path, "utf8")
    .split("\n")
    .map(line => parse(compile(tokenize(line))))
    .map(tree => tree.tags)
    .filter(tags => tags.length > 0)
    .map(tag => tag.slice(1))
    .reduce((acc, val) => acc.concat(val), [])
    .map(tag => tag.toLowerCase());

  let name = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("."));
  name = name.split(/(?=[A-Z])/).reduce((acc, val) => (acc += val + " "), "");
  name = name.charAt(0).toUpperCase() + name.substring(1);
  return {
    file: path,
    name: name,
    tags: compiled
  };
}

module.exports = {
  indexFolder
};
