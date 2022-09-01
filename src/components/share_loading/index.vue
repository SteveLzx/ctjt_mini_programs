<template>
  <view class="share_wrap">
    <scroll-view :scroll-y="true" class="h_100" lower-threshold="20" @scrolltolower="commentScrolltolower">
      <!--分享的具体内容-->
      <slot name="share-content"></slot>
      <!--下载、分享-->
      <DownloadShare v-if="showShare" :type="type" :height="88" @down="downActive" :isCoach="isCoach"
      @coachShare="({detail, type, source}) => $emit('coachShare', {detail, type, source})"/>
      <!--一对一咨询联系-->
      <view class="contact_container" v-if="showContact">
        <Contact :showSendMessage="showSendMessage" @callPhoneCallback="callPhoneCallback" @sendMessageCallback="sendMessageCallback" />
      </view>
      <view class="contact_container advertisement" v-if="type === 99">
        <view class="title mt_40">活动说明</view>
        <view class="dec">活动开放时间为{{activityData.beginDate}} 至 {{activityData.endDate}}</view>
        <mp-html :content="activityData.explainInfo"></mp-html>
      </view>
      <!-- 广告轮播 -->
      <view class="contact_container advertisement" v-if="activityList.length > 0">
        <Advertisement :list="activityList" />
      </view>
      <!-- 导航 -->
      <view class="c_viscosity">
        <CtjtAutoCenterNav :flex="true" :list="tabList" :current="current" :trans-left="150" @change="handleNavChange"></CtjtAutoCenterNav>
      </view>
      <swiper class="scroll_view" :current="current" @change="handleSwiperChange"
      :style="{height: swiperHeight + 'px'}">
        <swiper-item v-if="tabList[0] && tabList[0].value === 1">
          <view class="visiting_card_box" id="carRefId">
            <view class="visiting_card">
              <view class="user_info">
                <image class="avatar" :src="defaultUserImg()"></image>
                <view class="name_tag">
                  <view class="name">{{userNameFilter}}</view>
                </view>
              </view>
              <view class="info_list">
                <text class="iconfont">&#xe6a2;</text>
                <text class="info">{{mobileFilter}}</text>
              </view>
              <view class="info_list">
                <text class="iconfont">&#xe6a0;</text>
                <text class="info">{{ userInfoData.roleName || ''}}</text>
              </view>
              <view class="info_list last">
                <text class="iconfont">&#xe6a1;</text>
                <text class="info">{{drivingSchoolNameFilter}}</text>
                <text class="tag">已认证</text>
              </view>
              <!-- <image class="qr_code" :src="codeimg"></image> -->
            </view>
            <view class="card_menu" v-if="userInfoData.id > 0">
              <view class="menu1" @click="downCard">下载名片</view>
              <button class="menu2" :data-type="7" :data-detail="userInfoData" v-if="isCoach" @click="$emit('coachShare', {type: 7, detail: userInfoData})">分享名片</button>
              <button open-type="share" class="menu2" :data-type="7" :data-detail="userInfoData" v-else>分享名片</button>
            </view>
          </view>
        </swiper-item>
        <swiper-item :class="{'b_f': queryGoodsFlag && goodsList.length === 0}">
          <!-- 班别选择 -->
          <view class="goods_list" id="goodsRefId">
            <view class="default_box" v-if="queryGoodsFlag && goodsList.length === 0">
              <image :src="defaultImg()" class="detault_img"></image>
              <view class="warn">暂无班别信息～</view>
            </view>
            <ClassCom v-for="(item, index) in goodsList" :key="item.id" :item="item" :index="index"
            @coachShare="({detail, type, source}) => $emit('coachShare', {detail, type, source})"
            :isCoach="isCoach" @downloadPoster="downloadPoster"></ClassCom>
          </view>
        </swiper-item>
        <template v-if="schoolId === 370">
          <swiper-item :class="{'b_f': queryStoreFlag && trainingPlaceAndStoreList.length === 0}">
              <!-- 广仁特殊处理 -->
              <view class="train_ground_section" id="storeRefId">
                <view class="default_box" v-if="queryStoreFlag && trainingPlaceAndStoreList.length === 0">
                  <image :src="defaultImg()" class="detault_img"></image>
                  <view class="warn">暂无线下地址信息～</view>
                </view>
                <Store v-for="(item, index) in trainingPlaceAndStoreList" :key="index" :item="item" :showDownload="false">
                  <DownloadShare :detail="item" :type="item.hasOwnProperty('storeId') ? 2 : 3" :source="'list'"
                  @coachShare="({detail, type, source}) => $emit('coachShare', {detail, type: item.hasOwnProperty('storeId') ? 2 : 3, source})" :isCoach="isCoach"
                  @down="downloadPoster({ detail: item, type: item.hasOwnProperty('storeId') ? 3 : 2, source: 'list' })"/>
                </Store>
              </view>
          </swiper-item>
        </template>
        <template v-else>
          <swiper-item  :class="{'b_f': queryTrainingFlag && trainingPlaceList.length === 0}">
              <!-- 训练场 -->
              <view class="train_ground_section" id="trainingPlaceRefId">
                <view class="default_box" v-if="queryTrainingFlag && trainingPlaceList.length === 0">
                  <image :src="defaultImg()" class="detault_img"></image>
                  <view class="warn">暂无训练场信息～</view>
                </view>
                <Store v-for="(item, index) in trainingPlaceList" :key="index" :item="item" :showDownload="false">
                  <DownloadShare :detail="item" :type="3" :source="'list'" :isCoach="isCoach"
                  @coachShare="({detail, type, source}) => $emit('coachShare', {detail, type, source})"
                  @down="downloadPoster({ detail: item, type: 3, source: 'list' })"/>
                </Store>
              </view>
          </swiper-item>
          <swiper-item :class="{'b_f': queryStoreFlag && storeList.length === 0}">
            <!-- 门店 -->
            <view class="store_ervices_section" id="storeRefId">
              <view class="default_box" v-if="queryStoreFlag && storeList.length === 0">
                <image :src="defaultImg()" class="detault_img"></image>
                <view class="warn">暂无门店信息～</view>
              </view>
              <Store v-for="item in storeList" :key="item.telephone" :item="item" :showDownload="false">
                <DownloadShare :detail="item" :type="2" :source="'list'" :isCoach="isCoach"
                @coachShare="({detail, type, source}) => $emit('coachShare', {detail, type, source})"
                @down="downloadPoster({ detail: item, type: 2, source: 'list' })" />
              </Store>
            </view>
          </swiper-item>
        </template>
        <swiper-item v-if="tabList[tabList.length - 2].value === 6">
          <!-- 好评 -->
          <view class="comment_section" id="commentRefId">
            <view class="comment_item" v-for="(item, index) in coachEvaluateList" :key="index">
              <view class="box_t">
                <text class="name">{{item.appraiser}}</text>
                <text class="time">{{item.createdTime}}</text>
              </view>
              <view class="box_b">{{item.content}}</view>
            </view>
          </view>
        </swiper-item>
        <!-- <swiper-item>驾校</swiper-item> -->
      </swiper>
    </scroll-view>
  </view>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import DownloadShare from '@/components/download_share/index.vue';
