import { Vue, Component, Watch } from 'vue-property-decorator';
import {
  verifyTelAccredit,
  getMainFromPhotoJson,
  savePosterToAlbum,
  filterParams,
  generateSceneId,
  schoolName
} from '@/assets/js/common';
import { runEnv, schoolId as appSid } from '@/config/build_path';
import { setGlobalData, getGlobalData } from '@/assets/js/global_data';
import { imgDomain } from '@/assets/js/config';
import DownloadShare from '@/components/download_share/index.vue';

import { getStoreCard, getClassCard } from './get_canvas';

type ObjType = {
  [key: string]: any;
}

type UniExpand = {
  getUserProfile: any;
} & UniApp.Uni;

@Component({
  components: { DownloadShare }
})
export default class Index extends Vue {
  imgDomain = imgDomain;

  private shareShow = false;

  userInfoFlag = true; // 用户是否登录=>true:未登录； false:已登录

  inviterId = ''; // 教练ID

  schoolId = appSid; // 驾校ID

  loading = true;

  authFLag = 1;

  onLoad(options: any) {
    if (uni.getStorageSync('isCoach')) {
      const timer = setTimeout(() => {
        uni.switchTab({
          url: '/pages/public/my/index'
        });
        clearTimeout(timer);
      }, 1000);
    }
    const coachInfo = uni.getStorageSync('coachInfo');
    // 当前用户为教练或者客服或者管理员，则展示所属驾校信息
    if (coachInfo && coachInfo.drivingSchoolId) {
      //  获取当前用户驾校
      this.schoolId = coachInfo.drivingSchoolId;
      return;
    }
    const schoolId = uni.getStorageSync('schoolId');
    // 有缓存驾校ID，则默认取之前缓存的驾校ID
    if (schoolId && Number(schoolId) !== 0) {
      this.schoolId = schoolId;
      return;
    }

    // 若为教练首次登录
    const $emitter = getGlobalData('$emitter');
    $emitter.on('codeLogin', () => {
      if (!uni.getStorageSync('mobile') || uni.getStorageSync('isCoach')) {
        uni.switchTab({
          url: '/pages/public/my/index'
        });
      }
      const coach = uni.getStorageSync('coachInfo');
      // 当前用户为教练或者客服或者管理员，则展示所属驾校信息
      if (coach && coach.drivingSchoolId) {
        //  获取当前用户驾校
        this.schoolId = coach.drivingSchoolId;
        this.init();
      }
    });
  }

  onShow() {
    this.init();
    this.authFLag += 1;
  }

  // 授权手机号回调
  verifyTelAccredit(e: any) {
    verifyTelAccredit(e);
  }

  @Watch('loading')
  onLoadingChange(newVal: any) {
    // 数据请求完后计算高度
    if (!newVal) this.$nextTick(() => this.getElHeight());
  }

  isCoach = false;

  init() {
    this.isCoach = uni.getStorageSync('isCoach');
    if (!this.isCoach) {
      // 进来获取地理位置授权
      uni.getLocation({
        success: res => {
          uni.setStorageSync('longitude', res.longitude);
          uni.setStorageSync('latitude', res.latitude);
        }
      });
    }
    this.getGoodsList();
    uni.setNavigationBarTitle({
      // title: schoolName[this.schoolId]
      title: '首页'
    });
    // 广仁陪驾单独处理
    if (appSid === 370) {
      this.goodsTabbar = [
        { value: 1, label: '班别选择' },
        { value: 2, label: '线下地址' },
        { value: 4, label: '驾校介绍' }
      ];
    }
  }

  // 计算swiper高度
  swiperHeight = 0;

  tab2Height = 0;

  getElHeight() {
    const query = uni.createSelectorQuery();
    query.selectAll('.el_height').boundingClientRect(rect => {
      if (rect instanceof Array) {
        uni.getSystemInfo({
          success: res => {
            let elHeight = 0;
            rect.forEach(item => {
              elHeight += item.height;
            });
            this.swiperHeight = res.windowHeight - elHeight - (this.inviterId ? 8 : 0); // 计算外层swiper高度
          }
        });
      }
    }).exec();
  }

