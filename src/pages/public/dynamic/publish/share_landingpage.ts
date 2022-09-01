import { Vue, Component } from 'vue-property-decorator';
import { userData } from '@/pages/personal/invite/index';
import {
  resCountDown,
  generateSceneId,
  openCustomerService,
  schoolTelephone,
  schoolName,
  getMainFromPhotoJson,
  getImageInfo,
  addCarModelText,
  verifyTelAccredit,
  makePhoneCall
} from '@/assets/js/common';
import { schoolId } from '@/config/build_path';
import { getGlobalData } from '@/assets/js/global_data';
import { queryNameCardInfo } from '@/pages/public/_common/index';
import getShareCard from '@/pages/public/my/get_canvas';
import { proImgDomain } from '@/assets/js/config';
import { getStoreCard, getClassCard } from '@/pages/public/home_new/get_canvas';

type DetailsType = {
  photoUrl?: string | Array<string>;
  trainingItemList: Array<any>;
  appName?: string;
  photoUrlMain?: string;
  id?: string;
}

const titleOpts = {
  1: '驾校',
  2: '门店',
  3: '训练场',
  4: '班别',
  5: '介绍新学员立享',
  6: '报名学车立减',
  7: `${schoolName[schoolId]}名片`,
};

@Component
export default class Index extends Vue {
  authFLag = 0;

  shareVisible = false; // 分享自定义

  shareContent = {};

  isCoach = false;

