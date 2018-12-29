const { indexFolder } = require("@/service/indexer");
var stringSimilarity = require("string-similarity");

var index = indexFolder(__dirname + "/../assets/post")[0];

function search(query) {
  return index
    .map(post => {
      let sortedTags = post.tags.sort(
        (a, b) =>
          stringSimilarity.compareTwoStrings(query, b) -
          stringSimilarity.compareTwoStrings(query, a)
      );
      return {
        file: post.file,
        name: post.name,
        tags: sortedTags,
        similarity: stringSimilarity.compareTwoStrings(query, sortedTags[0])
      };
    })
    .sort((a, b) => b.similarity - a.similarity);
}

module.exports = {
  search
};
