<template>
  <view class="content">
    <button
      v-if='authFlag && !isPersonal'
      class='get_phone'
      style="z-index: 11;"
      open-type='getPhoneNumber'
      @getphonenumber='verifyTelAccredit'
    ></button>
    <view
      v-if='userInfoFlag && !isPersonal && !authFlag'
      class='get_phone'
      @click='getUserProfile'
    ></view>
    <view class="header_section">
      <view class="capsule"></view>
      <view class="container_box" :style="{height: !authFlag ? 'auto' : '199rpx', overflow: !authFlag ? 'auto' : 'hidden'}">
        <view class="user_box haslogin_class">
          <view class="user_img">
            <image class="img" :src="wechatUserInfo.avatarUrl || defaultUserImg"></image>
          </view>
          <view class="user_info">
            <!-- 已登录未报名 -->
            <template v-if="!authFlag">
              <view class="info_box">
                <view class="nick_name">{{userDetail.name}}</view>
                <view class="label">
                  <text>{{userDetail.drivingSchoolName}}</text>
                  <text style="margin-left: 32rpx;" v-if="userDetail.showStar > 0">{{['一', '二', '三', '四', '五'][userDetail.showStar-1]}}星教练</text>
                  <text style="margin-left: 32rpx;" v-if="userDetail.type === 3">金牌客服</text>
                </view>
              </view>
            </template>
            <!-- 未登录用户 -->
            <template v-else>
              <button class="login">立即登录</button>
            </template>
          </view>
        </view>
        <!-- 登录后 -->
        <view class="gradual_change_box"></view>
        <view class="list_section" v-if="!authFlag">
          <view class="item_box">
            <view class="tit">入职日期</view>
            <view class="info">{{userDetail.entryTime}}</view>
          </view>
          <view class="item_box">
            <view class="tit">所属片区</view>
            <view class="info">{{userDetail.regionName}}</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 列表 -->
    <view class="middle_section">
      <view class="list_container">
        <view class="item_li" v-for="item in list" :key="item.value" @click="clickItem(item.click)">
          <view class="item_l">
            <span class="iconfont" v-html="item.icon"></span>{{item.label}}
          </view>
          <view v-if="item.hasArrow" class="iem_r">
            {{userDetail[item.rText] || ''}}
            <span class="iconfont">&#xe627;</span>
          </view>
        </view>
      </view>
    </view>
    <!-- 我的二维码 -->
    <view class="qr_code_section" v-if="saveFlag" :style="{paddingTop: statusBarHeight + 53 + 'px'}">
      <view class="container">
        <image class="share_poster_img" :src="canvasPath"></image>
        <span class="close iconfont" @click="saveFlag = false;isReady = false;">&#xe634;</span>
      </view>
      <view class="opts_box">
        <button class="btn wexin" @click="shareToFriend">分享到微信</button>
        <button class="btn album" @click="savePosterToAlbum">保存到相册</button>
      </view>
    </view>
    <ctjt-canvas
        v-if="isReady"
        :param="canvasParam"
        @fail="canvasFail"
        @success="canvasSuccess"></ctjt-canvas>
  </view>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { SVGDEFAULTUSERIMG, SVGDEFAULTUSERLOGINIMG } from '@/assets/svg';
import CtjtCanvas from '@/components/canvas/index.vue';
import { getGlobalData } from '@/assets/js/global_data';
import {
  loginVerification,
  verifyTelAccredit,
  getSystemInfo,
  savePosterToAlbum
} from '@/assets/js/common';
// import getCanvasParam from './canvas_data';

type ClassType = {
  [key: string]: any;
}

type UniExpand = {
  showShareImageMenu: any;
  getUserProfile: any;
} & UniApp.Uni;

@Component({
  components: { CtjtCanvas }
})
export default class EnterpriseMy extends Vue {
  statusBarHeight = getSystemInfo().statusBarHeight;

  // 订单卡片背景图片
  myCardBg = 'https://file.aicar365.com/mini-program/common/wode_kapian_bg.png';

  // 是否为学员端
  isPersonal = true;

  // 是否需要授权
  authFlag = true;

  userInfoFlag = true;

  wechatUserInfo: any = {};

  created() {
    this.isPersonal = this.$isPersonal;
  }

