<template>
  <div id="wrapper">
    <main>
      <post :file-name="post" v-if="post"></post>
      <search v-on:selected="select" v-if="search"></search>
      <span style="color:white" v-if="loading">loading</span>
    </main>
  </div>
</template>

<script>
import Post from "./post/Post";
import Search from "./search/Search";
import { setTimeout } from "timers";
const { init } = require("@/service/searcher");
export default {
  data() {
    return { post: undefined, search: false, loading: false };
  },
  name: "landing-page",
  components: { Post, Search },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    select(path) {
      this.post = path;
      this.search = false;
    }
  },
  updated() {
    setTimeout(() => {
      init();
      this.loading = false;
      this.search = true;
    }, 1000);
  },
  mounted() {
    window.addEventListener(
      "keypress",
      function(e) {
        console.log(e);
        if (String.fromCharCode(e.keyCode) === " ") {
          this.search = true;
        }
      }.bind(this)
    );
    this.loading = true;
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
  background-color: #1c1d20;
}

#wrapper {
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
