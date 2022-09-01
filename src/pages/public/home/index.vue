<template>
  <view>
    <Skeleton v-if="loading"/>
    <view
      v-if='userInfoFlag && !isPersonal && !authFlag'
      class='get_phone'
      @click="getUserProfile"
    ></view>
    <view class="content" v-if="!loading" :animation="animationData">
      <!-- 轮播图 -->
      <view class="swiper_section el_height">
        <view class="swiper_section_spacing" :class="{'hasCoach': inviterId || !isPersonal}">
            <swiper class="swiper"
              style="height: 120px;"
              :indicator-dots="false"
              :autoplay="true"
              :interval="2000"
              :duration="500">
                <swiper-item>
                    <view class="swiper_item">
                      <image class="info_l" :src="bannerUrl" mode="widthFix"></image>
                    </view>
                </swiper-item>
            </swiper>
        </view>
      </view>
      <!-- 教练授权 -->
      <view class="auth_section el_height" v-if="authFlag && !isPersonal">
        <view class="info">
          请授权手机号登录获得使用权限
          <view class="text">该小程序仅限平台驾校的教练员和客服使用</view>
        </view>
        <button class="auth_btn" open-type='getPhoneNumber'
      @getphonenumber='verifyTelAccredit'>授权登录</button>
      </view>
      <!-- 教练信息 -->
      <view class="coach_section el_height" v-if="inviterId !== '' && inviterDetail.drivingSchoolName">
        <view class="info">
          <image class="info_l" :src="wechatUserInfo.avatarUrl"></image>
          <view class="info_r">
            <view class="names">
              <text class="name" :style="{width: inviterDetail.userName.length * 37 + 'rpx'}">{{inviterDetail.userName}}</text>
              <span class="d_line"></span>
              <text class="name" style="flex: 1">{{inviterDetail.drivingSchoolName}}</text>
            </view>
            <view class="evaluate" v-if="inviterDetail.type == 1">
              <view class="evaluate_l">
                <span class="iconfont icon_selected" v-for="item in inviterDetail.showStar" :key="item">&#xe61d;</span>
                <span class="iconfont icon_selected" v-for="item in (5 - inviterDetail.showStar)" :key="item">&#xe62c;</span>
              </view>
              <view class="evaluate_r" v-if="inviterDetail.praiseNum > 0">{{inviterDetail.praiseNum}}个带教好评</view>
            </view>
            <view class="evaluate" v-if="inviterDetail.type == 2">
              <view class="evaluate_r" style="margin: 0;">金牌客服</view>
            </view>
          </view>
        </view>
        <view class="phone" @click="callPhone(inviterDetail.mobile)">
          <image class="icon" :src="svgPhone"></image>
        </view>
      </view>
      <!-- 列表 -->
      <view class="goods_container">
        <!-- tab -->
        <view class="tabbar_container el_height">
          <text
            :class="['item_bar', { 'active': item.value === tabIndex }]"
            v-for="item in goodsTabbar"
            :key="item.value"
            @click="changeTab(item.value)"
          >{{item.label}}</text>
        </view>
        <view class="">
            <swiper class="swiper" :current="tabIndex - 1"
            @change="swiperChange1"
            :style="{height: swiperHeight ? swiperHeight + 'px' : 'auto'}">
                <swiper-item>
                  <!-- 班别选择 -->
                  <scroll-view :style="{height: swiperHeight ? swiperHeight + 'px' : 'auto'}" scroll-y="true">
                    <view class="goods_list">
                      <view class="default_box" v-if="queryGoodsFlag && goodsList.length === 0">
                        <image :src="defaultImgGoods()" class="detault_img"></image>
                        <view class="warn">暂无班别信息～</view>
                      </view>
                      <view class="item_goods" v-for="(item, index) in goodsList" :key="item.id">
                        <view class="images">
                          <image :src="imgDomain + item.photoUrlMain" mode="aspectFill" @click="toDetails(item)" class="goods_img"></image>
                          <span class="label">报名有礼</span>
                        </view>
                        <view class="price_share">
                          <view class="price">
                            <text class="unit">¥</text>
                            <text class="nums">{{item.price}}</text>
                            <text class="old_p">¥{{item.originalPriceNum}}</text>
                          </view>
                          <button class="share" open-type='share' v-if="isPersonal">
                            <span class="iconfont icon_share">&#xe61e;</span>
                          </button>
                        </view>
                        <view class="title" @click="toDetails(item)">{{item.name}}</view>
                        <view class="browse">
                          <text>浏览{{item.browseNumber}}次</text>
                          <text style="margin-left: 40rpx;">已报名{{item.registeredNumber}}</text>
                        </view>
                        <view class="sign_up">
                          <Barrage :timeout="Math.floor(Math.random() * 4000) * (index + 1) + 4000"></Barrage>
                        </view>
                        <!-- 报名按钮 -->
                        <view class="btns" v-if="isPersonal">
                          <button class="sign_btn" @click="toDetails(item)">立即报名</button>
                        </view>
                        <!-- 分享按钮 -->
                        <view class="btns" v-if="!isPersonal">
                          <button class="sign_btn" @click="shareShow=true;currentShareItem=item;" v-if="!authFlag">分享</button>
                          <button class="sign_btn" open-type='getPhoneNumber' @getphonenumber='verifyTelAccredit' v-else>分享</button>
                        </view>
                      </view>
                    </view>
                    </scroll-view>
                </swiper-item>
                <swiper-item>
                  <!-- 驾校介绍 -->
                    <view class="driv_school_section">
                      <!-- tab栏 -->
                      <view class="driv_school_tab">
                        <text
                          :class="['item_bar', { 'active': drivTabIndex === item.value }]"
                          v-for="item in drivSchoolTabbar"
                          :key="item.value"
                          @click="changeDrivSchoolCLass(item.value)"
                        >{{item.label}}</text>
                      </view>
                      <swiper class="swiper" :current="drivTabIndex - 1" :style="{height: swiperHeight ? swiperHeight - tab2Height + 'px' : 'auto'}" @change="swiperChange2">
                        <swiper-item>
                          <!-- 基础信息 -->
                          <scroll-view scroll-y="true" :style="{height: swiperHeight ? swiperHeight - tab2Height + 'px' : 'auto'}">
                            <view class="default_box" v-if="false">
                              <image :src="defaultImgBasic()" class="detault_img"></image>
                              <view class="warn">暂无简介～</view>
                            </view>
                            <view class="basic_info_section" v-html="El"></view>
                          </scroll-view>
                        </swiper-item>
                        <swiper-item>
                            <scroll-view scroll-y="true" :style="{height: swiperHeight ? swiperHeight - tab2Height + 'px' : 'auto'}">
                              <!-- 门店服务 -->
                              <view class="store_ervices_section">
                                <view class="default_box" v-if="queryStoreFlag && storeList.length === 0">
                                  <image :src="defaultImgStore()" class="detault_img"></image>
                                  <view class="warn">暂无训练场信息～</view>
                                </view>
                                <view class="item_box" v-for="item in storeList" :key="item.telephone">
                                  <view class="banner">
                                    <image class="img" mode="aspectFill" :src="imgDomain + item.photoUrlMain"></image>
                                  </view>
                                  <view class="info">
                                    <view class="title">{{item.name}}</view>
                                    <view class="phone" @click="callPhone(item.telephone)">
                                      <span class="iconfont">&#xe632;</span>
                                      <text>{{item.telephone}}</text>
                                    </view>
                                    <view class="address" @click="openLocation(item.longitude, item.latitude, item.cityName + item.areaName + item.address)">
                                      <span class="iconfont">&#xe633;</span>
                                      <text>{{item.cityName + item.areaName + item.address}}</text>
                                    </view>
                                    <view class="labels">
                                      <text class="label" v-for="val in item.serviceList" :key="val">{{val}}</text>
                                    </view>
                                  </view>
                                </view>
                              </view>
                            </scroll-view>
                        </swiper-item>
                        <swiper-item>
                          <scroll-view scroll-y="true" :style="{height: swiperHeight ? swiperHeight - tab2Height + 'px' : 'auto'}">
                            <!-- 训练场 -->
                            <view class="train_ground_section">
                              <view class="default_box" v-if="queryTrainingFlag && trainingPlaceList.length === 0">
                                <image :src="defaultImgTrain()" class="detault_img"></image>
                                <view class="warn">暂无训练场信息～</view>
                              </view>
                              <view class="item_box" v-for="(item, index) in trainingPlaceList" :key="index">
                                <view class="banner">
                                  <image class="img" mode="aspectFill" :src="imgDomain + item.photoUrlMain"></image>
                                </view>
                                <view class="info">
                                  <view class="title">{{item.name}}</view>
                                  <!-- <view class="phone" @click="callPhone(item.telephone)">
                                    <span class="iconfont">&#xe632;</span>
                                    <text>{{item.telephone}}</text>
                                  </view> -->
                                  <view class="address" @click="openLocation(item.longitude, item.latitude, item.cityName + item.areaName + item.address)">
                                    <span class="iconfont">&#xe633;</span>
                                    <text>{{item.cityName + item.areaName + item.address}}</text>
                                  </view>
                                  <view class="labels">
                                    <text class="label" v-for="val in item.serviceList" :key="val">{{val}}</text>
                                  </view>
                                </view>
                              </view>
                            </view>
                          </scroll-view>
                        </swiper-item>
                      </swiper>
                    </view>
                </swiper-item>
            </swiper>
        </view>
      </view>
      <!-- 分享 -->
      <ctjt-share v-if='shareShow' @cancel="shareShow=false" @weixinCallback="shareShow=false" @posterCallback="posterCallback"></ctjt-share>
      <!-- 海报 -->
      <save-pic :canvasPath="canvasPath" v-if="showPoster" @close="showPoster = false"></save-pic>
      <ctjt-canvas v-if="canvasFlag" :param="canvasParam" @fail="() => {}" @success="canvasSuccess"></ctjt-canvas>
    </view>
  </view>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import CtjtShare from '@/components/share/index.vue';
import CtjtCanvas from '@/components/canvas/index.vue';
import SavePic from '@/components/save_pic/index.vue';
// import Barrage from '@/components/barrage/index.vue';
import Skeleton from './skeleton.vue';
import Index from './index';

@Component({
  components: {
    CtjtShare,
    CtjtCanvas,
    Skeleton,
    SavePic
  }
})
export default class Home extends Index {
  defaultImgTrain = () => 'https://file.aicar365.com/mini-program/common/queshengye_zanwuxunlianchangxinxi.png';

  defaultImgStore = () => 'https://file.aicar365.com/mini-program/common/queshengye_zanwumendianxinxi.png';

  defaultImgBasic = () => 'https://file.aicar365.com/mini-program/common/queshengye_zanwujianjie.png';

  defaultImgGoods = () => 'https://file.aicar365.com/mini-program/common/queshengye_banbiexinxi.png';
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