import Contact from '@/components/contact/index.vue';
import CtjtAutoCenterNav from '@/components/auto_center_nav/index.vue';
import Advertisement from '@/components/advertisement/index.vue';
import Store from '@/components/storefront/index.vue';
import ClassCom from '@/components/class/index.vue';
import MpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html.vue';
import Index from './index';

@Component({
  components: {
    DownloadShare, Contact, CtjtAutoCenterNav, Advertisement, Store, ClassCom, MpHtml
  },
})
export default class ShareLoading extends Index {}
</script>
<style lang="less" scoped>
.share_wrap {
  position: relative;
  background: @ctjt-bgcolor-primary;
  height: 100%;
  .contact_container {
    margin: 24rpx 0rpx;
  }
}
.h_100 {
  height: 100%;
}
.advertisement {
  padding: 28rpx 30rpx;
  background-color: @ctjt-color-text-white;
}
.scroll_view {
  width: 100%;
}
.scroll_container {
  background: @ctjt-bgcolor-primary;
}
.b_f{
  background: #fff;
}
.goods_list {
  padding: 40rpx 30rpx;
  padding-bottom: calc(100rpx +  constant(safe-area-inset-bottom)); /*兼容 IOS<11.2*/
  padding-bottom: calc(100rpx +  env(safe-area-inset-bottom)); /*兼容 IOS>11.2*/
}
.store_ervices_section, .train_ground_section {
  padding: 0 30rpx;
  padding-bottom: calc(100rpx +  constant(safe-area-inset-bottom)); /*兼容 IOS<11.2*/
  padding-bottom: calc(100rpx +  env(safe-area-inset-bottom)); /*兼容 IOS>11.2*/
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
.comment_section {
  border-top: 1rpx solid @ctjt-color-border-two;
  padding: 0 30rpx;
  background-color: @ctjt-color-text-white;
  box-sizing: border-box;
  .comment_item {
    border-bottom: 1rpx solid @ctjt-color-border-two;
    padding: 40rpx 0 24rpx 0;
    &:last-child {
      border: 0;
    }
    .box_t {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .name {
        line-height: 26rpx;
        color: @ctjt-color-text-main;
        font-size: 26rpx;
      }
      .time {
        line-height: 26rpx;
        color: @ctjt-color-text-secondary-two;
        font-size: 26rpx;
      }
    }
    .box_b {
      margin-top: 24rpx;
      line-height: 38rpx;
      color: @ctjt-color-text-secondary-one;
      font-size: 26rpx;
    }
  }
}
.c_viscosity {
  position: sticky;
  width: 100%;
  z-index: 2;
}

.visiting_card_box {
  background: #fff;
  padding: 40rpx 30rpx;
  padding-bottom: calc(100rpx +  constant(safe-area-inset-bottom)); /*兼容 IOS<11.2*/
  padding-bottom: calc(100rpx +  env(safe-area-inset-bottom)); /*兼容 IOS>11.2*/
  .visiting_card {
    box-shadow: 0px 8rpx 16rpx 0px rgba(0, 0, 0, 0.15);
    border-radius: 24rpx;
    padding: 40rpx;
    margin-bottom: 40rpx;
    position: relative;
    .qr_code {
      width: 126rpx;
      height: 126rpx;
      position: absolute;
      right: 40rpx;
      bottom: 40rpx;
    }
  }
  .user_info {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;
    .avatar {
      width: 120rpx;
      height: 120rpx;
      background: #fff2be;
      margin-right: 40rpx;
      border-radius: 50%;
    }
    .name_tag {
      // flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      .name {
        color: @ctjt-color-text-main;
        font-size: 32rpx;
        line-height: 1;
        // margin-bottom: 16rpx;
      }
      .edit_wrap {
        padding: 20rpx 30rpx 20rpx 8rpx;
        margin-top: 7rpx;
        .iconfont {
          font-size: 38rpx;
          line-height: 1;
        }
      }
    }
  }
  .info_list {
    margin-bottom: 24rpx;
    height: 26rpx;
    display: flex;
    align-items: center;
    &.last {
      margin-bottom: 0;
    }
    .tag {
      color: @ctjt-color-label;
      background: @ctjt-bgcolor-label;
      font-size: 22rpx;
      line-height: 1;
      border-radius: 8rpx;
      padding: 2rpx 5rpx;
      margin-left: 10rpx;
    }
  }
  .info_list text {
    font-size: 26rpx;
    color: @ctjt-color-text-secondary-one;
  }
  .info_list .info {
    margin-left: 8rpx;
    // width: 300rpx;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    height: 26rpx;
    line-height: 26rpx;
  }
  .card_menu {
    display: flex;
    .menu1,
    .menu2 {
      flex: 1;
      line-height: 70rpx;
      text-align: center;
      font-size: 32rpx;
      color: @ctjt-color-text-main;
      border-radius: 40rpx;
    }
    .menu1 {
      line-height: 66rpx;
      border: solid 2rpx @ctjt-color-text-main;
      margin-right: 30rpx;
    }
    .menu2 {
      background: @ctjt-color-primary;
    }
  }
}

.title {
  color: @ctjt-color-text-main;
  font-size: 32rpx;
  line-height: 32rpx;
}
.dec {
  color: @ctjt-color-text-secondary-one;
  font-size: 26rpx;
  line-height: 26rpx;
  margin: 24rpx 0rpx 16rpx 0rpx;
}

</style>
