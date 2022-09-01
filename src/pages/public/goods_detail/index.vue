<template>
  <view class="content" @click="bindSDKDomClick">
    <canvas type="2d" id="myCanvas" style="width: 345px;height: 276px;margin:0;position: fixed;top: -200%"></canvas>
    <scroll-view scroll-y="true" class="scroll_box">
      <!-- 轮播图 -->
      <view class="swiper_section">
        <view class="swiper_section_spacing" v-if="details.photoUrl && details.photoUrl.length > 0">
            <swiper class="swiper"
              @change="swiperChange"
              :indicator-dots="false"
              :interval="2000"
              :duration="500"
              :style="{height: swiperHeight + 'px'}">
                <swiper-item v-for="(item, index) in details.photoUrl" :key="index">
                    <view class="swiper_item" v-if="isImage(item)">
                      <image :src="imgDomain + item" mode="widthFix"></image>
                    </view>
                    <view class="swiper_item" v-else>
                      <video :src="imgDomain + item" :autoplay="index === 0" muted show-mute-btn></video>
                    </view>
                </swiper-item>
            </swiper>
        </view>
        <!-- 脚标 -->
        <view class="swiper_list_cell">
          <text class="cell_text">{{swiperCurrentIndex + 1}}/{{details.photoUrl.length}}</text>
        </view>
      </view>
      <!-- 中间部分 -->
      <view class="middle_section" v-if="details.appName">
        <view class="info_container">
          <view class="price_share">
            <view class="price">
              <text class="unit">¥</text>
              <text class="nums">{{details.appPrice}}</text>
              <text class="old_p">¥{{details.appPrice + 200}}</text>
            </view>
            <view>
              <view class="share down" @click="showDownloadPoster = true">
                <text class="iconfont icon_share" style="font-size: 48rpx;">&#xe69a;</text>
              </view>
              <button class="share" open-type="share">
                <text class="iconfont icon_share">&#xe61e;</text>
              </button>
            </view>
          </view>
          <view class="title">{{details.appName}}</view>
          <view class="browse">
            <text v-if="details.browseNumber">浏览{{details.browseNumber}}次</text>
            <!-- <text v-if="details.registeredNumber" style="margin-left: 40rpx;">已报名{{details.registeredNumber}}</text> -->
            <!-- <text style="margin-left: 40rpx;">评价 {{details.name}} </text> -->
          </view>
        </view>
        <!-- <view class="sign_up_container">
          <Barrage></Barrage>
        </view> -->
      </view>
      <!-- 班别详情 -->
      <view class="class_details_section" v-if="details.description">
        <SplitterBar :tit="'班别详情'"></SplitterBar>
        <!-- <view class="detail" v-html="details.description"></view> -->
        <mp-html :content="details.description"></mp-html>
      </view>
    </scroll-view>
    <!-- 立即报名 学员端是立即报名 教练端是分享-->
    <view class="fixed_container" v-if="isStudent">
      <button class="submit sub1" @click="consult" mark:name="consult">在线咨询</button>
      <button class="submit" v-if='!authFlag'
          open-type='getPhoneNumber'
          @getphonenumber='verifyTelAccredit'>立即报名</button>
      <button class="submit" @click="signUp()" v-else mark:name="signUp">立即报名</button>
    </view>
    <view class="fixed_container" v-if="false">
      <button class="submit" @click="shareShow = true" v-if="!authFlag">分享</button>
    </view>
    <!-- 选择商品规格弹出 -->
    <!-- <view class="mask" @click="showPopup=false" v-if="showPopup"></view>
    <view class="popup_container" :class="{'active': showPopup}">
      <span class="iconfont close" @click="showPopup=false">&#xe634;</span>
      <view class="goods_info">
        <view class="info_box">
          <view class="image_box">
            <image class="img" mode="aspectFill" :src="imgDomain + details.photoUrlMain" v-if="details.photoUrlMain"></image>
          </view>
          <view class="price_box">
            <view class="p_t">
              <text class="unit">¥</text>
              <text class="nums">{{currentTrainingItem.salesPrice}}</text>
              <text class="old_p">¥{{currentTrainingItem.originalPrice}}</text>
            </view>
            <view class="p_b">已选：{{currentTrainingItem.labelText}}</view>
          </view>
        </view>
        <view class="spe_box">
          <view class="title">规格</view>
          <view class="container">
            <text class="label" v-for="item in details.trainingItemList"
            :class="{'active': currentTrainingItem.label === item.label}"
            :key="item.label" @click="currentTrainingItem = item">{{item.labelText}}</text>
          </view>
        </view>
      </view>
      <view class="submit">
        <button class="btn" @click="signUp()">确认</button>
      </view> -->
    <!-- </view> -->
    <!-- <ctjt-share v-if='shareShow' @cancel="shareShow = false" @weixinCallback="shareShow = false" @posterCallback="posterCallback"></ctjt-share> -->
    <!-- <ctjt-canvas v-if="canvasFlag" :param="canvasParam" @fail="() => {}" @success="canvasSuccess"></ctjt-canvas> -->
    <DownloadPoster v-if="showDownloadPoster" @close="showDownloadPoster = false" :data="downloadPosterData"/>
    <!-- 海报 -->
    <save-pic :canvasPath="canvasPath" v-if="showPoster" @close="showPoster = false"></save-pic>
    <view class="pop_box" v-if="showCounpon"></view>
    <view class="coupon_box" :animation="animationData">
      <view class="tit">优惠券活动</view>
      <Coupon :item="coupon" from="detail"></Coupon>
      <view class="des des1">恭喜您获得优惠券~！请在小程序菜单“我的”>“我的卡券“中查看</view>
      <view class="des des2">该优惠券需要到线下门店进行使用</view>
      <view class="btn" @click="callPhone()" mark:name="call">立即联系</view>
      <view class="close" @click="showCounpon = false;generateAnimationData(0);">
        <text class="iconfont">&#xe6af;</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import SplitterBar from '@/components/splitter_bar/index.vue';
import MpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html.vue';
import {
  getImageInfo,
  isImage,
  verifyTelAccredit,
  openCustomerService,
  addCarModelText,
  schoolTelephone,
  makePhoneCall,
  generateSceneId
} from '@/assets/js/common';
import { setGlobalData, getGlobalData } from '@/assets/js/global_data';
// import Barrage from '@/components/barrage/index.vue';
// import CtjtShare from '@/components/share/index.vue';
// import CtjtCanvas from '@/components/canvas/index.vue';
import SavePic from '@/components/save_pic/index.vue';
import DownloadPoster from '@/components/download_poster/index.vue';
import getCanvasParam from '@/pages/public/goods_detail/canvas_data';
import { proImgDomain } from '@/assets/js/config';
import { schoolId } from '@/config/build_path';
import { getClassCard } from '../home_new/get_canvas';
import Coupon from '../card_voucher/coupon.vue';

type DetailsType = {
  photoUrl?: string | Array<string>;
  trainingItemList: Array<any>;
  name?: string;
  id?: string;
  appName?: string;

}

type ObjType = {
  [key: string]: string;
}
@Component(
  {
    components: {
      MpHtml,
      SplitterBar,
      SavePic,
      Coupon,
      DownloadPoster
    }
  }
)
export default class GoodsDetail extends Vue {
  @Prop({ required: true }) tit!: string;

  imgDomain = proImgDomain;

  canvasParam = {};

  shareShow = false;

  showPoster = false;

  canvasFlag = false;

  private showPopup = false;

  id = ''; // 商品ID

  details: DetailsType = { trainingItemList: [] }; // 班别详情

  swiperHeight = 0; // banner图高度

  swiperCurrentIndex = 0; // swiper当前index

  // 是否是学员
  isStudent = true;

  // 是否已登录
  authFlag = false;

  showCounpon = false;

  showDownloadPoster = false; // 生成海报

  downloadPosterData = {}; // 生成海报的数据

  onLoad(options: any) {
    this.isStudent = !uni.getStorageSync('isCoach');
    this.id = options.id;
    this.getData();
    if (options.inviterId) {
      setGlobalData('inviterId', options.inviterId);
    }

    // 校验是否已登录
    if (uni.getStorageSync('mobile')) this.authFlag = true;
    const $emitter = getGlobalData('$emitter');
    $emitter.on('authorize', () => {
      this.authFlag = true;
    });
  }

