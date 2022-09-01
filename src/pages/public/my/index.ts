import { Component, Vue } from 'vue-property-decorator';
import {
  verifyTelAccredit,
  regTel,
  queryWeChatQRCode,
  generateSceneId,
  schoolName,
  schoolTelephone,
  getUserProfile
} from '@/assets/js/common';
import { getGlobalData } from '@/assets/js/global_data';
import { schoolId } from '@/config/build_path';
import getShareCard from './get_canvas';
import { queryNameCardInfo } from '../_common/index';

type UniExpand = {
  getUserProfile: any;
} & UniApp.Uni;

@Component
export default class MineIndex extends Vue {
  authFlag = false;

  showDownloadPoster = false;

  downloadPosterData = { detail: {}, type: 7 };

  defaultMobile = schoolTelephone[schoolId];

  schoolId = schoolId;

  grMenu = [
    {
      name: '我的排班',
      key: 'arrange',
      icon: '&#xe6a6;'
    }, {
      name: '我的带教',
      key: 'teaching',
      icon: '&#xe6a9;'
    }, {
      name: '我的加钟',
      key: 'overtime',
      icon: '&#xe694;'
    }, {
      name: '我的学员',
      key: 'student',
      icon: '&#xe6a5;'
    }, {
      name: '学员查询',
      key: 'search',
      icon: '&#xe6a4;'
    }
  ];

  menuOptions = [
    {
      name: '我的订单',
      key: 1,
      isStudent: true,
      icon: '&#xe6a6;',
      hidden: true,
    },
    {
      name: '我的卡券',
      key: 2,
      isStudent: true,
      icon: '&#xe6aa;',
      schoolHidden: [638]
    },
    {
      name: '切换角色',
      key: 3,
      icon: '&#xe6a4;',
      auth: true,
      hidden: true,
    },
    {
      name: '关注服务号',
      key: 4,
      icon: '&#xe6a8;',
    },
    {
      name: '意见反馈',
      key: 5,
      icon: '&#xe6a7;',
    }
  ];

  isStudent = !uni.getStorageSync('isCoach');

  mobile = uni.getStorageSync('mobile');

  userId = uni.getStorageSync('userId');

  wechatUserInfo: any = { avatarUrl: '' };

  roleName = '';

  shareVisible = false; // 分享自定义

  shareContent = {};

  // 默认用户头像
  defaultUserImg = () => 'https://file.aicar365.com/mini-program/common/dialogue_xueyuantouxiang.png';

  defaultShengang = () => `https://file.aicar365.com/mini-program/${schoolId}/common/headportrait_normal.png`;

  // 名片信息
  private cardInfo: any = {};

  async onShow() {
    uni.setNavigationBarTitle({
      title: '我的'
    });
    // 校验是否已绑定手机号
    if (uni.getStorageSync('mobile')) this.authFlag = true;
    if (!this.isStudent) {
      // 解决编辑后返回我的-主页出现没有更新名片信息的问题
      this.getCoachInfo();
    }
    this.wechatUserInfo = uni.getStorageSync('wechatUserInfo') || { avatarUrl: '' };
  }

  async onReady() {
    const $emitter = getGlobalData('$emitter');
    $emitter.on('authorize', async (flag: boolean) => {
      this.authFlag = flag;
      this.mobile = uni.getStorageSync('mobile');
      this.isStudent = !uni.getStorageSync('isCoach');
      this.userId = uni.getStorageSync('userId');
      if (!this.isStudent) {
        this.getCoachInfo();
      }
    });
  }

  async getCoachInfo() {
    this.cardInfo = await queryNameCardInfo(this.userId);
    this.roleName = this.cardInfo.roleName;
    this.downloadPosterData.detail = this.cardInfo;
    this.getStatics();
  }

  codeimg = null;

  /** 获取教练、客服二维码 */
  async queryCodeimg() {
    const { id } = this.cardInfo;
    if (!id || id === '0') return;
    const sceneId = uni.getStorageSync('sceneId') || await this.productSceneId();
    this.codeimg = await queryWeChatQRCode({ params: sceneId as string });
  }

  // 获取菜单列表 isStudent: 学员端特有; hidden: 隐藏菜单
  get menuList() {
    return this.menuOptions.filter(
      (res) => (!res.isStudent || res.isStudent === Boolean(this.isStudent))
        && (!res.auth || res.auth === this.authFlag)
        && !res.hidden && (!res.schoolHidden || !res.schoolHidden.includes(schoolId))
    );
  }

