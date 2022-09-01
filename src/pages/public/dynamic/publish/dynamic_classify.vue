<template>
  <scroll-view scroll-y style="height: 100%;background: #fff">
    <view class="list_content">
      <view class="content_tit">选择想发布的动态类型</view>
      <view v-if="type === 3">
        <view v-if="storePoster.length > 0">
          <view class="module_tit">门店海报</view>
          <view class="content_list poster_list">
            <view class="poster" v-for="(item, index) in storePoster" :key="item.id" @click="jumpToActivity(3, item)" :class="{'mr-0': (index + 1) % 3 === 0}">
              <image class="img" :src="imgDomain + item.url" mode="widthFix"/>
              <view class="tit">{{item.name}}</view>
            </view>
          </view>
        </view>
        <view v-if="regionPoster.length > 0">
          <view class="module_tit">片区海报</view>
          <view class="content_list poster_list">
            <view class="poster" v-for="(item, index) in regionPoster" :key="item.id" @click="jumpToActivity(3, item)" :class="{'mr-0': (index + 1) % 3 === 0}">
              <image class="img" :src="imgDomain + item.url" mode="widthFix"/>
              <view class="tit">{{item.name}}</view>
            </view>
          </view>
        </view>
        <view v-if="officialPoster.length > 0">
          <view class="module_tit">官方海报</view>
          <view class="content_list poster_list">
            <view class="poster" v-for="(item, index) in officialPoster" :key="item.id" @click="jumpToActivity(3, item)" :class="{'mr-0': (index + 1) % 3 === 0}">
              <image class="img" :src="imgDomain + item.url" mode="widthFix"/>
              <view class="tit">{{item.name}}</view>
            </view>
          </view>
        </view>
      </view>
      <view v-if="type === 2">
        <view v-if="storePoster.length > 0">
          <view class="module_tit">门店推文</view>
          <view class="content_list article_list">
            <view class="article" v-for="(item, index) in storePoster" :key="item.id" @click="jumpToActivity(2, item)" :class="{'mr-0': (index + 1) % 3 === 0}">
              <image class="img" :src="imgDomain + item.url" mode="widthFix"/>
              <view class="tit">{{item.name}}</view>
            </view>
          </view>
        </view>
        <view v-if="regionPoster.length > 0">
          <view class="module_tit">片区推文</view>
          <view class="content_list article_list">
            <view class="article" v-for="(item, index) in regionPoster" :key="item.id" @click="jumpToActivity(2, item)" :class="{'mr-0': (index + 1) % 3 === 0}">
              <image class="img" :src="imgDomain + item.url" mode="widthFix"/>
              <view class="tit">{{item.name}}</view>
            </view>
          </view>
        </view>
        <view v-if="officialPoster.length > 0">
          <view class="module_tit">官方推文</view>
          <view class="content_list article_list">
            <view class="article" v-for="(item, index) in officialPoster" :key="item.id" @click="jumpToActivity(2, item)" :class="{'mr-0': (index + 1) % 3 === 0}">
              <image class="img" :src="imgDomain + item.url" mode="widthFix"/>
              <view class="tit">{{item.name}}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { imgDomain } from '@/assets/js/config';
import { setGlobalData } from '@/assets/js/global_data';

@Component
export default class Index extends Vue {
  imgDomain = imgDomain;

  storePoster = [];

  regionPoster = [];

  officialPoster = [];

  type = 3; // 3海报 2推文

  onLoad(options) {
    this.type = Number(options.type);
    const title = ['发布推文列表', '发布海报列表'];
    uni.setNavigationBarTitle({
      title: title[this.type - 2] || '发布活动列表'
    });
    this.init();
  }

  async init() {
    const url = this.type === 2 ? 'sale/v1/appDynamic/queryTweet' : 'sale/v1/appDynamic/queryPosterType';
    const data = await this.$http.get(url);
    this.storePoster = data.storePoster || data.storeTweet;
    this.regionPoster = data.regionPoster || data.regionTweet;
    this.officialPoster = data.officialPoster || data.officialTweet;
    console.log(data);
  }

  jumpToActivity(type: number, item?: any, key?: any) {
    const path = {
      1: 'lijian',
      2: 'publish_article',
      3: 'nemt',
      4: 'certificate'
    };
    if (type === 2 || type === 3) {
      setGlobalData(type === 2 ? 'tweetDetail' : 'posterDetail', item);
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
    &.mr-0{
      margin-right: 0;
    }
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