  // 当前选择的学习类型
  currentTrainingItem = {};

  async getData() {
    // const details = await this.$http.get('goods/applet/v1/getProductById', { id: this.id });
    const details = await this.$http.get('goods/applet/v1/queryClassByID', { id: this.id });
    // photoUrl返回的是json字符串
    const { photoUrl } = details;
    details.photoUrlMain = photoUrl; // 取一张图作为主图
    const imageMsg: any = await getImageInfo(proImgDomain + photoUrl);
    // 按照长宽比例计算
    this.swiperHeight = imageMsg.height * (this.$systemInfo.windowWidth / imageMsg.width);
    details.photoUrl = [photoUrl];
    this.downloadPosterData = {
      detail: {
        ...details,
        url: photoUrl,
      },
      type: 4
    };
    try {
      if (typeof details.salesPrice === 'string') {
        const salesPrice = JSON.parse(details.salesPrice);
        const trainingItem: any = [];
        let flag = 1;
        // 找出最低价，展示默认选中的类型
        const originalPrice = JSON.parse(details.originalPrice);
        Object.keys(salesPrice).forEach(key => {
          const item = {
            label: key,
            labelText: addCarModelText(key),
            salesPrice: salesPrice[key],
            originalPrice: originalPrice[key]
          };
          if (flag === 1) {
            this.currentTrainingItem = item;
            details.price = salesPrice[key];
            flag = 2;
          }
          if (details.price > salesPrice[key]) {
            details.price = salesPrice[key];
            this.currentTrainingItem = item;
          }
          trainingItem.push(item);
        });
        details.originalPriceNum = (this.currentTrainingItem as any).originalPrice;
        details.trainingItemList = trainingItem;
      }
    } catch (error) {
      console.log(error);
    }
    this.details = details;
  }

  isImage(url: string) { // 判断是图片还是视频
    return isImage(url);
  }

  swiperChange(event: any) {
    this.swiperCurrentIndex = event.detail.current;
  }

  //  授权手机号的回调
  verifyTelAccredit(e: any) {
    verifyTelAccredit(e);
    const $emitter = getGlobalData('$emitter');
    $emitter.on('authorize', (flag) => {
      if (flag) this.signUp();
    });
  }

  // 点击立即报名
  // signUp(key: boolean) {
  //   if (this.details.trainingItemList.length > 1 && !key) {
  //     this.showPopup = true;
  //   } else {
  //     setGlobalData('currentTrainingItem', this.currentTrainingItem);
  //     setGlobalData('productDetail', this.details);
  //     uni.navigateTo({
  //       url: '/package_order/payment/index'
  //     });
  //   }
  // }

  consult() {
    const inviterInfo = uni.getStorageSync('inviterInfo');
    if (inviterInfo && inviterInfo.companyId !== '0' && inviterInfo.imId) {
      uni.navigateTo({
        url: `../../../package_im/pages/TUI-Chat/chat?conversationID=C2C${inviterInfo.imId}`
      });
      return;
    }
    openCustomerService();
  }

  callPhone() {
    const inviterInfo = uni.getStorageSync('inviterInfo');
    let phoneNumber = '';

    if (inviterInfo && inviterInfo.companyId !== '0') {
      phoneNumber = inviterInfo.mobile || schoolTelephone[inviterInfo.companyId];
    } else {
      phoneNumber = schoolTelephone[uni.getStorageSync('schoolId') || schoolId]; // 默认取驾校电话
    }
    makePhoneCall(phoneNumber);
  }

  coupon = {};

  async signUp() {
    this.callPhone();
    // if (schoolId === 638) { // 港安驾校特殊处理不发券
    //   this.callPhone();
    //   return;
    // }
    // // 查询是否有券
    // const coupon = await this.$http.post('sale/v1/mkt/coupon/receiveCoupon', { mobile: uni.getStorageSync('mobile'), userId: uni.getStorageSync('userId') });
    // if (!coupon) {
    //   this.callPhone();
    // } else {
    //   this.coupon = coupon;
    //   this.showCounpon = true;
    //   this.generateAnimationData(1);
    // }
  }

