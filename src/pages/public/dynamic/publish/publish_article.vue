<template>
  <view class="content_box">
    <view class="content">推文内容路径:
      <text class="url" @click="preview">{{tweetDetail.addressUrl}}</text>
    </view>
    <view class="tip">点击链接可预览</view>
    <view class="btn_box">
      <view class="btn" @click="share"><text class="iconfont">&#xe696;</text>分享</view>
    </view>
    <CustomShare :visible.sync="shareVisible" :content.sync="shareContent"></CustomShare>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { schoolId } from '@/config/build_path';
import { imgDomain } from '@/assets/js/config';
import CustomShare from '@/components/custom_share/index.vue';
import { generateSceneId } from '@/assets/js/common';
import { getGlobalData } from '@/assets/js/global_data';

let id = '';
let sceneId: any = '';
@Component({
  components: { CustomShare }
})
export default class WebView extends Vue {
  shareVisible = false;

  shareContent = {};

  tweetDetail: any = {};

  onLoad(options) {
    id = options.id;
    this.tweetDetail = getGlobalData('tweetDetail');
    uni.setNavigationBarTitle({
      title: this.tweetDetail.name || '发布推文'
    });
  }

  preview() {
    uni.navigateTo({
      url: `/pages/public/dynamic/publish/article?id=${id}&userId=${uni.getStorageSync('coachInfo').userId}`,
    });
  }

  async share() {
    sceneId = await generateSceneId({
      dynamicsId: uni.getStorageSync('cardInfo').id,
      publishExport: 1,
      publishFormat: 1,
      title: '',
      type: 7,
      url: '',
      extra: {
        id,
        type: 'tweet'
      }
    });
    this.shareContent = {
      imageUrl: imgDomain + this.tweetDetail.url,
      title: this.tweetDetail.name,
      path: `/pages/public/dynamic/publish/article?id=${id}&scene=${sceneId}&userId=${uni.getStorageSync('coachInfo').userId}`
    };
    this.shareVisible = true;
  }

  onShareAppMessage() {
    (this as any).$track.send({
      event: 'ck',
      extra: {
        share: true,
        scene: sceneId,
        id
      }
    });
    return this.shareContent;
  }
}

</script>

<style lang="less" scoped>
.content_box{
  padding: 0 30rpx;
  height: 100%;
  background: #fff;
  .btn_box{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 16rpx 30rpx 32rpx;
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
  .content{
    font-size: 26rpx;
    color: @ctjt-color-text-main;
    padding-top: 24rpx;
    word-break:break-all;
    .url{
      margin-left: 10rpx;
      color: @ctjt-color-text-secondary-five;
    }
  }
  .tip{
    font-size: 24rpx;
    color: @ctjt-color-text-secondary-two;
    line-height: 1;
    margin-top: 10rpx;
  }
}
</style>
