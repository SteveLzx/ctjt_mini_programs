<template>
  <view class="box">
    <view class="prize" :style="{opacity: currentIndex === 1 ? 1 : 0.5}"></view>
    <view class="prize" :style="{opacity: currentIndex === 2 ? 1 : 0.5}"></view>
    <view class="prize" :style="{opacity: currentIndex === 3 ? 1 : 0.5}"></view>
    <view class="prize" :style="{opacity: currentIndex === 8 ? 1 : 0.5}"></view>
    <view class="prize bengin" @click="active"></view>
    <view class="prize" :style="{opacity: currentIndex === 4 ? 1 : 0.5}"></view>
    <view class="prize" :style="{opacity: currentIndex === 7 ? 1 : 0.5}"></view>
    <view class="prize" :style="{opacity: currentIndex === 6 ? 1 : 0.5}"></view>
    <view class="prize" :style="{opacity: currentIndex === 5 ? 1 : 0.5}"></view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

let timer = null;
@Component
export default class Exercises extends Vue {
  currentIndex = 0;

  onLoad() {
    uni.hideHomeButton();
    // this.active();
  }

  active() {
    const timerIn = setInterval(this.chooseIndex, 150);
    const timerOut = setTimeout(() => {
      clearInterval(timerIn);
      timer = setInterval(this.chooseIndex, 250);
      clearTimeout(timerOut);
    }, 4800);
  }

  chooseIndex() {
    const index = 2;
    if (this.currentIndex === index) {
      clearInterval(timer);
    }
    this.currentIndex += 1;
    if (this.currentIndex > 8) this.currentIndex = 1;
  }
}
</script>

<style lang="less" scoped>
.box{
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .prize{
    width: 200rpx;
    height: 200rpx;
    background: #999;
    margin: 10rpx;
    opacity: 0.5;
    &.bengin{
      opacity: 1;
    }
  }
}
</style>