  // 生成海报
  posterCallback() {
    if (this.canvasPath) {
      this.showPoster = true;
      return;
    }
    this.shareShow = false;
    this.canvasFlag = true;
    uni.showLoading({
      title: '生成中'
    });
    const inviterDetail = uni.getStorageSync('inviterDetail');
    this.canvasParam = getCanvasParam(this.details, uni.getStorageSync('wechatUserInfo').avatarUrl, inviterDetail);
  }

  canvasPath = '';

  canvasSuccess(data: any) {
    uni.hideLoading();
    this.showPoster = true;
    this.canvasPath = data.res.tempFilePath;
  }

  async onShareAppMessage() {
    if (this.$platFormPc) {
      uni.showToast({
        icon: 'none',
        title: '请在手机端操作此功能'
      });
      return false;
    }
    uni.showLoading({
      title: '加载中...'
    });
    const imageUrl: any = await getClassCard(this.details, this);
    const sceneId = await generateSceneId({
      dynamicsId: this.details.id,
      publishExport: 1,
      publishFormat: 1,
      title: this.details.name || this.details.appName,
      type: 4,
      url: this.details.photoUrl[0]
    });
    uni.hideLoading();
    return {
      title: `${this.details.name || this.details.appName}的相关介绍，马上查看一下吧`,
      path: `/pages/public/dynamic/publish/share_landingpage?scene=${sceneId}`,
      imageUrl
    };
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
    this.animationData = animationRun.export();
  }
}

</script>

