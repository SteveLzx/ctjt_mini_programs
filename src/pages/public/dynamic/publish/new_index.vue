<template>
  <scroll-view scroll-y style="height: 100%;background: #fff">
    <view class="list_content">
      <view class="content_tit">选择想发布的动态类型</view>
      <view v-if="posterList.length > 0">
        <view class="module_tit" @click="showMore(3)">海报 <text>更多 <text class="iconfont">&#xe6a3;</text></text></view>
        <view class="content_list poster_list">
          <view class="poster" v-for="item in posterList" :key="item.id" @click="jumpToActivity(3, item)">
            <image class="img" :src="imgDomain + item.url" mode="widthFix"/>
            <view class="tit">{{item.name}}</view>
          </view>
        </view>
      </view>
      <view v-if="schoolId !== 638">
        <view class="module_tit">活动 <text v-if="false">更多 <text class="iconfont">&#xe6a3;</text></text></view>
        <view class="content_list activity_list">
          <!-- <view class="activity" v-for="item in posterList" :key="item.id" @click="jumpToActivity(1)">
            <image class="img" :src="imgDomain + item.url" mode="widthFix"/>
            <view class="tit">{{item.name}}</view>
          </view> -->
          <view class="activity" @click="jumpToActivity(5)" v-if="schoolId === 16 && new Date().getTime() < new Date('2022/08/16').getTime()">
            <image class="img" :src="proImgDomain + 'mini-program/common/share_card_yqxc.jpg'" mode="widthFix"/>
            <view class="tit">深港幸运大转盘</view>
          </view>
          <view class="activity" @click="jumpToActivity(1)">
            <image class="img" :src="proImgDomain + 'mini-program/common/cover.jpg'" mode="widthFix"/>
            <view class="tit">立减</view>
          </view>
        </view>
      </view>
      <view v-if="tweetList.length > 0">
        <view class="module_tit" @click="showMore(2)">推文 <text>更多 <text class="iconfont">&#xe6a3;</text></text></view>
        <view class="content_list article_list">
          <view class="article" v-for="item in tweetList" :key="item.id" @click="jumpToActivity(2, item)">
            <image class="img" :src="imgDomain + item.url" mode="widthFix"/>
            <view class="tit">{{item.name}}</view>
          </view>
        </view>
      </view>
      <view v-if="certificateList.length > 0">
        <view class="module_tit">荣誉证书</view>
        <view class="content_list certificate_list">
          <view class="certificate" v-for="(item, index) in certificateList" :key="item.id" @click="jumpToActivity(4, item, index + 1)">
            <image class="img" :src="imgDomain + item.url" mode="widthFix"/>
            <view class="tit">{{item.name}}</view>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { imgDomain, proImgDomain } from '@/assets/js/config';
import { setGlobalData } from '@/assets/js/global_data';
import { schoolId } from '@/config/build_path';

@Component
export default class Index extends Vue {
  posterList = [];

  tweetList = [];

  schoolId = schoolId;

  certificateList = [];

  imgDomain = imgDomain;

  proImgDomain = proImgDomain;

  created() {
    this.init();
  }

  async init() {
    const data = await this.$http.get('sale/v1/appDynamic/queryAppDynamic');
    this.posterList = data.poster || [];
    this.tweetList = data.tweet || [];
    this.certificateList = data.certificate || [];
  }

  showMore(key) {
    uni.navigateTo({
      url: `/pages/public/dynamic/publish/dynamic_classify?type=${key}`,
    });
  }

  // 跳转到具体活动页
  jumpToActivity(type: number, item = { id: '' }, key?: any) {
    const path = {
      1: 'lijian',
      2: 'publish_article',
      3: 'nemt',
      4: 'certificate',
      5: 'coolschoolcar'
    };
    if (type === 2 || type === 3) {
      setGlobalData((type === 2 ? 'tweetDetail' : 'posterDetail'), item);
    }
    uni.navigateTo({
      url: `/pages/public/dynamic/publish/${path[type]}?type=${key}&id=${item.id}`,
    });
  }
}

</script>

<style lang="less" scoped>
.list_content{
  height: 100%;
  background: #fff;
  padding: 0 64rpx;
  .content_tit{
    padding: 40rpx 0;
    line-height: 32rpx;
    font-size: 32rpx;
    color: @ctjt-color-text-main;
  }
  .module_tit{
    font-size: 32rpx;
    line-height: 32rpx;
    font-weight: 500;
    color: @ctjt-color-text-main;
    > text{
      float: right;
      color: @ctjt-color-text-secondary-one;
      font-size: 26rpx;
      font-weight: 400;
      .iconfont{
        margin-left: 8rpx;
        font-size: 26rpx;
      }
    }
  }
}
.content_list{
  margin-top: 24rpx;
  width: 100%;
  overflow: hidden;
  .poster{
    width: 190rpx;
    margin-right: 26rpx;
    display: inline-block;
    .img{
      width: 100%;
      max-height: 408rpx;
      border-radius: 24rpx;
      background: #F5F3F5;
    }
    &:nth-child(3){
      margin-right: 0;
    }
    &:nth-child(6){
      margin-right: 0;
    }
    &:nth-child(9){
      margin-right: 0;
    }
    &:nth-child(12){
      margin-right: 0;
    }
    &:nth-child(15){
      margin-right: 0;
    }
  }
  &.poster_list{
    height: 514rpx;
  }
  &.activity_list{
    height: 344rpx;
  }
  &.article_list{
    height: 258rpx;
  }
  .activity{
    width: 298rpx;
    margin-right: 26rpx;
    float: left;
    .img{
      width: 100%;
      max-height: 238rpx;
      border-radius: 24rpx;
      background: #F5F3F5;
    }
    &:nth-child(2){
      margin-right: 0;
    }
  }
  .article{
    width: 190rpx;
    margin-right: 26rpx;
    display: inline-block;
    .img{
      width: 100%;
      max-height: 152rpx;
      border-radius: 24rpx;
      background: #F5F3F5;
    }
    &:nth-child(3){
      margin-right: 0;
    }
  }
  .certificate{
    width: 190rpx;
    margin-right: 26rpx;
    float: left;
    .img{
      width: 100%;
      max-height: 338rpx;
      border-radius: 24rpx;
      background: #F5F3F5;
    }
    &:nth-child(3){
      margin-right: 0;
    }
    .tit{
      height: 50rpx;
    }
  }
  .tit{
    margin-top: 8rpx;
    height: 102rpx;
    line-height: 26rpx;
    font-size: 26rpx;
    color: @ctjt-color-text-secondary-one;
    text-align: center;
    word-break: break-all;
    overflow: hidden;
  }
}
</style>
