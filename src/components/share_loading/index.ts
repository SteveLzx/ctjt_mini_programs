import {
  Vue, Component, Prop, Watch, Emit
} from 'vue-property-decorator';
import { schoolName, schoolTelephone } from '@/assets/js/common';
import { imgDomain } from '@/assets/js/config';
import { queryNameCardInfo } from '@/pages/public/_common/index';
import { schoolId } from '@/config/build_path';

const tabList = [
  {
    value: 1, id: 1, label: '名片', swiperHeight: 0
  },
  {
    value: 2, id: 3, label: '班别', swiperHeight: 0
  },
  {
    value: 4, id: 5, label: '训练场', swiperHeight: 0
  },
  {
    value: 5, id: 6, label: '门店', swiperHeight: 0
  },
  {
    value: 6, id: 7, label: '好评99%', swiperHeight: 0
  },
  {
    value: 3, id: 4, label: '驾校', swiperHeight: 0
  },
];

const tabListGuangren = (() => {
  const list = [...tabList];
  list.splice(2, 2, {
    value: 5, id: 6, label: '线下地址', swiperHeight: 0
  });
  return list;
})();

@Component
export default class Index extends Vue {
  imgDomain = imgDomain;

  // 默认用户头像
  defaultUserImg = () => `https://file.aicar365.com/mini-program/${schoolId}/common/headportrait_normal.png`;

  defaultImg= () => 'https://file.aicar365.com/mini-program/common/queshengye_banbiexinxi.png';

  @Prop({ default: 0 }) type!: number

  @Prop({ default: true }) showShare!: boolean

  @Prop({ default: true }) showContact!: boolean

  @Prop({ default: '' }) sId!: string

  @Prop({ default: '' }) userId!: string

  @Prop({ default: '' }) forwardUserId!: string

  @Prop({ default: '' }) sceneId!: string

  @Prop({ default: 0 }) userType!: number

  @Prop({ default: '' }) source!: string

  @Prop({ default: {} }) activityData!: {}

  @Emit('down-active')
  downActive() {
    //
  }

  @Emit('down-card')
  downCard() {
    return this.userInfoData;
  }

  @Watch('sceneId', { immediate: true })
  handleWatchSceneId(val) {
    if (val) {
      this.init();
    }
  }

  // 名片详情专用
  @Watch('source', { immediate: true })
  handleWatchSource(val) {
    if (val === 'nameCard') {
      this.init();
    }
  }

  get userNameFilter() {
    const { userType } = this;
    const { userName } = this.userInfoData;
    return userType === 3 ? schoolName[schoolId] : userName;
  }

  get mobileFilter() {
    const { userType } = this;
    const { mobile } = this.userInfoData;
    return userType === 3 ? schoolTelephone[schoolId] : mobile;
  }

  get drivingSchoolNameFilter() {
    const { userType } = this;
    const { drivingSchoolName } = this.userInfoData;
    return userType === 3 ? schoolName[schoolId] : drivingSchoolName;
  }

  // 广仁特殊处理
  get trainingPlaceAndStoreList() {
    const { trainingPlaceList, storeList } = this;
    return [...trainingPlaceList, ...storeList];
  }

  @Watch('trainingPlaceAndStoreList')
  handletrainingPlaceAndStore() {
    if (this.schoolId === 370) this.getElHeight(6);
  }

  tabList: any = []; // tab

  inviterId = ''; // 教练ID

  showSendMessage = false;

  schoolId = schoolId;

  isCoach = false;

