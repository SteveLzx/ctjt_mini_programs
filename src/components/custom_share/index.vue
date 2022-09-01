<template>
  <view class="pop_box" v-if="visible">
    <view class="share_box">
      <text class="iconfont close_icon" @click="close">&#xe634;</text>
      <view class="share_content">
        <view class="school_msg">
          <image :src="`https://file.aicar365.com/mini-program/${schoolId}/common/headportrait_normal.png`" mode="aspectFill"></image>
          <text>{{schoolName}}</text>
        </view>
        <input type="text" class="share_tit" v-model.trim="content.title" maxlength="16">
        <view class="tip">PS: 可以编辑自己喜欢的标题进行分享，更有个性～！</view>
        <image class="share_img" :src="content.imageUrl" mode="aspectFill"></image>
      </view>
      <view class="botton_box">
        <button class="share_botton" v-show="content.title.length === 0" @click="beforeShare">立即分享</button>
        <button open-type="share" class="share_botton" v-show="content.title.length > 0">立即分享</button>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Watch
} from 'vue-property-decorator';
import { schoolId } from '@/config/build_path';
import { schoolName } from '@/assets/js/common';

@Component
export default class CustomShare extends Vue {
  @Prop({
    default: false
  }) visible;

  @Prop({
    default: {
      imageUrl: '',
      title: '',
      path: ''
    }
  }) content;

  @Watch('content.title')
  change() {
    this.$emit('update:content', {
      ...this.content
    });
  }

  schoolId = schoolId;

  schoolName = schoolName[schoolId];

  close() {
    this.$emit('update:visible', false);
  }

  beforeShare() {
    uni.showToast({
      title: '请填写分享标题',
      icon: 'none'
    });
  }
}

</script>

<style lang="less" scoped>
.share_box{
  position: fixed;
  top: 50%;
  left: 50%;
  width: 684rpx;
  transform: translate(-50%, -50%);
  background: #fff;
  z-index: 5;
  border-radius: 24rpx;
  .share_content{
    padding: 32rpx;
    .tip{
      line-height: 1;
      font-size: 25rpx;
      color: #999;
    }
  }
  .share_img{
    width: 620rpx;
    height: 496rpx;
    margin-top: 32rpx;
  }
  .botton_box{
    border-top: solid 1rpx #E5E5E5;
    padding: 32rpx;
    text-align: center;
  }
  .share_botton{
    width: 370rpx;
    line-height: 88rpx;
    margin: 0 auto;
    background: #ffd944;
    border-radius: 49rpx;
    color: #353535;
    font-size: 32rpx;
  }
  .share_tit{
    padding: 0 12rpx;
    height: 88rpx;
    font-size: 40rpx;
    line-height: 88rpx;
    background: #f5f3f5;
    color: #353535;
    border-radius: 24rpx;
    margin-bottom: 8rpx;
  }
  .school_msg{
    margin-bottom: 32rpx;
    display: flex;
    align-items: center;
    color: #555;
    font-size: 36rpx;
    line-height: 1;
    image{
      width: 62rpx;
      height: 62rpx;
      margin-right: 16rpx;
    }
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
}
</style>
