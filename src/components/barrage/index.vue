<template>
  <view style="background: #fff;overflow: hidden;height: 38rpx;">
    <view class="barrage" :class="{'active': active}">
      <view style="margin-bottom: 1px;">
        <image :src="current.headimgurl" alt="" class="user_header"></image>
        <span class="user_name">{{current.nickname}}</span>
        刚刚报名成功
      </view>
      <view>
        <image :src="nextCurrent.headimgurl" alt="" class="user_header"></image>
        <span class="user_name">{{nextCurrent.nickname}}</span>
        刚刚报名成功
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import dataList from './index';

type ObjType = {
  [key: string]: any;
}

let timeout = 0;
let interval = 0;

@Component
export default class Index extends Vue {
  @Prop({
    default: 4000
  }) timeout!: number;

  current = {};

  nextCurrent: ObjType = {};

  active = false;

  created() {
    const currentIndex = Math.floor(Math.random() * (dataList.length));
    this.current = dataList[currentIndex];
    interval = setInterval(() => {
      this.getNextCurrent();
      this.active = true;
    }, this.timeout);
  }

  getNextCurrent() {
    const index = Math.floor(Math.random() * (dataList.length));
    this.nextCurrent = dataList[index];
    timeout = setTimeout(() => {
      this.current = this.nextCurrent;
      this.active = false;
    }, 1000);
  }

  onMounted() {
    clearInterval(interval);
    clearTimeout(timeout);
  }
}
</script>
<style lang="less" scoped>
.barrage{
  background: #fff;
  color: @ctjt-color-text-secondary-two;
  font-size: 26rpx;
  line-height: 38rpx;
  &.active{
    transition: all 0.5s;
    transform: translate(0, -40rpx);
  }
  .user_header{
    width: 38rpx;
    height: 38rpx;
    margin-right: 16rpx;
    float: left;
    border-radius: 50%;
  }
  .user_name{
    margin-right: 10rpx;
    color: @ctjt-color-text-secondary-one;
  }
}
</style>
