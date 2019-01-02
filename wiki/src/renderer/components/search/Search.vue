<template>
  <main>
    <div class="overlay"></div>
    <div class="content">
      <div class="search" v-cloak>
        >
        <input
          ref="search"
          type="text"
          autofocus
          v-on:input="update"
          v-on:keyup.down="down"
          v-on:keyup.up="up"
          v-on:keyup.enter="select"
        >
      </div>
      <div class="results">
        <div class="entry" v-for="(entry, i) of search" :key="entry.file">
          <div class="column" :class="i === index ? 'active' : ''">
            <span class="name">{{entry.name}}</span>
            <span class="file">{{entry.file.substring(entry.file.indexOf("assets"))}}</span>
          </div>
          <div class="column">
            <span class="tag">{{entry.tags.slice(0,4)}}</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
const { search } = require("@/service/searcher");
export default {
  data() {
    return { search: [], index: 0 };
  },
  mounted() {
    this.$refs.search.focus();
  },
  methods: {
    update({ type, target }) {
      this.index = 0;
      console.log(search);
      this.search = search(target.value)
        .filter(entry => entry.similarity > 0)
        .slice(0, 8);
    },
    up() {
      this.index--;
    },
    down() {
      this.index++;
    },
    select() {
      this.$emit("selected", this.search[this.index].file);
    }
  }
};
</script>

<style scoped>
.overlay {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0px;
  top: 0px;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 100;
}

.content {
  z-index: 101;
  position: absolute;
  left: 50%;
  width: 800px;
  top: 300px;
  transform: translateX(-50%);
}

.search {
  padding: 5px;
  border-bottom: 3px solid #2dba8a;
  color: #2dba8a;
  font-size: 30px;
  font-weight: 600;
}

.search input {
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 30px;
  font-weight: 600;
  width: 90%;
  color: #2dba8a;
}

.results {
  margin-top: 10px;
}
.entry {
  margin-bottom: 15px;
}
.entry:after {
  content: "";
  display: table;
  clear: both;
}
.column {
  width: 50%;
  display: inline-block;
  float: left;
}
.name {
  font-size: 20px;
  color: #fbfffe;
  display: block;
}

.active .name {
  color: #2dba8a;
  font-weight: 600;
}

.file {
  font-style: italic;
  color: #ec9ded;
}

.tag {
  color: #fcfc62;
  text-align: right;
  font-weight: 700;
}
</style>