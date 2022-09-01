<template>
  <view>
    <canvas type="2d" id="nemt" style="height: 1486rpx;width: 690rpx; position:fixed;top:200%;"></canvas>
    <view class="content">
      <view class="tit">介绍人页面</view>
      <view class="desc">分享出去直接被分享人(介绍人)打开将看到以下页面</view>
      <image class="nemt_banner" :src="imgUrl" mode="widthFix"/>
    </view>
    <view class="btns">
      <button class="btn download_btn" @click="save">
        <text class="iconfont">&#xe69a;</text>
        <label>下载</label>
      </button>
      <button
        class="btn share_btn"
        data-type="share"
        :data-detail="detail"
        @click="shareImg"
      >
        <text class="iconfont">&#xe696;</text><label>分享</label>
      </button>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  schoolName,
  schoolTelephone,
  generateSceneId,
  queryWeChatQRCode,
  savePosterToAlbum
} from '@/assets/js/common';
import { queryNameCardInfo } from '@/pages/public/_common/index';
import { schoolId as sId } from '@/config/build_path';
import { imgDomain } from '@/assets/js/config';
import { getGlobalData } from '@/assets/js/global_data';

@Component
export default class Nemt extends Vue {
  detail: any = {
    cardName: '',
    mobile: ''
  };

  imgUrl = '';

  sceneId: any = '';

  imgDomain = imgDomain;

  async created() {
    uni.showLoading({
      title: '海报生成中...'
    });
    uni.setNavigationBarTitle({
      title: getGlobalData('posterDetail').name
    });
    this.detail = await queryNameCardInfo(uni.getStorageSync('userId'));
    this.sceneId = await this.productSceneId();
    const codeimg = await queryWeChatQRCode({ params: this.sceneId as string });
    this.getCanvas(codeimg);
  }

  productSceneId() {
    return new Promise(resolve => {
      const { id, userId, userName } = this.detail;
      generateSceneId({
        dynamicsId: id || userId,
        publishExport: 1,
        publishFormat: 1,
        title: this.detail.userType === 3 ? schoolName[sId] : userName,
        type: 7,
        extra: {
          id: getGlobalData('posterDetail').id,
          type: 'poster'
        }
      }).then(sceneId => {
        resolve(sceneId);
      });
    });
  }

  save() {
    (this as any).$track.send({
      event: 'ck',
      extra: {
        down: true,
        scene: this.sceneId,
        id: getGlobalData('posterDetail').id
      }
    });
    savePosterToAlbum(this.imgUrl);
  }

  shareImg() {
    (this as any).$track.send({
      event: 'ck',
      extra: {
        share: true,
        scene: this.sceneId,
        id: getGlobalData('posterDetail').id
      }
    });
    (uni as any).showShareImageMenu({
      path: this.imgUrl
    });
  }

