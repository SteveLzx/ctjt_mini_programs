import Vue from 'vue';
import imLogin from '@/package_im/utils/im_login';
import { env, schoolId } from '@/config/build_path';
/* eslint-disable */
import $http from './request';
/* eslint-enable */
import { getGlobalData, setGlobalData } from './global_data';

type ObjType = {
  [key: string]: any;
}
type UserInfo = {
  token?: string;
  userId?: string;
  openId?: string;
  type?: number;
  mobile?: string;
  imId?: string;
  drivingSchoolId?: string;
  avatar?: string;
  nickname?: string;
}

type UniExpand = {
  openCustomerServiceChat: any;
  getUserProfile: any;
} & UniApp.Uni;

function setStorage(res: UserInfo) {
  setGlobalData<UserInfo>('userInfo', res as UserInfo);
  uni.setStorageSync(env !== 'qiye' ? 'token' : 'b_token', (res as UserInfo).token);
  uni.setStorageSync('openId', (res as UserInfo).openId);
  uni.setStorageSync('userId', (res as UserInfo).userId);
  uni.setStorageSync('userType', (res as UserInfo).type);
  uni.setStorageSync('mobile', (res as UserInfo).mobile);
  uni.setStorageSync('imId', (res as UserInfo).imId);
  const $emitter = getGlobalData('$emitter');
  if (res.drivingSchoolId && res.drivingSchoolId !== '0') {
    uni.setStorageSync('isCoach', true);
    uni.setStorageSync('coachInfo', res);
  }
  if (res.mobile) {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      $emitter.emit('authorize', true);
    }, 1);
  }
  if (res.avatar) {
    uni.setStorageSync('wechatUserInfo', {
      avatarUrl: res.avatar,
      nickName: res.nickname
    });
  }
}

/** 重新登录 */
export const verifyLogin = () => new Promise((resolve, reject) => {
  uni.login({
    provider: 'weixin',
    success: ({ code }) => {
      // 1012 标峰驾校
      // 160 东莞广仁
      // 1609 兰州深港
      // 16 深港驾校
      // 2675 肇庆深港
      // 2997 重庆凯旋
      // 320 福华驾校
      // 3374 惠州深港
      // 3401 成都悦成
      // 370 广仁陪驾
      // 638 港安驾校
      const sendData = {
        code,
        schoolId // 区分小程序
      };
      $http
        .post('user/v1/wechat/boundWechat', sendData)
        .then((res: any) => {
          if (res.token) {
            setStorage(res);
            resolve(res);
            imLogin(); // 登录im
            const $emitter = getGlobalData('$emitter');
            $emitter.emit('codeLogin', true);
          } else {
            reject();
          }
        })
        .catch(() => {
          reject();
        });
    }
  });
});

const getWxCode = () => new Promise(resolve => {
  uni.login({
    provider: 'weixin',
    success: ({ code }) => {
      resolve(code);
    }
  });
});

/** 授权登录（绑定手机） */
export const verifyTelAccredit = async (e: any) => {
  if (!e.detail.encryptedData) return;
  const sendData = {
    encryptedData: e.detail.encryptedData,
    code: await getWxCode(),
    iv: e.detail.iv,
    type: env !== 'qiye' ? 1 : 2, // 1 学员端小程序；2 教练端小程序
    schoolId // 区分小程序
  };
  // console.log(JSON.stringify(sendData));
  $http.post('user/v1/wechat/registerWechat', sendData).then((res) => {
    setStorage(res);
    const $track = getGlobalData('$track');
    $track.send({
      event: 'ck',
      extra: {
        phoneAuthorize: true,
        scene: uni.getStorageSync('sceneId') || ''
      }
    });
  });
  // uni.login({
  //   provider: 'weixin',
  //   success: ({ code }) => {
  //     const sendData = {
  //       encryptedData: e.detail.encryptedData,
  //       code,
  //       iv: e.detail.iv,
  //       type: env !== 'qiye' ? 1 : 2, // 1 学员端小程序；2 教练端小程序
  //       schoolId // 区分小程序
  //     };
  //     // console.log(JSON.stringify(sendData));
  //     $http.post('user/v1/wechat/registerWechat', sendData).then((res) => {
  //       setStorage(res);
  //       const $track = getGlobalData('$track');
  //       $track.send({
  //         event: 'ck',
  //         extra: {
  //           phoneAuthorize: true,
  //           scene: uni.getStorageSync('sceneId') || ''
  //         }
  //       });
  //     });
  //   },
  // });
};

