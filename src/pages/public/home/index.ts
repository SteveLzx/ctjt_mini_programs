import { Vue, Component, Watch } from 'vue-property-decorator';
import { SVGPHONE } from '@/assets/svg/index';
import {
  verifyTelAccredit,
  getMainFromPhotoJson,
  loginVerification,
  savePosterToAlbum,
  filterParams,
  makePhoneCall
} from '@/assets/js/common';
import { runEnv } from '@/config/build_path';
import { setGlobalData, getGlobalData } from '@/assets/js/global_data';
import { imgDomain } from '@/assets/js/config';
import { schoolId as sId } from '@/config/build_path';
import getCanvasParam from './canvas_data';
import El from './schoolInfo';

type ObjType = {
  [key: string]: any;
}

type UniExpand = {
  getUserProfile: any;
} & UniApp.Uni;

@Component
export default class Index extends Vue {
  bannerUrl = 'https://file.aicar365.com/mini-program/common/banner.png';

  imgDomain = imgDomain;

  private shareShow = false;

  currentShareItem = {};

  El = El; // 暂时写死的驾校信息

  authFlag = true; // 是否展示授权

  userInfoFlag = true;

  private svgPhone = SVGPHONE;

  inviterId = ''; // 教练ID

  schoolId = ''; // 驾校ID

  loading = true;

  // 是否是学员端
  isPersonal = true;

  onLoad(options: any) {
    if (options.scene) {
      const paramsObj = filterParams(options.scene);
      this.inviterId = paramsObj.userId || getGlobalData('inviterId');
      // 如果有推荐人存储推荐人ID在下单时传值
      if (paramsObj.userId) {
        setGlobalData('inviterId', options.inviterId);
      }
    }
    this.schoolId = options.schoolId;
    // 如果跳转过来需要展示服务门店
    if (options.toShop) {
      this.tabIndex = 2;
      this.drivTabIndex = 2;
      this.queryStoreList();
    }
  }

  onShow() {
    this.isPersonal = this.$isPersonal;
    if (this.isPersonal) {
      this.init(); // 学员端直接获取商品
    } else {
      this.getUserAuth(); // 教练端获取用户信息
    }
  }

