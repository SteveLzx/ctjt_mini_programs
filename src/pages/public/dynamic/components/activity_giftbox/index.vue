<template>
  <view :class="['c_activity_giftbox', { 'no_price': !isShowPrice } ]">
    <view class="price" v-show="isShowPrice">{{price}}</view>
    <view :class="['time', { 'no_price_time': type === 5 && !isShowPrice }]" v-if="timer">活动即将在 {{timeName}} 后结束</view>
    <view class="info" v-show="isShowPrice">
      <text class="symbol">￥</text>
      <text class="nums">{{price}}</text>
    </view>
  </view>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import { resCountDown } from '@/assets/js/common';

@Component
export default class ActivityGiftbox extends Vue {
  @Prop({ default: 0 }) price!: number

  @Prop({ default: '' }) time!: string

  @Prop({ default: 5 }) type!: number

  @Prop({ default: true }) isShowPrice!: boolean

  timeName = '';

  timer = null

  @Watch('time')
  handleWatchTime(newVal: string) {
    // 存在并且大于当前时间
    clearInterval(this.timer);
    if (newVal && new Date().getTime() < new Date((`${newVal} 23:59:59`).replace(/-/g, '/')).getTime()) {
      const target = new Date((`${newVal} 23:59:59`).replace(/-/g, '/')).getTime();
      const now = new Date().getTime();
      let sub = target - now;
      this.timer = setInterval(() => {
        if (sub <= 0) {
          clearInterval(this.timer);
          this.timer = null;
        }
        this.timeName = resCountDown(sub);
        sub -= 1000;
      }, 1000);
    }
  }
}
</script>
<style lang="less" scoped>
  .c_activity_giftbox {
    position: relative;
    height: 920rpx;
    border-radius: 24rpx;
    overflow: hidden;
    background: url('https://file.aicar365.com/mini-program/common/cctivity_dynamics_bg2.jpg') no-repeat;
    background-size: 100% auto;
    &.no_price {
      background: url('https://file.aicar365.com/mini-program/common/cctivity_dynamics_bg2_noprice.png') no-repeat;
      background-size: 100% auto;
    }
    .price {
      position: absolute;
      width: 116rpx;
      right: 82rpx;
      top: 110rpx;
      font-size: 66rpx;
      line-height: 66rpx;
      text-align: center;
      font-weight: 500;
      color: #fef97c;
      background: -webkit-linear-gradient(-90deg, #fff, #fef97c);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .time {
      width: 100%;
      position: absolute;
      top: 194rpx;
      text-align: center;
      font-size: 32rpx;
      line-height: 32rpx;
      color: @ctjt-color-text-white;
      &.no_price_time {
        top: 284rpx;
      }
    }
    .info {
      width: 100%;
      position: absolute;
      top: 430rpx;
      text-align: center;
      font-weight: bold;
      color:#fb1a36;
      .nums {
        font-size: 125rpx;
        line-height: 125rpx;
        background: -webkit-linear-gradient(90deg, #e30421, #fb1a36);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: -2rpx;
      }
      .symbol {
        font-size: 32rpx;
        line-height: 32rpx;
      }
    }
  }
</style>
