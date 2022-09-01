<template>
    <view>
      <canvas type="2d" id="posterCanvas" style="width: 100%;height: 603rpx;position: fixed;top: -2000%"></canvas>
      <canvas type="2d" id="qrcodeBg" style="width: 375px;height: 375px;position: fixed;top: 200%"></canvas>
      <view class="shade" :animation="animationData" v-if="show">
        <view class="poster_box">
          <view>
            <text class="iconfont close_icon" @click="close">&#xe634;</text>
            <image :src="imgPath" style="width: 100%;vertical-align: bottom;" show-menu-by-longpress mode="widthFix"></image>
            <view class="btns_box">
              <view class="btns">
                <!-- <view class="btn" @click="copyUrl">
                  <text class="iconfont btn1_icon">&#xe6ac;</text>
                  <view>复制短链接</view>
                </view> -->
                <view class="btn" @click="save(1)">
                  <text class="iconfont btn2_icon">&#xe6ad;</text>
                  <view>保存二维码</view>
                </view>
                <view class="btn" @click="save(2)">
                  <text class="iconfont btn3_icon">&#xe6ae;</text>
                  <view>保存到相册</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop
} from 'vue-property-decorator';
import {
  savePosterToAlbum,
  generateSceneId,
  queryWeChatQRCode,
  schoolName
} from '@/assets/js/common';
import { schoolId } from '@/config/build_path';
import getPosterCommon from './get_canvas_common';
import getPosterCard from './get_canvas_card';
import getQrcode from './get_canvas_qrcode';
import getPosterClass from './get_canvas_class';
import getPosterStore from './get_canvas_store';

@Component
export default class DownloadPoster extends Vue {
  @Prop({
    required: true,
    default: {}
  }) data;

  show = false;

  animationData = {};

  imgPath: any = '';

  codeimg: any;

  animation = uni.createAnimation({
    duration: 200,
    timingFunction: 'ease',
  });

  norotateAndScale() {
    this.animation.opacity(1).step();
    this.animationData = this.animation.export();
  }

  resetAnimation() {
    this.animation.opacity(0).step();
    this.animationData = this.animation.export();
  }

  async mounted() {
    if (this.$platFormPc) {
      uni.showToast({
        icon: 'none',
        title: '请在手机端操作此功能'
      });
      this.$emit('close');
      return;
    }
    this.show = false;
    uni.showLoading({
      title: '海报生成中...'
    });
    this.norotateAndScale();
    const { detail, type } = this.data;
    const userType = uni.getStorageSync('userType');
    const sceneId = await generateSceneId({
      dynamicsId: detail.id,
      sceneId: detail.sceneId,
      publishExport: 3,
      publishFormat: 3,
      title: userType === 3 ? schoolName[schoolId] : `${detail.name || detail.userName || detail.appName}`,
      type,
      url: detail.url
    });
    this.codeimg = await queryWeChatQRCode({ params: sceneId as string });
    try {
      if (type === 7) {
        this.imgPath = await getPosterCard(this.data.detail, this.codeimg as string, this);
      } else if (type === 4) {
        this.imgPath = await getPosterClass(this.data.detail, this.codeimg as string, this);
      } else if (type === 2 || type === 3) {
        this.imgPath = await getPosterStore(this.data.detail, this.codeimg as string, this);
      } else {
        this.imgPath = await getPosterCommon(this.data.detail, this.codeimg as string, this);
      }
    } catch (error) {
      console.log(error);
      uni.showToast({
        icon: 'none',
        title: '生成失败'
      });
    }
    uni.hideLoading();
    this.show = true;
  }

  close() {
    this.resetAnimation();
    const timer = setTimeout(() => {
      this.$emit('close');
      clearTimeout(timer);
    }, 200);
  }

  copyUrl() {
    console.log('复制短链接');
  }

  async save(type: number) {
    (this as any).$track.send({
      event: 'ck',
      extra: {
        forwarded: true,
        scene: uni.getStorageSync('sceneId') || ''
      }
    });
    savePosterToAlbum(type === 1 ? await getQrcode(this.codeimg, this) : this.imgPath);
  }
}

</script>

<style lang="less" scoped>
.shade{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 99;
  opacity: 0;
  background: rgba(0, 0, 0, 0.7);
  width: 100vw;
  height: 100vh;
  .poster_box{
    background: #fff;
    border-radius: 23rpx;
    width: 690rpx;
    margin: 0 auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    > view{
      overflow: hidden;
      border-radius: 23rpx;
    }
    .close_icon{
      position: absolute;
      right: -16rpx;
      top: -80rpx;
      font-size: 48rpx;
      z-index: 3;
      color: #999;
      padding: 16rpx;
    }
    .btns_box{
      padding: 0 38rpx 40rpx;
    }
    .btns{
      display: flex;
      padding-top: 27rpx;
      border-top: solid 2rpx #E5E5E5;
      justify-content: space-between;
      font-size: 26rpx;
      line-height: 1;
      color: @ctjt-color-text-main;
      text-align: center;
      .btn{
        width: 132rpx;
        flex: 1;
        .iconfont{
          font-size: 80rpx;
          margin-bottom: 16rpx;
          display: inline-block;
        }
        .btn1_icon{
          color: #FFD944;
        }
        .btn2_icon{
          color: #64B6F4;
        }
        .btn3_icon{
          color: #F28757;
        }
      }
    }
  }
}
</style>
