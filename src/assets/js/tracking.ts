import { env, runEnv, schoolId } from '@/config/build_path';
import setting from '../../../package.json';
import { getGlobalData } from './global_data';
import { subscribeTmp } from './common';

// 云效空间
const logStoreList = {
  dev: 'dev-dtl-mkt-log',
  test: 'test-dtl-mkt-log',
  uat: 'uat-dtl-mkt-log',
  prod: 'dtl-mkt-log'
};

const appId = {
  16: 'wxdfa419cf7d281240',
  3374: 'wxef9787620a86a32c',
  370: 'wx67c99a085d3bc6f7',
  638: 'wx543d247638003343'
};

export default class Tracking {
  constructor() {
    this.init();
  }

  firstLaunch = true;

  init() {
    this.getSystemInfo();
    this.getNetworkType();
    this.getConnectedWifi();

    this.initAppEvent();
  }

  initAppEvent() {
    uni.setStorageSync('traceId', new Date().getTime());

    uni.onAppShow(() => {
      uni.setStorageSync('sessionId', new Date().getTime());
      this.send({
        event: 'cd'
      });
    });

    uni.onAppHide(() => {
      this.send({
        event: 'cb'
      });
      this.send({
        curTime: uni.getStorageSync('pageEntryTime'),
        outTime: new Date().getTime(),
        event: 'pv',
        extra: { scene: uni.getStorageSync('sceneId') }
      });
    });
  }

  getMixinData() {
    return {
      entryTime: 0,
      pageOptions: {},
      onLoad(options: any) {
        console.log('mixin_onLoad');
        this.entryTime = new Date().getTime();
        uni.setStorageSync('pageEntryTime', this.entryTime);
        this.pageOptions = options;
        const $emitter = getGlobalData('$emitter');
        // 登录后上报
        $emitter.on('codeLogin', () => {
          this.$track.send({
            event: 'pv',
            extra: { ...options }
          });
        });
        if (uni.getStorageSync('userId')) {
          this.$track.send({
            event: 'pv',
            extra: { ...options }
          });
        }
      },
      onUnload() {
        console.log('mixin_onUnload');
        this.$track.send({
          curTime: this.entryTime,
          outTime: new Date().getTime(),
          event: 'pv',
          extra: { ...this.pageOptions }
        });
      },
      methods: {
        bindSDKDomClick(event) {
          const isStudent = !uni.getStorageSync('isCoach');
          const coachSubscribe = uni.getStorageSync('coachSubscribe');
          // 若教练未订阅过永久模版消息，则触发授权
          if (!isStudent && !coachSubscribe) {
            const tmplId = subscribeTmp[schoolId];
            uni.requestSubscribeMessage({
              tmplIds: [tmplId],
              success: (res: any) => {
                console.log(res);
                if (res[tmplId] === 'accept') uni.setStorageSync('coachSubscribe', true);
              },
              fail: err => console.log(err)
            });
          }
          // 埋点信息
          const { target, mark: { name } } = event;
          const domId = target.id || `x${target.x}_left${target.offsetLeft}-y${target.y}_top${target.offsetTop}`;
          const domJSON = {
            xax: target.x,
            yax: target.y
          };
          const pages = getCurrentPages();
          const currentPage: any = pages[pages.length - 1];
          const options = currentPage.options;
          this.$track.send({
            event: 'ck',
            widget: {
              widgetId: domId,
              widgetTitle: JSON.stringify(domJSON),
              widgetName: name || ''
            },
            extra: { ...options }
          });
        }
      }
    };
  }

  getData() {
    return {
      ...this.data,
      userId: uni.getStorageSync('userId'),
      mobile: uni.getStorageSync('mobile'),
      invitationCode: '',
      shareId: uni.getStorageSync('sceneId'),
      traceId: uni.getStorageSync('traceId'),
      sessionId: uni.getStorageSync('sessionId'),
      longitude: uni.getStorageSync('longitude'),
      latitude: uni.getStorageSync('latitude'),
      openId: uni.getStorageSync('openId'),
      unionId: '',
    };
  }

  // 固定信息
  data: any = {
    appId: appId[schoolId],
    downChannel: '微信', // 微信客户端
    appVersion: setting.version, // 小程序版本
    ua: 'wx'
  }

  // 获取设备相关信息
  getSystemInfo() {
    uni.getSystemInfo({
      success: res => {
        const {
          SDKVersion,
          platform,
          model,
          system,
          brand,
          version,
          screenHeight,
          screenWidth
        } = res;
        const batteryInfo = uni.getBatteryInfoSync();
        const systemInfo = {
          sdkVersion: SDKVersion, // 微信小程序SDK版本
          appTerminal: `${platform}_wx_mina`, // 应用终端
          bundleId: version, // 微信版本
          uiMode: platform, // 设备类型
          os: platform, // 操作系统
          osVersion: system, // 操作系统版本
          brand, // 手机品牌
          deviceName: `${brand} ${model}`, // 设备名称,
          deviceModel: model,
          isSimulator: platform === 'devtools',
          deviceId: SDKVersion + version + system.split(' ')[1],
          uuid: SDKVersion + version + system.split(' ')[1],
          screenHeight,
          screenWidth,
          ckgCrgngstt: batteryInfo.isCharging, // 是否在充电
          dmiChrggP: batteryInfo.level
        };
        this.data = { ...this.data, ...systemInfo };
      }
    });
  }

  // 获取网络状态
  getNetworkType() {
    uni.getNetworkType({
      success: res => {
        this.data.network = res.networkType;
      }
    });
  }

  // 获取wifi信息
  getConnectedWifi() {
    uni.getConnectedWifi({
      success: res => {
        this.data.wifiSsid = res.wifi.SSID;
      }
    });
  }

  // 获取时间戳
  getTime() {
    return new Date().getTime();
  }

  // 上报数据
  send({
    event,
    curTime = 0,
    outTime = 0,
    widget: { widgetId = '', widgetName = '', widgetTitle = '' } = {},
    extra = {}
  }) {
    const now = this.getTime();
    const pages = getCurrentPages(); // 当前页面栈
    const pagesLen = pages.length;
    const sendData = {
      event,
      curTime: curTime || now,
      outTime: outTime || now,
      pageName: pagesLen > 0 ? pages[pagesLen - 1].route : '', // 当前页面
      url: pagesLen > 0 ? pages[pagesLen - 1].route : '', // 当前页面
      sendTime: now,
      appRef: uni.getStorageSync('scene'),
      refer: pagesLen > 1 ? pages[pagesLen - 2].route : '', // 上级页面
      widgetId,
      widgetName,
      widgetTitle,
      extra: extra || {}
    };
    this.xhrRequest(sendData);
  }

  // 上报数据
  xhrRequest(sendData = {}) {
    const reqUrl = `https://user-event.cn-shenzhen.log.aliyuncs.com/logstores/${logStoreList[runEnv]}/track`;
    // const reqUrl = `https://user-event.cn-shenzhen.log.aliyuncs.com/logstores/${logStoreList['test']}/track`;
    console.log({
      ...this.getData(),
      ...sendData
    });
    uni.request({
      url: reqUrl,
      data: {
        APIVersion: '0.6.0',
        ...this.getData(),
        ...sendData
      },
      method: 'GET'
    });
  }
}
