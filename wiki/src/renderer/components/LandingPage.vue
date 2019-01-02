<template>
  <div id="wrapper">
    <main>
      <post :file-name="post" v-if="post"></post>
      <action v-if="!loading && !search" :overlay="action" v-on:selected="action = false"></action>
      <search v-on:selected="select" v-if="search"></search>
      <span class="loading" v-if="loading">loading</span>
    </main>
  </div>
</template>

<script>
import Post from "./post/Post";
import Search from "./search/Search";
import Action from "./action/Action";
import { setTimeout } from "timers";
const { init } = require("@/service/searcher");
export default {
  data() {
    return { post: undefined, search: false, loading: false, action: false };
  },
  name: "landing-page",
  components: { Post, Search, Action },
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
      if (init()) {
        this.loading = false;
        this.search = true;
      }
    }, 1000);
  },
  mounted() {
    window.addEventListener(
      "keypress",
      function(e) {
        if (String.fromCharCode(e.keyCode) === " ") {
          if (!this.action) this.search = true;
        } else if (e.key === "Enter") {
          if (!this.search && !this.loading) this.action = true;
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

.loading {
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% {
    top: 0;
  }
  50% {
    top: 100%;
    opacity: 0;
  }
  51% {
    top: -100%;
  }
  100% {
    top: 0;
    opacity: 1;
  }
}

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
  padding: 60px 80px;
}

main {
  display: flex;
  justify-content: space-between;
}
</style>
