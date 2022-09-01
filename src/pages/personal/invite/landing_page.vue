<template>
  <view>
    <view class="view_top">
      <!-- 滚屏 -->
      <view class="notice" v-if="promotionBegin">
        <view v-for="(item, key) in userData" :key="key">
          <view class="notice_box">
            <image class="notice_icon" :src="noticeIcon" alt=""/>
            <view>{{item.nickname}} 刚刚中奖获得 {{item.prizeName}}</view>
          </view>
        </view>
      </view>
      <image :src="bgTop" class="bg_img"></image>
      <view class="activity_time">活动时间: {{activitiyDate}}</view>
      <view class="lottery_box">
        <view class="warn">* 推荐活动专享 *</view>
        <Turntable :awardsList="awardsList" :sId="sId"/>
        <button class="turntable_auth" v-if="authFlag" open-type='getPhoneNumber' @getphonenumber='verifyTelAccredit'>
        </button>
        <view class="des">报名成功可获得额外抽奖机会</view>
        <view class="prize_rule">
          <button class="prize" @click="getMyPrize" v-if="!authFlag">我的奖品 ></button>
          <button class="prize" v-else open-type='getPhoneNumber' @getphonenumber='verifyTelAccredit'>我的奖品 ></button>
          <text class="split"></text>
          <button class="rule" @click="showRule = true">活动规则 > </button>
        </view>
        <view class="btns">
          <!-- <view class="share" @click="toInvite">邀请赚钱</view> -->
          <button class="consult" @click="openCustomerService" v-if="!authFlag">咨询客服</button>
          <button class="consult" v-else open-type='getPhoneNumber' @getphonenumber='verifyTelAccredit'>咨询客服</button>
          <view class="share" @click="getUserProfile">预约报名</view>
        </view>
      </view>
    </view>
    <view class="view_content">
      <view class="content">
        <view class="tab_list">
          <view class="tab" :class="{'active': current === 0}" @click="current = 0">班别列表</view>
          <view class="tab" :class="{'active': current === 1}" @click="current = 1">驾校介绍</view>
          <view class="tab last_tab" :class="{'active': current === 2}" @click="current = 2" v-if="sId != 16">训练场介绍</view>
        </view>
        <swiper class="swiper" :current="current" @change="currentChange" :style="{height: swiperHeight + 'px', maxHeight: maxHeight + 'px'}">
            <swiper-item>
              <view class="swiper-item item0">
                <img :src="classImg" alt="" class="class_img" mode="widthFix"/>
                <img :src="classImg1" alt="" class="class_img mar_24" mode="widthFix"/>
                <!-- 兰州深港1609 / 肇庆深港2675 -->
                <img :src="`https://file.aicar365.com/mini-program/${sId}/banbie2.png`" alt="" class="class_img mar_24" mode="widthFix" v-if="sId == 1609 || sId == 2675"/>
                <img :src="`https://file.aicar365.com/mini-program/${sId}/banbie3.png`" alt="" class="class_img mar_24" mode="widthFix" v-if="sId == 1609 || sId == 2675"/>
                <img :src="`https://file.aicar365.com/mini-program/${sId}/banbie4.png`" alt="" class="class_img mar_24" mode="widthFix" v-if="sId == 1609 || sId == 2675"/>
                <img :src="`https://file.aicar365.com/mini-program/${sId}/banbie5.png`" alt="" class="class_img mar_24" mode="widthFix" v-if="sId == 1609 || sId == 2675"/>
                <img :src="`https://file.aicar365.com/mini-program/${sId}/banbie6.png`" alt="" class="class_img mar_24" mode="widthFix" v-if="sId == 1609"/>
                <img :src="`https://file.aicar365.com/mini-program/${sId}/banbie7.png`" alt="" class="class_img mar_24" mode="widthFix" v-if="sId == 1609"/>
                <!-- 重庆凯旋2997 / 福华驾校320 -->
                <img :src="`https://file.aicar365.com/mini-program/${sId}/banbie2.png`" alt="" class="class_img mar_24" mode="widthFix" v-if="sId == 2997 || sId == 320"/>
                <img :src="`https://file.aicar365.com/mini-program/${sId}/banbie3.png`" alt="" class="class_img mar_24" mode="widthFix" v-if="sId == 2997 || sId == 320"/>
                <!-- <button class="btn" @click="getUserProfile">咨询</button> -->
                <button class="btn" @click="openCustomerService" v-if="!authFlag">咨询</button>
                <button class="btn" v-else open-type='getPhoneNumber' @getphonenumber='verifyTelAccredit'>咨询</button>
              </view>
            </swiper-item>
            <swiper-item>
              <view class="swiper-item item1">
                <img :src="item" alt="" class="introduce_img" v-for="(item, key) in introduceImgs" :key="key" mode="widthFix"/>
              </view>
            </swiper-item>
            <swiper-item v-if="sId != 16">
              <view class="swiper-item item2">
                <image :src="placeImg" class="place_img" mode="widthFix" v-if="sId != 1609 && sId != 3401"></image>
                <view v-for="(item, key) in traininggroundList" :key="key" @click="openLocation(item.location, item.address)">
                  <view class="place_tit">{{item.name}}</view>
                  <view class="address_box">
                    <view class="address">{{item.address}}</view>
                    <view class="split"></view>
                    <img src="../../../assets/svg/beiyaoqingye_icon_xunlianchangjieshao.svg" alt="">
                  </view>
                </view>
              </view>
            </swiper-item>
        </swiper>
      </view>
      <!-- <img :src="bannerImg" alt="" class="banner" @click="toInvite"> -->
      <img :src="inviteBanner" alt="" class="banner">
    </view>
    <view class="copyright">车态链网络科技有限公司技术支持</view>
    <view class="my_prize_box" v-if="showMyPrize || showRule"></view>
    <view class="my_prize" :animation="animationData">
      <view class="tit">我的奖品</view>
      <view class="prize_box">
        <view class="prize" v-for="(item, index) in lotteryRecord" :key="index">
          <image :src="prizeIcon"/>
          <view class="prize_des">
            {{item.unit + item.prizeName}}
            <view class="date">{{item.createdTime}}</view>
          </view>
        </view>
      </view>
      <view class="sure_btn" @click="hidePrize">确定</view>
    </view>
    <view class="rule_box" v-if="showRule">
      <view class="tit">活动规则</view>
      <view>1. 直降金额均为实际成交价和标准报价之间的金额，不可单独提取; </view>
      <view>2. 本活动直降金额为驾校标准价基础上降价;</view>
      <view>3. 本活动直降金额可能存在具体使用场景限定，详情请咨询客服;</view>
      <view>4. 本次直降的抽奖方式仅限于推荐活动专属和新学员留资使用，报名成功后可再次参与免费学车或特等奖等大奖抽奖;</view>
      <view>5.  活动最终解释权归驾校所有，详情请咨询客服</view>
      <view class="sure_btn" @click="showRule = false">确定</view>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { setGlobalData, getGlobalData } from '@/assets/js/global_data';
