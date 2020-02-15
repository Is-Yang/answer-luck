<template>
  <div id="app">
    <router-view v-if="isView"/>

    <van-icon name="music" class="play-music" 
      :style="{animationIterationCount: !isPlay ? 0 : 'infinite'}" 
      @click="playMusic"/>

    <!-- 背景音乐 -->
    <audio autoplay loop id="musicPiano">
      <source :src="musicSrc" type="audio/mpeg">
    </audio>

    <!-- 其他操作音乐 -->
    <audio id="setAudioPlay">
      <source src="" type="audio/mpeg">
    </audio>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      musicSrc: this.$fileUrl + require('./assets/audio/piano.mp3'),
      isPlay: true, // 是否播放
      isView: true,
      domAudio: null
    }
  },
  mounted() {
    document.addEventListener('DOMContentLoaded', () => {
      this.domAudio = document.getElementById('musicPiano');
      // setTimeout(() => {
      //   this.domAudio.play();
      // }, 1000);
    }, false)
  },
  methods: {
    reload () {
      this.isView = false;
      this.$nextTick(() => {
        this.isView = true;
      })
    },
    // 播放跟暂停音乐
    playMusic() {
      if (this.isPlay) {
        this.domAudio.pause();
        this.isPlay = false;
      } else {
        this.domAudio.play();
        this.isPlay = true;
      }
      this.$forceUpdate();
    }
  },
  beforeDestroy() {
    document.removeEventListener("DOMContentLoaded", function () {}, false);
  }
}
</script>

<style lang="scss">
#app {
  .play-music {
    position: fixed;
    top: 1.5rem;
    right: 1.5rem;
    font-size: 3.4rem;
    z-index: 9;
    color: #962e21;
    border-radius: 50%;
    animation: rotateAn 2.5s linear;
  }

  @keyframes rotateAn {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