export const loginVerification = () => {
  const $emitter = getGlobalData('$emitter');
  if (!uni.getStorageSync('mobile')) {
    verifyLogin().catch(() => {
      // 没授权手机，需要授权登录
      $emitter.emit('authorize', false);
    });
  } else {
    $emitter.emit('authorize', true);
  }
};

export const getUserProfile = () => new Promise(resolve => {
  (uni as UniExpand).getUserProfile({
    desc: '登录',
    success: (event: any) => {
      uni.setStorageSync('wechatUserInfo', event.userInfo);
      const { avatarUrl, nickName } = event.userInfo;
      $http.post('user/v1/wechat/updateVisitor', {
        avatar: avatarUrl,
        nickname: nickName
      });
      resolve(event.userInfo);
    },
    fail: (err: any) => {
      resolve();
    }
  });
});

// 获取图片信息
export const getImageInfo = (src: string) => new Promise((resolve, reject) => {
  uni.getImageInfo({
    src,
    success: (res) => {
      resolve(res);
    },
    fail: (err) => {
      reject(err);
    }
  });
});

// 判断是图片还是视频
export const isImage = (url: string) => url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('.gif') || url.includes('.bmp');

// 判断是否是数组
export const isArray = (array: any[]) => Object.prototype.toString.call(array) === '[object Array]';

// 从图片的JSON里取一张作为主图
export const getMainFromPhotoJson = (photoUrl: string) => {
  let photoUrlMain = '';
  // photoUrl返回的是json字符串,取第一张图片作为主图
  if (typeof photoUrl === 'string') {
    const urlArray = JSON.parse(photoUrl);
    if (!isArray(urlArray)) return '';
    try {
      urlArray.forEach((url: ObjType) => {
        /* eslint-disable */
        if (photoUrlMain) throw '';
        /* eslint-enable */
        Object.keys(url).forEach(async (key) => {
          // 获取图片高度撑开banner高度
          if (isImage(url[key])) {
            photoUrlMain = url[key];
          }
        });
      });
    } catch (e) {
      console.log(e);
    }
  }
  return photoUrlMain;
};

const savePhoto = (path: string) => {
  uni.saveImageToPhotosAlbum({
    filePath: path,
    success() {
      uni.showToast({
        title: '保存成功',
        icon: 'none'
      });
    },
    fail() {
      uni.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
  });
};

const openAuthConfirm = (content: string) => {
  wx.showModal({
    content,
    confirmText: '确认',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        wx.openSetting({
          success: (result) => {
            const resCopy = result;
            resCopy.authSetting = {
              'scope.writePhotosAlbum': true,
            };
          }
        });
      }
    }
  });
};

// 保存文件
export const savePosterToAlbum = (path: string) => {
  uni.getSetting({
    success(res) {
      if (res.authSetting['scope.writePhotosAlbum']) {
        savePhoto(path);
      } else {
        // uni.showToast({
        //   title: '请允许保存图片',
        //   icon: 'none'
        // });
        uni.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            savePhoto(path);
          },
          fail() {
            openAuthConfirm('保存图片需要授权文件保存权限,是否前往设置打开?');
          }
        });
      }
    }
  });
};

// 获取设备信息
export const getSystemInfo = () => uni.getSystemInfoSync();

