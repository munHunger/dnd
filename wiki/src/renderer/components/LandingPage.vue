<template>
  <div id="wrapper">
    <main>
      <post file-name="mary.md"></post>
    </main>
  </div>
</template>

<script>
import Post from "./post/Post";

export default {
  name: "landing-page",
  components: { Post },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}

#wrapper {
  background-color: #494a4b;
  color: aliceblue;
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
