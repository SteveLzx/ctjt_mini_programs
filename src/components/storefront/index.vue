// 训练场/门店组件
<template>
  <view :class="['item_box', { 'sharelandingpage': source === 'sharelandingpage' }]">
    <view :class="['banner', { 'sharelandingpage': source === 'sharelandingpage' }]">
      <image class="img" mode="aspectFill" :src="imgDomain + fiilterImage(item.image || item.photoUrl)"	lazy-load="true"></image>
    </view>
    <view class="info">
      <view class="title">{{item.name}}</view>
      <view class="phone" @click="callPhone(item.telephone)" v-if="item.telephone && false">
        <span class="iconfont">&#xe632;</span>
        <text>{{item.telephone}}</text>
      </view>
      <view class="address" @click="openLocation(item.longitude, item.latitude, item.cityName + item.areaName + item.address)">
        <span class="iconfont">&#xe633;</span>
        <text class="text">{{item.cityName + item.areaName + item.address}}</text>
      </view>
      <view class="labels" v-if="item.serviceList && item.serviceList.lenth > 0">
        <text class="label" v-for="val in item.serviceList" :key="val">{{val}}</text>
      </view>
      <view class="call_box" @click="callPhone(item.telephone)" v-if="item.telephone && source !== 'sharelandingpage' && false">电话咨询</view>
    </view>
    <DownloadShare :detail="item" :type="2" @down="downloadPosterData = { detail: item, type: 2 };showDownloadPoster = true" v-if="showDownload"/>
    <DownloadPoster v-if="showDownloadPoster && showDownload" @close="showDownloadPoster = false" :data="downloadPosterData"/>
    <slot></slot>
  </view>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import DownloadPoster from '@/components/download_poster/index.vue';
import DownloadShare from '@/components/download_share/index.vue';
import { makePhoneCall } from '@/assets/js/common';
import { schoolId } from '@/config/build_path';

@Component({
  components: { DownloadPoster, DownloadShare }
})
export default class Store extends Vue {
  @Prop({
    default: {}
  }) item; // 内容详情

  @Prop({
    default: true
  }) showDownload; // 是否显示下载

  @Prop({
    default: ''
  }) source; // 页面引用来源

  imgDomain = 'https://file.aicar365.com/';

  showDownloadPoster = false;

  downloadPosterData = {};

  // 拨打电话
  callPhone(tel: string) {
    makePhoneCall(tel);
  }

  // 跳转地图
  openLocation(longitude: number, latitude: number, address?: string) {
    if (longitude > 0 && latitude > 0) {
      console.log(longitude, latitude);
      uni.openLocation({
        latitude: Number(latitude),
        longitude: Number(longitude),
        address
      });
    }
  }

  fiilterImage(json: string) {
    try {
      const image = JSON.parse(json);
      if (image && image[0]) {
        return image[0].photoUrl || `mini-program/${schoolId}/mendian/default.jpg`;
      }
    } catch (error) {
      return `mini-program/${schoolId}/mendian/default.jpg`;
    }
    return `mini-program/${schoolId}/mendian/default.jpg`;
  }
}

</script>

<style lang="less" scoped>
.item_box {
  background-color: #fff;
  margin-top: 40rpx;
  border-radius: 24rpx;
  overflow: hidden;
  &.sharelandingpage {
    margin-top: 0;
    border-radius: 0;
  }
  .banner {
    overflow: hidden;
    border-top-left-radius: 24rpx;
    border-top-right-radius: 24rpx;
    height: 346rpx;
    &.sharelandingpage {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
    .img {
      width: 100%;
      max-height: 346rpx;
      vertical-align: top;
    }
  }
  .info {
    padding: 28rpx 32rpx 20rpx;
    position: relative;
    .call_box{
      background: @ctjt-color-primary;
      width: 200rpx;
      text-align: center;
      line-height: 70rpx;
      color: @ctjt-color-text-main;
      font-size: 32rpx;
      top: 43rpx;
      right: 32rpx;
      border-radius: 40rpx;
      position: absolute;
    }
    .title {
      font-size: 32rpx;
      color: @ctjt-color-text-main;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 32rpx;
      margin-bottom: 20rpx;
    }
    .phone, .address {
      margin-top: 16rpx;
      color: @ctjt-color-text-secondary-one;
      font-size: 26rpx;
      display: flex;
      line-height: 1.5;
      .text{
        flex: 1;
      }
      .iconfont {
        font-size: 26rpx;
        color: @ctjt-color-text-secondary-one;
        margin-right: 8rpx;
      }
    }
    .phone{
      font-size: 28rpx;
    }
    .labels {
      overflow: hidden;
      margin-top: 28rpx;
      .label {
        font-size: 22rpx;
        color: @ctjt-color-label;
        padding: 0 11rpx;
        height: 30rpx;
        box-sizing: border-box;
        border-radius: 8rpx;
        border: 1rpx solid @ctjt-color-label;
        margin-right: 16rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        float: left;
        margin-bottom: 10rpx;
        &:first-of-type {
          margin-left: 0;
        }
      }
    }
  }
  .store_btns{
    display: flex;
    border-top: solid 1rpx @ctjt-color-border-two;
    view{
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 76rpx;
      color: @ctjt-color-text-secondary-two;
      font-size: 26rpx;
      &:first-child{
        border-right: solid 1rpx @ctjt-color-border-two;
      }
      .iconfont{
        font-size: 36rpx;
        color: @ctjt-color-text-secondary-one;
        margin-right: 16rpx;
      }
    }
  }
}
</style>
