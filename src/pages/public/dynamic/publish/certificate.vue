<template>
  <view>
    <canvas
      type="2d"
      id="certificate"
      style="width: 345px; height: 614px; position: fixed; top: 200%"
    ></canvas>
    <view class="photo_box">
      上传学员照片
      <view class="upload_photo" @click="uploadAvatar">
        <image class="avatarUrl" v-if="!avatarUrl.includes('img_jiangpai')" :src="avatarUrl" mode="aspectFill"></image>
        <view v-else>
          <image class="icon" src="https://file.aicar365.com/mini-program/common/certificate/icon_zhaopian.png"></image>
          <view>点击上传照片</view>
        </view>
      </view>
    </view>
    <view class="student_msg">
      <view class="list"><view>学员姓名<text>*</text></view> <input type="text" class="entry_box" v-model.trim="name" maxlength="5" @blur="canvas"></view>
      <view class="list"><view>考试日期<text>*</text></view>
      <picker mode="date" @change="bindRegionChange" style="flex: 1">
        <input type="text" class="entry_box" v-model="date" disabled>
      </picker>
      </view>
      <view class="list"><view>成绩/评价<text>*</text></view> <input type="text" class="entry_box" v-model.trim="appraise" maxlength="8" @blur="canvas"></view>
      <view class="list"><view>学员称号<text>*</text></view> <input type="text" class="entry_box" v-model.trim="result" maxlength="8" @blur="canvas"></view>
    </view>
    <view class="preview">
      <view class="tit">版面样式</view>
      <image class="" :src="imgUrl" mode="widthFix"></image>
    </view>
    <view class="split"></view>
    <view class="btn_box">
      <view class="btn" @click="share"><text class="iconfont">&#xe696;</text>分享</view>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { imgDomain } from '@/assets/js/config';
import { schoolId } from '@/config/build_path';
import { putUploadFiles, getUploadFiles } from '@/assets/js/upload_oss';
import getPressImage from '@/assets/js/press_utils';
import { generateSceneId, queryWeChatQRCode, schoolName } from '@/assets/js/common';

const subject = ['一', '二', '三', '四'];

@Component
export default class Certificate extends Vue {
  temp = `${imgDomain}mini-program/common/certificate/certificate_1.jpg`;

  imgUrl = `${imgDomain}mini-program/common/certificate/certificate_1.jpg`;

  avatarUrl = `${imgDomain}mini-program/common/certificate/img_jiangpai.png`;

  name = '';

  date = '';

  appraise = '成绩优异';

  result = '优秀学员';

  type = 1;

  id = '';

  sceneId: any = '';

  async onLoad(options) {
    this.type = options.type;
    this.id = options.id;
    this.temp = `${imgDomain}mini-program/common/certificate/certificate_${this.type}.jpg`;
    const date = new Date();
    this.date = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    await this.queryCodeimg();
    this.canvas();
  }

  share() {
    if (!this.name || !this.appraise || !this.result) {
      uni.showToast({
        title: '请先完善信息',
        icon: 'none'
      });
      return;
    }
    (this as any).$track.send({
      event: 'ck',
      extra: {
        share: true,
        id: this.id,
        scene: this.sceneId
      }
    });
    (uni as any).showShareImageMenu({
      path: this.imgUrl
    });
  }