// 调起支付
// 订单ID/支付金额/是否分期
// key: 1--一期；2--二期
export const wechatPay = (orderId: string, amount: number, isInstallment: number, key: number) => new Promise(resolve => {
  const payData = {
    openId: uni.getStorageSync('openId'),
    orderId,
    tradeType: 'JSAPI',
    amount: key === 1 ? String(amount) : '', // 一期支付金额
    balance: key === 2 ? String(amount) : '', // 二期支付金额
    isInstallment
  };
  $http.post('order/v1/app/pay', payData).then((wechat: any) => {
    uni.hideLoading();
    uni.requestPayment({
      provider: 'wxpay',
      ...wechat,
      success: () => {
        uni.showToast({
          icon: 'success',
          title: '支付成功'
        });
        resolve('');
      },
      fail: () => {
        uni.showToast({
          icon: 'none',
          title: '支付失败'
        });
      }
    });
  });
});

// 跳转至学员信息填报页面
export const navigateToForm = (orderId: string) => {
  uni.navigateTo({
    url: `/package_order/sign_up_form/index?orderId=${orderId}`
  });
};

// 跳转至订单详情页面
export const navigateToOrderDetail = (orderId: string) => {
  uni.navigateTo({
    url: `/package_order/sign_up_order_detail/index?orderId=${orderId}`
  });
};

// 为学车类型增加说明
export const addCarModelText = (carModel: string) => {
  if (carModel === 'C1') return 'C1手动挡';
  if (carModel === 'C2') return 'C2自动挡';
  if (carModel === 'D') return 'D三轮摩托车';
  if (carModel === 'E') return 'E两轮摩托车';
  return carModel;
};

export const compare = (property: string) => (a: any, b: any) => a[property] - b[property];

// 用加号和-号传递的二维码参数
export const filterParams = (options: string) => {
  if (!options) return {};
  const kv = options.split('_');
  const paramsObj: any = {};
  kv.forEach(item => {
    const params = item.split('-');
    paramsObj[params[0]] = params[1];
  });
  return paramsObj;
};

export const filterDate = (date: string) => {
  const [ymd] = date.split(' ');
  const arr = ymd.split('-');
  return `${arr[1]}月${arr[2]}日`;
};

export const replaceDate = (date: string) => date.replace(/-/g, '/');

/**
   * 格式手机号
   * @param type 1:转换为134****8888；2:截取后四位
   */
export const regTel = (type: number, tel: string) => {
  let telText = '';
  if (type === 1) {
    telText = tel.replace(/^(\d{3})\d{4}(\d+)/, '$1****$2');
  } else if (type === 2) {
    telText = tel.substring(7, 11);
  }
  return telText;
};

// convas画矩形，带圆角
export const darwRoundRect = (x, y, w, h, r, context, bgColor = '#FFD944') => {
  const ctx = context;
  ctx.save();
  ctx.beginPath();

  // 左上弧线
  ctx.arc(x + r, y + r, r, 1 * Math.PI, 1.5 * Math.PI);
  // 左直线
  ctx.moveTo(x, y + r);
  ctx.lineTo(x, y + h - r);
  // 左下弧线
  ctx.arc(x + r, y + h - r, r, 0.5 * Math.PI, 1 * Math.PI);
  // 下直线
  ctx.lineTo(x + r, y + h);
  ctx.lineTo(x + w - r, y + h);
  // 右下弧线
  ctx.arc(x + w - r, y + h - r, r, 0 * Math.PI, 0.5 * Math.PI);
  // 右直线
  ctx.lineTo(x + w, y + h - r);
  ctx.lineTo(x + w, y + r);
  // 右上弧线
  ctx.arc(x + w - r, y + r, r, 1.5 * Math.PI, 2 * Math.PI);
  // 上直线
  ctx.lineTo(x + w - r, y);
  ctx.lineTo(x + r, y);

  ctx.fillStyle = bgColor;
  ctx.fill();
  ctx.clip();
};

/**
 * 数字显示，万以下直接显示数字，不加分隔符，万显示格式为xxx.x万+，亿显示格式为xxx.x亿+
 * @param num 传入一个数字
 * @returns string
 */
