<template>
  <view class="c_turn_table">
    <view class="main">
      <view class="pmd_box" v-for="item in 24" :key="item" :style="[{transform:'rotate('+item * 15+'deg)'}]">
        <view class="pmd"></view>
      </view>
      <view class="canvas-container">
        <view class="canvas-content-box">
          <view></view>
        </view>
        <view class="canvas-content" >
          <view :animation="animationData" class="content">
            <view class="canvas-list">
              <view class="canvas-item" v-for="(item,index) in awardsList" :key="index">
                <view class="canvas-item-text" :style="[{transform:'rotate('+item.turn+')'}]">
                  <view>{{item.unit}}</view>
                  <view>{{item.prizeName}}</view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view v-if="authFlag"  class="canvas-btn" @click="playReward"></view>
        <button v-else class="canvas-btn" open-type='getPhoneNumber' @getphonenumber='verifyTelAccredit'></button>
      </view>
    </view>
    <view class="my_prize_box" v-if="showPrize || showPrize2"></view>
    <view class="my_prize" :animation="animationData2">
      <image :src="prizeBg"></image>
      <view class="tit">恭喜您获得</view>
      <view class="prize">{{currentPrize.unit + currentPrize.prizeName}}</view>
      <view class="sure_btn" @click="hidePrize">确定</view>
    </view>
    <view class="my_prize" :animation="animationData3" style="height: 516rpx;">
      <image :src="prizeBg2"></image>
      <view class="tit" style="padding-top: 120rpx">谢谢参与</view>
      <view class="prize" style="padding-top: 150rpx;line-height: 46rpx;">报名成功<br>可获得额外抽奖机会</view>
      <view class="sure_btn" @click="hidePrize2">确定</view>
    </view>
  </view>
</template>
<script lang="ts">
import {
  Component, Prop, Vue
} from 'vue-property-decorator';
import {
  verifyTelAccredit
} from '@/assets/js/common';
import {
  getGlobalData
} from '@/assets/js/global_data';
import { schoolId } from '@/config/build_path';

@Component
export default class Turntable extends Vue {
  @Prop({ default: [] }) awardsList!: [];

  @Prop({ default: '' }) sId!: number | string

  @Prop({ default: '' }) batchId!: string

  @Prop({ default: '' }) activityId!: string

  @Prop({ default: true }) disabled!: boolean

  authFlag = !!uni.getStorageSync('mobile'); // 是否展示授权

  animationData = {};

  runDeg = 0;

  awardIndex = 0;

  created() {
    const $emitter = getGlobalData('$emitter');
    $emitter.on('authorize', () => {
      this.authFlag = true;
    });
  }

  // 授权手机号回调
  verifyTelAccredit(e: any) {
    verifyTelAccredit(e);
  }

  // 中奖信息对象
  currentPrize = {};

  // 点击转盘
  async playReward() {
    if (this.disabled) return;
    const userType = uni.getStorageSync('userType');
    const userTypeFlag = [2, 3];
    if (userTypeFlag.includes(userType)) {
      uni.showToast({
        title: '工作人员不参与抽奖',
        icon: 'none'
      });
      return;
    }
    // 点击转盘抽奖
    const { activityId } = this;
    const sceneId = uni.getStorageSync('sceneId');
    const mobile = uni.getStorageSync('mobile');
    const sendData = {
      activityId,
      drivingSchoolId: schoolId,
      mobile,
      sceneId,
    };
    const result = await this.$http.post('sale/v1/mkt/coupon/lotteryByMkt', sendData);
    if (result) {
      this.currentPrize = result;
      // 中奖index
      const length = this.awardsList.length;
      const awardIndex = this.awardsList.findIndex((item: any) => item.grade === result.grade); // 随机数
      this.awardIndex = awardIndex;
      const runNum = 8; // 旋转8周
      const duration = 4000; // 时长

      // 旋转角度
      this.runDeg = this.runDeg || 0;
      this.runDeg = this.runDeg + (360 - (this.runDeg % 360)) + (360 * runNum - awardIndex * (360 / length)) + 22.5;
      // 创建动画
      const animationRun = uni.createAnimation({
        duration,
        timingFunction: 'ease'
      });
      animationRun.rotate(this.runDeg).step();
      this.animationData = animationRun.export();

      // 中奖提示
      const timer = setTimeout(() => {
        clearTimeout(timer);
        this.getMyPrize();
      }, duration + 500);
    }
  }

  // 展示我的奖品
  showPrize = false;

  prizeBg = '';

  getMyPrize() {
    this.showPrize = true;
    this.prizeBg = 'https://file.aicar365.com/mini-program/common/prize_bg.png';
    this.generateAnimationData(1);
  }

