// 授权，手机，微信信息
<template>
  <view class="pop" v-if="mobileAuth || wxInfoAuth">
    <view class="login_box">
      <image class="close_icon" src="https://file.aicar365.com/mini-program/common/guanbi.png" mode="aspectFill" @click="close"></image>
      <view>{{mobileAuth ? '登录或注册' : '设置您的昵称'}}</view>
      <button class="auth_box" v-if="mobileAuth"  open-type="getPhoneNumber" @getphonenumber="verifyTelAccredit">
        <image class="wechat_icon" src="https://file.aicar365.com/mini-program/common/weixin.png" mode="aspectFill"></image>
        微信账号快速登录
      </button>
      <view class="auth_box" v-if="wxInfoAuth" @click="getUserProfile">
        <image class="wechat_icon" src="https://file.aicar365.com/mini-program/common/weixin.png" mode="aspectFill"></image>
        授权获取微信账号信息
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Watch
} from 'vue-property-decorator';
import { getUserProfile, verifyTelAccredit } from '@/assets/js/common';
import { getGlobalData } from '@/assets/js/global_data';

@Component
export default class Authorize extends Vue {
  @Prop({ default: 0 }) flag: number

  @Watch('flag')
  flagChange() {
    const timer = setTimeout(() => {
      this.init();
      clearTimeout(timer);
    }, 1000);
  }

  created() {
    const $emitter = getGlobalData('$emitter');
    $emitter.on('authorize', () => {
      this.mobileAuth = false;
    });
  }

  close() {
    this.mobileAuth = false;
    this.wxInfoAuth = false;
  }

  verifyTelAccredit(e: any) {
    if (!e.detail.encryptedData) {
      this.mobileAuth = false;
      return;
    }
    verifyTelAccredit(e);
  }

  getUserProfile() {
    getUserProfile().then(() => {
      this.wxInfoAuth = false;
    });
  }

  mobileAuth = false;

  wxInfoAuth = false;

  init() {
    if (!uni.getStorageSync('mobile')) {
      this.mobileAuth = true;
      return;
    }
    this.mobileAuth = false;
    if (!uni.getStorageSync('wechatUserInfo')) {
      this.wxInfoAuth = true;
      return;
    }
    this.wxInfoAuth = false;
  }
}

</script>

<style lang="less" scoped>
.pop{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.7);
}
.login_box{
  width: 620rpx;
  height: 212rpx;
  padding: 80rpx 0;
  border-radius: 8px;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  z-index: 6;
  .close_icon{
    position: absolute;
    right: 0;
    top: 0;
    padding: 24rpx;
    width: 32rpx;
    height: 32rpx;
  }
  .auth_box{
    margin: 64rpx auto 0;
    width: 514rpx;
    height: 108rpx;
    border-radius: 10rpx;
    background: #1aad19;
    color: #fff;
    text-align: center;
    font-size: 36rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    .wechat_icon{
      width: 60rpx;
      height: 50rpx;
      margin-right: 20rpx;
    }
  }
}
</style>
