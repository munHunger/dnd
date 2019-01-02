<template>
  <main>
    <span :class="input.class">
      <markdown
        v-if="Array.isArray(input.value) && input.class !== 'tag'"
        v-for="(child, index) in input.value"
        :key="index"
        :input="child"
      ></markdown>
      <span
        v-if="input.class === 'tag'"
      >{{input.value.slice(3,-1).reduce((acc, val) => acc += val.value, "")}}</span>
      <span v-if="!Array.isArray(input.value) && input.class === 'text'">{{input.value}}</span>
    </span>
  </main>
</template>

<script>
export default {
  props: ["input"],
  name: "markdown"
};
</script>

<style scoped>
main {
  display: inline;
}
.heading {
  color: #2dba8a;
  font-weight: 900;
  font-size: 40px;
}
.tag {
  color: #5dd9c1;
}
.italic {
  font-style: italic;
  color: #e63462;
}
.bold {
  font-weight: 900;
  color: #fe5f55;
}
</style>