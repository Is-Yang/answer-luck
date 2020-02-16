<template>
  <div id="app">
    <router-view v-if="isView"/>

    <van-icon v-if="isPlay" name="music" class="play-music" 
      @click="playMusic"/>
    <van-icon v-if="!isPlay" name="music" class="play-music stop"  
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
      musicSrc: require('./assets/audio/piano.mp3'),
      isPlay: true, // 是否播放
      isView: true,
      domAudio: null,
      flag: false, // 是否已经播放
    }
  },
  mounted() {
    const music = document.getElementById('musicPiano');
    document.addEventListener('DOMContentLoaded', () => {
      this.domAudio = music;
    })

    document.addEventListener("WeixinJSBridgeReady", function () {
        music.play();
    });
    
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
    font-size: 3.5rem;
    z-index: 9;
    color: #962e21;
    border-radius: 50%;
    animation: rotateAn 2.5s linear;
    animation-iteration-count: infinite;

    &::after {
        content: "";
        position: absolute;
        top: 0.6rem;
        left: 0.8rem;
        z-index: -1;
        width: 1.8rem;
        height: 2.2rem;
        background-color: #fff;
    }

    &.stop {
      animation-iteration-count: 0;
    }
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
