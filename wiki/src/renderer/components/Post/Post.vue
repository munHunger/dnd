<template>
  <main :key="fileName">
    fileName: {{fileName}}
    <div class="post">{{data}}</div>
    <div class="info">
      <div v-for="item in info" v-bind:key="item.name">{{item.name}}</div>
    </div>
  </main>
</template>

<script>
const { parse } = require("@/service/parser");
const fs = require("fs");
let postInfo = { data: "abc", info: [] };
export default {
  props: ["fileName"],
  watch: {
    fileName: {
      immediate: true,
      handler: (newVal, oldVal) => {
        if (newVal) {
          postInfo = parse(
            fs
              .readFileSync(__dirname + "/../../assets/" + newVal, "utf8")
              .split("\n")
          );
        }
      }
    }
  },
  data: () => {
    console.log(this.fileName);
    return postInfo;
  }
};
</script>

<style scoped>
.post {
}
.info {
  padding: 15px;
  margin: 15px;
  color: bisque;
  background-color: darkslategray;
}
</style>