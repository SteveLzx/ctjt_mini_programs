<template>
  <view class="view_top" :style="{backgroundImage: `url(${bgTop})`}">
    <!-- <image :src="bgTop" class="bg_img"></image> -->
    <view style="height: 484rpx"></view>
    <view class="form_box" v-if="!success">
      <view class="tit">为了保障客服能及时帮您完成报名流程，请留下您的联系方式。</view>
      <input class="form" type="text" maxlength="10" placeholder="姓名" v-model="name">
      <input class="form" type="tel" maxlength="11" placeholder="手机号" v-model="mobileNo">
      <input class="form" type="tel" maxlength="18" placeholder="身份证" v-model="cardNo">
      <view class="btn" @click="submit">确认</view>
    </view>
    <view class="form_success" v-if="success">
      <view class="tit">客服已经收到您的报名意向，我们会尽快联系您，请留意接听。</view>
      <view class="btn" @click="goBack">确认</view>
    </view>
    <!-- <img :src="bannerImg" alt="" class="banner" @click="toNext"> -->
    <img :src="inviteBanner" alt="" class="banner">
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getGlobalData } from '@/assets/js/global_data';
import { mobileReg } from '@/assets/js/verification_rules';

@Component
export default class Exercises extends Vue {
  bgTop = 'https://file.aicar365.com/mini-program/common/shengang_liuzi_img_bg.png';

  bannerImg = 'https://file.aicar365.com/mini-program/common/huodongjiemian_banner.png';

  inviteBanner = 'https://file.aicar365.com/mini-program/common/invite_banner.png';

  name = '';

  mobileNo = '';

  cardNo = '';

  success = false;

  onShow() {
    uni.hideHomeButton();
  }

  onLoad(options: any) {
    this.bgTop = `https://file.aicar365.com/mini-program/${options.sId}/fbg.png`;
    this.bannerImg = `https://file.aicar365.com/mini-program/${options.sId}/banner.png`;
  }

  submit() {
    if (!this.mobileNo || !mobileReg.test(this.mobileNo)) {
      uni.showToast({
        title: '请填写正确手机号',
        icon: 'none'
      });
      return;
    }
    this.addActivityLogs();
  }

  async addActivityLogs() {
    const userInfo = uni.getStorageSync('wechatUserInfo') || {};
    const data = {
      activitiyId: 10001,
      recommendedId: getGlobalData('inviterId_ldx') || '',
      types: 3,
      wechatOpenId: getGlobalData('openId') || '',
      mobileNo: this.mobileNo,
      trueName: this.name,
      idNo: this.cardNo,
      wechatLogoUrl: userInfo.avatarUrl || '',
      wechatNickname: userInfo.nickName || '',
      mchId: getGlobalData('sId_ldx')
    };
    await this.$http.post('sale/v1/recommend/addActivityLogs', data);
    this.success = true;
  }

  toNext() {
    uni.navigateTo({
      url: `/pages/personal/invite/index?sId=${getGlobalData('sId_ldx')}&recommendedId=${getGlobalData('inviterId_ldx')}`
    });
  }

  goBack() {
    uni.navigateBack({
      delta: 1
    });
  }
}
</script>

<style lang="less" scoped>
.view_top{
  position: relative;
  background-color: #fdeac3;
  background-repeat: no-repeat;
  background-size: 100% auto;
  padding: 0 24rpx;
  min-height: 100%;
  .bg_img{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }
  .form_box{
    background-color: rgba(255, 255, 255, .7);
    border-radius: 16rpx;
    padding: 40rpx 30rpx 70rpx;
    margin: 0 0 48rpx;
    .tit{
      color: #000;
      font-size: 32rpx;
      line-height: 48rpx;
      margin-bottom: 40rpx;
    }
    .form{
      background: #fff;
      border-radius: 16rpx;
      height: 88rpx;
      padding: 0 24rpx;
      font-size: 32rpx;
      border: 2rpx solid rgba(229, 229, 229, 1);
      margin-bottom: 32rpx;
    }
    .btn{
      line-height: 83rpx;
      background: #D40620;
      border-radius: 16rpx;
      text-align: center;
      color: #fff;
      font-size: 32rpx;
    }
  }
  .form_success{
    background-color: rgba(255, 255, 255, .7);
    border-radius: 16rpx;
    padding: 140rpx 30rpx 96rpx;
    left: 0;
    right: 0;
    top: 484rpx;
    margin: 0 0 48rpx;
    .tit{
      color: #000;
      font-size: 32rpx;
      line-height: 48rpx;
      margin-bottom: 99rpx;
    }
    .btn{
      line-height: 83rpx;
      background: #D40620;
      border-radius: 16rpx;
      text-align: center;
      color: #fff;
      font-size: 32rpx;
    }
  }
}
.banner{
  height: 326rpx;
  width: 100%;
  margin-bottom: 20rpx;
}
</style>