import {
  filterParams,
  filterDate,
  verifyTelAccredit,
  loginVerification,
  replaceDate,
  customerService
} from '@/assets/js/common';
import { traininggroundList, userData } from './index';
import Turntable from './Turntable.vue';

type UniExpand = {
  showShareImageMenu: any;
  getUserProfile: any;
  openCustomerServiceChat: any;
} & UniApp.Uni;

@Component({
  components: { Turntable }
})
export default class Exercises extends Vue {
  bgTop = 'https://file.aicar365.com/mini-program/common/beiyaoqingye_banner_img.png';

  classImg = 'https://file.aicar365.com/mini-program/common/beiyaoqingye_img_banbieliebiao.png';

  classImg1 = 'https://file.aicar365.com/mini-program/common/beiyaoqingye_img_banbieliebiao.png';

  placeImg = 'https://file.aicar365.com/mini-program/common/beiyaoqingye_img_xunlianchangjieshao.png';

  bannerImg = 'https://file.aicar365.com/mini-program/common/huodongjiemian_banner.png';

  inviteBanner = 'https://file.aicar365.com/mini-program/common/invite_banner.png';

  noticeIcon = require('../../../assets/svg/ldx_banner_icon_laba.svg');

  prizeIcon = 'https://file.aicar365.com/mini-program/common/gift.png';

  current = 0;

  swiperHeight = '';

  maxHeight = '';

  sId = ''; // 驾校ID

  showRule = false;