  // 商品列表(班别选择)
  goodsList = [];

  queryGoodsFlag = false;

  async getGoodsList() {
    this.goodsList = await this.$http.get('goods/applet/v1/queryClassBySchoolId', { drivingSchoolId: this.schoolId });
    // this.goodsList = await this.$http.get('goods/applet/v1/queryProductListForAppletBySchoolId', { drivingSchoolId: this.schoolId });
    this.queryGoodsFlag = true;
    uni.stopPullDownRefresh();
    this.loading = false;
    setTimeout(() => this.norotateAndScale(), 1);
    // this.goodsList.forEach((good: any) => {
    //   const item = good;
    //   // 从商品的类别里面找出最低的一个销售价
    //   item.price = this.countMinPrice(item.salesPrice);
    //   // 从商品的类别里面找出最低的一个原价
    //   item.originalPriceNum = this.countMinPrice(item.originalPrice);
    //   item.photoUrlMain = getMainFromPhotoJson(item.photoUrl);
    // });
  }

  countMinPrice(priceStr: string) {
    if (typeof priceStr === 'string') {
      const priceObj = JSON.parse(priceStr);
      const priceList: number[] = [];
      Object.keys(priceObj).forEach(key => {
        priceList.push(priceObj[key]);
      });
      priceList.sort();
      return priceList[0];
    }
    return 0;
  }

  // 班别/介绍相关
  goodsTabbar = [
    { value: 1, label: '班别选择' },
    { value: 2, label: '门店服务' },
    { value: 3, label: '训练场' },
    { value: 4, label: '驾校介绍' }
  ]

  private tabIndex = 1;

  swiperChange(event: any) {
    this.tabIndex = event.detail.current + 1;
    this.dataLength();
  }

  changeTab(param: number) {
    if (param === 4) {
      uni.navigateTo({ url: '/pages/public/home_new/web_view' });
      return;
    }
    this.tabIndex = param;
  }

  // 判断门店和训练场数据
  dataLength() {
    if (this.storeList.length === 0) {
      this.getStorePlace(1);
    }
    if (this.trainingPlaceList.length === 0) {
      this.getStorePlace(2);
    }
  }

  storeList = []; // 服务门店列表

  trainingPlaceList = []; // 训练场列表

  queryStoreFlag = false;

  queryTrainingFlag = false;

  /**
   * @param key 1:获取门店 2:获取场地
   */
  async getStorePlace(key: number) {
    // 有场景值的，取场景值中的用户id
    const inviterInfo = uni.getStorageSync('inviterInfo');
    let data: any = {
      current: this.current,
      drivingSchoolId: this.schoolId,
      latitude: uni.getStorageSync('latitude'),
      longitude: uni.getStorageSync('longitude')
    };
    if (inviterInfo && inviterInfo.userId) {
      const { forwardUserId, userId } = inviterInfo;
      data = {
        ...data,
        userId: Number(forwardUserId) > 0 ? forwardUserId : userId,
      };
    }
    const url = key === 1 ? 'space/v1/applet/queryStoreList' : 'space/v1/applet/queryTrainingPlaceList';
    const list = await this.$http.post(url, data);
    // list.forEach((val: any) => {
    //   const item = val;
    //   item.photoUrlMain = getMainFromPhotoJson(item.image);
    //   item.serviceList = this.getOtherService(item.otherService);
    // });
    if (key === 2) {
      this.queryTrainingFlag = true;
      this.trainingPlaceList = list;
      // 广仁陪驾门店和训练场合并在一起
      if (appSid === 370) {
        this.storeList = this.storeList.concat(list);
      }
    }
    if (key === 1) {
      if (this.current === 1) this.storeList = [];
      this.queryStoreFlag = true;
      this.storeList = this.storeList.concat(list.data);
      this.storeTotal = list.total;
    }
  }