  init() {
    this.isCoach = uni.getStorageSync('isCoach');
    this.showSendMessage = !uni.getStorageSync('isCoach');
    // 根据type展示对应的tab项
    // 广仁驾校特殊处理
    this.tabList = schoolId === 370 ? tabListGuangren : tabList;
    const { type, userId, userType } = this;
    // 班别，训练场，门店场景进来的没有好评
    // 活动场景进来的也没有好评
    if ([2, 3, 4, 5, 6, 99].includes(type)) this.tabList = this.tabList.filter((item: any) => item.id !== 7);
    // 名片场景进来的也没有名片
    // 只有客服教练.职能人员角色才有名片
    if ((![2, 3].includes(userType)) || type === 7) this.tabList = this.tabList.filter((item: any) => item.id !== 1);
    if (userType === 3) this.tabList = this.tabList.filter((item: any) => item.id !== 7);
    if (userId) this.queryCardInfo();
    // 取第一个tab赋值高度
    if (userId) this.queryActivityList(userId);
    this.getGoodsList();
    this.queryStoreList();
    this.queryTrainingPlaceList();
    this.queryCoachEvaluateList();
    // console.log(this.tabList);
  }

  // tab事件处理================================
  current = 0;

  handleSwiperChange(e) {
    const { current } = e.detail;
    // const { current: _current } = this;
    // const { id } = this.tabList[current];
    // if (id === 4) {
    //   this.current = current > _current ? current + 1 : current - 1;
    //   return;
    // }
    this.current = current;
    this.setElHeight();
  }

  handleNavChange(val: number) {
    const { id } = this.tabList[val];
    if (id === 4) {
      uni.navigateTo({ url: '/pages/public/home_new/web_view' });
      return;
    }
    this.current = val;
    this.setElHeight();
  }

  // swiper高度事件处理================================
  swiperHeight = 300;