  onShow() {
    // 校验是否已登录
    if (uni.getStorageSync('wechatUserInfo')) {
      this.userInfoFlag = false;
      this.wechatUserInfo = uni.getStorageSync('wechatUserInfo');
    }
    const $emitter = getGlobalData('$emitter');
    $emitter.on('authorize', (flag: boolean) => {
      this.authFlag = flag;
      if (!flag && !this.userDetail.name) this.queryWeChatUser();
    });
    loginVerification();
  }

  getUserProfile() {
    (uni as UniExpand).getUserProfile({
      desc: '登录',
      success: (event: any) => {
        this.userInfoFlag = false;
        uni.setStorageSync('wechatUserInfo', event.userInfo);
        this.wechatUserInfo = event.userInfo;
      },
      fail: () => {
        uni.showToast({
          title: '请授权获取信息',
          icon: 'none'
        });
      }
    });
  }

  userDetail: any = {};

  async queryWeChatUser() {
    // 0、散客 1、学员 2、教练 3、客服
    const type = uni.getStorageSync('userType');
    const userDetail = await this.$http.post('user/v1/wechat/queryWeChatUser', { type });
    if (userDetail.entryTime) userDetail.entryTime = userDetail.entryTime.split(' ')[0];
    // 教练端的为了和queryQrCodeUserDetail一致
    if (!this.isPersonal) {
      userDetail.type = type - 1;
      // 如果存有带教好评数，带过来
      if (uni.getStorageSync('inviterDetail')) userDetail.praiseNum = uni.getStorageSync('inviterDetail').praiseNum;
    }
    this.userDetail = userDetail;
  }

  // 默认头像
  private defaultUserImg = SVGDEFAULTUSERIMG || SVGDEFAULTUSERLOGINIMG;

  // 教练二维码分享
  isReady = false;

  // 展示名片海报
  saveFlag = false;

  // 监听分析框展示状态，判断底部tab栏是否显示
  @Watch('saveFlag')
  onChangeValue(newVal: boolean) {
    if (newVal) {
      uni.hideTabBar();
    } else {
      uni.showTabBar();
    }
  }

  private canvasPath = '';

  public canvasParam = {};

  canvasFail(e: any) {
    console.log(e.err);
  }

  canvasSuccess(data: any) {
    this.canvasPath = data.res.tempFilePath;
    this.saveFlag = true;
    uni.hideLoading();
  }

  savePosterToAlbum() {
    savePosterToAlbum(this.canvasPath);
  }

  shareToFriend() {
    (uni as UniExpand).showShareImageMenu({
      path: this.canvasPath
    });
  }

  verifyTelAccredit(e: any) {
    verifyTelAccredit(e);
  }

  private showGoodsInfo = true

  private list = [
    {
      icon: '&#xe63c;', value: 1, label: '我的招生', rText: '', hasArrow: true, click: 'toast'
    },
    {
      icon: '&#xe63a;', value: 2, label: '门店', rText: 'storeName', hasArrow: true
    },
    {
      icon: '&#xe63d;', value: 3, label: '二维码名片', rText: '', hasArrow: true, click: 'getQr'
    }
  ]

  clickItem(name: string) {
    if (name) (this as ClassType)[name]();
  }

  toast() {
    uni.showToast({
      title: '二期功能',
      icon: 'none'
    });
  }

  async getQr() {
    if (this.canvasPath) {
      this.saveFlag = true;
      return;
    }
    uni.showLoading({
      title: '生成中'
    });
    await this.queryWeChatQRCode();
  }

  async queryWeChatQRCode() {
    const data = {
      url: 'pages/public/home/index',
      params: `userId-${wx.getStorageSync('userId')}`
    };
    let qrcode = await this.$http.post('user/v1/wechat/queryWeChatQRCode', data);
    qrcode = `data:image/jpg;base64,${qrcode}`;
    this.send_code(qrcode);
  }

  // 将base64图片转网络图片
  send_code(code: string) {
    const fs = wx.getFileSystemManager();
    const times = new Date().getTime();
    const codeimg = `${wx.env.USER_DATA_PATH}/${times}.png`;
    fs.writeFile({
      filePath: codeimg,
      data: code.slice(22),
      encoding: 'base64',
      success: () => {
        // this.canvasParam = getCanvasParam(this.userDetail, this.wechatUserInfo.avatarUrl, codeimg);
        this.isReady = true;
      }
    });
  }
}

</script>

<style lang="less" scoped>