  current = 1;

  storeTotal = 10;

  bindscrolltolower() {
    if (this.storeList.length >= this.storeTotal) return;
    this.current += 1;
    this.getStorePlace(1);
  }

  // 其他服务JSON字符串转列表
  getOtherService(json: string): string[] {
    const list: string[] = [];
    if (json) {
      try {
        const service = JSON.parse(json);
        service.forEach((val: any) => {
          list.push(val.label);
        });
      } catch (error) {
        console.log(error);
      }
    }
    return list;
  }

  // 用户微信信息
  wechatUserInfo = {};

  getUserProfile() {
    (uni as UniExpand).getUserProfile({
      desc: '登录',
      success: (event: any) => {
        this.userInfoFlag = false;
        uni.setStorageSync('wechatUserInfo', event.userInfo);
        this.wechatUserInfo = event.userInfo;
      },
      fail: () => {
        uni.showToast({
          title: '请授权获取信息',
          icon: 'none'
        });
      }
    });
  }

  async onShareAppMessage(res) {
    if (res.from === 'menu') {
      return {
        title: '',
        path: `/pages/public/home_new/index?schoolId=${this.schoolId}`,
      };
    }
    if (this.$platFormPc) {
      uni.showToast({
        icon: 'none',
        title: '请在手机端操作此功能'
      });
      return {
        title: '',
        path: `/pages/public/home_new/index?schoolId=${this.schoolId}`,
      };
    }
    if (this.isCoach) return this.shareContent;
    return this.getShareMsg(res.target.dataset.type, res.target.dataset.detail);
  }

  shareVisible = false;

  shareContent = {};

  async coachShare({ type, detail }) {
    this.shareContent = await this.getShareMsg(type, detail);
    this.shareVisible = true;
  }

  async getShareMsg(type, detail) {
    uni.showLoading({
      title: '加载中...'
    });
    let url = '';
    let title = '';
    let imageUrl: any = '';
    if (type === 4) { // 分享班别
      title = '包接送、包考试费、包补考费';
      url = detail.photoUrl;
      imageUrl = await getClassCard(detail, this);
    }
    if (type === 2 || type === 3) { // 分享训练场或者门店
      title = type === 2 ? '查看学车门店,另有门店密布全市!' : '查看训练场,另有训练场密布全市!';
      url = type === 2 ? getMainFromPhotoJson(detail.image) : getMainFromPhotoJson(detail.photoUrl);
      imageUrl = await getStoreCard(detail, this);
    }
    const sceneId = await generateSceneId({
      dynamicsId: detail.id,
      publishExport: 1,
      publishFormat: 1,
      title: detail.name || detail.appName,
      type,
      url
    });
    uni.hideLoading();
    return {
      // title: `${detail.name || detail.appName}的相关介绍，马上查看一下吧`,
      title,
      path: `/pages/public/dynamic/publish/share_landingpage?scene=${sceneId}`,
      imageUrl
    };
  }

  animationData = {};

  animation = uni.createAnimation({
    duration: 1000,
    timingFunction: 'ease',
  });

  norotateAndScale() {
    this.animation.opacity(1).step();
    this.animationData = this.animation.export();
  }

  classTriggered = true;

  async classBindrefresherrefresh() {
    this.classTriggered = true;
    await this.init();
    const timer = setTimeout(() => {
      this.classTriggered = false;
      clearTimeout(timer);
    }, 1000);
  }

  // 下载海报
  showDownloadPoster = false;

  downloadPosterData: any = null;

  downloadPoster(data) {
    const { type, detail } = data;
    let url = '';
    if (type === 4) {
      url = detail.photoUrl;
    }
    if (type === 3) {
      url = getMainFromPhotoJson(detail.photoUrl);
    }
    if (type === 2) {
      url = getMainFromPhotoJson(detail.image);
    }
    this.downloadPosterData = {
      detail: {
        ...detail,
        url,
      },
      type,
    };
    this.showDownloadPoster = true;
  }
}
