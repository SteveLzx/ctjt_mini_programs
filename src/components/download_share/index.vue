<template>
  <view class="ds_wrap">
    <view :style="{ height: `${height}rpx` }" @click="$emit('down')"> <text class="iconfont">&#xe69a;</text>下载</view>
    <button :style="{ height: `${height}rpx` }" open-type='share' :data-type="type" :data-source="source" :data-detail="detail" v-if="!isCoach"> <text class="iconfont">&#xe696;</text>分享 </button>
    <button :style="{ height: `${height}rpx` }"  @click="$emit('coachShare', {detail, type, source})" v-else> <text class="iconfont">&#xe696;</text>分享 </button>
  </view>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class DownloadShare extends Vue {
  @Prop() type: number; // 分享类型，用在回调时配置分享的路径等;

  @Prop() source: string; // 组件使用场景;

  @Prop({ default: false }) isCoach: boolean; // 是否为教练端;

  @Prop() detail: any;

  @Prop({ default: 76 }) height!: number;

  showDownloadPoster = false;
}
</script>

<style lang="less" scoped>
.ds_wrap {
  display: flex;
  border-top: solid 1rpx @ctjt-color-border-two;
  background-color: #fff;
  view, button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 76rpx;
    color: @ctjt-color-text-secondary-two;
    font-size: 26rpx;
    &:first-child {
      border-right: solid 1rpx @ctjt-color-border-two;
    }
    .iconfont {
      font-size: 36rpx;
      color: @ctjt-color-text-secondary-one;
      margin-right: 16rpx;
    }
  }
}
</style>