  // 隐藏我的奖品
  async hidePrize() {
    this.showPrize = false;
    this.generateAnimationData(0);
  }

  // 提示报名后获得额外机会
  // showPrize2 = false;

  // prizeBg2 = '';

  // getMyPrize2() {
  //   this.showPrize2 = true;
  //   this.prizeBg2 = 'https://file.aicar365.com/mini-program/common/prize_bg2.png';
  //   this.generateAnimationData(1, 1);
  // }

  // 隐藏我的奖品
  // hidePrize2() {
  //   this.showPrize2 = false;
  //   this.generateAnimationData(0, 1);
  // }

  // 生成动画
  animationData2 = {};

  animationData3 = {};

  generateAnimationData(scale: number, key?: number) {
    // 创建动画
    const animationRun = uni.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    });
    animationRun.scale(scale, scale).step();
    if (key) {
      this.animationData3 = animationRun.export();
      return;
    }
    this.animationData2 = animationRun.export();
  }
}
</script>
<style lang="less" scoped>
  page {
    background: #fff;
  }
  .c_turn_table{
    width: 608rpx;
    height: 608rpx;
    margin: 0 auto;
    background: #FFCA6C;
    border-radius: 50%;
    box-shadow: 0px 6rpx 12rpx 0px rgba(178, 145, 75, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /* 转盘 */
  .main{
    width: 584rpx;
    height: 584rpx;
    border-radius: 50%;
    background: #E74C42;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .pmd{
      margin-top: 10rpx;
      width: 16rpx;
      height: 16rpx;
      background: #FCE7B7;
      border-radius: 50%;
      animation: colorChange .5s linear infinite;
    }
    .pmd_box{
      width: 16rpx;
      position: absolute;
      top: 0;
      height: 100%;
      &:nth-child(even) .pmd{
        background: #d8d8d8;
        animation: colorChange2 .5s linear infinite;
      }
    }
  }
  @keyframes colorChange {
    from {
      background: #d8d8d8;
    }
    to {
      background: #FCE7B7;
    }
  }
  @keyframes colorChange2 {
    from {
      background: #FCE7B7;
    }
    to {
      background: #d8d8d8;
    }
  }
  .canvas-container {
    margin: 0 auto;
    width: 506rpx;
    height: 506rpx;
    border-radius: 50%;
    background: #E0DEDE;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .canvas-content-box{
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 2;
    background: transparent;
    width: 409rpx;
    height: 409rpx;
    border: solid 48rpx #E0DEDE;
    opacity: 0.6;
  }
  .content{
    height: 506rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background: conic-gradient( #fff 0 45deg, #5EC0C8 45deg 90deg, #fff 90deg 135deg, #5EC0C8 135deg 180deg, #fff 180deg 225deg, #5EC0C8 225deg 270deg, #fff 270deg 315deg, #5EC0C8 315deg 360deg);
    border-radius: 50%;
    transform: rotate(45deg);
  }
  .canvas-content {
    z-index: 1;
    display: block;
    position: absolute;
    width: 506rpx;
    height: 506rpx;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .canvas-element {
    position: relative;
    z-index: 1;
    width: inherit;
    height: inherit;
    border-radius: 50%;
  }
  .canvas-list {
    position: absolute;
    left: 0;
    top: 0;
    width: inherit;
    height: inherit;
    z-index: 9999;
    width: 100%;
  }
  .canvas-item {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    color: #899E78;
    font-weight: bold;
    &:nth-child(even){
      color: #899E78;
    }
  }
  .canvas-item-text {
    position: relative;
    display: block;
    padding-top: 25rpx;
    margin: 0 auto;
    text-align: center;
    -webkit-transform-origin: 50% 253rpx;
    transform-origin: 50% 253rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .canvas-item-text text{
    font-size: 30rpx;
  }

  /**
  * 抽奖按钮
  */
  .canvas-btn {
    position: absolute;
    left: 50%;
    top: 133rpx;
    transform: translateX(-50%);
    z-index: 3;
    width: 172rpx;
    height: 210rpx;
    background: url('https://file.aicar365.com/mini-program/common/canvas_btn_red.png') no-repeat;
    background-size: 100% auto;
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
    width: 480rpx;
    height: 596rpx;
    border-radius: 16rpx;
    position: fixed;
    top: 230rpx;
    left: 50%;
    margin-left: -240rpx;
    transform: scale(0);
    z-index: 5;
    text-align: center;
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
    image{
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      z-index: -1;
    }
    .tit{
      padding-top: 272rpx;
      line-height: 48rpx;
      color: #FFE5CC;
      font-size: 48rpx;
    }
    .prize{
      color: #D40620;
      line-height: 38rpx;
      font-size: 38rpx;
      padding-top: 102rpx;
    }
  }
</style>
