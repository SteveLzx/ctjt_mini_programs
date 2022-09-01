<template>
  <view class="content">
    <view class="msk"></view>
    <view class="container">
      <view class="title_section">
        <span class="label" style="margin-right: 8rpx"></span>
        <image class="icon" :src="svglingxing"></image>
        <text class="tit">分享到</text>
        <image class="icon" :src="svglingxing"></image>
        <span class="label" style="margin-left: 8rpx"></span>
      </view>
      <view class="opts_section">
        <button class="img_box" @click="_weixin" open-type="share">
          <image class="img" :src="svgweixin"></image>
          <text class="text">微信好友</text>
        </button>
        <button class="img_box" @click="_poster">
          <image class="img" :src="svgshengchenghaibao"></image>
          <text class="text">生成海报</text>
        </button>
      </view>
      <view class="btns_section">
        <button class="btn" @click="_cancel">取消</button>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import {
  Vue, Component, Prop, Emit
} from 'vue-property-decorator';
import { SVGWEIXIN, SVGSHENGCHENGHAIBAO } from '@/assets/svg/index';

@Component
export default class CtjtShare extends Vue {
  @Prop({ required: true }) show!: boolean;

  private svgweixin = SVGWEIXIN;

  private svgshengchenghaibao = SVGSHENGCHENGHAIBAO;

  private svglingxing = 'https://file.aicar365.com/mini-program/common/lingxing.png'; // svg 显示不出来

  @Emit('cancel')
  _cancel() {
    console.log('取消');
  }

  @Emit('weixinCallback')
  _weixin() {
    console.log('微信');
  }

  @Emit('posterCallback')
  _poster() {
    console.log('海报');
  }
}
</script>

<style lang="less" scoped>
.content {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
}
.msk {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 3;
}
.container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 4;
  background-color: #fff;
  border-radius: 8rpx 8rpx 0 0;
  .title_section {
    padding: 32rpx 0 40rpx 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .label {
      width: 68rpx;
      height: 1rpx;
      background-color: @ctjt-color-border-one;
    }
    .icon {
      width: 18rpx;
      height: 16rpx;
    }
    .tit {
      margin: 0 16rpx;
      font-size: 36rpx;
      color: @ctjt-color-text-main;
    }
  }
  .opts_section {
    padding-bottom: 40rpx;
    display: flex;
    align-items: center;
    .img_box {
      background-color: #fff;
      padding: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .img {
        width: 110rpx;
        height: 110rpx;
      }
      .text {
        margin-top: 16rpx;
        font-size: 24rpx;
        color: @ctjt-color-text-secondary-one;
      }
    }
  }
  .btns_section {
    width: 100%;
    .btn {
      width: 100%;
      height: 98rpx;
      background-color: #fff;
      font-size: 32rpx;
      color: @ctjt-color-text-secondary-one;
      text-align: center;
      line-height: 98rpx;
      border: 0;
      border-top: 1rpx solid @ctjt-color-border-two;
    }
  }
}
</style>
