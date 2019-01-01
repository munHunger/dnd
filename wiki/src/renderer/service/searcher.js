const { indexFolder } = require("@/service/indexer");
var stringSimilarity = require("string-similarity");

var index;

function init() {
  if (!this.index) {
    this.index = indexFolder(__dirname + "/../assets/post");
  }
}

function search(query) {
  return index
    .map(post => {
      let sortedTags = post.tags
        .concat([post.name])
        .filter(tag => tag)
        .sort(
          (a, b) =>
            stringSimilarity.compareTwoStrings(query, b) -
            stringSimilarity.compareTwoStrings(query, a)
        );
      return {
        file: post.file,
        name: post.name,
        tags: sortedTags,
        similarity:
          sortedTags.length > 0
            ? stringSimilarity.compareTwoStrings(query, sortedTags[0])
            : 0
      };
    })
    .sort((a, b) => b.similarity - a.similarity);
}

module.exports = {
  search,
  init
};