<style lang="less" scoped>
.coupon_box{
  width: 568rpx;
  padding: 64rpx 26rpx 48rpx;
  border-radius: 24rpx;
  position: fixed;
  left: 50%;
  top: 50%;
  margin-left: -310rpx;
  margin-top: -310rpx;
  background: #fff;
  z-index: 5;
  transform: scale(0);
  .close{
    transform: rotate(-45deg);
    position: absolute;
    right: 0;
    top: -90rpx;
    .iconfont{
      color: #999;
      font-size: 48rpx;
    }
  }
  .tit{
    color: @ctjt-color-text-main;
    line-height: 36rpx;
    font-size: 36rpx;
    font-weight: 500;
    text-align: center;
    margin-bottom: 40rpx;
  }
  .des{
    line-height: 38rpx;
    font-size: 26rpx;
    color: #666;
    text-indent: 52rpx;
  }
  .des1{
    margin-top: -24rpx;
  }
  .des2{
    line-height: 26rpx;
    margin: 8rpx 0 48rpx;
  }
  .btn{
    width: 370rpx;
    text-align: center;
    line-height: 88rpx;
    margin: 0 auto;
    color: @ctjt-color-text-main;
    background: @ctjt-color-primary;
    border-radius: 49rpx;
  }
}
.content {
  box-sizing: border-box;
  background-color: @ctjt-bgcolor-primary;
  overflow: hideen;
  .scroll_box{
    padding-bottom: 98rpx;
    height: 100%;
  }
}
.swiper_section {
  position: relative;
}
.swiper_section_spacing {
  .swiper {
    overflow: hidden;
  }
  .swiper_item {
    width: 100%;
    height: 100%;
    position: relative;
    // background-color: @ctjt-color-primary;
    image{
      width: 100%;
    }
    video{
      width: 100%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
.swiper_list_cell {
  position: absolute;
  right: 24rpx;
  bottom: 24rpx;
  display: flex;
  .cell_text {
    height: 50rpx;
    padding: 0 20rpx;
    border-radius: 25rpx;
    font-size: 28rpx;
    line-height: 50rpx;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.4);
  }
}
.middle_section {
  padding: 32rpx 24rpx;
  .info_container {
    background-color: #fff;
    border-radius: 8rpx;
    padding: 32rpx;
    .price_share {
      padding: 0 0 8rpx;
      display: flex;
      justify-content: space-between;
      .price {
        display: flex;
        align-items: baseline;
        .unit {
          font-size: 24rpx;
          color: @ctjt-color-price;
        }
        .nums {
          font-size: 48rpx;
          color: @ctjt-color-price;
        }
        .old_p {
          margin-left: 16rpx;
          font-size: 26rpx;
          color: @ctjt-color-text-secondary-one;
          text-decoration: line-through;
        }
      }
      .share {
        display: inline-block;
        margin: 0;
        padding: 0;
        line-height: 43rpx;
        background: transparent;
        &.down{
          position: relative;
          left: -30rpx;
          top: -4rpx;
        }
        .icon_share {
          font-size: 38rpx;
          color: @ctjt-color-text-main;
        }
      }
    }
    .title {
      line-height: 48rpx;
      color: @ctjt-color-text-main;
      font-size: 32rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      color: @ctjt-color-text-main;
    }
    .browse {
      margin-top: 16rpx;
      font-size: 24rpx;
      color: @ctjt-color-text-secondary-two;
    }
  }
  .sign_up_container {
    background-color: #fff;
    border-radius: 8rpx;
    margin-top: 17rpx;
    padding: 25rpx 32rpx;
    display: flex;
    align-items: center;
    .image_list {
      display: flex;
      align-items: center;
      .item_img {
        height: 38rpx;
        width: 38rpx;
        border-radius: 50%;
        margin-right: 16rpx;
      }
    }
    .user {
      font-size: 26rpx;
      color: @ctjt-color-text-secondary-one;
      .tips {
        margin-left: 8rpx;
        color: @ctjt-color-text-secondary-two;
      }
    }
  }
}
.class_details_section {
  .detail {
    .img {
      width: 100%;
      height: auto;
    }
  }
}
.fixed_container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  .submit {
    border-radius: 0;
    width: 100%;
    height: 98rpx;
    // background-image: linear-gradient(to right, @ctjt-color-btn-bgl, @ctjt-color-btn-bgr);
    background: @ctjt-color-primary;
    font-size: 32rpx;
    color: @ctjt-color-text-main;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sub1{
    background: #FFF8DE;
  }
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.popup_container {
  position: fixed;
  bottom: -100%;
  left: 0px;
  width: 100%;
  background-color: #fff;
  border-radius: 8rpx 8rpx 0 0;
  transition: all 0.3s;
  &.active{
    bottom: 0;
  }
  .close {
    position: absolute;
    right: 16rpx;
    top: 16rpx;
    font-size: 32rpx;
    color: #D8D8D8;
  }
  .goods_info {
    padding: 72rpx 32rpx 64rpx;
    .info_box {
      padding-bottom: 40rpx;
      display: flex;
      border-bottom: 1rpx solid @ctjt-color-border-two;
      .image_box {
        width: 160rpx;
        height: 160rpx;
        border-radius: 8rpx;
        overflow: hidden;
        background-color: antiquewhite;
        .img {
          width: 100%;
          height: 100%;
        }
      }
      .price_box {
        margin-left: 24rpx;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        .p_t {
          margin-bottom: 11rpx;
          .unit {
            font-size: 32rpx;
            color: @ctjt-color-price;
          }
          .nums {
            font-size: 48rpx;
            color: @ctjt-color-price;
          }
          .old_p {
            margin-left: 12rpx;
            font-size: 26rpx;
            color: @ctjt-color-text-secondary-one;
            text-decoration: line-through;
          }
        }
        .p_b {
          font-size: 24rpx;
          color: @ctjt-color-text-primary;
        }
      }
    }
    .spe_box {
      padding-top: 40rpx;
      .title {
        font-size: 30rpx;
        color: @ctjt-color-text-primary;
      }
      .container {
        margin-top: 16rpx;
        .label {
          display: inline-block;
          min-width: 126rpx;
          padding: 0 60rpx;
          height: 60rpx;
          margin-right: 40rpx;
          border-radius: 30rpx;
          background-color: #fff;
          font-size: 30rpx;
          text-align: center;
          line-height: 60rpx;
          color: @ctjt-color-text-primary;
          border: 1px solid @ctjt-color-border-two;
          margin-bottom: 20rpx;
          &.active {
            background-color: #FFF8DE;
            color: @ctjt-color-text-main;
            border-color: @ctjt-color-primary;
          }
          &:last-of-type {
            margin-right: 0;
          }
        }
      }
    }
  }
  .submit {
    .btn {
      border-radius: 0;
      width: 100%;
      height: 98rpx;
      background: @ctjt-color-primary;
      font-size: 32rpx;
      color: @ctjt-color-text-primary;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
