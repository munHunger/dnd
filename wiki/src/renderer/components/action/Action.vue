<template>
  <main>
    <sound v-for="(sound, index) of sounds" :key="index" :src="sound" v-on:done="completeSound"></sound>

    <div class="overlay" v-if="overlay"></div>
    <div class="content" v-if="overlay">
      <div class="search" v-cloak>
        $
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
            <span class="name">{{entry.name ? entry.name : entry}}</span>
          </div>
          <div class="column" v-if="entry.description">
            <span class="description">{{entry.description}}</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Sound from "../sound/Sound";
var stringSimilarity = require("string-similarity");
const fs = require("fs");

export default {
  props: ["overlay"],
  data() {
    return {
      sounds: [],
      search: [],
      index: 0,
      actions: [
        {
          name: "sound",
          description: "add a sound to the track",
          value: fs
            .readdirSync(__dirname + "/../../assets/sound")
            .map(
              item =>
                item +
                "/" +
                fs
                  .readdirSync(__dirname + "/../../assets/sound/" + item)
                  .filter(file => file.endsWith(".json"))[0]
            ),
          onSelect: value => this.sounds.push(value)
        }
      ]
    };
  },
  mounted() {
    this.$watch(
      "overlay",
      overlay => {
        if (overlay) this.$refs.search.focus();
      },
      { immediate: true }
    );
  },
  methods: {
    completeSound(src) {
      this.sounds = this.sounds
        .slice(0, this.sounds.indexOf(src))
        .concat(this.sounds.slice(this.sounds.indexOf(src) + 1));
    },
    update({ type, target }) {
      this.index = 0;
      if (!this.selected)
        this.search =
          this.actions.length > 1
            ? this.actions.sort(
                (a, b) =>
                  stringSimilarity.compareTwoStrings(b.name, target.value) -
                  stringSimilarity.compareTwoStrings(a.name, target.value)
              )
            : this.actions;
      else
        this.search = this.selected.value.sort(
          (a, b) =>
            stringSimilarity.compareTwoStrings(b, target.value) -
            stringSimilarity.compareTwoStrings(a, target.value)
        );
    },
    up() {
      this.index--;
    },
    down() {
      this.index++;
    },
    select() {
      this.$refs.search.value = "";
      if (this.selected) {
        this.selected.onSelect.call(this, this.search[this.index]);
        this.selected = undefined;
        this.search = [];
        this.$emit("selected", true);
      } else {
        this.selected = this.search[this.index];
        this.search = this.selected.value;
      }
      this.index = 0;
    }
  },
  components: { Sound }
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

.description {
  color: #fcfc62;
  text-align: right;
  font-weight: 700;
}
</style>