<template>
  <view @click="bindSDKDomClick">
    <Skeleton v-if="loading"/>
    <canvas type="2d" id="myCanvas" style="width: 345px;height: 276px;margin:0;position: fixed;top: -200%"></canvas>
    <!-- <view
      v-if='userInfoFlag && !authFlag'
      class='get_phone'
      @click="getUserProfile"
    ></view> -->
    <view class="content" v-if="!loading" :animation="animationData">
      <!-- 列表 -->
      <view class="goods_container">
        <!-- tab -->
        <view class="tabbar_container el_height">
          <text
            class="item_bar"
            :class="{ 'active': item.value === tabIndex }"
            v-for="item in goodsTabbar"
            :key="item.value"
            @click="changeTab(item.value)"
          >{{item.label}}</text>
        </view>
        <view mark:name="tabHome">
            <swiper class="swiper" :current="tabIndex - 1"
            @change="swiperChange"
            :style="{height: swiperHeight ? swiperHeight + 'px' : 'auto'}">
                <swiper-item :class="{'b_f': queryGoodsFlag && goodsList.length === 0}">
                  <!-- 班别选择 -->
                  <scroll-view :style="{height: swiperHeight ? swiperHeight + 'px' : 'auto'}"
                  scroll-y="true" refresher-enabled
                  :refresher-triggered="classTriggered"
                  @refresherrefresh="classBindrefresherrefresh">
                    <view class="goods_list">
                      <view class="default_box" v-if="queryGoodsFlag && goodsList.length === 0">
                        <image :src="defaultImg()" class="detault_img"></image>
                        <view class="warn">暂无班别信息～</view>
                      </view>
                      <ClassCom v-for="(item, index) in goodsList" :key="item.id" :item="item" :index="index"
                      @coachShare="coachShare" @downloadPoster="downloadPoster" :isCoach="isCoach"></ClassCom>
                    </view>
                    </scroll-view>
                </swiper-item>
                <swiper-item :class="{'b_f': queryStoreFlag && storeList.length === 0}">
                  <scroll-view scroll-y="true" :style="{height: swiperHeight ? swiperHeight + 'px' : 'auto'}" @scrolltolower="bindscrolltolower" enhanced lower-threshold="300">
                    <!-- 门店服务 -->
                    <view class="store_ervices_section">
                      <view class="default_box" v-if="queryStoreFlag && storeList.length === 0">
                        <image :src="defaultImg()" class="detault_img"></image>
                        <view class="warn">暂无门店信息～</view>
                      </view>
                      <Store v-for="item in storeList" :key="item.id" :item="item" :showDownload="false">
                        <DownloadShare :detail="item" :type="schoolId === 370 && !item.hasOwnProperty('storeId') ? 3 : 2" @down="downloadPoster({detail: item, type: schoolId === 370 && !item.hasOwnProperty('storeId') ? 2 : 3})"
                        @coachShare="coachShare" :isCoach="isCoach"/>
                      </Store>
                    </view>
                  </scroll-view>
                </swiper-item>
                <swiper-item :class="{'b_f': queryTrainingFlag && trainingPlaceList.length === 0}" v-if="schoolId !== 370">
                  <scroll-view scroll-y="true" :style="{height: swiperHeight ? swiperHeight + 'px' : 'auto'}" >
                    <!-- 训练场 -->
                    <view class="train_ground_section">
                      <view class="default_box" v-if="queryTrainingFlag && trainingPlaceList.length === 0">
                        <image :src="defaultImg()" class="detault_img"></image>
                        <view class="warn">暂无训练场信息～</view>
                      </view>
                      <Store v-for="item in trainingPlaceList" :key="item.id" :item="item" :showDownload="false">
                        <DownloadShare :detail="item" :type="3" @down="downloadPoster({detail: item, type: 3})"
                        @coachShare="coachShare" :isCoach="isCoach"/>
                      </Store>
                    </view>
                  </scroll-view>
                </swiper-item>
            </swiper>
        </view>
      </view>
    </view>
    <Tabbar currentIndex="0"/>
    <DownloadPoster v-if="showDownloadPoster" @close="showDownloadPoster = false" :data="downloadPosterData"/>
    <Authorize :flag="authFLag"></Authorize>
    <CustomShare :visible.sync="shareVisible" :content.sync="shareContent"></CustomShare>
  </view>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Tabbar from '@/components/tabbar/index.vue';
// import Barrage from '@/components/barrage/index.vue';
import Store from '@/components/storefront/index.vue';
import ClassCom from '@/components/class/index.vue';
import DownloadShare from '@/components/download_share/index.vue';
import DownloadPoster from '@/components/download_poster/index.vue';
import Authorize from '@/components/authorize/index.vue';
import CustomShare from '@/components/custom_share/index.vue';
import Index from './index';
import Skeleton from './skeleton.vue';

@Component({
  components: {
    Tabbar,
    Skeleton,
    DownloadShare,
    DownloadPoster,
    Store,
    ClassCom,
    Authorize,
    CustomShare
  }
})
export default class Home extends Index {
  defaultImg= () => 'https://file.aicar365.com/mini-program/common/queshengye_banbiexinxi.png';
}
</script>

<style lang="less" scoped>
@import url('./index.less');
.fade-enter-active, .fade-leave-active {
  transition: opacity 5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
