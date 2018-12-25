<template>
  <main :key="fileName">
    <div class="post">
      <div class="path">{{fileName}}</div>
      <span></span>
      {{data}}
    </div>
    <div class="info">
      <div v-for="item in info" v-bind:key="item.name">
        <div class="field">
          <div class="heading">{{item.name}}</div>
          <div class="data">
            <div v-for="field in item.data" v-bind:key="field" class="field">{{field}}</div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
const { parse } = require("@/service/parser");
const fs = require("fs");
export default {
  props: ["fileName"],
  data() {
    return parse(
      fs
        .readFileSync(__dirname + "/../../assets/" + this.fileName, "utf8")
        .split("\n")
    );
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