  getCanvas(codeimg) {
    // eslint-disable-next-line no-undef
    const query = wx.createSelectorQuery();
    query.select('#nemt')
      .fields({ node: true, size: true })
      .exec(async (res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        ctx.restore();
        const dpr = 2;
        const width = 690;
        const height = 1488;
        function dprT(data) {
          return data * dpr;
        }
        canvas.width = width;
        canvas.height = height;
        ctx.scale(1, 1);
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        ctx.save();

        const imgPromise = () => new Promise((resolve, reject) => {
          const img = canvas.createImage();
          img.onload = () => {
            resolve(img);
          };
          img.onerror = () => {
            reject(new Error('`fail to fetch image form`'));
            uni.showToast({
              icon: 'none',
              title: '生成失败'
            });
          };
          // img.src = 'https://file.aicar365.com/mini-program/common/gaokaohaibao_poster.jpg';
          // img.src = `https://file.aicar365.com/mini-program/${sId}/common/gaokaohaibao_poster.jpg?t=${new Date().getTime()}`;
          img.src = imgDomain + getGlobalData('posterDetail').url;
        });
        const img = await imgPromise();
        ctx.drawImage(img, 0, 0, width, height);

        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(0, dprT(637), width, dprT(214));

        const coachInfo = uni.getStorageSync('coachInfo') || {};
        const schoolId = uni.getStorageSync('schoolId') || sId;
        const userType = uni.getStorageSync('userType');
        const wechatUserInfo = uni.getStorageSync('wechatUserInfo');

        const avatarUrl = wechatUserInfo && uni.getStorageSync('isCoach') && wechatUserInfo.avatarUrl ? wechatUserInfo.avatarUrl : `https://file.aicar365.com/mini-program/${sId}/common/headportrait_normal.png`;
        const avatarPromise = () => new Promise((resolve, reject) => {
          const avatar = canvas.createImage();
          avatar.onload = () => {
            resolve(avatar);
          };
          avatar.onerror = () => {
            reject(new Error(`fail to fetch image form: ${avatarUrl}`));
            uni.showToast({
              icon: 'none',
              title: '生成失败'
            });
          };
          avatar.src = avatarUrl;
        });
        const img2 = await avatarPromise();
        ctx.beginPath();
        ctx.arc(dprT(60 / 2 + 10), dprT(60 / 2 + 648), dprT(60 / 2), 0, Math.PI * 2, false);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.clip();
        ctx.drawImage(img2, dprT(10), dprT(648), dprT(60), dprT(60));
        ctx.restore();

        ctx.font = `normal normal normal ${dprT(16)}px PingFang SC`;
        ctx.fillStyle = '#fff';
        ctx.fillText(userType === 3 ? schoolName[sId] : (this.detail.cardName || coachInfo.name || schoolName[schoolId]), dprT(80), dprT(686));
        ctx.font = `normal normal normal ${dprT(14)}px PingFang SC`;
        ctx.fillText('一对一学车咨询: ', dprT(10), dprT(730));
        ctx.font = `normal normal normal ${dprT((this.detail.mobile || coachInfo.mobile) && userType !== 3 ? 18 : 15)}px PingFang SC`;
        ctx.fillText(userType === 3 ? schoolTelephone[sId] : (this.detail.mobile || coachInfo.mobile || schoolTelephone[schoolId]), dprT(113), dprT(732));
        ctx.fillStyle = '#fff';
        ctx.font = `normal normal normal ${dprT(11)}px PingFang SC`;
        ctx.fillText('长按识别  报名优惠 ', dprT(244), dprT(733));

        ctx.lineWidth = 1;
        ctx.strokeStyle = '#fff';

        ctx.moveTo(dprT(236), dprT(649));
        ctx.lineTo(dprT(236), dprT(727));
        ctx.stroke();

        const codePromise = () => new Promise((resolve, reject) => {
          const code = canvas.createImage();
          code.onload = () => {
            resolve(code);
          };
          code.onerror = () => {
            reject(new Error(`fail to fetch image form: ${codeimg}`));
            uni.showToast({
              icon: 'none',
              title: '生成失败'
            });
          };
          code.src = codeimg;
        });

        ctx.fillStyle = 'white';
        ctx.fillRect(dprT(255), dprT(645), dprT(75), dprT(75));

        const img3 = await codePromise();
        ctx.drawImage(img3, dprT(255), dprT(645), dprT(75), dprT(75));

        // eslint-disable-next-line no-undef
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          canvas,
          width,
          height,
          fileType: 'jpg',
          success: (result: any) => {
            this.imgUrl = result.tempFilePath;
            uni.hideLoading();
          },
          fail: error => {
            console.log(error);
          }
        });
      });
  }

  // async onShareAppMessage() {
  //   if (this.$platFormPc) {
  //     uni.showToast({
  //       icon: 'none',
  //       title: '请在手机端操作此功能'
  //     });
  //     return false;
  //   }
  //   // const title = `您好，我是${this.detail.userType !== 3 ? this.detail.userName : schoolName[sId]}。这是我的名片，请惠存！`;
  //   const title = `高考结束啦~！开始学车啦~！${schoolName[sId]}专属优惠！`;
  //   return {
  //     title,
  //     path: `/pages/public/dynamic/publish/share_landingpage?scene=${this.sceneId}`,
  //     imageUrl: 'https://file.aicar365.com/mini-program/common/gaokaohaibao_sharecard.jpg',
  //   };
  // }
}

</script>

<style lang="less" scoped>
.content{
  padding: 0 30rpx 136rpx;
  background: #fff;
  .nemt_banner{
    width: 100%;
    height: 1756rpx;
    border-radius: 24rpx;
  }
  .tit{
    padding: 24rpx 0;
    color: @ctjt-color-text-main;
    font-size: 32rpx;
    line-height: 32rpx;
  }
  .desc{
    line-height: 26rpx;
    font-size: 26rpx;
    color: @ctjt-color-text-secondary-one;
    margin-bottom: 16rpx;
  }
}
.btns{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  padding: 16rpx 30rpx 32rpx;
  border-top: solid @ctjt-color-border-two 1rpx;
  background: #fff;
  .btn{
    flex: 1;
    line-height: 88rpx;
    text-align: center;
    color: @ctjt-color-text-main;
    font-size: 32rpx;
    border-radius: 49rpx;
    .iconfont{
      margin-right: 16rpx;
    }
  }
  .download_btn{
    border: solid 2rpx @ctjt-color-text-main;
    margin-right: 30rpx;
  }
  .share_btn{
    background: @ctjt-color-primary;
  }
}
</style>