  /** 在已经打开过该小程序的情况下打开群分享的卡片，获取到shareTicket */
  onShow(res) {
    this.authFLag += 1;
    // console.log('shareTicket', res);
    // uni.getShareInfo({
    //   shareTicket: res?.res.shareTicket,
    //   success(e: any) {
    //     console.log(e);
    //   },
    // });
    /** 开启微信分享到好友和朋友圈 可以写在公共组件里面 */
    uni.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    });
  }

  created() {
    const $emitter = getGlobalData('$emitter');
    $emitter.on('authorize', () => {
      this.authFlag = true;
    });
  }

  // 是否展示授权
  authFlag = !!uni.getStorageSync('mobile');

  // 授权手机号回调
  verifyTelAccredit(e: any) {
    verifyTelAccredit(e);
  }

  goHome() {
    uni.switchTab({ url: '/pages/public/home_new/index' });
  }

  // 进入场景类型
  type = 0;

  sceneId = '' // 当前场景之id

  onLoad(options) {
    const { scene } = options;
    uni.setStorageSync('sceneId', scene);
    if (uni.getStorageSync('userId')) {
      this.queryDynamicsScene(scene);
    }
    const $emitter = getGlobalData('$emitter');
    // 登录后请求详情
    $emitter.on('codeLogin', () => {
      this.queryDynamicsScene(scene);
    });
  }

  showSendMessage = false;

  // 根据场景值获取的用户名片信息
  cardInfo = {}

  // 查看场景信息
  dynamicsSceneData: any = {}

  async queryDynamicsScene(scene) {
    this.showSendMessage = !uni.getStorageSync('isCoach');
    this.isCoach = uni.getStorageSync('isCoach');
    const body = await this.$http.get(`sale/v1/mkt/dynamicsScene/${scene}`);
    this.dynamicsSceneData = body;
    this.sceneId = scene;
    const {
      type, companyId, dynamicsId
    } = body;
    // 教练和客服角色才存场景值信息，用于发消息，聊天用
    uni.setStorageSync('inviterInfo', body);
    if (companyId !== '0') uni.setStorageSync('schoolId', companyId);
    this.type = type;
    this.sId = companyId === '0' ? schoolId : companyId;
    if ([5, 6, 7].includes(type)) {
      // 设置标题
      this.setTitle(titleOpts[type]);
    }
    if ([5, 6, 99].includes(type)) {
      // 查询活动详情
      this.queryActivityById(dynamicsId);
      this.queryAwards(dynamicsId, type);
    }
    if (type === 3) {
      // 查询训练场详情
      this.queryTrainingPlaceForApplet(dynamicsId);
    }
    if (type === 2) {
      // 查询训练场详情
      this.queryStoreForApplet(dynamicsId);
    }
    if (type === 4) {
      // 查询班别详情
      this.queryClass(dynamicsId);
    }
    if (type === 7) {
      // 查询名片详情，子组件内调用
    }
  }

  setTitle(title) {
    uni.setNavigationBarTitle({
      title
    });
  }

  // 计算标题
  get mainTitle() {
    return schoolId === 370 ? '广仁邀您抽大奖' : '您的好友邀您参与';
  }

  // 查询活动详情
  activityData: any = {}

  async queryActivityById(id) {
    this.activityData = await this.$http.get('sale/v1/mkt/activities/getActivityById', { id });
    const { type, name } = this.activityData;
    if (type === 99) {
      this.setTitle(name);
    }
  }

  get downTimes() {
    const { beginDate } = (this as any).activityData;
    if (beginDate) {
      this.handleWatchTime(beginDate);
      return new Date(beginDate).getTime() > new Date().getTime();
    }
    return false;
  }

  timer = null

  timeName = ''

  handleWatchTime(newVal: string) {
    // 存在并且大于当前时间
    clearInterval(this.timer);
    if (newVal && new Date().getTime() < new Date((`${newVal} 00:00:00`).replace(/-/g, '/')).getTime()) {
      const target = new Date((`${newVal} 00:00:00`).replace(/-/g, '/')).getTime();
      const now = new Date().getTime();
      let sub = target - now;
      this.timer = setInterval(() => {
        if (sub <= 0) {
          clearInterval(this.timer);
          this.timer = null;
        }
        this.timeName = resCountDown(sub);
        sub -= 1000;
      }, 1000);
    }
  }

  // 查询训练场详情
  trainingData: any = {}

  async queryTrainingPlaceForApplet(id) {
    const trainingData = await this.$http.get('space/v1/applet/queryTrainingPlaceForAppletById', { id });
    const { photoUrl, otherService, name } = trainingData;
    this.setTitle(name);
    trainingData.photoUrlMain = getMainFromPhotoJson(photoUrl);
    trainingData.serviceList = this.getOtherService(otherService);
    this.trainingData = trainingData;
  }

  // 查询门店详情
  storeData: any = {}

  async queryStoreForApplet(id) {
    const storeData = await this.$http.get('space/v1/applet/queryStoreForAppletById', { id });
    const { image, otherService, name } = storeData;
    this.setTitle(name);
    storeData.photoUrlMain = getMainFromPhotoJson(image);
    storeData.serviceList = this.getOtherService(otherService);
    this.storeData = storeData;
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

  // 查询班别详情
  classData: DetailsType = { trainingItemList: [] };

  classSwiperHeight = 0;

  async queryClass(id) {
    const details = await this.$http.get('goods/applet/v1/queryClassByID', { id });
    const { photoUrl, appName } = details;
    this.setTitle(appName);
    details.photoUrlMain = photoUrl; // 取一张图作为主图
    const imageMsg: any = await getImageInfo(proImgDomain + photoUrl);
    // 按照长宽比例计算
    this.classSwiperHeight = imageMsg.height * (this.$systemInfo.windowWidth / imageMsg.width);
    details.photoUrl = [photoUrl];
    try {
      if (typeof details.salesPrice === 'string') {
        const salesPrice = JSON.parse(details.salesPrice);
        const trainingItem: any = [];
        let flag = 1;
        // 找出最低价，展示默认选中的类型
        const originalPrice = JSON.parse(details.originalPrice);
        Object.keys(salesPrice).forEach(key => {
          const item = {
            label: key,
            labelText: addCarModelText(key),
            salesPrice: salesPrice[key],
            originalPrice: originalPrice[key]
          };
          if (flag === 1) {
            // this.currentTrainingItem = item;
            details.price = salesPrice[key];
            flag = 2;
          }
          if (details.price > salesPrice[key]) {
            details.price = salesPrice[key];
            // this.currentTrainingItem = item;
          }
          trainingItem.push(item);
        });
        details.originalPriceNum = originalPrice;
        details.trainingItemList = trainingItem;
      }
    } catch (error) {
      console.log(error);
    }
    this.classData = details;
  }

  // 转盘数据
  sId = schoolId;

  awards = [];

  awardsList = [];

  // 获取转盘数据
  async queryAwards(activityId, type) {
    const sendData = {
      activityId,
      drivingSchoolId: schoolId
    };
    if (type !== 99) delete sendData.activityId;
    const body = await this.$http.post('sale/v1/mkt/coupon/queryAllPrizeByMkt', sendData);
    this.awards = body;
    this.drawAwardRoundel(); // 获取转盘数据
  }

  async drawAwardRoundel() {
    const awardsList = [];
    const { awards } = this;
    const turnNum = 360 / awards.length; // 文字旋转 turn 值
    // 奖项列表
    for (let i = 0; i < awards.length; i += 1) {
      const { grade } = awards[i];
      const index = grade - 1;
      const award = {
        turn: `${index * turnNum - 22.5}deg`,
        lineTurn: `${index * turnNum + turnNum / 2}deg`,
        ...awards[i]
      };
      awardsList[index] = award;
    }
    this.awardsList = awardsList;
    this.generateUserData(awardsList); // 生成虚拟数据
  }

  userData: any[] = [];

  // 生成虚拟数据
  userDataTimer = null

  generateUserData(list) {
    if (this.userDataTimer) return;
    let current = Math.floor(userData.length * Math.random());
    const awardsList = [...list].filter(item => item.unit !== '感谢');
    // 首先展示三等奖
    const two = awardsList.findIndex((item: any) => item.grade === 1);
    this.userData.push({
      ...userData[current],
      num: Math.ceil(5 * Math.random()),
      prizeName: awardsList[two].unit + awardsList[two].prizeName
    });
    this.userDataTimer = setInterval(() => {
      current += 1;
      if (current > userData.length) {
        current = Math.floor(userData.length * Math.random());
      }
      const prizeIndex = Math.floor(Math.random() * 4);
      const award = awardsList[prizeIndex];
      this.userData.push({
        ...userData[current],
        prizeName: award.unit + award.prizeName
      });
      this.userData.shift();
    }, 5000);
  }

  // 下载
  showDownloadPoster = false;

  downloadPosterData = {};

  // 活动
  async createdDynamicsScene() {
    const {
      title, dynamicsId, type, userType, userName, mobile
    } = this.dynamicsSceneData;
    const scene = uni.getStorageSync('sceneId');
    // 如果自己是客服教练,取自己的数据,如果不是就取上级的,上级也不是,就取驾校
    const locUserType = uni.getStorageSync('userType'); // 自己的userType
    let _cardName = '';
    let _mobile = '';
    if (locUserType !== 2) {
      if (userType === 2) {
        _cardName = userName;
        _mobile = mobile;
      }
    }
    if ([5, 6, 99].includes(type)) {
      let photoUrlMain;
      if (type === 5) photoUrlMain = 'https://file.aicar365.com/mini-program/common/share_poster_fx.jpg';
      if (type === 6) photoUrlMain = 'https://file.aicar365.com/mini-program/common/share_poster_lj.jpg';
      if (type === 99) photoUrlMain = schoolId === 370 ? 'https://file.aicar365.com/mini-program/common/share_poster_lj.jpg' : 'https://file.aicar365.com/mini-program/common/dongtai_yqxc.jpg';
      const sendData = {
        id: dynamicsId,
        sceneId: scene,
        name: title,
        cardName: _cardName,
        mobile: _mobile,
        photoUrlMain
      };
      this.downloadPosterData = {
        detail: sendData,
        type: type === 5 ? 6 : type,
      };
      this.showDownloadPoster = true;
    } else {
      // 班别，门店，训练场
      let imageUrl: any = '';
      let _data = {};
      // 分享班别
      if (type === 4) {
        _data = this.classData;
        imageUrl = (this.classData.photoUrl && this.classData.photoUrl[0]) || [];
      }
      // 训练场
      if (type === 3) {
        _data = this.trainingData;
        imageUrl = this.trainingData.photoUrlMain;
      }
      // 门店
      if (type === 2) {
        _data = this.storeData;
        imageUrl = this.storeData.photoUrlMain;
      }
      const sendData = {
        sceneId: scene,
        ..._data,
        id: dynamicsId,
        cardName: _cardName,
        mobile: _mobile,
        url: imageUrl
      };

      this.downloadPosterData = {
        detail: sendData,
        type,
      };
      console.log('downloadPosterData', this.downloadPosterData);
      this.showDownloadPoster = true;
    }
  }

  // 名片
  async downCard(data) {
    const scene = uni.getStorageSync('sceneId');
    const sendData = {
      sceneId: scene,
      ...data
    };
    this.downloadPosterData = {
      detail: sendData,
      type: 7,
    };
    this.showDownloadPoster = true;
  }

  // 班别,门店,训练场列表下载海报
  downStore(data) {
    const { type, detail, source } = data;
    if (source === 'list') {
      const scene = uni.getStorageSync('sceneId');
      let imageUrl: any = '';
      // 分享班别
      if (type === 4) {
        imageUrl = detail.photoUrl;
      }
      // 训练场
      // 门店
      if (type === 3 || type === 2) {
        imageUrl = type === 3 ? getMainFromPhotoJson(detail.photoUrl) : getMainFromPhotoJson(detail.image);
      }
      const sendData = {
        sceneId: scene,
        ...detail,
        url: imageUrl
      };

      this.downloadPosterData = {
        detail: sendData,
        type,
      };
      console.log('downloadPosterData-list', this.downloadPosterData);
      this.showDownloadPoster = true;
    }
  }

  async coachShare({ type, detail, source }) {
    uni.showLoading({
      title: '加载中...'
    });
    this.shareContent = await this.getShareMsg(type, detail, source);
    uni.hideLoading();
    this.shareVisible = true;
  }

  async getShareMsg(type, detail, source) {
    const scene = uni.getStorageSync('sceneId');
    if ([5, 6, 99].includes(type)) {
      // 转发活动
      const { title, dynamicsId } = this.dynamicsSceneData;
      const imageUrl = schoolId === 370 || type !== 99 ? 'https://file.aicar365.com/mini-program/common/share_card_lj.png' : 'https://file.aicar365.com/mini-program/common/share_card_yqxc.jpg';
      const sendData = {
        dynamicsId,
        sceneId: scene,
        publishExport: 1,
        publishFormat: 1,
        title,
        type: type !== 99 ? 6 : type
      };
      const sceneId = await generateSceneId(sendData);
      return {
        // title: `转发了${title}营销活动的相关介绍，马上查看一下吧`,
        title: `${schoolName[schoolId]}活动` || this.activityData.name,
        path: `/pages/public/dynamic/publish/share_landingpage?scene=${sceneId}`,
        imageUrl
      };
    }
    if (type === 7) {
      // 名片分享
      const { id, userName, visitorId } = detail;
      const cardInfo = await queryNameCardInfo(visitorId);
      const imageUrl = await getShareCard(cardInfo, this);
      const sendData = {
        dynamicsId: id,
        sceneId: scene,
        publishExport: 1,
        publishFormat: 1,
        title: userName,
        type
      };
      const sceneId = await generateSceneId(sendData);
      return {
        title: '找我学车价格透明拿证快~!',
        path: `/pages/public/dynamic/publish/share_landingpage?scene=${sceneId}`,
        imageUrl
      };
    }
    let imageUrl: any = '';
    let url: any = '';
    let dynamicsId: any = '';
    let title: any = '';
    let shareTitle = '';

    if (source === 'list') {
      // 列表分享
      if (type === 4) {
        const { id, appName, photoUrl } = detail;
        dynamicsId = id;
        title = appName;
        shareTitle = '包接送、包考试费、包补考费';
        url = photoUrl;
        imageUrl = await getClassCard(detail, this);
      }
      if (type === 2 || type === 3) {
        const {
          id, name, photoUrl, image
        } = detail;
        dynamicsId = id;
        title = name;
        shareTitle = type === 3 ? '查看训练场,另有训练场密布全市！' : '查看学车门店,另有门店密布全市！';
        url = type === 2 ? getMainFromPhotoJson(image) : getMainFromPhotoJson(photoUrl);
        imageUrl = await getStoreCard(detail, this);
      }
    } else {
      // 分享页单个分享
      // 分享班别
      if (type === 4) {
        dynamicsId = this.classData.id;
        title = this.classData.appName;
        shareTitle = '包接送、包考试费、包补考费';
        url = this.classData.photoUrlMain;
        imageUrl = await getClassCard(this.classData, this);
      }
      // 分享训练场
      if (type === 3) {
        dynamicsId = this.trainingData.id;
        title = this.trainingData.name;
        shareTitle = '查看训练场,另有训练场密布全市！';
        url = this.trainingData.photoUrlMain;
        imageUrl = await getStoreCard(this.trainingData, this);
      }
      // 分享门店
      if (type === 2) {
        dynamicsId = this.storeData.id;
        title = this.storeData.name;
        shareTitle = '查看学车门店,另有门店密布全市！';
        url = this.storeData.photoUrlMain;
        imageUrl = await getStoreCard(this.storeData, this);
      }
    }

    const sceneId = await generateSceneId({
      dynamicsId,
      sceneId: scene,
      publishExport: 1,
      publishFormat: 1,
      title,
      type,
      url
    });
    return {
      title: shareTitle,
      path: `/pages/public/dynamic/publish/share_landingpage?scene=${sceneId}`,
      imageUrl
    };
  }

  // 分享
  async onShareAppMessage(params: any) {
    const { from, target } = params;
    if (from === 'menu') {
      const schoolIdStor = uni.getStorageSync('schoolId');
      return {
        title: '',
        path: `/pages/public/home_new/index?schoolId=${schoolIdStor}`,
      };
    }
    if (this.$platFormPc) {
      uni.showToast({
        icon: 'none',
        title: '请在手机端操作此功能'
      });
      return false;
    }
    if (this.isCoach) return this.shareContent;
    const { type, detail, source } = target.dataset;
    const res = await this.getShareMsg(type, detail, source);
    return res;
  }

  /** 拨打电话 */
  async callPhoneCallback() {
    (this as any).$track.send({
      event: 'ck',
      extra: {
        call: true,
        scene: uni.getStorageSync('sceneId') || ''
      }
    });
    // 落地页为门店的时候，直接给门店打电话
    let phoneNumber = '';
    if (this.type === 2) {
      phoneNumber = this.storeData.telephone;
    } else if (this.type === 7) {
      const cardInfo: any = await queryNameCardInfo(this.dynamicsSceneData.dynamicsId, 1);
      const { userType } = cardInfo;
      phoneNumber = userType === 3 ? schoolTelephone[schoolId] : cardInfo.mobile;
    } else {
      const inviterInfo = uni.getStorageSync('inviterInfo');
      if (inviterInfo && inviterInfo.companyId !== '0' && inviterInfo.mobile) {
        phoneNumber = inviterInfo.mobile;
      } else {
        const sId = inviterInfo.companyId !== '0' ? inviterInfo.companyId : schoolId;
        phoneNumber = schoolTelephone[sId]; // 默认取驾校电话
      }
    }
    makePhoneCall(phoneNumber);
  }

  /** 发消息 */
  async sendMessageCallback() {
    (this as any).$track.send({
      event: 'ck',
      extra: {
        sendMsg: true,
        scene: uni.getStorageSync('sceneId') || ''
      }
    });
    if (this.type === 7) {
      const cardInfo: any = await queryNameCardInfo(this.dynamicsSceneData.dynamicsId, 1);
      const { userType } = cardInfo;
      if (userType === 3) {
        openCustomerService();
      } else {
        uni.navigateTo({
          url: `../../../../package_im/pages/TUI-Chat/chat?conversationID=C2C${cardInfo.imId}`
        });
      }
    } else {
      const inviterInfo = uni.getStorageSync('inviterInfo');
      if (inviterInfo && inviterInfo.companyId !== '0' && inviterInfo.imId) {
        uni.navigateTo({
          url: `../../../../package_im/pages/TUI-Chat/chat?conversationID=C2C${inviterInfo.imId}`
        });
        return;
      }
      openCustomerService();
    }
  }
}
