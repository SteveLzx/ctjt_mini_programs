<template>
  <view>
    <canvas
      type="2d"
      id="cardCanvas"
      style="width: 345px; height: 276px; position: fixed; top: 200%"
    ></canvas>
    <view class="header_section" v-if="!authFlag || isStudent">
      <view class="user_box">
        <view class="user_img" @click="getUserInfo">
          <image :src="wechatUserInfo.avatarUrl || defaultUserImg()"></image>
        </view>
        <view class="user_info">
          <!-- 已登录未报名 -->
          <template v-if="authFlag">
            <view class="user_wrap" @click="getUserInfo">
              <view class="nick_name">
                <view>{{ wechatUserInfo.nickName || '用户' + regTel(2) }}</view>
                <view class="nick_span" v-if="false"></view>
                <view v-if="false">学员</view>
              </view>
              <view class="tel">{{ regTel(1) }}</view>
            </view>
          </template>
          <!-- 未登录用户 -->
          <template v-else>
            <view class="user_wrap">
              <button
                class="login"
                open-type="getPhoneNumber"
                @getphonenumber="verifyTelAccredit"
              >
                立即登录
              </button>
              <view class="login_tips">登录后查看更多信息</view>
            </view>
          </template>
        </view>
      </view>
    </view>
    <template v-if="!isStudent && authFlag">
      <view class="visiting_card_box">
        <view class="visiting_card" @click="jumpPage('index')">
          <view class="user_info">
            <image
              class="avatar"
              :src="wechatUserInfo.avatarUrl || defaultShengang()"
            ></image>
            <view class="name_tag">
              <view class="name">
                {{ cardInfo.userName }}
              </view>
              <!-- <view class="edit_wrap" @click.stop="jumpPage('edit')">
                <text class="iconfont">&#xe6ab;</text>
              </view> -->
              <!-- <view class="tags">
                <view class="tag">星级教练</view>
                <view class="tag">星级教练</view>
                <view class="tag">星级教练</view>
              </view> -->
              <view></view>
            </view>
          </view>
          <view class="info_list">
            <text class="iconfont">&#xe6a2;</text>
            <text class="info">{{
              cardInfo.userType !== 3 ? cardInfo.mobile : defaultMobile
            }}</text>
          </view>
          <view class="info_list" v-if="roleNameFilter">
            <text class="iconfont">&#xe6a0;</text>
            <text class="info"> {{ roleNameFilter }} </text>
          </view>
          <view class="info_list last">
            <text class="iconfont">&#xe6a1;</text>
            <text class="info">{{ cardInfo.drivingSchoolName }}</text>
            <text class="tag">已认证</text>
          </view>
          <!-- <image class="qr_code" :src="codeimg"></image> -->
        </view>
        <view class="card_menu">
          <view class="menu1" @click="downloadCard">下载名片</view>
          <button class="menu2" @click="share">分享名片</button>
        </view>
      </view>
      <view class="commission_box">
        <view class="unreceived_commission" v-if="false">
          <view @click="toPublish">
            <text class="iconfont icon_left">&#xe69f;</text>
            继续发布或转发，获取更多客户
          </view>
          <text class="iconfont icon_right">&#xe6a3;</text>
        </view>
        <view class="commission">
          <!--  <view class="tit"
            >总金额
            <text class="right"
              ><text class="iconfont">&#xe69f;</text>佣金</text
            >
          </view>
         <view class="total_money">6300</view> -->
          <view class="detailed">
            <view class="list"
              >已发布<view class="number">{{ publishCount }}</view></view
            >
            <view class="list" @click="toJump(0)"
              >关联客户<view class="number">{{ relationCount }}</view></view
            >
            <view class="list" @click="toJump(2)"
              >已核销券<view class="number">{{ dealCount }}</view></view
            >
          </view>
          <view class="publish" @click="toPublish"
            >继续发布或转发，获取更多客户<text class="iconfont"
              >&#xe6a3;</text
            ></view
          >
        </view>
      </view>
    </template>
    <view class="menu_list">
      <button
        v-if="!authFlag"
        class="login"
        open-type="getPhoneNumber"
        @getphonenumber="verifyTelAccredit"
      ></button>
      <!-- 广仁教练专享 -->
      <view
        v-if="
          schoolId === 370 && !isStudent && authFlag && roleName === '陪驾导师'
        "
      >
        <view
          class="menu_item"
          @click="grClick(item.key)"
          v-for="item in grMenu"
          :key="item.key"
        >
          <view class="menu border">
            <span class="iconfont left_icon" v-html="item.icon"></span>
            <text class="menu_name">{{ item.name }}</text>
            <text class="iconfont right_icon">&#xe6a3;</text>
          </view>
        </view>
      </view>
      <view
        class="menu_item"
        v-for="(item, index) in menuList"
        :key="index"
        @click="menuClick(item.key)"
      >
        <view
          class="menu"
          :class="{ border: item.key !== 5 }"
          v-if="item.key !== 5"
        >
          <span class="iconfont left_icon" v-html="item.icon"></span>
          <text class="menu_name">{{ item.name }}</text>
          <text class="iconfont right_icon">&#xe6a3;</text>
        </view>
        <!-- 意见反馈 -->
        <button class="menu" open-type="feedback" v-else>
          <span class="iconfont left_icon" v-html="item.icon"></span>
          <text class="menu_name">{{ item.name }}</text>
          <text class="iconfont right_icon">&#xe6a3;</text>
        </button>
      </view>
    </view>
    <!-- <view class="agreement">隐私协议</view> -->
    <Tabbar currentIndex="3" />
    <DownloadPoster
      v-if="showDownloadPoster"
      @close="showDownloadPoster = false"
      :data="downloadPosterData"
    />
    <CustomShare
      :visible.sync="shareVisible"
      :content.sync="shareContent"
    ></CustomShare>
  </view>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Tabbar from '@/components/tabbar/index.vue';
