<template>
  <view class="content">
    <view class="title_section">
      <text class="iconfont">&#xe6b1;</text>
      <view class="tit">学车信息填报成功</view>
    </view>
    <view class="list_section">
      <view class="item_box">
        <view class="label">身份证号码</view>
        <view class="info">{{studentMsg.idNo}}</view>
      </view>
      <view class="item_box">
        <view class="label">姓名</view>
        <view class="info">{{studentMsg.name}}</view>
      </view>
      <view class="item_box">
        <view class="label">身份证地址</view>
        <view class="info" style="flex:1;margin-left:70rpx;text-align:right;word-break: break-all;">{{studentMsg.certificateAddress}}</view>
      </view>
      <view class="item_box">
        <view class="label">培训车型</view>
        <view class="info">{{carModel}}</view>
      </view>
      <view class="item_box">
        <view class="label">学车类型</view>
        <view class="info">{{learnType[studentMsg.learnType - 1]}}</view>
      </view>
      <view class="item_box" v-if="studentMsg.trainStage > 0">
        <view class="label">培训阶段</view>
        <view class="info">{{trainStage[studentMsg.trainStage - 1]}}</view>
      </view>
      <view class="item_box" v-if="studentMsg.driveType > 0">
        <view class="label">原驾驶证类型</view>
        <view class="info">{{driveType[studentMsg.driveType - 1]}}</view>
      </view>
      <view class="item_box" v-if="studentMsg.driveEndDate">
        <view class="label">原证件有效期</view>
        <view class="info">{{studentMsg.driveEndDate}}</view>
      </view>
      <view class="item_box">
        <view class="label">手机号码</view>
        <view class="info">{{studentMsg.mobile}}</view>
      </view>
    </view>
    <view class="tips_section">
      <view class="tit">温馨提示</view>
      <view class="info">为不影响您的学车进度，请在信息填报后尽快前往附近的服务门店完成录指纹、人脸采集和体检等事项。</view>
      <view class="link" @click="toIndex">查看服务门店</view>
    </view>
  </view>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { getGlobalData } from '@/assets/js/global_data';
import { driveTypeFilter } from '@/assets/js/enums';
import { addCarModelText } from '@/assets/js/common';

let flag = true;

@Component
export default class SignUpFormSuccess extends Vue {
  learnType = ['初学', '增驾', '本地转入', '异地转入'];

  trainStage = ['已科目一未科目二', ' 已科目二未科目三', '已科目三未科目二', '已科目三未文明'];

  driveType = driveTypeFilter;

  studentMsg = {};

  carModel = addCarModelText(getGlobalData('carModel'));

  created() {
    this.studentMsg = getGlobalData('studentCarMsg');
  }

  toIndex() {
    flag = false; // 避免销毁时回退两级退出小程序
    uni.reLaunch({
      url: `/pages/public/home/index?schoolId=${uni.getStorageSync('schoolId')}&toShop=1`
    });
  }

  onUnload() {
    if (flag) {
      // uni.navigateBack({
      //   delta: 2
      // });
      uni.reLaunch({
        url: '/pages/personal/my/index'
      });
    }
  }
}
</script>
<style lang="less">
page {
  background-color: #fff;
}
.title_section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 59rpx 0 32rpx 0;
  .iconfont {
    font-size: 56rpx;
    color: @ctjt-color-primary;
  }
  .tit {
    margin-top: 24rpx;
    font-size: 42rpx;
    color: @ctjt-color-text-main;
    font-weight: 500;
  }
}
.list_section {
  padding: 0 56rpx;
  .item_box {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 29rpx 0 31rpx 0;
    border-bottom: 1rpx solid @ctjt-color-border-two;
    .label {
      font-size: 28rpx;
      color: @ctjt-color-text-primary;
    }
    .info {
      font-size: 28rpx;
      color: @ctjt-color-text-secondary-two;
    }
  }
}
.tips_section {
  padding: 40rpx 75rpx;
  text-align: center;
  .tit, .info, .link {
    font-size: 28rpx;
    color: @ctjt-color-text-secondary-two;
  }
  .info {
    font-size: 24rpx;
    margin-top: 8rpx;
    line-height: 36rpx;
  }
  .link {
    font-size: 24rpx;
    color: @ctjt-color-primary-70;
    text-decoration: underline;
  }
}
</style>
