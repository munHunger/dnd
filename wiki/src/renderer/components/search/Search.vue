<template>
  <main>
    <div class="overlay"></div>
    <div class="content">
      <div class="search">
        <input type="text" autofocus>
        <span class="search"></span>
      </div>
      <div class="results">
        <div class="entry">
          <div class="column">
            <span class="name">Mary</span>
            <span class="file">/post/npc/mary.md</span>
          </div>
          <div class="column">
            <span class="tag">[#npc,#trader]</span>
          </div>
        </div>
        <div class="entry active">
          <div class="column">
            <span class="name">Albert Berg</span>
            <span class="file">/post/npc/albertBerg.md</span>
          </div>
          <div class="column">
            <span class="tag">[#npc,#trader]</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
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
}

.search input {
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 30px;
  font-weight: 600;
  width: 100%;
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