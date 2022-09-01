<template>
  <view style="height: 100%">
    <view class="asn_wrap">
      <view class="top_wrap">
        <view class="title">关注服务号</view>
        <image :src="orCodeUrl" class="img_wrap" show-menu-by-longpress></image>
        <view class="foot_title">长按识别或保存二维码图片</view>
      </view>
      <view class="bottom_wrap"></view>
    </view>
  </view>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { schoolId as sId } from '@/config/build_path';

@Component
export default class AttentionServicesNumber extends Vue {
  private orCodeUrl = '';

  onShow() {
    const schoolId = uni.getStorageSync('schoolId') || sId;
    this.orCodeUrl = `https://file.aicar365.com/mini-program/${schoolId}/services_number.jpg`;
  }
}
</script>
<style lang="less" scoped>
.asn_wrap {
  background: linear-gradient(top left, #fffae6, #fff5cb);
  background: -webkit-linear-gradient(top left, #fffae6, #fff5cb);
  padding: 57rpx 30rpx 201rpx 30rpx;
  .top_wrap {
    margin-bottom: 96rpx;
    background: url('https://file.aicar365.com/mini-program/common/wode_img_erweimabg.png')
      no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 102rpx 0 112rpx 0;
    text-align: center;
    .title {
      font-size: 48rpx;
      line-height: 1;
      letter-spacing: 2rpx;
      color: @ctjt-color-text-main;
      margin-bottom: 38rpx;
    }
    .foot_title {
      font-size: 26rpx;
      line-height: 27rpx;
      letter-spacing: 2rpx;
      color: @ctjt-color-text-secondary-one;
      margin-top: 16rpx;
    }
    .img_wrap {
      width: 300rpx;
      height: 300rpx;
      vertical-align: bottom;
    }
  }
  .bottom_wrap {
    height: 503rpx;
    background: url('https://file.aicar365.com/mini-program/common/wode_img_guanzhuliucheng.png')
      no-repeat;
    background-size: 100% 100%;
  }
}
</style>
