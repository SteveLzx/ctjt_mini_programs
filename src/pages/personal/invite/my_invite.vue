<template>
  <view class="bg">
    <view class="tit">我的邀请详情</view>
    <view class="invite_detail">
      <view class="list">
        <view>
          <view class="num">{{inviteTallys.appySuccessCount || 0}}<text>人</text></view>
          <view class="des">留下联系方式</view>
        </view>
        <view>
          <view class="num">{{inviteTallys.paymentSuccessCount || 0}}<text>人</text></view>
          <view class="des">成功报名</view>
        </view>
        <view>
          <view class="num">{{inviteTallys.reward || 0}}<text>元</text></view>
          <view class="des">获得奖金</view>
        </view>
      </view>
    </view>
    <view>
      <view class="tit">看过邀请函的朋友(潜在客户)<text>{{logListType1.length}}人</text></view>
      <view class="friends_box" :class="{'active': flag.a, 'height_cont': logListType1.length === 1}" v-if="logListType1.length > 0">
        <view class="friend" v-for="(item, index) in logListType1" :key="index">
          <img class="header_sculpture" :src="item.wechatLogoUrl || header" alt="">
          <view class="name">{{item.wechatNickname || '微信用户'}}</view>
          <view class="status">已邀请</view>
        </view>
        <view class="show_mor" v-if="logListType1.length > 1 && !flag.a" @click="flag.a = true">查看更多<span class="iconfont">&#xe627;</span></view>
      </view>
    </view>
    <view>
      <view class="tit">已留联系方式的朋友<text>{{logListType3.length}}人</text></view>
      <view class="friends_box" :class="{'active': flag.b, 'height_cont': logListType3.length === 1}" v-if="logListType3.length > 0">
        <view class="friend" v-for="(item, index) in logListType3" :key="index">
          <img class="header_sculpture" :src="item.wechatLogoUrl || header" alt="">
          <view class="name">{{item.wechatNickname || '微信用户'}}</view>
          <view class="status">客服正在邀请他报名</view>
        </view>
        <view class="show_mor" v-if="logListType3.length > 1 && !flag.b" @click="flag.b = true">查看更多<span class="iconfont">&#xe627;</span></view>
      </view>
    </view>
    <view>
      <view class="tit">成功报名的朋友<text>{{logListType4.length}}人</text></view>
      <view class="friends_box" :class="{'active': flag.c, 'height_cont': logListType4.length === 1}" v-if="logListType4.length > 0">
        <view class="friend" v-for="(item, index) in logListType4" :key="index">
          <img class="header_sculpture" :src="item.wechatLogoUrl || header" alt="">
          <view class="name">{{item.wechatNickname || '微信用户'}}</view>
          <view class="status">报名成功</view>
        </view>
        <view class="show_mor" v-if="logListType4.length > 1 && !flag.c" @click="flag.c = true">查看更多<span class="iconfont">&#xe627;</span></view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class MyInvite extends Vue {
  header = require('../../../assets/svg/ldx_morentouxiang.svg');

  logListType1: any[] = [];

  logListType2: any[] = [];

  logListType3: any[] = [];

  logListType4: any[] = [];

  flag = {
    a: false,
    b: false,
    c: false,
    d: false
  };

  inviteTallys = {};

  sId = '';

  onLoad(options: any) {
    this.sId = options.sId;
    this.getActivityLogList();
    this.queryRecommendInviteTallys();
  }

  // 获取邀请统计
  async queryRecommendInviteTallys() {
    const data = {
      banbanToken: '',
      activitiyId: 10001,
      openId: uni.getStorageSync('openId'),
      mchId: this.sId
    };
    this.inviteTallys = await this.$http.post('sale/v1/recommend/queryRecommendInviteTallys', data);
  }

  // 获取邀请详情
  async getActivityLogList() {
    const data = {
      banbanToken: '',
      activitiyId: 10001,
      openId: uni.getStorageSync('openId'),
      mchId: this.sId
    };
    const logList = await this.$http.post('sale/v1/recommend/getActivityLogList', data);
    logList.forEach((item: any) => {
      (this as any)[`logListType${item.types}`].push(item);
    });
  }
}

</script>

<style lang="less" scoped>
.bg{
  background: #D40620;
  height: 100%;
  padding: 0 24rpx;
  overflow: scroll;
  .tit{
    padding: 40rpx 0 24rpx 0;
    color: #fff;
    font-size: 34rpx;
    line-height: 34rpx;
    text{
      float: right;
      color: #FEF97C;
    }
  }
}
.invite_detail{
  padding: 56rpx 0 58rpx;
  background: #fff;
  border-radius: 16rpx;
  text-align: center;
  margin-bottom: 28rpx;
  .list{
    display: flex;
    view{
      flex: 1;
      border-right: #e5e5e5 1rpx solid;
      &:last-child{
        border: none;
      }
    }
    .num{
      color: #D40620;
      font-size: 48rpx;
      text{
        font-size: 24rpx;
      }
    }
    .des{
      margin-top: 12rpx;
      font-size: 24rpx;
      line-height: 24rpx;
      color: #999;
    }
  }
}
.friends_box{
  padding: 0 32rpx;
  background: #fff;
  border-radius: 16rpx;
  height: 223rpx;
  overflow: hidden;
  position: relative;
  transition: all 0.5s;
  &.height_cont{
    height: 152rpx;
  }
  &.active{
    height: auto;
  }
  .friend{
    height: 152rpx;
    display: flex;
    align-items: center;
    border-bottom: solid 1rpx #e5e5e5;
  }
  .header_sculpture{
    width: 88rpx;
    height: 88rpx;
    border-radius: 50%;
    margin-right: 16rpx;
  }
  .name{
    border-left: solid 1rpx #e5e5e5;
    padding-left: 15rpx;
    line-height: 24rpx;
    color: #999;
    font-size: 24rpx;
    flex: 1;
  }
  .status{
    float: right;
    font-size: 24rpx;
    line-height: 24rpx;
    color: #000;
  }
  .show_mor{
    line-height: 71rpx;
    color: #999;
    font-size: 24rpx;
    position: absolute;
    bottom: -1rpx;
    left: 32rpx;
    right: 32rpx;
    background: #fff;
    z-index: 2;
    .iconfont{
      float: right;
      font-size: 20rpx;
    }
  }
}
</style>
