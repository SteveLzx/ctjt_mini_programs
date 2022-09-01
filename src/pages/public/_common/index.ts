/* eslint-disable */
import $http from '@/assets/js/request';
/* eslint-enable */

export async function queryNameCardInfo(userId: string, type?: number) {
  try {
    let sendData = {};
    if (type === 1) {
      sendData = { id: userId };
    } else {
      sendData = { visitorId: userId };
    }
    const data = await $http.get('user/v1/wechat/queryCardInfo', sendData);
    uni.setStorageSync('cardInfo', data);
    return data;
  } catch (error) {
    console.log(error);
    return {};
  }
}

export default {};