  getElHeight(type) {
    this.$nextTick(() => {
      try {
        const setHeight = (id, height) => {
          this.tabList.forEach((item: any) => {
            const _item = item;
            if (item.value === id) _item.swiperHeight = height;
          });
        };
        const query = uni.createSelectorQuery().in(this);
        if (type === 1 || type === 2) {
          query.select('#carRefId').boundingClientRect(data => {
            const { height = 0 } = data || {};
            setHeight(1, height);
            this.setElHeight();
          }).exec();
        }
        if (type === 3) {
          query.select('#goodsRefId').boundingClientRect(data => {
            const { height } = data;
            setHeight(2, height);
          }).exec();
        }
        if (type === 5) {
          query.select('#trainingPlaceRefId').boundingClientRect(data => {
            const { height } = data;
            setHeight(4, height);
          }).exec();
        }
        if (type === 6) {
          query.select('#storeRefId').boundingClientRect(data => {
            const { height } = data;
            setHeight(5, height);
            this.setElHeight();
          }).exec();
        }
        if (type === 7) {
          query.select('#commentRefId').boundingClientRect(data => {
            const { height = 0 } = data || {};
            setHeight(6, height);
            this.setElHeight();
          }).exec();
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  setElHeight() {
    const { current } = this;
    const { id } = this.tabList[current];
    this.tabList.forEach((item: any) => {
      if (id === item.id) this.swiperHeight = item.swiperHeight;
    });
  }

  // 班别事件处理================================
  goodsList = [];

  queryGoodsFlag = false;

  async getGoodsList() {
    if (this.goodsList.length === 0) {
      this.goodsList = await this.$http.get('goods/applet/v1/queryClassBySchoolId', { drivingSchoolId: this.schoolId });
      this.queryGoodsFlag = true;
      this.getElHeight(3);
    }
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

  // 训练场事件处理================================
  trainingPlaceList = [];

  queryTrainingFlag = false;

  async queryTrainingPlaceList() {
    if (this.trainingPlaceList.length === 0) {
      const { userId, forwardUserId } = this;
      const sendData = {
        drivingSchoolId: schoolId,
        userId: Number(forwardUserId) > 0 ? forwardUserId : userId,
        latitude: uni.getStorageSync('latitude'),
        longitude: uni.getStorageSync('longitude')
      };
      const trainingPlaceList = await this.$http.post('space/v1/applet/queryTrainingPlaceList', sendData);
      this.queryTrainingFlag = true;
      this.trainingPlaceList = trainingPlaceList;
      if (this.schoolId !== 370) this.getElHeight(5);
    }
  }

  // 门店事件处理================================
  storeList = []; // 服务门店列表

  queryStoreFlag = false;

  storeCurrent = 1;

  async queryStoreList() {
    const flag = this.tabList.filter((item) => item.value === 5).length > 0;
    if (flag) {
      const { userId, forwardUserId } = this;
      const sendData = {
        current: this.storeCurrent,
        drivingSchoolId: schoolId,
        userId: Number(forwardUserId) > 0 ? forwardUserId : userId,
        latitude: uni.getStorageSync('latitude'),
        longitude: uni.getStorageSync('longitude')
      };
      this.queryStoreFlag = true;
      const body = await this.$http.post('space/v1/applet/queryStoreList', sendData);
      this.queryStoreFlag = false;
      const { data } = body;
      this.storeList = [...this.storeList, ...data];
      if (this.schoolId !== 370) this.getElHeight(6);
    }
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

  // 获取教练评论
  coachEvaluateList = []

  queryCoachEvaluateFlag = false

  coachEvaluateCurrent = 1;

  async queryCoachEvaluateList() {
    // tab列表有好评才需要请求
    const flag = this.tabList.filter((item) => item.value === 6).length > 0;
    if (flag) {
      const { coachEvaluateCurrent, userId } = this;
      const sendData = {
        current: coachEvaluateCurrent, pageSize: 30, userId: userId || 0
      };
      this.queryCoachEvaluateFlag = true;
      const body = await this.$http.post('user/v1/wechat/queryCoachEvaluatePage', sendData);
      this.queryCoachEvaluateFlag = false;
      const { Data } = body;
      this.coachEvaluateList = [...this.coachEvaluateList, ...Data];
      this.getElHeight(7);
    }
  }

  commentScrolltolower() {
    const { queryCoachEvaluateFlag, queryStoreFlag, current } = this;
    const { id } = this.tabList[current];
    if (id === 6) {
      // 门店
      if (!queryStoreFlag) {
        this.storeCurrent += 1;
        this.queryStoreList();
      }
    }
    if (id === 7) {
      // 评论
      if (!queryCoachEvaluateFlag) {
        this.coachEvaluateCurrent += 1;
        this.queryCoachEvaluateList();
      }
    }
  }

  // 获取分享人用户信息
  userInfoData: any = {}

  async queryCardInfo() {
    // tab列表有名片才需要请求
    const flag = this.tabList.filter((item) => item.value === 1).length > 0;
    if (flag) {
      // 有转发人的id就取转发人的信息
      const { userId, forwardUserId } = this;
      this.userInfoData = await queryNameCardInfo(Number(forwardUserId) > 0 ? forwardUserId : userId);
      // this.queryCodeimg();
      this.getElHeight(1);
      // setTimeout(() => {
      //   const index = this.tabList[0].id;

      // }, 200);
    }
  }

  // 获取教练、客服二维码
  // codeimg = null;

  // async queryCodeimg() {
  //   const { id, userName } = this.userInfoData;
  //   if (id > 0) {
  //     const _sceneId = uni.getStorageSync('sceneId');
  //     const sceneId = await generateSceneId({
  //       dynamicsId: id,
  //       sceneId: _sceneId,
  //       publishExport: 1,
  //       publishFormat: 1,
  //       title: userName,
  //       type: 7
  //     });
  //     this.codeimg = await queryWeChatQRCode({ params: sceneId as string });
  //   }
  // }

  // 查询最新活动列表
  activityList = []

  async queryActivityList(userId) {
    this.activityList = await this.$http.get('sale/v1/mkt/activities/getActivityList', { userId });
  }

  // 下载海报事件处理================================
  @Emit('down-store')
  downloadPoster(data) {
    return data;
  }

  /** 拨打电话 */
  @Emit('callPhoneCallback')
  callPhoneCallback() {
    //
  }

  /** 发消息 */
  @Emit('sendMessageCallback')
  sendMessageCallback() {
    //
  }
}
