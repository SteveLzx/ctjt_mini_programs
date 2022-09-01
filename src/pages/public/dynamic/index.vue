<template>
  <view class="dy_container">
    <canvas type="2d" id="cardCanvas" style="width: 345px; height: 276px; position: fixed; top: 200%"></canvas>
    <!-- 导航 -->
    <view class="c_viscosity">
      <CtjtAutoCenterNav :c-style="'padding: 0 30rpx; margin-right: 50rpx;'" :list="tabList" :current="current" :trans-left="150" @change="handleNavChange"></CtjtAutoCenterNav>
    </view>
    <swiper class="c_scroll_view" :current="current" @change="handleSwiperChange"
      :style="{height: swiperHeight + 'px'}">
      <swiper-item :class="{'b_f': queryReceivedScenesFlag && receivedScenesList.length === 0}">
        <scroll-view
          v-if="swiperHeight"
          :style="{ height: swiperHeight ? swiperHeight + 'px' : 'auto' }"
          :scroll-y="true"
          refresher-enabled
          :refresher-triggered="receivedScenesTriggered"
          @refresherrefresh="refresherreReceivedScenesList"
        >
          <view class="d_wrap">
            <view class="default_box" v-if="queryReceivedScenesFlag && receivedScenesList.length === 0">
              <image :src="defaultImg()" class="detault_img"></image>
              <view class="warn">暂无已收到信息～</view>
            </view>
            <view class="list" v-for="item in receivedScenesList" :key="item.id">
              <DynamicListChild :data="item" @downloadShare="downloadSharePoster"></DynamicListChild>
            </view>
          </view>
        </scroll-view>
      </swiper-item>
      <swiper-item :class="{'b_f': queryPublishScenesFlag && publishScenesList.length === 0}">
        <scroll-view
          v-if="swiperHeight"
          :style="{ height: swiperHeight ? swiperHeight + 'px' : 'auto' }"
          :scroll-y="true"
          refresher-enabled
          :refresher-triggered="publishScenesTriggered"
          @refresherrefresh="refresherrePublishScenesList"
        >
          <view class="d_wrap">
            <view class="default_box" v-if="queryPublishScenesFlag && publishScenesList.length === 0">
              <image :src="defaultImg()" class="detault_img"></image>
              <view class="warn">暂无已发布信息～</view>
            </view>
            <view class="list" v-for="item in publishScenesList" :key="item.id">
              <DynamicListChild :data="item" @downloadShare="downloadSharePoster"></DynamicListChild>
            </view>
          </view>
        </scroll-view>
      </swiper-item>
    </swiper>
    <!-- 底部tab -->
    <Tabbar currentIndex="1" />
    <!--下载海报弹框-->
    <DownloadPoster
      v-if="showDownloadPoster"
      @close="showDownloadPoster = false"
      :data="downloadPosterData"
    />
  </view>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import CtjtAutoCenterNav from '@/components/auto_center_nav/index.vue';
import Tabbar from '@/components/tabbar/index.vue';
import DownloadPoster from '@/components/download_poster/index.vue';
import DynamicListChild from '@/pages/public/dynamic/components/dynamic_child/index.vue';
import Index from './index';

@Component({
  components: {
    CtjtAutoCenterNav,
    Tabbar,
    DownloadPoster,
    DynamicListChild
  },
})
export default class DynamicPage extends Index {}
</script>

<style lang="less" scoped>
.dy_container {
  .add_dynamic {
    color: @ctjt-color-text-main;
    font-size: 32rpx;
    .iconfont {
      font-size: 32rpx;
      margin-right: 8rpx;
      color: @ctjt-color-primary;
    }
  }
  .d_wrap {
    padding: 40rpx 30rpx;
    padding-bottom: calc(100rpx +  constant(safe-area-inset-bottom)); /*兼容 IOS<11.2*/
    padding-bottom: calc(100rpx +  env(safe-area-inset-bottom)); /*兼容 IOS>11.2*/
    .list {
      border-radius: 24rpx;
      overflow: hidden;
      background: #fff;
      margin-bottom: 40rpx;
      position: relative;
      .disble_wrap {
        display: none;
      }
      &.disable {
        .disble_wrap {
          display: block;
          text-align: center;
          background-color: rgba(0, 0, 0, 0.7);
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
          color: #fff;
          font-size: 32rpx;
          line-height: 528rpx;
        }
      }
    }
  }
}
.b_f{
  background: #fff;
}
.default_box{
  color: @ctjt-color-text-primary;
  text-align: center;
  padding-top: 400rpx;
  font-size: 28rpx;
  background: #fff;
  padding-top: 144rpx;
  text-align: center;
  .detault_img{
    width: 422rpx;
    height: 326rpx;
  }
  .warn{
    font-size: 28rpx;
    color: @ctjt-color-text-secondary-one;
    line-height: 40rpx;
  }
}
</style>
