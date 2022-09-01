<template>
  <view style="position: relative">
    <view class="notice">
      <view v-for="(item, key) in userData" :key="key" style="min-width: 80%">
        <view class="notice_box">
          <image class="notice_icon" :src="noticeIcon" alt=""/>
          <view>{{item.nickname}} 邀请了{{item.num}}个好友，
            <text v-if="sId === 16 || sId === 160">获得精美礼品{{item.num}}份</text>
            <text v-else>赚到奖励{{item.num * reward || 0}}.00元</text>
          </view>
        </view>
      </view>
    </view>
    <view class="view_top">
      <image :src="bgTop" class="bg_img"></image>
      <view class="activity_time">活动时间: {{activitiyDate}}</view>
       <button class="invite_btn" open-type="share" v-if="!authFlag">立即邀请{{sId === 16 || sId === 160 ? '' : '赚钱'}}</button>
       <button class="invite_btn" v-else open-type='getPhoneNumber' @getphonenumber='verifyTelAccredit'>立即邀请{{sId === 16 || sId === 160 ? '' : '赚钱'}}</button>
    </view>
    <view class="view_content">
      <view class="tit">邀请1位好友 <text v-if="sId === 16 || sId === 160">可获得精美礼品1份</text><text v-else>赚{{reward}}</text></view>
      <image :src="processImg" class="process" :style="{height: sId === 16 || sId === 160 ? '280rpx' : '324rpx'}"></image>
      <view class="tit">我的邀请详情</view>
      <view class="invite_detail">
        <view class="list">
          <view>
            <view class="num">{{inviteTallys.appySuccessCount || 0}}<text>人</text></view>
            <view class="des">留下联系方式</view>
          </view>
          <view>
            <view class="num">{{inviteTallys.paymentSuccessCount || 0}}<text>人</text></view>
            <view class="des">成功报名</view>
          </view>
          <view>
            <view class="num">{{inviteTallys.reward || 0}}<text>元</text></view>
            <view class="des">获得奖金</view>
          </view>
        </view>
        <button class="reward" @click="toNext" v-if="!authFlag">我的邀请进度</button>
       <button class="reward" v-else open-type='getPhoneNumber' @getphonenumber='verifyTelAccredit'>我的邀请进度</button>
      </view>
      <view class="explain">
        <view>规则说明</view>
        <view>1、<text>活动时间：{{activitiyDate}}，期间不限制邀请人数，多邀请<text v-if="sId === 16 || sId === 160">多得礼品</text><text v-else>多赚钱</text></text></view>
        <view>2、<text>活动期间，推荐好友成功报名，每成功一人获得<text v-if="sId === 16 || sId === 160">精美礼品1份</text><text v-else>{{reward}}元，奖金将在月底转入您提供的个人账户</text></text></view>
        <view>3、<text>活动详情，请拨打客服电话{{mobileNo}}</text></view>
      </view>
    </view>
    <view class="copyright">车态链网络科技有限公司技术支持</view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getGlobalData } from '@/assets/js/global_data';
import {
  verifyTelAccredit,
  loginVerification,
  filterDate,
  filterParams
} from '@/assets/js/common';
import { userData } from './index';

let recommendedId = '';

@Component
export default class Invite extends Vue {
  noticeIcon = require('../../../assets/svg/ldx_banner_icon_laba.svg');

  sId: any = '';

  bgTop = '';

  processImg = '';

  authFlag = true; // 是否展示授权

  userId = '';

  inviteTallys = {}; // 邀请情况

  activitiyDate = ''; // 活动时间

  mobileNo = ''; // 驾校电话

  reward = 200; // 奖励金额

  onLoad(event: any) {
    let options = event;
    if (event.scene) { // 兼容从后端生成的二维码，传递的sId和rId
      options = filterParams(event.scene);
    }
    uni.hideHomeButton();
    this.sId = options.sId ? Number(options.sId) : 0;
    this.bgTop = `https://file.aicar365.com/mini-program/${this.sId}/1${(this.sId === 16 || this.sId === 160) ? '_new' : ''}.png`;
    this.processImg = `https://file.aicar365.com/mini-program/${this.sId}/2${(this.sId === 16 || this.sId === 160) ? '_new' : ''}.png`;
    recommendedId = options.recommendedId || options.rId || '';
    if (!uni.getStorageSync('token')) {
      const $emitter = getGlobalData('$emitter');
      $emitter.on('authorize', () => {
        this.init();
      });
      loginVerification();
      return;
    }
    this.init();
  }

  init() {
    this.getSchoolInfo();
    if (uni.getStorageSync('token')) {
      this.authFlag = false;
    }
    // 登录过直接获取邀请详情和userId
    if (uni.getStorageSync('openId')) {
      this.queryRecommendInviteTallys();
      this.getUserId();
    }
    this.generateUserData();
  }

  userData: any[] = [];

