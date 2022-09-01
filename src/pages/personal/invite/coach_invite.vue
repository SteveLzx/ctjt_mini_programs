<template>
  <view class="bg">
    <view class="box">
      <input class="input_telephone" maxlength="11" type="number" v-model="telephone">
      <view class="search_box">
        <view>输入手机号核实您所在驾校员工身份，即可生成您的专属二维码邀请链接哦。</view>
        <button class="search_btn" @click="queryInfo">搜索</button>
      </view>
    </view>
    <view class="info_box" v-if="coachInfo && coachInfo.trueName">
      <view class="name_text">{{coachInfo.trueName}}</view>
      <view class="info_content">
        <view class="schoolName">{{coachInfo.drivingSchoolName}}</view>
        <view class="station">{{coachInfo.station}}</view>
      </view>
    </view>
    <view class="info_box" v-if="coachInfo && coachInfo.trueName">
      <view class="name_text">邀请学员</view>
      <view class="share_content">
        <view :class="['share_box', shareType === 0 &&'share_active']" @click="changeShareType(0)">
          <span class="iconfont">&#xe688;</span>
          <view>推荐学员</view>
        </view>
        <view :class="['share_box', shareType === 1 &&'share_active']" @click="changeShareType(1)">
          <span class="iconfont">&#xe689;</span>
          <view>报名</view>
        </view>
      </view>
    </view>

    <view class="btn_group" v-if="coachInfo && coachInfo.trueName">
      <button class="btn btn1" @click="getPoster(1)">生成海报</button>
      <button class="btn btn2" @click="getPoster(2)">生成专属二维码</button>
    </view>

    <page-container z-index="1000" :show="showPage" position="center">
      <view class="canvasBox" >
        <!-- <ctjt-canvas
          v-if="isReady"
          :param="canvasParam"
          @fail="canvasFail"
          @success="canvasSuccess"></ctjt-canvas> -->
        <image class="share_poster_img" mode="widthFix" :src="canvasPath"></image>
        <icon class="cancel_btn" type="cancel" v-if="isReady&&canvasPath" size="26" color="#ccc" @click="backToMain"></icon>

        <view class="btn_group" v-if="isReady&&canvasPath">
          <button class="btn btn1" @click="shareToFriend">分享到微信</button>
          <button class="btn btn2" @click="savePosterToAlbum">保存到相册</button>
        </view>
      </view>
    </page-container>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  savePosterToAlbum
} from '@/assets/js/common';
import { schoolId } from '@/config/build_path';
// import CtjtCanvas from '@/components/canvas/index.vue';
import getCanvasParam from './canvas_data';
import getBmParam from './bm_data';
import getQrParam from './qr_code_data';

type UniExpand = {
  showShareImageMenu: any;
  getUserProfile: any;
} & UniApp.Uni;

@Component({
  components: {
    // CtjtCanvas
  }
})
export default class MyInvite extends Vue {
  telephone = ''

  coachInfo: any = {}

  showPage = false

  shareType = 0;

  active: any = {}

  qrcode = ''

  public canvasParam = {};

  // 教练二维码分享
  isReady = false;

  bgUrl = 'https://file.aicar365.com/mini-program/common/canvas_bg_ly.png';

  bmBgUrl = 'https://file.aicar365.com/mini-program/common/canvas_bg_ly_bm.png';

  studentConfig = {}

  async created() {
    uni.hideHomeButton();
    // eslint-disable-next-line no-undef
    this.coachInfo = wx.getStorageSync('coachInfo');
    const res: any = await this.$http.post(
      'sale/v1/recommend/joinActivity',
      {
        banbanToken: '',
        activitiyId: 10001,
        recommendedId: '',
        openId: '',
        mchId: (this.coachInfo && this.coachInfo.mchId) || '',
        mobileNo: (this.coachInfo && this.coachInfo.mobileNo) || ''
      }
    );
    this.active = res || {};
    if (this.coachInfo && this.coachInfo.mchId && this.active.activitiyId) {
      const config: any = await this.$http.post('sale/v1/reward/queryRewardConf', {
        mchId: this.coachInfo.mchId,
        activitiyId: this.active.activitiyId
      });
      this.studentConfig = config || {};
    }
  }