export const bigNumberTransform = (num: number): string => {
  let text = '';
  if (num >= 100000000) {
    // 亿
    if (num % 100000000 === 0) {
      text = `${Math.floor(num / 100000000)}亿+`;
    } else {
      const n = Math.ceil((num % 100000000) / 10000000);
      text = `${parseFloat(String(num / 100000000)).toFixed(0)}.${n > 1 ? n - 1 : n}亿+`;
    }
  } else if (num >= 10000) {
    // 万
    if (num % 10000 === 0) {
      text = `${Math.floor(num / 10000)}万+`;
    } else {
      const n = Math.ceil((num % 10000) / 1000);
      text = `${parseFloat(String(num / 10000)).toFixed(0)}.${n > 1 ? n - 1 : n}万+`;
    }
  } else {
    text = String(num);
  }
  return text;
};

/**
 * 根据秒计算剩余天数时分秒
 * @param seconds
 * @param level
 */
const getCountDown = (seconds, level): string => {
  let result = '';
  const time = Math.floor(seconds / level[0].unit);
  result += time < 10 ? `0${time}` : time;
  result += level[0].append;
  const sec = seconds - (time * level[0].unit);
  level.splice(0, 1);
  if (level.length > 0) {
    result += getCountDown(sec, level);
  }
  return result;
};

/**
 *  倒计时 天时分秒
 * @param time
 * @returns 返回倒计时时间
 */
export const resCountDown = (time) => {
  let res = null;
  const result = getCountDown(time, [
    { unit: 86400000, append: '天' },
    { unit: 3600000, append: '小时' },
    { unit: 60000, append: '分' },
    { unit: 1000, append: '秒' }
  ]);
  res = result.substring(0, 1) === '0' ? result.substring(1) : result;
  return res;
};

/** 生成uuid */
/* eslint-disable */
export function getUUid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 生成场景ID
 * @param
 * @returns
 */
export const generateSceneId = ({
  dynamicsId,
  sceneId = '',
  publishExport,
  publishExportDetails = '',
  publishFormat,
  title = '',
  type,
  url = '',
  extra = {}
}) => {
  const data = {
    dynamicsId, // 驾校(企业) || 门店 || 训练场 || 班别(商品) || 营销活动(分销) || 营销活动(立减)|| 名片 的ID
    id: sceneId, // 如果当前存在场景ID则传进来
    publishExport, // 1:微信聊天、2:微信朋友圈、3:保存到相册、4:复制到剪贴板、5:公众号菜单、6:微信服务通知、7:APP推送、8:微信小程序IM、9:APP 10:IM、11:短信、12:APP内链、13:微信小程序内链
    publishFormat, // 1:微信卡片、2:图片、3:小程序码、4:普通二维码、5:短链接、6:URL Link,URL Scheme、7:小程序通知、8:自定义消息
    publishImport: 3, // 1:手工创建、2:学员端小程序、3:驾校端小程序、4:数字化业务系统、5:斑斑驾道APP、6:斑斑驾道定制版APP、7:斑斑教练端APP
    title, // 分享/转发了XXX
    type, // 1:驾校(企业)、2:门店、3:训练场、4:班别(商品)、5:营销活动(分销)、6:营销活动(立减)、7:名片
    url, // 先不传
    extra // 拓展
  };
  return new Promise((resolve, reject) => {
    $http.post('sale/v1/mkt/dynamicsScene', data).then(res => {
      resolve(res);
    });
  });
};

/**
 *
 * @param param0
 * @returns
 */
export const queryWeChatQRCode = ({ url = 'pages/public/dynamic/publish/share_landingpage', params = '' }) => {
  return new Promise(async (resolve) => {
    const sendData = {
      url, // 需要生成二维码的url，默认落地页
      params, // 需要 携带的参数，参数最长32位字符
      schoolId
    };
    const base64 = await $http.post('user/v1/wechat/queryWeChatQRCode', sendData);
    const img = await transformCode(base64 as string);
    resolve(img);
  });
};

