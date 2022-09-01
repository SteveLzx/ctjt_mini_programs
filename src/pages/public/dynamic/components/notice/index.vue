<template>
  <view class="c_notice">
    <view v-for="(item, key) in data" :key="key">
      <view class="notice_box">
        <image class="notice_icon" :src="noticeIcon" alt=""/>
        <view>{{item.nickname}} 刚刚中奖获得 {{item.prizeName}}</view>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Notice extends Vue {
  @Prop({ default: [] }) data!: Array<any>

  noticeIcon = require('../../../../../assets/svg/ldx_banner_icon_laba.svg');
}

</script>
<style lang="less" scoped>
  .c_notice{
    position: relative;
    width: 100%;
    height: 40rpx;
    overflow: hidden;
    .notice_box{
      background: rgba(133, 21, 50, 0.65);
      height: 40rpx;
      border-radius: 20rpx;
      display: flex;
      align-items: center;
      padding: 0rpx 24rpx 0rpx 24rpx;
      color: #FFFFFF;
      font-size: 24rpx;
      position: absolute;
      animation: noticemove 5s linear infinite;
      .notice_icon{
        width: 25rpx;
        height: 25rpx;
        margin-right: 12rpx;
      }
    }
  }
  @keyframes noticemove {
    from {
      transform: translateX(130%);
    }
    to {
      transform: translateX(-130%);
    }
  }
</style>
