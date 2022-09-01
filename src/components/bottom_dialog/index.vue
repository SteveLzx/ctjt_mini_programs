<template>
  <view class="shade bdialog_wrap" v-if="isShow">
    <view class="content">
      <image
        class="close_icon"
        :src="closeIcon()"
        @click="$emit('close')"
      ></image>
      <!-- <text class="iconfont close_icon" @click="$emit('close')">&#xe6ab;</text> -->
      <view class="header">{{ title }}</view>
      <view class="main_content">
        <slot name="main"></slot>
      </view>
      <view class="foot_content">
        <slot name="foot"></slot>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import {
  Component, Vue, Emit, Prop
} from 'vue-property-decorator';

@Component
export default class CtjtBottomDialog extends Vue {
  @Prop({ default: true }) isShow: boolean;

  @Prop({ default: '' }) title: string;

  closeIcon = () => 'https://file.aicar365.com/mini-program/common/icon/close.png';
}
</script>

<style lang="less" scoped>
.shade {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 5;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  .content {
    background-color: @ctjt-color-text-white;
    border-radius: 48rpx 48rpx 0 0;
    width: 100%;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    animation-name: slidein; /*动画名称*/
    -webkit-animation-name: slidein;
    -ms-animation-name: slidein;
    -o-animation-name: slidein;
    animation-duration: 0.2s; /*动画所花费的时间*/
    -webkit-animation-duration: 0.2s;
    -ms-animation-duration: 0.2s;
    -o-animation-duration: 0.2s;
    height: 97%;
    // padding-bottom: calc(
    //   60rpx + constant(safe-area-inset-bottom)
    // ); /*兼容 IOS<11.2*/
    // padding-bottom: calc(
    //   60rpx + env(safe-area-inset-bottom)
    // ); /*兼容 IOS>11.2*/ // 底部空隙
    .close_icon {
      // font-size: 48rpx;
      width: 24rpx;
      height: 24rpx;
      color: @ctjt-color-text-secondary-two;
      padding: 16rpx 30rpx 30rpx;
      position: absolute;
      top: 33rpx;
      right: 15rpx;
    }
    .header {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 36rpx;
      line-height: 36rpx;
      color: @ctjt-color-text-main;
      padding: 44rpx 0 48rpx 0;
    }
    .main_content {
      // max-height: 75%;
      max-height: 80%;
      overflow: scroll;
    }
    .foot_content {
      background-color: @ctjt-color-text-white;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
}
</style>
