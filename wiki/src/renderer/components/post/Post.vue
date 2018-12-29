<template>
  <main :key="fileName">
    <div class="post">
      <div class="path">{{fileName.substring(fileName.indexOf("assets"))}}</div>
      <p v-for="(paragraph, pIndex) of paragraphs" :key="pIndex">
        <markdown v-for="(part, index) of paragraph.value" :key="index" :input="part"></markdown>
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
    return {
      paragraphs: [],
      tags: []
    };
  },
  mounted() {
    this.$watch(
      "fileName",
      fileName => {
        let parsed = fs
          .readFileSync(fileName, "utf8")
          .split("\n")
          .map(line => parse(compile(tokenize(line))));
        this.paragraphs = parsed.map(p => p.md);
        this.tags = parsed.map(p => p.tags).filter(tag => tag.length > 0);
      },
      { immediate: true }
    );
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