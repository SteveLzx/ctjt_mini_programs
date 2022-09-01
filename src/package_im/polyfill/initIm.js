import TIM from 'tim-wx-sdk';
import logger from '../utils/logger'; // app.js
import { runEnv } from '../../config/build_path';

/* eslint-disable */
export default {
  onLaunch() {
    const SDKAppID = runEnv === 'prod' ? 1400551488 : 1400696225;
    uni.setStorageSync(`TIM_${SDKAppID}_isTUIKit`, true);
    // 重点注意： 为了 uni-app 更好地接入使用 tim，快速定位和解决问题，请勿修改 uni.$TUIKit 命名。
    uni.$TUIKit = TIM.create({
      SDKAppID
    });

    // #ifdef MP-WEIXIN
    wx.$TIM = uni.$TUIKit;
    // #endif
    uni.$TUIKitTIM = TIM;
    uni.$TUIKitEvent = TIM.EVENT;
    uni.$TUIKitVersion = TIM.VERSION;
    uni.$TUIKitTypes = TIM.TYPES; // 监听系统级事件
    uni.$resetLoginData = this.resetLoginData();
    uni.$TUIKit.on(uni.$TUIKitEvent.SDK_READY, this.onSDKReady);
    uni.$TUIKit.on(uni.$TUIKitEvent.SDK_NOT_READY, this.onSdkNotReady);
    uni.$TUIKit.on(uni.$TUIKitEvent.KICKED_OUT, this.onKickedOut);
    uni.$TUIKit.on(uni.$TUIKitEvent.ERROR, this.onTIMError);
    uni.$TUIKit.on(uni.$TUIKitEvent.NET_STATE_CHANGE, this.onNetStateChange);
    uni.$TUIKit.on(uni.$TUIKitEvent.SDK_RELOAD, this.onSDKReload);
  },
  globalData: {
    userInfo: null,
    // 个人信息
    userProfile: null,
    isTUIKit: true,
    headerHeight: 0,
    statusBarHeight: 0,
    SDKAppID: runEnv === 'prod' ? 1400551488 : 1400696225
  },
  methods: {
    resetLoginData() {
      this.globalData.expiresIn = '';
      this.globalData.sessionID = '';
      this.globalData.userInfo = {
        userID: '',
        userSig: '',
        token: '',
        phone: ''
      };
      this.globalData.userProfile = null;
      logger.log(`| app |  resetLoginData | globalData: ${this.globalData}`);
    },
    onTIMError() {},
    onSDKReady({name}) {
      console.log(uni.$TUIKitEvent.SDK_READY, 'uni.$TUIKitEvent.SDK_READY');
        const isSDKReady = name === uni.$TUIKitEvent.SDK_READY ? true : false
        uni.$emit('isSDKReady', {
          isSDKReady: isSDKReady
        });
    },
    onNetStateChange() {},
    onSDKReload() {},
    onSdkNotReady() {},
    onKickedOut() {
      uni.showToast({
        title: '您被踢下线',
        icon: 'none'
      });
      uni.navigateTo({
        url: './pages/TUI-Login/login'
      });
    }
  }
}
/* eslint-enable */