.header_section {
  .capsule{
    height: 128rpx;
    width: 100%;
    background-color: @ctjt-color-primary-50;
  }
  .container_box {
    position: relative;
  }
  .user_box {
    box-sizing: border-box;
    padding: 23rpx 56rpx 0;
    height: 200rpx;
    width: 100%;
    background-image: linear-gradient(to bottom, @ctjt-color-primary-50, @ctjt-color-primary-30);
    display: flex;
    &.haslogin_class {
      height: 318rpx;
    }
    .user_img {
      .img {
        width: 110rpx;
        height: 110rpx;
        border-radius: 50%;
      }
    }
    .user_info {
      margin-left: 33rpx;
      height: 110rpx;
      display: flex;
      align-items: center;
      .login {
        width: 176rpx;
        height: 60rpx;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8rpx;
        border: 1px solid #fff;
        font-size: 36rpx;
        font-weight: 500;
        color: #fff;
        background-color: transparent;
      }
      .info_box {
        height: 100%;
      }
      .nick_name {
        font-size: 36rpx;
        color: #fff;
        padding-top: 8rpx;
      }
      .label {
        margin-top: 8rpx;
        font-size: 26rpx;
        color: #fff;
      }
    }
  }
  .gradual_change_box {
    height: 40rpx;
    width: 100%;
    background-image: linear-gradient(to bottom, #F6B364, #DE8B28);
  }
  .list_section {
    position: absolute;
    bottom: 0;
    left: 24rpx;
    box-sizing: border-box;
    width: calc(100% - 48rpx);
    padding: 0 32rpx;
    background-color: #fff;
    border-radius: 8rpx 8rpx 0 0;
    .item_box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx 0;
      border-bottom: 1rpx solid @ctjt-color-border-two;
      &:last-of-type {
        border-bottom: 0;
      }
      .tit {
        font-size: 28rpx;
        color: @ctjt-color-text-secondary-three;
      }
      .info {
        font-size: 28rpx;
        color: @ctjt-color-text-secondary-two;
      }
    }
  }
}
.middle_section {
  padding: 32rpx 24rpx;
  .goods_container {
    height: 215rpx;
    border-radius: 8rpx;
    position: relative;
    .goods_container_bg {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }
    .goods_container_info {
      box-sizing: border-box;
      padding: 32rpx;
      display: flex;
      z-index: 1;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }
    .goods_img {
      width: 192rpx;
      height: 150rpx;
      background-color: antiquewhite;
    }
    .goods_info {
      flex: 1;
      margin-left: 32rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title {
        font-size: 32rpx;
        color: @ctjt-color-text-main;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .iconfont {
          font-size: 24rpx;
        }
      }
      .info_b {
        .price, .data {
          font-size: 28rpx;
          color: @ctjt-color-text-secondary-one;
        }
        .data {
          margin-top: 4rpx;
        }
      }
    }
  }
  .list_container {
    border-radius: 8rpx;
    padding: 0 32rpx;
    background-color: #fff;
    .item_li {
      padding: 31rpx 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1rpx solid @ctjt-color-border-two;
      &:last-of-type {
        border-bottom: 0;
      }
      .item_l {
        font-size: 28rpx;
        color: @ctjt-color-text-secondary-three;
        display: flex;
        align-items: center;
        .iconfont {
          margin-right: 20rpx;
          font-size: 36rpx;
          color: @ctjt-color-icon;
        }
      }
      .iem_r {
        font-size: 28rpx;
        display: flex;
        align-items: center;
        color: @ctjt-color-text-secondary-two;
        .iconfont {
          color: #C7C7CC;
          margin-left: 16rpx;
          font-size: 16rpx;
        }
      }
    }
  }
}
.qr_code_section {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #F4F4F4;
  box-sizing: border-box;
  .container {
    position: relative;
    margin: 0 auto;
    width: 670rpx;
    height: 1012rpx;
    border-radius: 8rpx;
    background-color: #fff;
    overflow: hidden;
    .share_poster_img {
      width: 100%;
      height: 100%;
    }
    .close {
      font-size: 32rpx;
      position: absolute;
      top: 16rpx;
      right: 16rpx;
      color: #FBD8AF;
    }
  }
  .opts_box {
    margin-top: 56rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    .btn {
      box-sizing: border-box;
      width: 240rpx;
      height: 70rpx;
      padding: 0;
      margin: 0;
      border-radius: 8rpx;
      font-size: 26rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      &.wexin {
        color: @ctjt-color-primary-70;
        border: 1rpx solid @ctjt-color-primary-70;
      }
      &.album {
        margin-left: 40rpx;
        color: #fff;
        background-image: linear-gradient(to right, #FF9600, #FF6D00);
      }
    }
  }

}
</style>
