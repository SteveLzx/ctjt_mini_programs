import {
  Component, Vue, Prop, Emit, Watch
} from 'vue-property-decorator';
import { queryNameCardInfo } from '@/pages/public/_common/index';
import {
  queryWeChatQRCode,
  generateSceneId,
  schoolName,
  schoolTelephone
} from '@/assets/js/common';
import { schoolId } from '@/config/build_path';

@Component
export default class NameCardInfoIndex extends Vue {
  @Prop({ default: true }) showMobile!: boolean;

  @Prop({ default: '' }) userId!: string;

  @Prop({ default: 0 }) type!: number;

  @Prop({ default: true }) showSendMessage!: boolean;

  defaultImg = () => 'https://file.aicar365.com/mini-program/common/card_default.png';

  mobile = uni.getStorageSync('mobile');

  drivingSchoolName = (uni.getStorageSync('coachInfo') as any).drivingSchoolName;

  userName = (uni.getStorageSync('coachInfo') as any).name;

  cardInfo: any = {};

  defaultMobile = schoolTelephone[schoolId];

  @Watch('userId', { immediate: true })
  async handleWatchUserId(val: string) {
    const cardInfo = await queryNameCardInfo(val, this.type);
    this.cardInfo = cardInfo || {};
    // this.queryCodeimg();
    this.$emit('getCardInfo', this.cardInfo);
  }

  get roleNameFilter() {
    const { userType, roleName } = this.cardInfo;
    if (userType === 3) return '职能人员';
    if (roleName?.length > 6) {
      return `${roleName.substring(0, 6)}...`;
    }
    return roleName;
  }

  get userNameFilter() {
    const { userType, userName } = this.cardInfo;
    return userType === 3 ? schoolName[schoolId] : userName;
  }

  get tagsFilter() {
    const { tags } = this.cardInfo;
    return tags?.filter(a => a.label);
  }

  // 获取教练、客服二维码
  codeimg = null;

  async queryCodeimg() {
    const { id, userName } = this.cardInfo;
    const _sceneId = uni.getStorageSync('sceneId') || '';
    const sceneId = await generateSceneId({
      dynamicsId: id,
      sceneId: _sceneId,
      publishExport: 1,
      publishFormat: 1,
      title: userName,
      type: 7
    });
    this.codeimg = await queryWeChatQRCode({ params: sceneId as string });
  }

  /** 拨打电话 */
  @Emit('callPhoneCallback')
  _callPhone() {
    // 拨打电话
  }

  /** 发消息 */
  @Emit('sendMessageCallback')
  _sendMessage() {
    // 发消息
  }

  jumpEdit() {
    uni.navigateTo({
      url: '/pages/public/name_card/edit',
    });
  }
}