  introduceImgs = [
    'https://file.aicar365.com/mini-program/common/beiyaoqingye_img_jiaxiaojieshaoone.png',
    'https://file.aicar365.com/mini-program/common/beiyaoqingye_img_jiaxiaojieshaotwo.png',
    'https://file.aicar365.com/mini-program/common/beiyaoqingye_img_jiaxiaojieshaothree.png'
  ];

  traininggroundList: any[] = [];

  activitiyDate = ''; // 活动时间

  authFlag = true; // 是否展示授权

  promotionBegin = false; // 活动是否开始

  onShow() {
    uni.hideHomeButton();
  }

  onLoad(options: any) {
    if (!uni.getStorageSync('token')) {
      const $emitter = getGlobalData('$emitter');
      $emitter.on('authorize', (flag: boolean) => {
        this.authFlag = flag;
      });
      loginVerification();
    } else {
      this.authFlag = false;
    }
    if (options.scene) {
      const paramsObj = filterParams(options.scene);
      // 邀请人ID
      // 如果有推荐人存储推荐人
      if (paramsObj.uId) {
        setGlobalData('inviterId_ldx', paramsObj.uId);
      }
      if (paramsObj.sId) {
        setGlobalData('sId_ldx', paramsObj.sId);
        this.sId = paramsObj.sId;
        this.getSchoolInfo(); // 根据驾校ID查询活动日期及奖励金额
        this.imgGenerate(); // 动态生成各驾校图片
      }
      this.redirectTo();
    }
    uni.login({
      provider: 'weixin',
      success: async (res) => {
        const openId = await this.$http.get(`sale/v1/recommend/getWechatOpenid/${res.code}`);
        setGlobalData('openId', openId.wechatOpenId || '');
        this.addActivityLogs(1);
      }
    });
    const timer = setTimeout(() => {
      clearTimeout(timer);
      this.getSwiperHeight();
    }, 500);
    this.drawAwardRoundel(); // 获取转盘数据
  }

  awardsList = [];

  async drawAwardRoundel() {
    const data = {
      mchId: this.sId,
      activitiyId: 10001
    };
    const awards = await this.$http.post('sale/v1/prize/queryAllPrize', data);
    const awardsList = [];
    const turnNum = 360 / awards.length; // 文字旋转 turn 值
    // 奖项列表
    for (let i = 0; i < awards.length; i += 1) {
      const { luckCode } = awards[i];
      // 调整一下奖项顺序
      const obj = {
        GRADE_SPECIAL: 0,
        GRADE_ONE: 7,
        GRADE_TWO: 6,
        GRADE_THREE: 1,
        GRADE_FOUR: 2,
        GRADE_FIVE: 3,
        GRADE_SIX: 4,
        GRADE_LUCK: 5
      };
      const index = obj[luckCode];
      const award = {
        turn: `${index * turnNum - 22.5}deg`,
        lineTurn: `${index * turnNum + turnNum / 2}deg`,
        ...awards[i]
      };
      awardsList[index] = award;
    }
    this.awardsList = awardsList;
    this.generateUserData(awardsList); // 生成虚拟数据
  }

  userData: any[] = [];

  // 生成虚拟数据
  generateUserData(awardsList) {
    let current = Math.floor(userData.length * Math.random());
    // 首先展示三等奖
    const two = awardsList.findIndex((item: any) => item.luckCode === 'GRADE_TWO');
    this.userData.push({
      ...userData[current],
      num: Math.ceil(5 * Math.random()),
      prizeName: awardsList[two].unit + awardsList[two].prizeName
    });
    setInterval(() => {
      current += 1;
      if (current > userData.length) {
        current = Math.floor(userData.length * Math.random());
      }
      let prizeIndex;
      const ra = Math.random();
      // 随机展示奖品
      if (ra < 0.25) prizeIndex = awardsList.findIndex((item: any) => item.luckCode === 'GRADE_SPECIAL');
      if (ra > 0.25 && ra < 0.5) prizeIndex = awardsList.findIndex((item: any) => item.luckCode === 'GRADE_ONE');
      if (ra > 0.5 && ra < 0.75) prizeIndex = awardsList.findIndex((item: any) => item.luckCode === 'GRADE_TWO');
      if (ra > 0.75) prizeIndex = awardsList.findIndex((item: any) => item.luckCode === 'GRADE_THREE');
      const award = awardsList[prizeIndex];
      this.userData.push({
        ...userData[current],
        prizeName: award.unit + award.prizeName
      });
      this.userData.shift();
    }, 5000);
  }