// 将base64图片转临时图片
function transformCode(code: string) {
  // eslint-disable-next-line no-undef
  const fs = wx.getFileSystemManager();
  const times = new Date().getTime();
  // eslint-disable-next-line no-undef
  const img = `${wx.env.USER_DATA_PATH}/${times}.png`;
  return new Promise((resolve) => {
    fs.writeFile({
      filePath: img,
      data: code,
      encoding: 'base64',
      success: () => {
        resolve(img);
      }
    });
  });
}

// export const customerService: any = {
//   3374: 'https://work.weixin.qq.com/kfid/kfcd4eca412dc2042c0', // 惠州深港
//   160: 'https://work.weixin.qq.com/kfid/kfc0208892396e245a4', // 东莞广仁
//   3401: 'https://work.weixin.qq.com/kfid/kfc1df61e2b84fe7770', // 成都悦成
//   16: 'https://work.weixin.qq.com/kfid/kfc2c42bfe0d4cf088a', // 深港驾校
//   370: 'https://work.weixin.qq.com/kfid/kfcfd6fc33310112152', // 广仁陪驾
//   1609: 'https://work.weixin.qq.com/kfid/kfc0facdc236a959f60', // 兰州深港
//   638: 'https://work.weixin.qq.com/kfid/kfce60da96c64e7214a', // 港安驾校
//   2997: 'https://work.weixin.qq.com/kfid/kfcda2d2a82ef7b0df5', // 重庆凯旋
//   2675: 'https://work.weixin.qq.com/kfid/kfc000cd0de2072c399', // 肇庆深港
//   320: 'https://work.weixin.qq.com/kfid/kfcd661430f76f7214f' // 福华驾校
// };

export const customerService: any = {
  3374: 'https://work.weixin.qq.com/kfid/kfcba730c7a005ae061', // 惠州深港
  160: '', // 东莞广仁
  3401: '', // 成都悦成
  16: 'https://work.weixin.qq.com/kfid/kfc2c42bfe0d4cf088a', // 深港驾校
  370: 'https://work.weixin.qq.com/kfid/kfc156819b44b5fa2e7', // 广仁陪驾
  1609: '', // 兰州深港
  638: 'https://work.weixin.qq.com/kfid/kfc52ebdd45202d167d', // 港安驾校
  2997: '', // 重庆凯旋
  2675: '', // 肇庆深港
  320: '' // 福华驾校
};

export const schoolTelephone: any = {
  3374: '0752-8860066', // 惠州深港
  160: '0769-33333333', // 东莞广仁
  3401: '13708002061', // 成都悦成
  16: '0755-33333333', // 深港驾校
  370: '0755-33228895', // 广仁陪驾
  1609: '0931-8522222', // 兰州深港
  638: '0755-33331111 ', // 港安驾校
  2997: '023-36991111', // 重庆凯旋
  2675: '0758-6929999', // 肇庆深港
  320: '020-88888888' // 福华驾校
};

export const schoolName: any = {
  3374: '惠州深港驾校', // 惠州深港
  160: '东莞广仁驾校', // 东莞广仁
  3401: '成都悦成驾校', // 成都悦成
  16: '深圳深港驾校', // 深港驾校
  370: '广仁学车', // 广仁陪驾
  1609: '兰州深港驾校', // 兰州深港
  638: '港安驾校', // 港安驾校
  2997: '重庆凯旋驾校', // 重庆凯旋
  2675: '肇庆深港驾校', // 肇庆深港
  320: '福华驾校' // 福华驾校
};