import DownloadPoster from '@/components/download_poster/index.vue';
import CustomShare from '@/components/custom_share/index.vue';
import MineIndex from './index';

@Component({
  components: { Tabbar, DownloadPoster, CustomShare },
})
export default class Mine extends MineIndex {}
</script>

<style lang="less" scoped>
.header_section {
  flex: 0 0 auto;
  margin-bottom: 24rpx;
  .user_box {
    box-sizing: border-box;
    padding: 28rpx 0rpx 56rpx 40rpx;
    height: 200rpx;
    width: 100%;
    background-color: #fff;
    display: flex;
    .user_img {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      overflow: hidden;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .user_info {
      margin-left: 40rpx;
      .login_tips {
        color: @ctjt-color-text-secondary-one;
        font-size: 26rpx;
        line-height: 1;
        margin-top: 16rpx;
      }
      .login {
        width: 200rpxrpx;
        height: 70rpx;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 35rpx;
        border: 1px solid @ctjt-color-text-secondary-one;
        font-size: 32rpx;
        color: @ctjt-color-text-main;
        background-color: transparent;
      }
      .info_box {
        height: 100%;
      }
      .nick_name {
        padding-top: 24rpx;
        font-size: 32rpx;
        line-height: 32rpx;
        color: @ctjt-color-text-main;
        display: flex;
        align-items: center;
        // justify-content: center;
        .nick_span {
          width: 2rpx;
          height: 32rpx;
          background-color: @ctjt-color-text-main;
          margin: 0rpx 20rpx;
        }
      }
      .tel {
        margin-top: 16rpx;
        font-size: 26rpx;
        line-height: 1;
        color: @ctjt-color-text-secondary-one;
      }
    }
  }
}
.visiting_card_box {
  background: #fff;
  padding: 40rpx 30rpx;
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
      // background: #fff2be;
      margin-right: 40rpx;
      border-radius: 50%;
      // overflow: hidden;
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
      // .tag {
      //   float: left;
      //   padding: 4rpx 11rpx;
      //   font-size: 22rpx;
      //   border-radius: 8rpx;
      //   margin-right: 16rpx;
      //   color: @ctjt-color-label;
      //   border: solid 1rpx @ctjt-color-label;
      // }
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
.commission_box {
  padding: 40rpx 30rpx 42rpx 30rpx;
  margin: 40rpx 0;
  background: #fff;
  .commission {
    background: url('https://file.aicar365.com/mini-program/marketing/wode_img_youyongjin.png')
      no-repeat;
    background-size: 100% auto;
    background-position: left top;
    border-radius: 24rpx;
    padding-top: 60rpx;
    .tit {
      font-size: 20rpx;
      line-height: 20rpx;
      color: @ctjt-color-text-main;
      padding: 0 32rpx 12rpx;
      .right {
        float: right;
      }
      .iconfont {
        font-size: 20rpx;
        margin-right: 8rpx;
      }
    }
    .total_money {
      padding-left: 32rpx;
      line-height: 56rpx;
      font-size: 56rpx;
      color: @ctjt-color-text-main;
      padding-bottom: 48rpx;
    }
    .detailed {
      display: flex;
      padding: 0 32rpx 48rpx;
      view {
        flex: 1;
        color: @ctjt-color-text-main;
        font-size: 20rpx;
        line-height: 20rpx;
      }
      .number {
        margin-top: 12rpx;
        font-size: 36rpx;
        line-height: 1;
      }
    }
    .publish {
      padding: 0 32rpx;
      line-height: 70rpx;
      color: @ctjt-color-text-main;
      font-size: 22rpx;
      .iconfont {
        float: right;
        font-size: 26rpx;
      }
    }
  }
  .unreceived_commission {
    background: url('https://file.aicar365.com/mini-program/marketing/wode_img_wuyongjin.png')
      no-repeat;
    background-size: 100% auto;
    background-position: left top;
    height: 112rpx;
    border-radius: 24rpx;
    display: flex;
    align-items: center;
    padding: 0 32rpx;
    font-size: 22rpx;
    color: @ctjt-color-text-main;
    justify-content: space-between;
    .icon_left {
      font-size: 22rpx;
      margin-right: 8rpx;
      color: @ctjt-color-text-main;
    }
    .icon_right {
      font-size: 22rpx;
      color: @ctjt-color-text-main;
    }
  }
}
.menu_list {
  padding-bottom: calc(
    200rpx + constant(safe-area-inset-bottom)
  ); /*兼容 IOS<11.2*/
  padding-bottom: calc(200rpx + env(safe-area-inset-bottom)); /*兼容 IOS>11.2*/
  position: relative;
  .login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 100rpx;
    left: 0;
    z-index: 3;
  }
  .menu_item {
    background: #fff;
    padding: 0 30rpx;
    .menu {
      height: 112rpx;
      display: flex;
      align-items: center;
      position: relative;
      font-size: 26rpx;
      &.border {
        border-bottom: solid 1rpx @ctjt-color-border-two;
      }
      .menu_name {
        margin-left: 16rpx;
        color: @ctjt-color-text-secondary-three;
      }
      .left_icon {
        font-size: 44rpx;
        margin-left: 10rpx;
        color: @ctjt-color-text-secondary-two;
      }
      .right_icon {
        margin: 0 10rpx 0 0;
        font-size: 26rpx;
        position: absolute;
        right: 0;
      }
    }
  }
}
.agreement {
  line-height: 88rpx;
  color: @ctjt-color-text-secondary-one;
  text-align: center;
  text-decoration: underline;
  font-size: 24rpx;
  padding-bottom: calc(
    100rpx + constant(safe-area-inset-bottom)
  ); /*兼容 IOS<11.2*/
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom)); /*兼容 IOS>11.2*/
}
</style>