  getUserAuth() {
    // 校验是否已登录
    if (uni.getStorageSync('wechatUserInfo')) {
      this.userInfoFlag = false;
      this.wechatUserInfo = uni.getStorageSync('wechatUserInfo');
    }
    const $emitter = getGlobalData('$emitter');
    $emitter.on('authorize', (flag: boolean) => {
      this.authFlag = flag;
      this.inviterId = uni.getStorageSync('userId');
      this.init();
    });
    loginVerification();
    if (!this.schoolId) this.init();
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

  init() {
    // 只有驾校ID没有教练ID直接通过驾校获取商品信息
    if (!this.schoolId && !this.inviterId) { // 如果没有驾校ID也没有邀请ID则显示最近的一个驾校信息
      this.schoolId = uni.getStorageSync('schoolId') || sId);
    }
    if (this.schoolId && !this.inviterId) {
      uni.setStorageSync('schoolId', this.schoolId);
      this.getGoodsList();
    }
    // 有教练ID先获取教练信息再通过驾校获取商品信息
    if (this.inviterId) {
      this.getInviterDetail();
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
    query.select('.driv_school_tab').boundingClientRect(rect => {
      this.tab2Height = rect.height + 8;
    }).exec();
  }

  // 邀请人详情
  inviterDetail: ObjType = {};

  async getInviterDetail() {
    try {
      this.inviterDetail = await this.$http.post('user/v1/wechat/queryQrCodeUserDetail', { userId: this.inviterId });
    } catch (error) {
      console.log(error);
    }
    // 存储下来详情页面生成海报使用
    uni.setStorageSync('inviterDetail', this.inviterDetail);
    if (!this.schoolId && this.inviterDetail && this.inviterDetail.drivingSchoolId) {
      this.schoolId = this.inviterDetail.drivingSchoolId;
    }
    uni.setStorageSync('schoolId', this.schoolId);
    this.getGoodsList();
  }

  // 商品列表(班别选择)
  goodsList = [];

  queryGoodsFlag = false;

  async getGoodsList() {
    this.goodsList = await this.$http.get('goods/applet/v1/queryProductListForAppletBySchoolId', { drivingSchoolId: this.schoolId });
    this.queryGoodsFlag = true;
    uni.stopPullDownRefresh();
    this.loading = false;
    setTimeout(() => this.norotateAndScale());
    this.goodsList.forEach((good: any) => {
      const item = good;
      // 从商品的类别里面找出最低的一个销售价
      item.price = this.countMinPrice(item.salesPrice);
      // 从商品的类别里面找出最低的一个原价
      item.originalPriceNum = this.countMinPrice(item.originalPrice);
      item.photoUrlMain = getMainFromPhotoJson(item.photoUrl);
    });
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

  // 监听分析框展示状态，判断底部tab栏是否显示
  @Watch('shareShow')
  @Watch('showPoster')
  onChangeValue(newVal: boolean) {
    if (newVal) {
      uni.hideTabBar();
    } else {
      uni.showTabBar();
    }
  }

  // 班别/介绍相关
  private goodsTabbar = [
    { value: 1, label: '班别选择' },
    { value: 2, label: '驾校介绍' },
  ]

  private tabIndex = 1;

  swiperChange1(event: any) {
    this.tabIndex = event.detail.current + 1;
  }

  changeTab(param: number) {
    this.tabIndex = param;
  }

  // 基础信息相关
  private drivSchoolTabbar = [
    { value: 1, label: '基本信息' },
    { value: 2, label: '服务门店' },
    { value: 3, label: '训练场' },
  ]

  private drivTabIndex = 1;

  storeList = []; // 服务门店列表

  trainingPlaceList = []; // 训练场列表

  swiperChange2(event: any) {
    const { current } = event.detail;
    this.drivTabIndex = current + 1;
    // 查询门店列表
    if (current === 1 && this.storeList.length === 0) {
      this.queryStoreList();
    }
    // 查询训练场列表
    if (current === 2 && this.trainingPlaceList.length === 0) {
      this.queryTrainingPlaceList();
    }
  }

  queryStoreFlag = false;

  async queryStoreList() {
    const storeList = await this.$http.get('space/applet/v1/queryStoreListForAppletBySchoolId', { id: this.schoolId });
    this.queryStoreFlag = true;
    storeList.forEach((store: any) => {
      const item = store;
      item.photoUrlMain = getMainFromPhotoJson(item.image);
      item.serviceList = this.getOtherService(item.otherService);
    });
    this.storeList = storeList;
  }

  queryTrainingFlag = false;

  async queryTrainingPlaceList() {
    const trainingPlaceList = await this.$http.get('space/applet/v1/queryTrainingPlaceListForAppletBySchoolId', { id: this.schoolId });
    this.queryTrainingFlag = true;
    trainingPlaceList.forEach((place: any) => {
      const item = place;
      item.photoUrlMain = getMainFromPhotoJson(item.photoUrl);
      item.serviceList = this.getOtherService(item.otherService);
    });
    this.trainingPlaceList = trainingPlaceList;
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

  changeDrivSchoolCLass(param: number) {
    this.drivTabIndex = param;
  }

  // 跳转详情
  toDetails(item: any) {
    uni.navigateTo({
      url: `/pages/public/goods_detail/index?id=${item.id}`,
    });
  }

  // 拨打电话
  callPhone(tel: string) {
    makePhoneCall(tel || this.inviterDetail.mobile);
  }

  // 跳转地图
  openLocation(longitude: number, latitude: number, address?: string) {
    if (longitude && latitude) {
      uni.openLocation({
        latitude,
        longitude,
        address
      });
    }
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

  onShareAppMessage() {
    if (!this.isPersonal) {
      return {
        title: this.inviterDetail.drivingSchoolName,
        path: `/pages/enterprise/share/index?path=/pages/public/home/index&inviterId=${this.inviterId}&schoolId=${this.schoolId}`
      };
    }
    return {
      title: this.inviterDetail.drivingSchoolName,
      path: `/pages/public/home/index?schoolId=${this.schoolId}`
    };
  }

  sharePoster() {
    this.shareShow = false;
    this.showPoster = true;
  }

  // 海报弹出展示
  showPoster = false;

  canvasFlag = false;

  canvasParam = {};

  private canvasPath = '';

  /* eslint-disable */
  canvasFail(e: any) {
    console.log(e);
  }

  canvasSuccess(data: any) {
    uni.hideLoading();
    this.showPoster = true;
    this.canvasPath = data.res.tempFilePath;
    this.canvasParam = {};
    this.canvasFlag = false;
  }

  /* eslint-enable */
  savePosterToAlbum() {
    savePosterToAlbum(this.canvasPath);
  }

  // 生成海报
  posterCallback() {
    this.shareShow = false;
    this.canvasFlag = true;
    uni.showLoading({
      title: '生成中'
    });
    this.canvasParam = getCanvasParam(this.currentShareItem, uni.getStorageSync('wechatUserInfo').avatarUrl, this.inviterDetail);
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

  onPullDownRefresh() {
    if (this.isPersonal) {
      this.init(); // 学员端直接获取商品
    } else {
      this.getUserAuth(); // 教练端获取用户信息
    }
  }
}