// 一次性订阅
export const subscribeTmpOnce: any = {
  3374: 'tkum6jbQzHRMH57iy83DYk2oEefrQxI1i_SkF9kCZJU', // 惠州深港
  160: '东莞广仁驾校', // 东莞广仁
  3401: '成都悦成驾校', // 成都悦成
  16: 'fDJfdE0GES6TX5sYpjlAn-1jjFdvYV-ZOmYaOf4DnvA', // 深港驾校
  370: 'Ct0_pTce-vIKkV_tFl35C92JwFlXftt_FLQkfs7oF1w', // 广仁陪驾
  1609: '兰州深港驾校', // 兰州深港
  638: '4tbqbDxVAyff6eABdhCbI4uAYy7SDk_YeVsFk_U37tA', // 港安驾校
  2997: '重庆凯旋驾校', // 重庆凯旋
  2675: '肇庆深港驾校', // 肇庆深港
  320: '福华驾校' // 福华驾校
}

// 长期订阅
export const subscribeTmp: any = {
  3374: 'ZQW6bWTQGL6zVkVK8A0CCXiZLm-w0sM5XnHgwcTCT58', // 惠州深港
  160: '东莞广仁驾校', // 东莞广仁
  3401: '成都悦成驾校', // 成都悦成
  16: '_0QMMVKy06ZpjgM8wsW47sZ5asJegRHMTmceJkXHLHo', // 深港驾校
  370: 'FFGvlzp-6xthzNTc0fjVd3Fi9SkN6vvxJSoLSySV5A4', // 广仁陪驾
  1609: '兰州深港驾校', // 兰州深港
  638: '', // 港安驾校
  2997: '重庆凯旋驾校', // 重庆凯旋
  2675: '肇庆深港驾校', // 肇庆深港
  320: '福华驾校' // 福华驾校
}

const qyAppId: any = {
  3374: 'ww8559dd396d1a20ad', // 惠州深港
  160: '东莞广仁驾校', // 东莞广仁
  3401: '成都悦成驾校', // 成都悦成
  16: 'ww9541ffad85d74b5a', // 深港驾校
  370: 'ww330c88cb351a1f43', // 广仁陪驾
  1609: '兰州深港驾校', // 兰州深港
  638: 'ww50eedba6bd8dfc19', // 港安驾校
  2997: '重庆凯旋驾校', // 重庆凯旋
  2675: '肇庆深港驾校', // 肇庆深港
  320: '福华驾校' // 福华驾校
};


/**
 * params data: 优先取传入的值，再取缓存的schoolId，再取默认的深港驾校16
 */
export const openCustomerService = (data?) => {
  if (Vue.prototype.$platFormPc) {
    uni.showToast({
      icon: 'none',
      title: '请在手机端操作此功能'
    });
    return;
  }
  const school = data || (uni.getStorageSync('schoolId') !== '0' ? uni.getStorageSync('schoolId') : schoolId);
  const url = customerService[school] || customerService[schoolId];
  (uni as UniExpand).openCustomerServiceChat({
    extInfo: { url },
    corpId: qyAppId[schoolId],
    success(res: any) {
      console.log(res);
    },
    fail(res: any) {
      console.log(res);
    }
  });
};

export const makePhoneCall = (phoneNumber: string) => {
  if (Vue.prototype.$platFormPc) {
    uni.showToast({
      icon: 'none',
      title: '请在手机端操作此功能'
    });
    return false;
  }
  uni.makePhoneCall({
    phoneNumber
  });
};

/** 日期时间格式化处理 */
export const DateFormat = (dateTime: any, format: string) => {
  var o = {
    "M+": dateTime.getMonth() + 1, //month
    "d+": dateTime.getDate(),    //day
    "h+": dateTime.getHours(),   //hour
    "m+": dateTime.getMinutes(), //minute
    "s+": dateTime.getSeconds(), //second
    "q+": Math.floor((dateTime.getMonth() + 3) / 3),  //quarter
    "S": dateTime.getMilliseconds() //millisecond
  }
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
    (dateTime.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o) if (new RegExp("(" + k + ")").test(format))
    format = format.replace(RegExp.$1,
      RegExp.$1.length == 1 ? o[k] :
        ("00" + o[k]).substr(("" + o[k]).length));
  return format;
}

/** 处理超过999的数量 */
export const manyNumberFormat = (val: number) => {
  const format = val > 999 ? '999+' : val;
  return format;
}