  // 授权手机号回调
  verifyTelAccredit(e: any) {
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      uni.showToast({
        title: '请先授权登录',
        icon: 'none',
      });
      return;
    }
    const $emitter = getGlobalData('$emitter');
    $emitter.on('authorize', (flag: boolean) => {
      this.authFlag = flag;
      if (!flag) this.addActivityLogs(3);
    });
    verifyTelAccredit(e);
  }

  // 短信链接过来的直接跳转到分享页面
  redirectTo() {
    const scene = uni.getLaunchOptionsSync().scene;
    if (scene === 1065) {
      uni.redirectTo(
        {
          url: `/pages/personal/invite/index?sId=${getGlobalData('sId_ldx')}&recommendedId=${getGlobalData('inviterId_ldx')}`
        }
      );
    }
  }

  imgGenerate() {
    this.bgTop = `https://file.aicar365.com/mini-program/${this.sId}/bg_zp.png`;
    this.classImg = `https://file.aicar365.com/mini-program/${this.sId}/banbie.png`;
    this.classImg1 = `https://file.aicar365.com/mini-program/${this.sId}/banbie1.png`;
    this.placeImg = `https://file.aicar365.com/mini-program/${this.sId}/xunlianchang.png`;
    this.bannerImg = `https://file.aicar365.com/mini-program/${this.sId}/banner.png`;
    this.introduceImgs = [
      `https://file.aicar365.com/mini-program/${this.sId}/i_1.png`,
      `https://file.aicar365.com/mini-program/${this.sId}/i_2.png`,
      `https://file.aicar365.com/mini-program/${this.sId}/i_3.png`
    ];
    this.traininggroundList = traininggroundList[this.sId];
  }

  addActivityLogs(types: number, wechatLogoUrl = '', wechatNickname = '') {
    const data = {
      activitiyId: 10001,
      recommendedId: getGlobalData('inviterId_ldx') || '',
      types,
      wechatOpenId: getGlobalData('openId'),
      mobileNo: uni.getStorageSync('mobile') || '',
      wechatLogoUrl,
      wechatNickname,
      mchId: this.sId
    };
    this.$http.post('sale/v1/recommend/addActivityLogs', data);
  }

  async getSchoolInfo() {
    const data = {
      mchId: getGlobalData('sId_ldx'),
      activitiyId: 10001
    };
    const info = await this.$http.post('sale/v1/reward/queryRewardConf', data);
    const {
      beginDate,
      endDate,
    } = info;
    if (new Date(replaceDate(beginDate)).getTime() < new Date().getTime() && new Date(replaceDate(endDate)).getTime() > new Date().getTime()) {
      this.promotionBegin = true;
    }
    this.activitiyDate = `${filterDate(beginDate)}-${filterDate(endDate)}`;
  }

  currentChange(event: any) {
    this.current = event.detail.current;
    this.getSwiperHeight();
  }

  getSwiperHeight() {
    const query = uni.createSelectorQuery().in(this);
    query.select(`.item${this.current}`).boundingClientRect(rect => {
      this.swiperHeight = `${rect.height + (this.current === 0 ? 50 : 0)}`;
      if (this.current === 0) this.maxHeight = this.swiperHeight;
    }).exec();
  }

  getUserProfile() {
    if (uni.getStorageSync('wechatUserInfo')) {
      const { avatarUrl, nickName } = uni.getStorageSync('wechatUserInfo');
      this.addActivityLogs(2, avatarUrl, nickName);
      this.toNroll();
      return;
    }
    (uni as UniExpand).getUserProfile({
      desc: '登录',
      success: (event: any) => {
        const { avatarUrl, nickName } = event.userInfo;
        uni.setStorageSync('wechatUserInfo', event.userInfo);
        this.addActivityLogs(2, avatarUrl, nickName);
        this.toNroll();
      },
      fail: () => {
        this.addActivityLogs(2);
        this.toNroll();
      }
    });
  }

  // 展示我的奖品
  showMyPrize = false;

  lotteryRecord = [];

  async getMyPrize() {
    const data = {
      activitiyId: 10001,
      mchId: this.sId,
      mobileNo: uni.getStorageSync('mobile')
    };
    const result = await this.$http.post('sale/v1/prize/queryUserLotteryRecord', data);
    if (!result || result.length === 0) {
      uni.showToast({
        title: '暂无奖品',
        icon: 'none'
      });
      return;
    }
    this.lotteryRecord = result;
    this.showMyPrize = true;
    this.generateAnimationData(1);
  }

  // 隐藏我的奖品
  hidePrize() {
    this.showMyPrize = false;
    this.generateAnimationData(0);
  }

  // 生成动画
  animationData = {};

  generateAnimationData(key: number) {
    // 创建动画
    const animationRun = uni.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    });
    animationRun.scale(key, key).step();
    // animationRun.rotate(270).step();
    this.animationData = animationRun.export();
  }

  toNroll() {
    uni.navigateTo({
      url: `/pages/personal/invite/collect_form?sId=${getGlobalData('sId_ldx')}`
    });
  }

  toInvite() {
    uni.navigateTo({
      url: `/pages/personal/invite/index?sId=${getGlobalData('sId_ldx')}&recommendedId=${getGlobalData('inviterId_ldx')}`
    });
  }

  toMyPrize() {
    uni.navigateTo({
      url: '/pages/personal/invite/my_prize'
    });
  }

  // 跳转地图
  openLocation(longlat: number[], address?: string) {
    if (longlat.length > 0) {
      uni.openLocation({
        longitude: longlat[1],
        latitude: longlat[0],
        address
      });
    }
  }

  openCustomerService() {
    const url = customerService[getGlobalData('sId_ldx')];
    (uni as UniExpand).openCustomerServiceChat({
      extInfo: { url },
      corpId: 'ww9541ffad85d74b5a',
      success(res: any) {
        console.log(res);
      },
      fail(res: any) {
        console.log(res);
      }
    });
  }
}
</script>

