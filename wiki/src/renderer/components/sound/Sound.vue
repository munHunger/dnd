<template>
  <main>
    <div class="track">
      <div id="waveform"></div>
      <br>
      <div class="timeline" v-for="(track, index) of timeline" :key="index">
        <span
          class="light"
          v-for="(light, index) of track"
          :key="index"
          :style="{ 'background-color': 'rgba(' + light.color.join(',') + ')', 'left': (light.time/duration)*100 + '%' }"
        ></span>
      </div>
    </div>
  </main>
</template>

<script>
const WaveSurfer = require("wavesurfer.js");
const fs = require("fs");

export default {
  data() {
    return { timeline: {}, duration: 10000 };
  },
  mounted() {
    this.$nextTick(() => {
      fs.readFile(
        "src/renderer/assets/sound/roar/monsterRoar.json",
        (err, data) => {
          if (err) throw err;
          data = JSON.parse(data);
          var wavesurfer = WaveSurfer.create({
            container: "#waveform",
            waveColor: "#2dba8a",
            progressColor: "#5dd9c1"
          });
          wavesurfer.load("src/renderer/assets/sound/" + data.sound);
          this.timeline = data.timeline;
          wavesurfer.on("ready", () => {
            wavesurfer.play();
            this.duration = wavesurfer.getDuration() * 1000;
          });
        }
      );
    });
  }
};
</script>

<style scoped>
.track {
  position: relative;
}
#waveform {
  height: 150px;
  width: 400px;
}
.light {
  position: absolute;
  width: 5px;
  height: 15px;
  display: inline-block;
}
.timeline {
  display: inherit;
  width: 400px;
  height: 50px;
}
</style>