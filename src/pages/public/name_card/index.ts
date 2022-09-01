import { Component, Vue } from 'vue-property-decorator';
import { generateSceneId, getMainFromPhotoJson, schoolName } from '@/assets/js/common';
import { getStoreCard, getClassCard } from '@/pages/public/home_new/get_canvas';
import { queryNameCardInfo } from '@/pages/public/_common/index';
import getShareCard from '@/pages/public/my/get_canvas';
import { schoolId } from '@/config/build_path';

@Component
export default class NameCardIndex extends Vue {
  // type = 7;

  schoolId = uni.getStorageSync('schoolId') || schoolId;

  userId = uni.getStorageSync('userId');

  sceneId = uni.getStorageSync('sceneId');

  // 下载
  showDownloadPoster = false;

  downloadPosterData = { detail: {}, type: 7 };

  onShow() {
    /** 开启微信分享到好友和朋友圈 可以写在公共组件里面 */
    uni.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    });
    (this.$refs as any).nameCardInfoRef.handleWatchUserId(this.userId);
  }

  cardInfo = {};

  getCardInfo(cardInfo: any) {
    this.cardInfo = cardInfo;
    this.downloadPosterData.detail = cardInfo;
  }

  // 班别,门店,训练场列表下载海报
  // downStore(data) {
  //   console.log(data);
  //   const { type, detail, source } = data;
  //   if (source === 'list') {
  //     const scene = uni.getStorageSync('sceneId');
  //     const { id } = detail;
  //     let imageUrl: any = '';
  //     let title: any = '';
  //     // 分享班别
  //     if (type === 4) {
  //       imageUrl = detail.photoUrl;
  //       title = detail.appName;
  //     }
  //     // 训练场
  //     // 门店
  //     if (type === 3 || type === 2) {
  //       imageUrl = type === 3 ? getMainFromPhotoJson(detail.photoUrl) : getMainFromPhotoJson(detail.image);
  //       title = detail.name;
  //     }
  //     const sendData = {
  //       id,
  //       sceneId: scene,
  //       name: title,
  //       photoUrlMain: imageUrl,
  //       url: imageUrl
  //     };

  //     this.downloadPosterData = {
  //       detail: sendData,
  //       type,
  //     };
  //     console.log('downloadPosterData-list', this.downloadPosterData);
  //     this.showDownloadPoster = true;
  //   }
  // }

  // 分享
  async onShareAppMessage(params: any) {
    const { from, target } = params;
    const scene = uni.getStorageSync('sceneId');
    const userId = uni.getStorageSync('coachInfo').userId;
    if (from === 'menu' || (target.dataset && target.dataset.type === 7)) {
      const cardInfo: any = await queryNameCardInfo(userId);
      const { userName, id, userType } = cardInfo;
      const imageUrl = await getShareCard(cardInfo, this);
      const sendData = {
        dynamicsId: id,
        sceneId: scene,
        publishExport: 1,
        publishFormat: 1,
        title: userType !== 3 ? userName : schoolName[schoolId],
        type: 7
      };
      const sceneId = await generateSceneId(sendData);
      return {
        title: `您好，我是${userType !== 3 ? userName : schoolName[schoolId]}。这是我的名片，请惠存！`,
        path: `/pages/public/dynamic/publish/share_landingpage?scene=${sceneId}`,
        imageUrl
      };
    }

    const { type, detail, source } = target.dataset;
    let imageUrl: any = '';
    let url: any = '';
    let dynamicsId: any = '';
    let title: any = '';
    if (source === 'list') {
      // 列表分享
      if (type === 4) {
        const { id, appName, photoUrl } = detail;
        dynamicsId = id;
        title = appName;
        url = photoUrl;
        imageUrl = await getClassCard(detail, this);
      }
      if (type === 2 || type === 3) {
        const {
          id, name, photoUrl, image
        } = detail;
        dynamicsId = id;
        title = name;
        url = type === 2 ? getMainFromPhotoJson(image) : getMainFromPhotoJson(photoUrl);
        imageUrl = await getStoreCard(detail, this);
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
      title: `发布了${title}的相关介绍，马上查看一下吧`,
      path: `/pages/public/dynamic/publish/share_landingpage?scene=${sceneId}`,
      imageUrl
    };
  }
}