  async queryInfo() {
    const regs = /^1\d{10}$/;
    if (regs.test(this.telephone)) {
      const res = await this.$http.get(`sale/v1/worker/getWorkerInfo/${this.telephone}`);
      if (res) {
        this.coachInfo = res || {};
        console.log(this.coachInfo);
        uni.setStorageSync('coachInfo', this.coachInfo);
        const config: any = await this.$http.post('sale/v1/reward/queryRewardConf', {
          mchId: this.coachInfo.mchId,
          activitiyId: this.active.activitiyId
        });
        this.studentConfig = config || {};
      } else {
        this.coachInfo = {};
        uni.setStorageSync('coachInfo', this.coachInfo);
        uni.showToast({
          title: '未查询到该手机号信息',
          icon: 'none',
          duration: 2000
        });
      }
    } else {
      this.coachInfo = {};
      uni.setStorageSync('coachInfo', this.coachInfo);

      uni.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      });
    }
  }

  private canvasPath = '';

  canvasFail(e: any) {
    console.log(e.err);
  }

  canvasSuccess(data: any) {
    this.canvasPath = data.res.tempFilePath;
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

  // 将base64图片转网络图片
  sendCode(code: string, type: number) {
    // eslint-disable-next-line no-undef
    const fs = wx.getFileSystemManager();
    const times = new Date().getTime();
    // eslint-disable-next-line no-undef
    const codeimg = `${wx.env.USER_DATA_PATH}/${times}.png`;
    fs.writeFile({
      filePath: codeimg,
      data: code,
      encoding: 'base64',
      success: () => {
        if (type === 1 && this.shareType === 0) {
          this.canvasParam = getCanvasParam(this.coachInfo, this.studentConfig, this.bgUrl, codeimg);
        } else if (type === 1 && this.shareType === 1) {
          this.canvasParam = getBmParam(this.coachInfo, this.bmBgUrl, codeimg);
        } else {
          this.canvasParam = getQrParam(codeimg, this.shareType);
        }
        this.isReady = true;
      }
    });
  }

  async getPoster(type) {
    this.showPage = true;
    uni.showLoading({
      title: '海报生成中',
    });
    this.getQRCode((code: string) => {
      this.sendCode(code, type);
    });
  }

  backToMain() {
    this.showPage = false;
    this.canvasPath = '';
    this.isReady = false;
  }

  changeShareType(type: number) {
    this.shareType = type;
  }

  async getQRCode(callback?: Function) {
    const res: any = await this.$http.post(
      'sale/v1/recommend/joinActivity',
      {
        banbanToken: '',
        activitiyId: 10001,
        recommendedId: '',
        openId: '',
        mchId: (this.coachInfo && this.coachInfo.mchId) || '',
        mobileNo: (this.coachInfo && this.coachInfo.mobileNo) || ''
      }
    );
    this.active = res || {};
    let data = {};
    if (this.shareType === 0) {
      data = {
        url: 'pages/personal/invite/index',
        params: `sId-${this.active.mchId}_rId-${this.active.activitiyId}`,
        schoolId
      };
    } else {
      data = {
        url: 'pages/personal/invite/landing_page',
        params: `uId-${this.active.id}_sId-${this.active.mchId}`,
        schoolId
      };
    }

    const base64 = await this.$http.post('user/v1/wechat/queryWeChatQRCode', data);
    if (typeof (callback) === 'function') {
      callback(base64);
    }
  }

  async onShareAppMessage() {
    const res: any = await this.$http.post(
      'sale/v1/recommend/joinActivity',
      {
        banbanToken: '',
        activitiyId: 10001,
        recommendedId: '',
        openId: '',
        mchId: (this.coachInfo && this.coachInfo.mchId) || '',
        mobileNo: (this.coachInfo && this.coachInfo.mobileNo) || ''
      }
    );
    this.active = res || {};
    return {
      title: '邀请您了解一下这家靠谱驾校',
      path: this.shareType === 0
        ? `/pages/personal/invite/index?scene=sId-${this.active.mchId}_rId-${this.active.activitiyId}`
        : `/pages/personal/invite/landing_page?scene=uId-${this.active.id}_sId-${this.active.mchId}`,
      imageUrl: 'https://file.aicar365.com/mini-program/common/yaoqinghan.png'
    };
  }
}

</script>

<style lang="less" scoped>
.bg{
  background: #F5F3F5;
  height: 100%;
  &::before{
    display: table;
    content: '';
  }
  .box{
    padding: 56rpx 32rpx;
    margin: 32rpx 24rpx;
    border-radius: 16rpx;
    background: #fff;
    .input_telephone{
      border: 1rpx solid #ccc;
      border-radius: 16rpx;
      line-height: 88rpx;
      height: 88rpx;
      font-size: 28rpx;
      padding: 0 20rpx;
      margin-bottom: 32rpx;
    }
    .search_box{
      display: flex;
      justify-content: space-between;
      font-size: 24rpx;
      color: #999;
      .search_btn{
        min-width: 170rpx;
        background: #D40620;
        width: 170rpx;
        margin-left: 30rpx;
        height: 70rpx;
        line-height: 70rpx;
        color: #fff;
        font-size: 32rpx;
        border-radius: 16rpx;
      }
    }
  }

  .info_box{
    padding: 0rpx 24rpx;
    margin: 32rpx 24rpx;
    border-radius: 16rpx;
    background: #fff;
    .name_text{
      line-height: 96rpx;
      height: 96rpx;
      border-bottom: 1rpx solid #999;
      padding: 0rpx 8rpx;
      font-size: 28rpx;
      color: #000;
    }
    .info_content{
      display: flex;
      justify-content: space-between;
      line-height: 85rpx;
      height: 85rpx;
      font-size: 28rpx;
      color: #000;
      padding: 0rpx 8rpx;

    }
    .station{
      min-width: 150rpx;
      width: 150rpx;
      text-align: right;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .schoolName{
      flex-grow: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .share_content{
      display: flex;
      justify-content: space-around;
      padding: 32rpx;
      font-size: 28rpx;
    }
    .share_box{
      width: 160rpx;
      text-align: center;
      border: 1px solid #999;
      color: #999;
      padding: 16rpx;
      border-radius: 16rpx;
    }
    .share_active{
      border: 1px solid #D40620;
      color: #D40620;
      background: #FFF2F4;
    }
  }

  .btn_group{
    display: flex;
    justify-content: space-between;
    margin: 90rpx 16rpx 32rpx;
    width: calc(100% - 32rpx);
    .btn{
      width: 45%;
      line-height: 82rpx;
      height: 82rpx;
      font-size: 36rpx;
      border-radius: 16rpx;
    }
  }
  .btn1{
    border: 1rpx solid #D40620;
    color: #D40620;
  }
  .btn2{
    background: #D40620;
    color: #fff;
  }
  .cancel_btn{
    position: absolute;
    right: 20rpx;
    top: 20rpx;
  }
}
.share_poster_img{
  width: 80%;
  margin-top: 100rpx;
}
.canvasBox{
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>
