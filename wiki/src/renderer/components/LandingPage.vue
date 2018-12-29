<template>
  <div id="wrapper">
    <main>
      <post :file-name="post" v-if="post"></post>
      <search v-on:selected="select" v-if="search"></search>
    </main>
  </div>
</template>

<script>
import Post from "./post/Post";
import Search from "./search/Search";
export default {
  data() {
    return { post: undefined, search: true };
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
  mounted() {
    window.addEventListener(
      "keypress",
      function(e) {
        if (String.fromCharCode(e.keyCode) === " ") {
          this.search = true;
        }
      }.bind(this)
    );
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
