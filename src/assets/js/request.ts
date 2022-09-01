import { runEnv, env } from '@/config/build_path';
/* eslint-disable */
import { verifyLogin } from './common';
/* eslint-enable */

const apiUrl = {
  dev: 'https://dev.aicar365.com/',
  test: 'https://test.aicar365.com/',
  uat: 'https://uat.aicar365.com/',
  prod: 'https://aicar365.com/'
};
const publicUrl = apiUrl[runEnv] || '';
// const publicUrl = 'https://test.aicar365.com/';
interface RequestError extends UniApp.GeneralCallbackResult {
  msg?: string;
}

// 定义后端返回的数据类型
interface ApiData {
  body: object;
  msg?: string;
  code: number;
}

type Method = 'GET' | 'OPTIONS' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT' | undefined;
const request = (method: Method, url: string, data?: object, contentType?: string) => {
  const token: string = uni.getStorageSync(env !== 'qiye' ? 'token' : 'b_token') || '';
  const URL = publicUrl + url;
  return new Promise((resolve, reject) => {
    uni.request({
      url: URL,
      data,
      method,
      timeout: 15000,
      header: {
        'content-type': contentType || 'application/json;charset=utf-8',
        Authorization: token
      },
      success: (res: UniApp.RequestSuccessCallbackResult) => {
        if (res.statusCode === 200) {
          if ((res.data as ApiData).code === 200) {
            resolve((res.data as ApiData).body);
          } else {
            console.log('(res.data as ApiData).code:', (res.data as ApiData).code);
            if ((res.data as ApiData).code === 401 || (res.data as ApiData).code === 407) {
              verifyLogin(); // 登录失效后重新获取新token
            } else {
              uni.showToast({
                title: (res.data as ApiData).msg,
                icon: 'none'
              });
            }
            reject(res);
          }
        } else {
          uni.showToast({
            title: '网络异常,请稍后重试',
            icon: 'none'
          });
          reject(res);
        }
      },
      fail: (err: RequestError) => {
        reject(err.msg || '');
      }
    });
  });
};
const get = (url: string, data?: object, contentType?: string) => request('GET', url, data, contentType);

const post = (url: string, data: object, contentType?: string) => request('POST', url, data, contentType);

export default {
  get,
  post
};
