<template>
  <view class="skeleton_box">
    <view class="bg block1"></view>
    <view style="overflow: hidden">
      <view class="bg block2 b_r"></view>
      <view class="bg block2 b_r"></view>
    </view>
    <view class="bg block3 b_r"></view>
    <view style="background: #fff;margin: 0 24rpx;padding: 24rpx 32rpx 38rpx;">
      <view style="overflow: hidden">
        <view class="block4 b_r bg"></view>
        <view class="block5 b_r bg"></view>
        <view class="block6 b_r bg"></view>
      </view>
      <view class="block7 b_r bg"></view>
      <view class="block7 b_r bg"></view>
      <view style="overflow: hidden">
        <view class="block8 b_r bg"></view>
        <view class="block8 b_r bg"></view>
      </view>
      <view>
        <view class="block9 b_r bg"></view>
        <view class="block10 b_r bg"></view>
        <view class="block11 b_r bg"></view>
        <view style="clear:both"></view>
      </view>
    </view>
    <view class="block12 b_r bg"></view>
  </view>
</template>

<script lang="ts">
export default {

};
</script>

<style lang="less" scoped>
/* eslint-disable */
.skeleton_box{
  background: @ctjt-bgcolor-primary;
}
.block1{
  width: 100%;
  height: 256rpx;
}
.block2{
  width: 146rpx;
  height: 44rpx;
  margin: 28rpx 32rpx 32rpx 32rpx;
  float: left;
}
.block3{
  margin: 0 24rpx;
  height: 300rpx;
}
.block3{
  margin: 0 24rpx;
  height: 300rpx;
}
.block4{
  width: 126rpx;
  height: 54rpx;
  float: left;
}
.block5{
  width: 78rpx;
  height: 36rpx;
  float: left;
  margin-top: 18rpx;
  margin-left: 16rpx;
}
.block6{
  width: 40rpx;
  height: 40rpx;
  float: right;
  margin-top: 15rpx;
}
.block7{
  width: 608rpx;
  height: 40rpx;
  margin-top: 12rpx;
}
.block8{
  width: 130rpx;
  height: 34rpx;
  margin-right: 40rpx;
  float: left;
  margin-top: 28rpx;
}
.block9{
  width: 38rpx;
  height: 38rpx;
  margin-right: 16rpx;
  border-radius: 50%;
  float: left;
  margin-top: 16rpx;
}
.block10{
  margin-top: 16rpx;
  width: 250rpx;
  height: 40rpx;
  float: left;
}
.block11{
  width: 120rpx;
  height: 60rpx;
  margin-top: -20rpx;
  float: right;
}
.block12{
  height: 180rpx;
  margin: 32rpx 24rpx 0;
}
.bg{
  background: @ctjt-color-border-two;
	animation-name: twinkle;
	animation-timing-function: inherit;
	animation-duration: 1.5s;
	animation-iteration-count: infinite;
}
.b_r{
  border-radius: 8rpx;
}

@keyframes twinkle {
	0% {
		background-color: @ctjt-color-border-one;
	}

	50% {
		background-color: @ctjt-color-border-two;
	}

	100% {
		background-color: @ctjt-color-border-one;
	}
}
/* eslint-enable */
</style>
