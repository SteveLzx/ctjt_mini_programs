<template>
  <view class="c_classes">
    <!-- 轮播图 -->
    <view class="swiper_section">
      <view class="swiper_section_spacing" v-if="data.photoUrl && data.photoUrl.length > 0">
          <swiper class="swiper"
            @change="swiperChange"
            :indicator-dots="false"
            :interval="2000"
            :duration="500"
            :style="{height: swiperHeight + 'px'}">
              <swiper-item v-for="(item, index) in data.photoUrl" :key="index">
                  <view class="swiper_item" v-if="isImage(item)">
                    <image :src="imgDomain + item" mode="widthFix"></image>
                  </view>
                  <view class="swiper_item" v-else>
                    <video :src="imgDomain + item" :autoplay="index === 0" muted show-mute-btn></video>
                  </view>
              </swiper-item>
          </swiper>
      </view>
      <!-- 脚标 -->
      <view class="swiper_list_cell">
        <text class="cell_text">{{swiperCurrentIndex + 1}}/{{data.photoUrl.length}}</text>
      </view>
    </view>
    <!-- 中间部分 -->
    <view class="middle_section" v-if="data.appName">
      <view class="info_container">
        <view class="price_share">
          <view class="price">
            <text class="unit">¥</text>
            <text class="nums">{{data.appPrice}}</text>
            <text class="old_p">¥{{data.appPrice + 200}}</text>
          </view>
          <view>
            <view class="share down" @click="down">
              <text class="iconfont icon_share" style="font-size: 48rpx;">&#xe69a;</text>
            </view>
            <button class="share" open-type='share' :data-type="4" v-if="!isCoach">
              <span class="iconfont icon_share">&#xe61e;</span>
            </button>
            <button class="share" :data-type="4" v-else @click="$emit('coachShare', { type: 4, detail: data})">
              <span class="iconfont icon_share">&#xe61e;</span>
            </button>
          </view>
        </view>
        <view class="title">{{data.appName}}</view>
        <view class="browse">
          <text v-if="data.browseNumber">浏览{{data.browseNumber}}次</text>
          <!-- <text v-if="data.registeredNumber" style="margin-left: 40rpx;">已报名{{data.registeredNumber}}</text> -->
        </view>
      </view>
      <!-- <view class="sign_up_container">
        <Barrage></Barrage>
      </view> -->
      <!--一对一咨询联系-->
      <view class="contact_container">
        <Contact :showSendMessage="showSendMessage" @callPhoneCallback="callPhoneCallback" @sendMessageCallback="sendMessageCallback" />
      </view>
      <!-- 班别详情 -->
      <view class="class_details_section" v-if="data.description">
        <SplitterBar :tit="'班别详情'"></SplitterBar>
        <mp-html :content="data.description"></mp-html>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import {
  Component, Prop, Vue, Emit
} from 'vue-property-decorator';
import { proImgDomain } from '@/assets/js/config';
import { isImage } from '@/assets/js/common';
import MpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html.vue';
import Contact from '@/components/contact/index.vue';
import SplitterBar from '@/components/splitter_bar/index.vue';
// import Barrage from '@/components/barrage/index.vue';

@Component({
  components: { SplitterBar, MpHtml, Contact }
})
export default class Classes extends Vue {
  @Prop({ default: {} }) data!: {}

  @Prop({ default: 0 }) swiperHeight!: number

  @Prop({ default: true }) showSendMessage!: boolean

  @Prop({ default: false }) isCoach!: boolean

  imgDomain = proImgDomain;

  swiperCurrentIndex = 0; // swiper当前index

  isImage(url: string) { // 判断是图片还是视频
    return isImage(url);
  }

  @Emit('down')
  down() {
    //
  }

  /** 拨打电话 */
  @Emit('callPhoneCallback')
  callPhoneCallback() {
    //
  }

  /** 发消息 */
  @Emit('sendMessageCallback')
  sendMessageCallback() {
    //
  }
}

</script>
<style lang="less" scoped>
.c_classes {
  background-color: @ctjt-bgcolor-primary;
}
.swiper_section {
  position: relative;
}
.swiper_section_spacing {
  .swiper {
    overflow: hidden;
  }
  .swiper_item {
    width: 100%;
    height: 100%;
    position: relative;
    image{
      width: 100%;
    }
    video{
      width: 100%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
.swiper_list_cell {
  position: absolute;
  right: 24rpx;
  bottom: 24rpx;
  display: flex;
  .cell_text {
    height: 50rpx;
    padding: 0 20rpx;
    border-radius: 25rpx;
    font-size: 28rpx;
    line-height: 50rpx;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.4);
  }
}
.middle_section {
  padding: 32rpx 24rpx 0;
  .info_container {
    background-color: #fff;
    border-radius: 8rpx;
    padding: 32rpx;
    .price_share {
      padding: 0 0 8rpx;
      display: flex;
      justify-content: space-between;
      .price {
        display: flex;
        align-items: baseline;
        .unit {
          font-size: 24rpx;
          color: @ctjt-color-price;
        }
        .nums {
          font-size: 48rpx;
          color: @ctjt-color-price;
        }
        .old_p {
          margin-left: 16rpx;
          font-size: 26rpx;
          color: @ctjt-color-text-secondary-one;
          text-decoration: line-through;
        }
      }
      .share {
        display: inline-block;
        margin: 0;
        padding: 0;
        line-height: 43rpx;
        background: transparent;
        &.down{
          position: relative;
          left: -30rpx;
          top: -4rpx;
        }
        .icon_share {
          font-size: 38rpx;
          color: @ctjt-color-text-main;
        }
      }
    }
    .title {
      line-height: 48rpx;
      color: @ctjt-color-text-main;
      font-size: 32rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      color: @ctjt-color-text-main;
    }
    .browse {
      margin-top: 16rpx;
      font-size: 24rpx;
      color: @ctjt-color-text-secondary-two;
    }
  }
  .sign_up_container {
    background-color: #fff;
    border-radius: 8rpx;
    margin-top: 17rpx;
    padding: 25rpx 32rpx;
    display: flex;
    align-items: center;
    .image_list {
      display: flex;
      align-items: center;
      .item_img {
        height: 38rpx;
        width: 38rpx;
        border-radius: 50%;
        margin-right: 16rpx;
      }
    }
    .user {
      font-size: 26rpx;
      color: @ctjt-color-text-secondary-one;
      .tips {
        margin-left: 8rpx;
        color: @ctjt-color-text-secondary-two;
      }
    }
  }
}
.contact_container {
  border-radius: 8rpx;
  margin: 24rpx 0rpx;
  overflow: hidden;
}
.class_details_section {
  padding-top: 32rpx;
  .detail {
    .img {
      width: 100%;
      height: auto;
    }
  }
}
</style>