  /** 从相册选择上传头像 */
  uploadAvatar() {
    uni.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      success: (res) => {
        const icon = res.tempFilePaths?.[0];
        putUploadFiles(icon, 'student_head_pic').then((filename: any) => {
          // 获取头像
          this.avatarUrl = getUploadFiles(filename, 'student_head_pic');
          this.canvas();
        });
      }
    });
  }

  bindRegionChange(e) {
    const { value } = e.detail;
    this.date = value.replace(/-/g, '/');
    this.canvas();
  }

  codeimg: any = '';

  async queryCodeimg() {
    const cardInfo = uni.getStorageSync('cardInfo');
    const {
      id,
      userId,
      userName,
      userType
    } = cardInfo;
    const sceneId = await generateSceneId({
      dynamicsId: id || userId,
      publishExport: 1,
      publishFormat: 1,
      title: Number(userType) === 3 ? schoolName[schoolId] : userName,
      type: 7,
      extra: { id: this.id, type: 'certificate' }
    });
    this.sceneId = sceneId;
    this.codeimg = await queryWeChatQRCode({ params: sceneId as string });
  }

  canvas() {
    uni.showLoading({
      title: '生成中...'
    });
    /* eslint-disable */
    const query = wx.createSelectorQuery();
    query.select('#certificate')
      .fields({ node: true, size: true })
      .exec(async (res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const width = res[0].width;
        const height = res[0].height;
        ctx.restore();
        const dpr = wx.getSystemInfoSync().pixelRatio / 1.2;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        ctx.save();
        // 画图片
        const bgPromise = () => new Promise((resolve, reject) => {
          const bg = canvas.createImage();
          bg.onload = () => {
            resolve(bg);
          };
          bg.onerror = () => {
            reject(new Error(`fail to fetch image form: ${this.temp}`));
          };
          bg.src = this.temp;
        });
        const img = await bgPromise();
        ctx.drawImage(img, 0, 0, 345, 614);
        ctx.restore();

        ctx.font = 'normal normal normal 14px PingFang SC';
        ctx.fillStyle = '#353535';
        ctx.fillText(`${this.name || 'XXX'}同学:`, 37, 304);
        const text1 = `在${schoolName[schoolId]}进行机动车驾驶员驾考学习，并进行科目${subject[this.type - 1]}考试。`;
        const text2 = `${this.appraise}，给予【${this.result}】称号。`;
        ctx.fillText(text1.substr(0, 17), 65, 324);
        ctx.fillText(text1.substr(17), 37, 344);
        ctx.fillText(text2.substr(0, 17), 65, 364);
        ctx.fillText(text2.substr(17), 37, 384);
        const strWidth1 = ctx.measureText(schoolName[schoolId]).width;
        ctx.fillText(schoolName[schoolId], 37 + 271 - strWidth1, 444);
        const date = this.date.split('/');
        const dateText = `${date[0]}年${date[1]}月${date[2]}日`;
        const strWidth2 = ctx.measureText(dateText).width;
        ctx.fillText(dateText, 37 + 271 - strWidth2, 464);

        const coachInfo = uni.getStorageSync('coachInfo');
        const { name, mobile } = coachInfo;
        ctx.fillStyle = '#fff';
        ctx.fillText(`教练：${name}`, 15, 550);
        ctx.fillText('一对一学车咨询: ', 15, 574);
        ctx.font = 'normal normal normal 11px PingFang SC';
        ctx.fillText('长按识别  报名优惠 ', 15, 598);
        ctx.font = 'normal normal normal 18px PingFang SC';
        ctx.fillText(mobile, 120, 574);

        ctx.restore();

        const avatarPromise = () => new Promise((resolve, reject) => {
          const avatar = canvas.createImage();
          avatar.onload = () => {
            resolve(avatar);
          };
          avatar.onerror = () => {
            reject(new Error(`fail to fetch image form: ${this.avatarUrl}`));
            uni.showToast({
              icon: 'none',
              title: '生成失败'
            });
          };
          avatar.src = this.avatarUrl;
        });

        ctx.fillStyle = 'transparent';

        const codePromise = () => new Promise((resolve, reject) => {
          const code = canvas.createImage();
          code.onload = () => {
            resolve(code);
          };
          code.onerror = () => {
            reject(new Error(`fail to fetch image form: ${this.codeimg}`));
            uni.showToast({
              icon: 'none',
              title: '生成失败'
            });
          };
          code.src = this.codeimg;
        });

        const img3 = await codePromise();
        ctx.drawImage(img3, 253, 535, 73, 73);

        const img2 = await avatarPromise();
        ctx.beginPath();
        ctx.arc(100 / 2 + 122, 100 / 2 + 180, 100 / 2, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.clip();
        ctx.drawImage(img2, 122, 180, 100, 100);
        ctx.restore();
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          canvasId: 'certificate',
          canvas,
          width,
          height,
          fileType: 'jpg',
          success: (result: any) => {
            uni.hideLoading();
            this.imgUrl = result.tempFilePath;
          },
          fail: error => {
            uni.hideLoading();
            console.log(error);
          }
        });
      });
      /* eslint-enable */
  }
}

</script>

<style lang="less" scoped>
.photo_box{
  height: 228rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 0 30rpx;
  color: @ctjt-color-text-main;
  font-size: 32rpx;
  .upload_photo{
    width: 180rpx;
    height: 180rpx;
    border-radius: 50%;
    background: @ctjt-bgcolor-primary;
    color: @ctjt-color-text-secondary-two;
    font-size: 22rpx;
    line-height: 1;
    text-align: center;
    overflow: hidden;
    .icon{
      margin-top: 54rpx;
      width: 56rpx;
      height: 44rpx;
      margin-bottom: 8rpx;
    }
    .avatarUrl{
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}
.student_msg{
  padding: 24rpx 30rpx;
  background: #fff;
  margin: 24rpx 0;
  color: @ctjt-color-text-main;
  font-size: 32rpx;
  .list{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;
    view{
      width: 180rpx;
    }
    text{
      color: @ctjt-color-price;
    }
  }
  .entry_box{
    flex: 1;
    padding: 28rpx 24rpx;
    font-size: 32rpx;
    background: @ctjt-bgcolor-primary;
    border-radius: 24rpx;
  }
}
.preview{
  background: #fff;
  padding: 24rpx 30rpx;
  .tit{
    color: @ctjt-color-text-main;
    font-size: 32rpx;
    margin-bottom: 24rpx;
  }
  image{
    width: 100%;
    border-radius: 24rpx;
  }
}
.split{
  height: 160rpx;
}
.btn_box{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16rpx 30rpx 32rpx;
  background: #fff;
  .btn{
    width: 100%;
    line-height: 88rpx;
    text-align: center;
    background: @ctjt-color-primary;
    color: @ctjt-color-text-main;
    font-size: 32rpx;
    border-radius: 44rpx;
    .iconfont{
      margin-right: 16rpx;
    }
  }
}
</style>
