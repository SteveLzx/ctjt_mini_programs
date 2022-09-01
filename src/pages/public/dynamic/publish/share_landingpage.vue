<template>
  <scroll-view class="content">
    <canvas
      type="2d"
      id="cardCanvas"
      style="width: 345px; height: 276px; position: fixed; top: 200%"
    ></canvas>
    <canvas
      type="2d"
      id="myCanvas"
      style="
        width: 345px;
        height: 276px;
        margin: 0;
        position: fixed;
        top: -200%;
      "
    ></canvas>
    <ShareLoading
      :type="type"
      :show-share="type != 7 && type != 4"
      :show-contact="type != 7 && type != 4"
      :sId="Number(sId)"
      :user-id="dynamicsSceneData.userId"
      :user-type="dynamicsSceneData.userType"
      :forward-user-id="dynamicsSceneData.forwardUserId"
      :scene-id="sceneId"
      :activity-data="activityData"
      @down-active="createdDynamicsScene"
      @down-card="downCard"
      @down-store="downStore"
      @callPhoneCallback="callPhoneCallback"
      @sendMessageCallback="sendMessageCallback"
      @coachShare="coachShare"
    >
      <template #share-content>
        <template v-if="type == 4">
          <Classes
            :isCoach="isCoach"
            :data="classData"
            :showSendMessage="showSendMessage"
            :swiper-height="classSwiperHeight"
            @down="createdDynamicsScene"
            @callPhoneCallback="callPhoneCallback"
            @sendMessageCallback="sendMessageCallback"
            @coachShare="coachShare"
          />
        </template>
        <template v-if="type == 2">
          <Store
            :item="storeData"
            :showDownload="false"
            :source="'sharelandingpage'"
          ></Store>
        </template>
        <template v-if="type == 3">
          <Store
            :item="trainingData"
            :showDownload="false"
            :source="'sharelandingpage'"
          ></Store>
        </template>
        <template v-if="type == 7">
          <view class="c_card">
            <NameCardInfo
              :type="1"
              :show-mobile="false"
              :user-id="dynamicsSceneData.dynamicsId"
              :showSendMessage="showSendMessage"
              @callPhoneCallback="callPhoneCallback"
              @sendMessageCallback="sendMessageCallback"
            />
          </view>
        </template>
        <template v-if="type == 1"></template>
        <template v-if="type == 5">
          <view class="activity_container">
            <view :class="['activity', { disable: downTimes }]">
              <view class="disble_wrap" v-if="downTimes">活动即将在 {{ timeName }} 后开始</view>
              <view class="notice" v-if="!downTimes">
                <Notice :data="userData" />
              </view>
              <ActivityGiftbox
                :price="activityData.bounty"
                :time="!downTimes ? activityData.endDate : ''"
                :is-show-price="activityData.isShow === 1"
                :type="activityData.type"
              />
              <button class="share_btn" open-type="share" :data-type="type">
                点击调起分享
              </button>
            </view>
          </view>
        </template>
        <template v-if="type == 6">
          <view class="activity_container">
            <view :class="['activity', { disable: downTimes }]">
              <view class="disble_wrap" v-if="downTimes"
                >活动即将在 {{ timeName }} 后开始</view
              >
              <view class="notice" v-if="!downTimes">
                <Notice :data="userData"></Notice>
              </view>
              <ActivityTurntable
                :list="awardsList"
                :batch-id="activityData.couponBatchId"
                :activity-id="activityData.id"
                :s-id="sId"
                :time="!downTimes ? activityData.endDate : ''"
                :disabled="false"
              />
            </view>
            <button v-if="authFlag" class="sign_btn" @click="goHome">
              立即报名
            </button>
            <button
              v-else
              class="sign_btn"
              open-type="getPhoneNumber"
              @getphonenumber="verifyTelAccredit"
            >
              立即报名
            </button>
          </view>
        </template>
        <template v-if="type == 99">
          <view class="activity_container">
            <view :class="['activity', { disable: downTimes }]">
              <view class="activity_mtitle">{{mainTitle}}</view>
              <view class="activity_stitle" v-if="sId !== 370">深港幸运大转盘</view>
              <view class="disble_wrap" v-if="downTimes"
                >活动即将在 {{ timeName }} 后开始</view
              >
              <view class="notice" v-if="!downTimes">
                <Notice :data="userData"></Notice>
              </view>
              <ActivityTurntable
                :bgType='1'
                :list="awardsList"
                :batch-id="activityData.couponBatchId"
                :activity-id="activityData.id"
                :s-id="sId"
                :time="!downTimes ? activityData.endDate : ''"
                :disabled="false"
              />
            </view>
            <button v-if="authFlag" class="sign_btn" @click="goHome">
              立即报名
            </button>
            <button
              v-else
              class="sign_btn"
              open-type="getPhoneNumber"
              @getphonenumber="verifyTelAccredit"
            >
              立即报名
            </button>
          </view>
        </template>
      </template>
    </ShareLoading>
    <DownloadPoster
      v-if="showDownloadPoster"
      @close="showDownloadPoster = false"
      :data="downloadPosterData"
    />
    <Authorize :flag="authFLag"></Authorize>
    <CustomShare :visible.sync="shareVisible" :content.sync="shareContent" v-show="shareVisible"></CustomShare>
  </scroll-view>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import ShareLoading from '@/components/share_loading/index.vue';
