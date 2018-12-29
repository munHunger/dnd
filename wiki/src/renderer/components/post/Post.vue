<template>
  <main :key="fileName">
    <div class="post">
      <div class="path">{{fileName}}</div>
      <p v-for="paragraph of paragraphs" :key="paragraph">
        <markdown v-for="part of paragraph.value" :key="part.class" :input="part"></markdown>
      </p>
    </div>
    <div class="info">
      <div v-for="item in tags" v-bind:key="item[1]">
        <div v-if="item[0] === 'i'">
          <div class="heading">{{item[1]}}</div>
          <div class="data">
            <div v-for="field in item.slice(2)" v-bind:key="field" class="field">{{field}}</div>
          </div>
        </div>
      </div>
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
    let parsed = fs
      .readFileSync(__dirname + "/../../assets/" + this.fileName, "utf8")
      .split("\n")
      .map(line => parse(compile(tokenize(line))));
    return {
      paragraphs: parsed.map(p => p.md),
      tags: parsed.map(p => p.tags).filter(tag => tag.length > 0)
    };
  }
};
</script>

<style scoped>
p {
  margin-top: 15px;
}
.post {
}
.path::before {
  content: "/";
}
.path {
  padding: 10px;
  font-style: italic;
  color: #ec9ded;
}
.info {
  padding: 15px;
  margin: 15px;
  color: #2dba8a;
  border-left: 1px solid #2dba8a;
}
.info .data .field {
  margin-bottom: 5px;
}
.info .heading {
  font-weight: 600;
  margin-top: 15px;
  font-size: 20px;
  color: #ccd7c5;
}
</style>