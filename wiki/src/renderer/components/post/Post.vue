<template>
  <main :key="fileName">
    <div class="post">
      <div class="path">{{fileName}}</div>post:
      <p v-for="paragraph of paragraphs" :key="paragraph">
        <markdown v-for="part of paragraph.value" :key="part.class" :input="part"></markdown>
      </p>
    </div>
  </main>
</template>

<script>
import Markdown from "./markdown/Markdown";
const { parse, compile, tokenize } = require("@/service/parser");
const fs = require("fs");
export default {
  components: { Markdown },
  props: ["fileName"],
  data() {
    return {
      paragraphs: fs
        .readFileSync(__dirname + "/../../assets/" + this.fileName, "utf8")
        .split("\n")
        .map(line => parse(compile(tokenize(line))))
    };
  }
};
</script>

<style scoped>
.post {
}
.path::before {
  content: "/";
}
.path {
  padding: 10px;
  font-style: italic;
}
.info {
  padding: 15px;
  margin: 15px;
  color: bisque;
  border-left: 1px solid bisque;
}
.info .data .field {
  margin-bottom: 5px;
}
.info .heading {
  font-weight: 600;
  margin-top: 15px;
}
</style>