import Store from '@/components/storefront/index.vue';
import NameCardInfo from '@/pages/public/name_card/components/name_card_info/index.vue';
import DownloadPoster from '@/components/download_poster/index.vue';
import Authorize from '@/components/authorize/index.vue';
import CustomShare from '@/components/custom_share/index.vue';
import ActivityTurntable from '../components/activity_turntable/index.vue';
import ActivityGiftbox from '../components/activity_giftbox/index.vue';
import Notice from '../components/notice/index.vue';
import Classes from '../components/classes/index.vue';
import Index from './share_landingpage';

@Component({
  components: {
    ShareLoading,
    ActivityTurntable,
    ActivityGiftbox,
    Notice,
    Classes,
    Store,
    NameCardInfo,
    DownloadPoster,
    Authorize,
    CustomShare
  },
})
export default class ShareLandingpage extends Index {}
</script>
<style lang="less" scoped>
.content {
  box-sizing: border-box;
  background-color: @ctjt-color-text-white;
  overflow: hideen;
  height: 100%;
}
.activity_container {
  padding: 40rpx 30rpx;
  background-color: @ctjt-color-text-white;
  .activity {
    position: relative;
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
        z-index: 99;
        color: #fff;
        font-size: 32rpx;
        line-height: 430rpx;
        border-radius: 24rpx;
      }
    }
      .activity_mtitle {
        position: absolute;
        top: 64rpx;
        width: 100%;
        font-size: 58rpx;
        line-height: 58rpx;
        text-align: center;
        font-weight: 600;
        color: #fef97c;
        background: -webkit-linear-gradient(-90deg, #fff, #fef97c);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        z-index: 1;
      }
      .activity_stitle {
        position: absolute;
        top: 140rpx;
        width: 100%;
        font-size: 34rpx;
        line-height: 34rpx;
        text-align: center;
        font-weight: 500;
        color: #fff;
        z-index: 1;
      }
    .notice {
      position: absolute;
      width: 100%;
      top: 242rpx;
      z-index: 3;
    }
  }
  .sign_btn {
    height: 88rpx;
    width: 690rpx;
    margin-top: 32rpx;
    text-align: center;
    line-height: 88rpx;
    border-radius: 44rpx;
    color: @ctjt-color-text-main;
    font-size: 32rpx;
    background: @ctjt-color-primary;
  }
  .share_btn {
    position: absolute;
    bottom: 80rpx;
    width: 100%;
    height: 200rpx;
    background-color: @ctjt-color-primary;
    opacity: 0;
  }
}
.c_card {
  background-color: @ctjt-color-text-white;
  padding-top: 56rpx;
  margin-bottom: 24rpx;
}
</style>
