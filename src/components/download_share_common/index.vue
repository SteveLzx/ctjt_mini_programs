<template>
  <view class="dsc_wrap">
    <button class="btns download_btn" @click="$emit('down')">
      <text class="iconfont">&#xe69a;</text>
      <label>下载</label>
    </button>
    <button
      class="btns share_btn"
      :data-type="type"
      :data-detail="detail"
       @click="$emit('coachShare', {detail, type})"
    >
      <text class="iconfont">&#xe696;</text><label>分享</label>
    </button>
  </view>
</template>

<script lang="ts">
import {
  Component, Vue, Prop
} from 'vue-property-decorator';

@Component
export default class DownloadShareCommon extends Vue {
  @Prop() type: number; // 分享类型，用在回调时配置分享的路径等;

  @Prop() detail: any;
}
</script>

<style lang="less" scoped>
.dsc_wrap {
  display: flex;
  // align-items: center;
  // justify-content: center;
  padding: 16rpx 0rpx 32rpx 0rpx;
  .btns {
    height: 88rpx;
    width: 330rpx;
    line-height: 88rpx;
    border-radius: 49rpx;
    font-size: 32rpx;
    color: @ctjt-color-text-main;
    .iconfont {
      margin-right: 16rpx;
      font-size: 36rpx;
    }
  }
  .download_btn {
    border: 2rpx solid @ctjt-color-text-main;
    margin-right: 30rpx;
  }
  .share_btn {
    background: @ctjt-color-primary;
  }
}
</style>
