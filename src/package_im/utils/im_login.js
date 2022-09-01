// import { genTestUserSig } from '../debug/GenerateTestUserSig.js';
import { setTokenStorage } from './token';
import $http from '../../assets/js/request';
import { getGlobalData } from '../../assets/js/global_data';

export default async (userID = uni.getStorageSync('imId')) => {
  const app = getApp();
  const userSig = await $http.post('base/v1/im/getUserSig', { userId: userID });
  // const userSig = genTestUserSig(userID).userSig;
  const SDKAppID = app.globalData.SDKAppID;
  app.globalData.userInfo = {
    userSig,
    userID
  };
  setTokenStorage({
    userInfo: app.globalData.userInfo
  });
  uni.setStorageSync(`TIM_${SDKAppID}_isTUIKit`, true);
  uni.$TUIKit.login({
    userID,
    userSig
  }).then(() => {
    const $emitter = getGlobalData('$emitter');
    $emitter.emit('imLogin');
  });
};
