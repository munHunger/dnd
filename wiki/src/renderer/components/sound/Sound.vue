<template>
  <main>
    <div class="track">
      <div id="waveform"></div>
      <div class="timeline" v-for="(track, index) of timeline" :key="index">
        <span
          class="light"
          v-for="(light, index) of track.frames"
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
const Hue = require("philips-hue");
const { DeviceDiscovery } = require("sonos");

export default {
  props: ["src"],
  data() {
    return { timeline: {}, duration: 10000 };
  },
  methods: {
    rgbToHsl(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;
      var max = Math.max(r, g, b);
      var min = Math.min(r, g, b);
      var h;
      var s;
      var l = (max + min) / 2;

      if (max == min) {
        h = s = 0; // achromatic
      } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }

      return [h, s, l];
    }
  },
  mounted() {
    DeviceDiscovery().once("DeviceAvailable", device => {
      console.log("found device " + device);
      device.play(
        "http://ia801402.us.archive.org/20/items/TenD2005-07-16.flac16/TenD2005-07-16t10Wonderboy.mp3"
      );
    });

    var hue = new Hue();
    var configFile = process.env.HOME + "/.philips-hue.json";
    if (!fs.existsSync(configFile))
      hue.login(configFile).catch(function(err) {
        console.error(err.stack || err);
      });
    else {
      let hueConfig = JSON.parse(fs.readFileSync(configFile));
      hue.bridge = hueConfig.bridge;
      hue.username = hueConfig.username;
    }
    this.$nextTick(() => {
      fs.readFile("src/renderer/assets/sound/" + this.src, (err, data) => {
        if (err) throw err;
        data = JSON.parse(data);
        var wavesurfer = WaveSurfer.create({
          container: "#waveform",
          waveColor: "#2dba8a",
          progressColor: "#5dd9c1",
          cursorWidth: 0
        });
        wavesurfer.load("src/renderer/assets/sound/" + data.sound);
        this.timeline = data.timeline;
        wavesurfer.on("ready", () => {
          wavesurfer.play();
          this.duration = wavesurfer.getDuration() * 1000;
          console.log("starting play " + this.duration);
        });
        wavesurfer.on("finish", () => {
          this.$emit("done", this.src);
        });
        wavesurfer.on("audioprocess", () => {
          let currentTime = wavesurfer.getCurrentTime() * 1000;
          this.timeline.forEach(track => {
            let frame = track.frames.filter(
              frame => frame.time > currentTime
            )[0];
            if (track.repeat) {
              let max = Math.max.apply(
                null,
                track.frames.map(frame => frame.time)
              );
              frame = track.frames.sort(
                (a, b) =>
                  Math.abs(a.time - (currentTime % max)) -
                  Math.abs(b.time - (currentTime % max))
              )[0];
            }
            if (frame && !frame.done) {
              track.frames.forEach(frame => (frame.done = false));
              frame.done = true;
              let hsl = this.rgbToHsl(
                frame.color[0],
                frame.color[1],
                frame.color[2]
              );
              hue.light(track.light).setState({
                on: true,
                hue: Math.floor(hsl[0] * 65535),
                sat: Math.floor(hsl[1] * 254),
                bri: Math.floor(frame.color[3] * 254),
                transitiontime: Math.floor(frame.transition / 100)
              });
            }
          });
        });
      });
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
  height: 15px;
}
</style>