  // 虚拟数据
  generateUserData() {
    let current = Math.floor(userData.length * Math.random());
    this.userData.push({
      ...userData[current],
      num: Math.ceil(5 * Math.random())
    });
    setInterval(() => {
      current += 1;
      if (current > userData.length) {
        current = Math.floor(userData.length * Math.random());
      }
      this.userData.push({
        ...userData[current],
        num: Math.ceil(5 * Math.random())
      });
      this.userData.shift();
    }, 5000);
  }

  async getSchoolInfo() {
    const data = {
      mchId: this.sId,
      activitiyId: 10001
    };
    const info = await this.$http.post('sale/v1/reward/queryRewardConf', data);
    const {
      beginDate,
      endDate,
      mobileNo,
      reward
    } = info;
    this.mobileNo = mobileNo;
    this.reward = reward;
    this.activitiyDate = `${filterDate(beginDate)}-${filterDate(endDate)}`;
  }

  // 获取邀请详情
  async queryRecommendInviteTallys() {
    const data = {
      banbanToken: '',
      activitiyId: 10001,
      openId: uni.getStorageSync('openId'),
      mchId: this.sId
    };
    this.inviteTallys = await this.$http.post('sale/v1/recommend/queryRecommendInviteTallys', data);
  }

  // 授权手机号回调
  verifyTelAccredit(e: any) {
    verifyTelAccredit(e);
  }

  toNext() {
    uni.navigateTo({
      url: `/pages/personal/invite/my_invite?sId=${this.sId}`
    });
  }

  async getUserId() {
    const data = {
      banbanToken: '',
      activitiyId: 10001,
      openId: uni.getStorageSync('openId'),
      mchId: this.sId,
      recommendedId
    };
    const userInfo = await this.$http.post('sale/v1/recommend/joinActivity', data);
    this.userId = userInfo.id;
  }

  onShareAppMessage() {
    if (this.authFlag) {
      uni.showToast({
        title: '请先授权登录',
        icon: 'none'
      });
      return false;
    }
    return {
      title: '报名学车抽取百万红包返现及免费学车机会',
      path: `/pages/personal/invite/landing_page?scene=uId-${this.userId}_sId-${this.sId}`,
      imageUrl: 'https://file.aicar365.com/mini-program/common/yaoqinghan.png'
    };
  }
}

</script>

<style lang="less" scoped>
page{
  height: 100%;
}
.view_top{
  position: relative;
  height: 809rpx;
  .activity_time{
    padding-top: 260rpx;
    line-height: 24rpx;
    font-size: 24rpx;
    color: #fff;
    text-align: center;
  }
  .invite_btn{
    width: 386rpx;
    height: 84rpx;
    line-height: 78rpx;
    font-size: 34rpx;
    color: #D40620;
    margin: 368rpx auto 0;
    background: url('https://file.aicar365.com/mini-program/common/huodongzhuye_banner_btn.png') no-repeat;
    background-size: 100% 100%
  }
}
.view_content{
  background: #D40620;
  padding: 0 24rpx 70rpx;
  .tit{
    color: #fff;
    font-size: 34rpx;
    line-height: 34rpx;
    padding-bottom: 24rpx;
    padding-top: 40rpx;
    text{
      color: yellow;
      padding-left: 10rpx;
    }
  }
  .process{
    width: 100%;
    height: 324rpx;
  }
  .invite_detail{
    padding: 56rpx 0 40rpx;
    background: #fff;
    border-radius: 16rpx;
    text-align: center;
    .list{
      display: flex;
      view{
        flex: 1;
        border-right: #e5e5e5 1rpx solid;
      }
      .num{
        color: #D40620;
        font-size: 48rpx;
        text{
          font-size: 24rpx;
        }
      }
      .des{
        margin-top: 12rpx;
        font-size: 24rpx;
        line-height: 24rpx;
        color: #999;
      }
    }
    .reward{
      background: #D40620;
      font-size: 34rpx;
      color: #fff;
      line-height: 70rpx;
      width: 320rpx;
      border-radius: 48rpx;
      margin: 36rpx auto 0;
    }
  }
}
.explain {
  margin-top: 24rpx;
  line-height: 36rpx;
  font-size: 24rpx;
  color: #fff;
  view{
    display: flex;
  }
  text{
    flex: 1;
  }
}
.bg_img{
  width: 100%;
  height: 809rpx;
  position: absolute;
  z-index: -1;
}
.notice{
  // display: flex;
  top: 204rpx;
  position: absolute;
  z-index: 3;
  // width: max-content;
  width: 100%;
  .notice_box{
    background: rgba(133, 21, 50, 0.65);
    height: 40rpx;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    padding: 0rpx 24rpx 0rpx 24rpx;
    margin: 0rpx 50rpx 0rpx 100rpx;
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
    transform: translateX(112%);
  }
  to {
    transform: translateX(-112%);
  }
}
.copyright{
  text-align: center;
  background: #D40620;
  color: #fff;
  font-size: 24rpx;
  padding-bottom: 24rpx;
}
</style>