<style lang="less" scoped>
.view_top{
  position: relative;
  height: 1668rpx;
  .activity_time{
    padding-top: 295rpx;
    color: #FFF09D;
    font-size: 24rpx;
    line-height: 24rpx;
    text-align: center;
  }
}
swiper-item{
  overflow: scroll;
}
.view_content{
  background: #FDEBC5;
  padding: 64rpx 24rpx 72rpx;
  .content{
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    .tab_list{
      display: flex;
      background: #D40620;
    }
    .tab{
      line-height: 80rpx;
      flex: 1;
      text-align: center;
      color: #fff;
      font-size: 28rpx;
      position: relative;
      &.active{
        background: #fff;
        color: #000;
      }
    }
    // .tab:not(.last_tab)::after{
    //     content: '';
    //     height: 14rpx;
    //     width: 2rpx;
    //     background: #fff;
    //     position: absolute;
    //     top: 33rpx;
    //     right: 0;
    //   }
  }
}
.swiper{
  // padding: 24rpx 0 0;
  .swiper-item{
    padding: 24rpx 24rpx 24rpx;
  }
  .class_img{
    width: 100%;
    &.mar_24{
      margin-top: 24rpx;
    }
  }
  .btn{
    background: #D40620;
    width: 200rpx;
    height: 70rpx;
    line-height: 70rpx;
    color: #fff;
    float: right;
    font-size: 34rpx;
    border-radius: 48rpx;
    text-align: center;
    margin-top: 16rpx;
  }
}
.place_tit{
  padding-top: 40rpx;
  line-height: 28rpx;
  color: #000;
  font-size: 28rpx;
  padding-bottom: 8rpx;
}
.address_box{
  display: flex;
  align-items: center;
  .address{
    flex: 1;
    color: #666;
    font-size: 24rpx;
    line-height: 36rpx;
  }
  .split{
    width: 1rpx;
    height: 48rpx;
    background: #E5E5E5;
    margin-left: 15rpx;
  }
  image{
    width: 36rpx;
    height: 40rpx;
    margin: 0 32rpx 0 16rpx;
  }
}
.introduce_img{
  width: 100%;
  margin-bottom: 30rpx;
}
.place_img{
  width: 100%;
}
.bg_img{
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
}
.banner{
  height: 326rpx;
  width: 100%;
  margin-top: 48rpx;
}
.copyright{
  text-align: center;
  background: #FDEBC5;
  color: #999;
  font-size: 24rpx;
  padding-bottom: 24rpx;
}
.lottery_box{
  padding-top: 130rpx;
  position: relative;
  overflow: hidden;
  .warn{
    line-height: 24rpx;
    text-align: center;
    color: #d40620;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    top: 90rpx;
    font-size: 24rpx;
  }
  .turntable_auth{
    background: transparent;
    width: 608rpx;
    height: 608rpx;
    margin: 0 auto;
    position: absolute;
    top: 130rpx;
    z-index: 4;
    left: 50%;
    margin-left: -304rpx;
  }
  .des{
    text-align: center;
    padding: 24rpx 0 4rpx;
    line-height: 32rpx;
    color: #d40620;
    font-size: 32rpx;
  }
  .btns{
    display: flex;
    margin-top: 24rpx;
    view,button{
      flex: 1;
      text-align: center;
      line-height: 70rpx;
      font-size: 32rpx;
      border-radius: 49rpx;
      padding: 0;
    }
    .share{
      border: solid 2rpx #D40620;
      color: #D40620;
      margin-left: 30rpx;
      margin-right: 40rpx;
    }
    .consult{
      margin-left: 40rpx;
    }
    .consult,.enroll{
      color: #fff;
      background-image: linear-gradient(to bottom, #FF0020, #D40620);
    }
  }
}
.prize_rule{
  text-align: center;
  align-items: center;
  display: flex;
  button {
    font-size: 24rpx;
    line-height: 24rpx;
    display: inline;
    background: transparent;
    padding: 16rpx 0;
    flex: 1;
    text-align: left;
    &:nth-child(1) {
      text-align: right;
    }
  }
  .prize {
    color: #D40620;
    padding-right: 24rpx;
  }
  .split{
    height: 24rpx;
    background: #D40620;
    width: 2rpx;
    display: inline-block;
  }
  .rule{
    color: #666;
    padding-left: 24rpx;
  }
}
.notice{
  top: 350rpx;
  position: absolute;
  z-index: 3;
  width: 100%;
  height: 40rpx;
  overflow: hidden;
  .notice_box{
    // min-width: 80%;
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
.my_prize_box{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 4;
}
  .my_prize{
    width: 400rpx;
    padding: 84rpx 40rpx 162rpx 40rpx;
    background: #fff;
    border-radius: 16rpx;
    position: fixed;
    top: 230rpx;
    left: 50%;
    margin-left: -240rpx;
    transform: scale(0);
    z-index: 5;
    .prize_box{
      max-height: 300rpx;
      overflow: scroll;
    }
    .sure_btn{
      width: 280rpx;
      line-height: 80rpx;
      text-align: center;
      border-radius: 45rpx;
      background: #d40620;
      color: #fff;
      font-size: 34rpx;
      position: absolute;
      bottom: -140rpx;
      left: 50%;
      transform: translateX(-50%);
    }
    .tit{
      font-size: 48rpx;
      text-align: center;
      padding-bottom: 70rpx;
      border-bottom: 1px solid rgba(151, 151, 151, 1);
      color: #000;
    }
    .prize{
      height: 146rpx;
      display: flex;
      align-items: center;
      border-bottom: 1px solid rgba(151, 151, 151, 1);
      image{
        float: left;
        width: 54rpx;
        height: 60rpx;
      }
      .prize_des{
        flex: 1;
        text-align: right;
        color: #000;
        line-height: 28rpx;
        font-size: 28rpx;
        .date{
          color: #999;
          margin-top: 16rpx;
          font-size: 22rpx;
          line-height: 22rpx;
        }
      }
    }
  }
  .rule_box{
    width: 400rpx;
    padding: 60rpx 40rpx 80rpx 40rpx;
    background: #fff;
    border-radius: 16rpx;
    position: fixed;
    top: 230rpx;
    left: 50%;
    margin-left: -240rpx;
    color: #999;
    font-size: 28rpx;
    z-index: 5;
    .tit{
      text-align: center;
      font-size: 36rpx;
      padding-bottom: 10rpx;
      line-height: 36rpx;
    }
    .sure_btn{
      width: 280rpx;
      line-height: 80rpx;
      text-align: center;
      border-radius: 45rpx;
      background: #d40620;
      color: #fff;
      font-size: 34rpx;
      position: absolute;
      bottom: -140rpx;
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>
