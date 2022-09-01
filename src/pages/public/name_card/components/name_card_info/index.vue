<template>
  <view class="user_wrap">
    <view class="card_wrap">
      <view class="left_icon">
        <image class="avatar" :src="cardInfo.icon || defaultImg()"></image>
      </view>
      <view class="label_tag">
        <view class="item" v-for="(item, i) in tagsFilter" :key="i">
          <view class="label_info">
            <view class="icon_font"></view>
            <view class="label_title">{{ item.label }}</view>
          </view>
          <view class="label_value">{{ item.value }}</view>
        </view>
      </view>
    </view>
    <view class="dec_wrap">
      <view class="name_cons">
        <view class="nick_name">{{ userNameFilter }}</view>
        <view class="edit_wrap" @click="jumpEdit" v-if="showMobile">
          <text class="iconfont">&#xe6ab;</text>
        </view>
      </view>
      <view class="info_wrap">
        <view class="tag">已认证</view>
        <view class="info" :class="{ max_info: !cardInfo.subjects }">
          {{ cardInfo.drivingSchoolName }}</view
        >
        <view class="subjects_wrap">
          <view class="split_tag" v-if="roleNameFilter"></view>
          {{ roleNameFilter }}
        </view>
      </view>
      <view class="tag_wrap">
        <view v-for="(item, i) in cardInfo.carModel" :key="i">{{ item }}</view>
        <view v-for="(item, i) in cardInfo.subjects" :key="i">{{ item }}</view>
      </view>
      <template v-if="showMobile">
        <view class="mobile_wrap">
          <text class="iconfont">&#xe6a2;</text>
          <text>一对一学车咨询：</text>
          <text>{{
            cardInfo.userType === 3 ? defaultMobile : cardInfo.mobile
          }}</text>
        </view>
      </template>
      <template v-else>
        <view class="mobile_wrap c_call_phone">
          <text>一对一学车咨询：</text>
          <button
            class="btn send_btn"
            v-if="showSendMessage"
            @click="_sendMessage"
          >
            发消息
          </button>
          <button class="btn call_btn" @click="_callPhone">打电话</button>
        </view>
      </template>
    </view>
    <view class="self_dec_wrap" v-if="cardInfo.about">
      <text>{{ cardInfo.about }}</text>
    </view>
  </view>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import NameCardInfoIndex from './index';

@Component
export default class NameCardInfo extends NameCardInfoIndex {}
</script>
<style lang="less" scoped>
.user_wrap {
  background: @ctjt-bgcolor-primary;
  .card_wrap {
    background: url('https://file.aicar365.com/mini-program/common/wode_kapianimg.png')
      no-repeat;
    background-size: 100% 100%;
    height: 398rpx;
    position: relative;
    display: flex;
    padding: 0 14rpx;
    .left_icon {
      height: 366rpx;
      width: 391rpx;
      overflow: hidden;
      margin: 8rpx 0 0 4rpx;
      border-radius: 24rpx 0 0 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      -webkit-clip-path: polygon(0 0, 0 100%, 85% 100%, 100% 0);
      clip-path: polygon(0 0, 0 100%, 85% 100%, 100% 0);
      overflow: hidden;
      .avatar {
        height: 100%;
      }
    }
    .label_tag {
      width: 331rpx;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .item {
        display: flex;
        margin-bottom: 24rpx;
        width: 100%;
        &:last-child {
          margin-bottom: 0;
        }
        .label_info {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 10rpx;
          .icon_font {
            width: 15rpx;
            height: 15rpx;
            margin-right: 8rpx;
            border: 1rpx solid @ctjt-color-text-main;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            &::after {
              content: '';
              width: 7rpx;
              height: 7rpx;
              background-color: @ctjt-color-primary;
              border: 1rpx solid @ctjt-color-text-main;
              border-radius: 50%;
            }
          }
          .label_title {
            text-align: left;
            font-size: 26rpx;
            line-height: 1;
            color: @ctjt-color-text-main;
          }
        }
        .label_value {
          text-align: right;
          font-size: 26rpx;
          line-height: 1;
          color: #353535;
          right: 52rpx;
          position: absolute;
        }
      }
    }
  }
  .dec_wrap {
    padding: 40rpx 62rpx;
    background-color: @ctjt-color-text-white;
    .name_cons {
      display: flex;
      align-items: center;
      .nick_name {
        font-size: 36rpx;
        line-height: 1;
        color: @ctjt-color-text-main;
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
    .info_wrap {
      display: flex;
      align-items: center;
      margin: 24rpx 0;
      .tag {
        width: 82rpx;
        height: 28rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22rpx;
        border-radius: 8rpx;
        margin-right: 8rpx;
        color: @ctjt-color-label;
        background-color: @ctjt-bgcolor-label;
      }
      .info {
        font-size: 28rpx;
        line-height: 1;
        color: @ctjt-color-text-main;
        // max-width: 270rpx;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
      .max_info {
        min-width: 270rpx;
        max-width: none;
      }
      .subjects_wrap {
        display: flex;
        align-items: center;
        font-size: 28rpx;
        line-height: 1;
        color: @ctjt-color-text-main;
        max-width: 280rpx;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        .split_tag {
          margin: 0 8rpx;
          width: 8rpx;
          height: 8rpx;
          background-color: @ctjt-color-text-main;
          border-radius: 50%;
        }
      }
    }
    .tag_wrap {
      display: flex;
      align-items: center;
      > view {
        margin-right: 24rpx;
        font-size: 28rpx;
        line-height: 1;
        color: @ctjt-color-text-main;
        padding: 8rpx 30rpx;
        border-radius: 8rpx;
        background-color: @ctjt-color-primary;
        display: flex;
        align-items: center;
        position: relative;
        overflow: hidden;
        &::after {
          content: '';
          width: 14rpx;
          height: 14rpx;
          background-color: @ctjt-color-text-white;
          position: absolute;
          right: -7rpx;
          border-radius: 50%;
        }
      }
    }
    .mobile_wrap {
      margin: 32rpx 0;
      display: inline-flex;
      align-items: center;
      text {
        margin-right: 10rpx;
        font-size: 28rpx;
        line-height: 1;
        color: @ctjt-color-text-main;
        &:last-child {
          font-size: 36rpx;
        }
      }
    }
    .c_call_phone {
      margin-top: 40rpx;
      width: 100%;
      justify-content: space-between;
      .btn {
        width: 184rpx;
        height: 70rpx;
        line-height: 70rpx;
        border-radius: 35rpx;
        font-size: 32rpx;
        text-align: center;
        color: @ctjt-color-text-main;
      }
      .send_btn {
        border: 2rpx solid @ctjt-color-text-main;
        margin-right: 24rpx;
        box-sizing: border-box;
        line-height: 66rpx;
      }
      .call_btn {
        background: @ctjt-color-primary;
      }
    }
  }
  .self_dec_wrap {
    background-color: @ctjt-color-text-white;
    margin: 24rpx 0;
    padding: 28rpx 62rpx;
    display: flex;
    align-items: center;
    text {
      font-size: 28rpx;
      color: @ctjt-color-text-main;
      letter-spacing: 2rpx;
      line-height: 42rpx;
      word-break: break-all;
    }
  }
}
</style>
