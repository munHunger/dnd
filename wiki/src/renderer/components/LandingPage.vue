<template>
  <div id="wrapper">
    <main>
      <post file-name="post/npc/albertBerg.md"></post>
      <search></search>
    </main>
  </div>
</template>

<script>
import Post from "./post/Post";
import Search from "./search/Search";
const { indexFolder } = require("@/service/indexer");
console.log(indexFolder(__dirname + "/../assets/post/npc"));
export default {
  name: "landing-page",
  components: { Post, Search },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");
@import url("https://fonts.googleapis.com/css?family=Roboto+Mono");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Roboto Mono", monospace;
}

#wrapper {
  background-color: #1c1d20;
  color: #ccdbdc;
  height: 100vh;
  padding: 60px 80px;
  width: 100vw;
}

main {
  display: flex;
  justify-content: space-between;
}

main > div {
  flex-basis: 50%;
}
</style>
