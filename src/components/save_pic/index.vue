<template>
  <view class="poster_section">
    <view class="msk"></view>
    <view class="container">
      <span class="close iconfont" @click="close">&#xe634;</span>
      <image :src="canvasPath" class="poster_img" mode="widthFix" show-menu-by-longpress></image>
    </view>
    <button class="opt_btn" @click="savePosterToAlbum">保存</button>
  </view>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Emit
} from 'vue-property-decorator';
import {
  savePosterToAlbum
} from '@/assets/js/common';

@Component
export default class SavePic extends Vue {
  @Prop({
    default: ''
  }) canvasPath!: string;

  @Emit('close')
  close() {
    return false;
  }

  created() {
    uni.hideTabBar();
  }

  savePosterToAlbum() {
    savePosterToAlbum(this.canvasPath);
  }

  unmounted() {
    uni.showTabBar();
  }
}

</script>

<style lang="less" scoped>
.poster_section {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 10;
  .msk {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.75);
  }
  .container {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(0, -54%);
    width: 82%;
    margin: 0 9%;
    overflow: hidden;
    .poster_img {
      width: 100%;
      height: 100%;
    }
    .close {
      font-size: 32rpx;
      position: absolute;
      top: 16rpx;
      right: 16rpx;
      color: #FBD8AF;
    }
  }
  .opt_btn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 98rpx;
    padding: 0;
    background-image: linear-gradient(to right, @ctjt-color-btn-bgl, @ctjt-color-btn-bgr);
    background-color: #FFFFFF;
    border-radius: 0;
    color: #fff;
    font-size: 32rpx;
  }
}
</style>