  /** 跳转到编辑名片界面/名片详情界面 */
  jumpPage(type: string) {
    if (type === 'index' && !this.wechatUserInfo.avatarUrl && this.cardInfo.userType !== 3) {
      getUserProfile().then(res => {
        this.wechatUserInfo = res;
        uni.navigateTo({
          url: `/pages/public/name_card/${type}`,
        });
      }).catch(() => {
        uni.navigateTo({
          url: `/pages/public/name_card/${type}`,
        });
      });
      return;
    }
    uni.navigateTo({
      url: `/pages/public/name_card/${type}`,
    });
  }

  getUserInfo() {
    getUserProfile().then(res => {
      this.wechatUserInfo = res;
    });
  }

  get roleNameFilter() {
    const { userType, roleName } = this.cardInfo;
    if (userType === 3) return '职能人员';
    if (roleName?.length > 15) {
      return `${roleName.substring(0, 15)}...`;
    }
    return roleName;
  }

  elementTracker(clickInfo) {
    console.log(clickInfo);
  }

  // 授权手机号回调
  verifyTelAccredit(e: any) {
    // 新注册
    verifyTelAccredit(e);
  }

  regTel(type: number) {
    return regTel(type, this.mobile);
  }

  downloadCard() {
    if (!this.cardInfo || !this.cardInfo.id || this.cardInfo.id === '0') {
      uni.showToast({
        icon: 'none',
        title: '请先编辑名片'
      });
      return;
    }
    this.showDownloadPoster = true;
  }

  grClick(key) {
    uni.navigateTo({
      url: `/pages/public/my/gr_menu/${key}/index?userId=${this.cardInfo.empId}`,
    });
  }

  menuClick(key: number) {
    if (key === 2) {
      // 我的卡券
      uni.navigateTo({
        url: '/pages/public/card_voucher/index',
      });
    }
    if (key === 3) {
      uni.showModal({
        title: '提示',
        content: `确定切换为${this.isStudent ? '教练端' : '学员端'}`,
        success: (res) => {
          if (res.confirm) {
            this.isStudent = !this.isStudent;
            uni.setStorageSync('isCoach', !this.isStudent);
          }
        },
      });
    }
    if (key === 4) {
      // 关注服务号
      uni.navigateTo({
        url: '/pages/public/attention_services_number/index',
      });
    }
  }

  toPublish() {
    uni.switchTab({
      url: '/pages/public/dynamic/index'
    });
  }

  toJump(type: number) {
    uni.reLaunch({
      url: `/pages/public/thread_new/index?tab=${type}`
    });
  }

  // 统计数据
  dealCount = 0;

  publishCount = 0;

  relationCount = 0;

  async getStatics() {
    try {
      const { dealCount, publishCount, relationCount } = await this.$http.get('sale/v1/mkt/statistics');
      this.dealCount = dealCount || 0;
      this.publishCount = publishCount || 0;
      this.relationCount = relationCount || 0;
    } catch (error) {
      console.log(error);
    }
  }

  /** 生成sceneId */
  productSceneId() {
    return new Promise(resolve => {
      const { id, userId, userName } = this.cardInfo;
      generateSceneId({
        dynamicsId: id || userId,
        publishExport: 1,
        publishFormat: 1,
        title: Number(this.cardInfo.userType) === 3 ? schoolName[schoolId] : userName,
        type: 7
      }).then(sceneId => {
        resolve(sceneId);
      });
    });
  }

  async share() {
    if (this.$platFormPc) {
      uni.showToast({
        icon: 'none',
        title: '请在手机端操作此功能'
      });
      return;
    }
    uni.showLoading({ title: '' });
    const { id } = this.cardInfo;
    if (!id || id === '0') {
      uni.showToast({
        icon: 'none',
        title: '请先编辑名片'
      });
      return;
    }
    let imageUrl: any = '';
    // const title = `您好，我是${this.cardInfo.userType !== 3 ? this.cardInfo.userName : schoolName[schoolId]}。这是我的名片，请惠存！`;
    const title = '找我学车价格透明拿证快～!';
    const sceneId = await this.productSceneId();
    this.shareContent = {};
    if (this.authFlag && !this.isStudent) {
      imageUrl = await getShareCard(this.cardInfo, this);
      uni.hideLoading();
      this.shareContent = {
        title,
        path: `/pages/public/dynamic/publish/share_landingpage?scene=${sceneId}`,
        imageUrl,
      };
    }
    this.shareVisible = true;
  }

  async onShareAppMessage() {
    return this.shareContent;
  }
}
