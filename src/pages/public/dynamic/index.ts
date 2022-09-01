import { Vue, Component } from 'vue-property-decorator';
import { generateSceneId, schoolName } from '@/assets/js/common';
import { queryNameCardInfo } from '@/pages/public/_common/index';
import getShareCard from '@/pages/public/my/get_canvas';
import { schoolId } from '@/config/build_path';
import { proImgDomain } from '@/assets/js/config';

@Component
export default class Index extends Vue {
  defaultImg= () => 'https://file.aicar365.com/mini-program/common/queshengye_banbiexinxi.png';

  created() {
    uni.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    });
    this.queryReceivedScenesList();
    this.queryPublishScenesList();
    this.$nextTick(() => this.getElHeight());
  }

  onLoad(options) {
    const { tab } = options;
    this.current = Number(tab) === 2 ? 1 : 0;
  }

  // 轮播高度
  swiperHeight = 0;

  // 动态获取高度
  getElHeight() {
    uni.getSystemInfo({
      success: (res) => {
        this.swiperHeight = res.windowHeight - 44;
      },
    });
  }

  handleSwiperChange(e) {
    const { current } = e.detail;
    this.current = current;
  }

  // tab切换begin
  tabList = [
    { value: 0, label: '已收到' },
    { value: 1, label: '已发布' }
  ];

  handleNavChange(e) {
    this.current = e;
  }

  // 当前tab页面下标
  current = 0;

  // 已收到================================
  receivedScenesList = []

  queryReceivedScenesFlag = false;

  async queryReceivedScenesList() {
    this.receivedScenesList = await this.$http.get('sale/v1/mkt/receivedScenes');
    this.queryReceivedScenesFlag = true;
  }

  receivedScenesTriggered = false;

  async refresherreReceivedScenesList() {
    this.receivedScenesTriggered = true;
    await this.queryReceivedScenesList();
    const timer = setTimeout(() => {
      this.receivedScenesTriggered = false;
      clearTimeout(timer);
    }, 1000);
  }

  // 已发布================================
  publishScenesList = []

  queryPublishScenesFlag = false;

  async queryPublishScenesList() {
    this.publishScenesList = await this.$http.get('sale/v1/mkt/publishScenes');
    this.queryPublishScenesFlag = true;
  }

  publishScenesTriggered = false;

  async refresherrePublishScenesList() {
    this.publishScenesTriggered = true;
    await this.queryPublishScenesList();
    const timer = setTimeout(() => {
      this.publishScenesTriggered = false;
      clearTimeout(timer);
    }, 1000);
  }

  // 下载海报弹框是否出现
  showDownloadPoster = false;

  // 海报生成数据配置
  downloadPosterData = {};

  // 下载
  async downloadSharePoster(params) {
    const {
      type, dynamicsId, id, originalTitle, userName, mobile, url, userType
    } = params;
    const locUserType = uni.getStorageSync('userType'); // 自己的userType
    let _cardName = '';
    let _mobile = '';
    if (locUserType !== 2) {
      if (userType === 2) {
        _cardName = userName;
        _mobile = mobile;
      }
    }
    if (type === 7) {
      const cardInfo: any = await queryNameCardInfo(dynamicsId, 1);
      this.downloadPosterData = {
        detail: {
          ...cardInfo,
          sceneId: id,
        },
        type,
      };
      this.showDownloadPoster = true;
    } else {
      // 如果自己是教练客服，取自己的，不是取上一级的
      let photoUrlMain = url;
      let _data: any = {};
      if ([2, 3, 4].includes(type)) {
        if (type === 2) {
          _data = await this.$http.get('space/v1/applet/queryStoreForAppletById', { id: dynamicsId });
          const sendData = {
            ..._data,
            id: dynamicsId,
            sceneId: id,
            cardName: _cardName,
            mobile: _mobile,
            photoUrlMain,
            url,
          };
          this.downloadPosterData = {
            detail: sendData,
            type,
          };
          this.showDownloadPoster = true;
        } else if (type === 3) {
          _data = await this.$http.get('space/v1/applet/queryTrainingPlaceForAppletById', { id: dynamicsId });
          const sendData = {
            ..._data,
            id: dynamicsId,
            sceneId: id,
            cardName: _cardName,
            mobile: _mobile,
            photoUrlMain,
            url,
          };
          this.downloadPosterData = {
            detail: sendData,
            type,
          };
          this.showDownloadPoster = true;
        } else if (type === 4) {
          _data = await this.$http.get('goods/applet/v1/queryClassByID', { id: dynamicsId });
          const sendData = {
            ..._data,
            id: dynamicsId,
            sceneId: id,
            cardName: _cardName,
            mobile: _mobile,
            photoUrlMain,
            url,
          };
          this.downloadPosterData = {
            detail: sendData,
            type,
          };
          this.showDownloadPoster = true;
        }
      }
      if ([5, 6, 99].includes(type)) {
        if (type === 5) {
          photoUrlMain = 'https://file.aicar365.com/mini-program/common/share_poster_fx.jpg';
        } else if (type === 6) {
          photoUrlMain = 'https://file.aicar365.com/mini-program/common/share_poster_lj.jpg';
        } else if (type === 99) {
          photoUrlMain = schoolId === 370 ? 'https://file.aicar365.com/mini-program/common/share_poster_lj.jpg' : 'https://file.aicar365.com/mini-program/common/dongtai_yqxc.jpg';
        }
        const sendData = {
          id: dynamicsId,
          sceneId: id,
          name: originalTitle,
          cardName: _cardName,
          mobile: _mobile,
          photoUrlMain,
          url: '',
        };
        this.downloadPosterData = {
          detail: sendData,
          type,
        };
        this.showDownloadPoster = true;
      }
    }
  }

  // 分享
  async onShareAppMessage(params: any) {
    const { from, target } = params;
    const { type, detail } = target.dataset;
    if (from === 'button') {
      const {
        dynamicsId, id, originalTitle, url
      } = detail;
      let imageUrl: any = '';
      let title = '';
      const sendData = {
        dynamicsId,
        sceneId: id,
        publishExport: 1,
        publishFormat: 1,
        title: originalTitle,
        type,
        url: [5, 6, 7, 99].includes(type) ? '' : url
      };
      const sceneId = await generateSceneId(sendData);
      if (type === 7) {
        const cardInfo = await queryNameCardInfo(dynamicsId, 1);
        imageUrl = await getShareCard(cardInfo, this);
        title = '找我学车价格透明拿证快~!';
      } else {
        switch (type) {
          case 2:
            title = '查看学车门店,另有门店密布全市！';
            imageUrl = proImgDomain + url;
            break;
          case 3:
            title = '查看训练场,另有训练场密布全市！';
            imageUrl = proImgDomain + url;
            break;
          case 4:
            title = '包接送、包考试费、包补考费';
            imageUrl = proImgDomain + url;
            break;
          case 5:
            title = `${schoolName[schoolId]}活动`;
            imageUrl = 'https://file.aicar365.com/mini-program/common/share_card_fx.png';
            break;
          case 6:
            title = `${schoolName[schoolId]}活动`;
            imageUrl = 'https://file.aicar365.com/mini-program/common/share_card_lj.png';
            break;
          case 99:
            title = `${schoolName[schoolId]}活动`;
            imageUrl = schoolId === 370 ? 'https://file.aicar365.com/mini-program/common/share_card_lj.png' : 'https://file.aicar365.com/mini-program/common/share_card_yqxc.jpg';
            break;
          default:
            imageUrl = '';
            break;
        }
      }
      return {
        // title: `转发了${originalTitle}${type === 7 ? '' : '的相关介绍'}，马上查看一下吧`,
        title,
        path: `/pages/public/dynamic/publish/share_landingpage?scene=${sceneId}`,
        imageUrl
      };
    }
    return { };
  }
}
