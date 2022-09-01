import { regTel, makePhoneCall } from '@/assets/js/common';
import { mobileReg } from '@/assets/js/verification_rules';
import {
  Component, Prop, Vue, Emit, Watch
} from 'vue-property-decorator';
import {
  labelStatusFilter,
  typeStatusFilter,
  nameFilter,
  addThreadRecord,
  bmLabelList,
  noyxLabelList,
} from './_common';
import { labelList } from './_enums';

@Component({
  components: {},
  filters: {
    sexFilter(val: number) {
      console.log(val);
      const sex = {
        0: '女',
        1: '男'
      };
      return sex[val] || '';
    },
    fillAddressFilter(val: string) {
      if (val?.length > 15) {
        return `${val.substring(0, 15)}...`;
      }
      return val;
    }
  }
})
export default class ThreadDetailIndex extends Vue {
  @Prop({ required: true }) listFlag!: false;

  defaultImg = () => 'https://file.aicar365.com/mini-program/common/queshengye_banbiexinxi.png';

  // 默认用户头像
  defaultUserImg = () => 'https://file.aicar365.com/mini-program/common/dialogue_xueyuantouxiang.png';

  data: any = {};

  regTel(type: number, tel: string) {
    return regTel(type, tel);
  }

  /** 姓名行显示 */
  nameFilter(item: any) {
    return nameFilter(item);
  }

  /** 标签类别 */
  labelStatusFilter(val: number) {
    return labelStatusFilter(val);
  }

  /** 来源类别 */
  typeStatusFilter(val: number) {
    return typeStatusFilter(val);
  }

  // 当前tab页面下标
  current = 0;

  tabList = [
    { value: 0, label: '用户记录' },
    { value: 1, label: '跟踪记录' },
    { value: 2, label: '用户备注' },
  ];

  handleNavChange(e) {
    this.current = e;
  }

  /** 切换tab时候请求数据 */
  swiperChange(event: any) {
    const { current } = event.detail;
    this.current = current;
    this.threadRecordFlag = false;
    this.remarks = '';
    this.queryThreadRecordList();
  }

  // 计算swiper高度
  swiperHeight = 340;

  /** 获取详情数据 */
  async queryDetail() {
    const { clueId } = this;
    this.data = await this.$http.get(`sale/v1/mkt/clues/${clueId}`);
  }

  // 线索记录列表
  threadRecordList = [];

  threadRecordFlag = false;

  // 线索详情Id
  clueId = '';

  /** 获取用户足迹、跟踪记录、用户备注 */
  async queryThreadRecordList() {
    const { current } = this;
    const apiParam = {
      0: 'sale/v1/mkt/footprints',
      1: 'sale/v1/mkt/trackRecords',
      2: 'sale/v1/mkt/remarks',
    };
    const { userId } = this.data;
    try {
      this.threadRecordList = await this.$http.get(apiParam[current], { userId });
    } catch (error) {
      this.threadRecordList = [];
    }
    this.threadRecordFlag = true;
  }

  /* 下拉刷新 */
  threadTriggered1 = false;

  threadTriggered2 = false;

  threadTriggered3 = false;

  threadBindrefresherrefresh1() {
    this.threadRecordFlag = false;
    this.threadTriggered1 = true;
    this.queryThreadRecordList();
    const timer = setTimeout(() => {
      this.threadTriggered1 = false;
      clearTimeout(timer);
    }, 1000);
  }

  threadBindrefresherrefresh2() {
    this.threadRecordFlag = false;
    this.threadTriggered2 = true;
    this.queryThreadRecordList();
    const timer = setTimeout(() => {
      this.threadTriggered2 = false;
      clearTimeout(timer);
    }, 1000);
  }

  threadBindrefresherrefresh3() {
    this.threadRecordFlag = false;
    this.threadTriggered3 = true;
    this.queryThreadRecordList();
    const timer = setTimeout(() => {
      this.threadTriggered3 = false;
      clearTimeout(timer);
    }, 1000);
  }

  async onLoad(options: any) {
    const clueId = options?.id;
    this.clueId = clueId;
    await this.queryDetail();
    this.queryThreadRecordList();// 获取线索记录
  }

  remarks = '';

  /** 添加用户备注 */
  submitRemarks() {
    const { clueId, remarks } = this;
    const { userId } = this.data;
    if (!remarks || remarks?.length > 200) {
      uni.showToast({
        icon: 'none',
        title: '请输入最多200个字符的备注',
      });
      return;
    }
    addThreadRecord(clueId, userId, 5, { remarks });
    this.remarks = '';
    const timer = setTimeout(() => {
      this.current = 2;
      this.queryThreadRecordList();
      clearTimeout(timer);
    }, 200);
  }

  // 编辑信息
  dialogName = '';

  /** 关闭弹出框 */
  closeDialog() {
    const timer = setTimeout(() => {
      this.dialogName = '';
      clearTimeout(timer);
    }, 200);
  }

  /** 打开编辑信息弹出框 */
  openFormDataDialog() {
    this.dialogName = '用户信息';
    this.bindFormData();
  }

  // 编辑用户信息表单
  private formData: any = {
    fillName: '',
    fillMobile: '',
    fillIdNo: '',
    fillAddress: '',
    fillCarModel: ''
  };

  carModelList = [
    {
      id: 1,
      value: 'C1'
    },
    {
      id: 2,
      value: 'C2'
    },
    {
      id: 3,
      value: 'C5'
    },
    {
      id: 4,
      value: 'A1'
    },
    {
      id: 5,
      value: 'B2'
    },
    {
      id: 6,
      value: 'D'
    },
    {
      id: 7,
      value: 'E'
    }
  ]

  handCarModelRedioActive(val: string) {
    this.formData.fillCarModel = val;
  }

  /** 绑定编辑表单 */
  bindFormData() {
    const {
      name,
      nickname,
      mobile,
      fillName,
      fillMobile,
      fillIdNo,
      fillAddress,
      fillCarModel
    } = this.data;
    this.formData.fillName = fillName || name || nickname;
    this.formData.fillMobile = fillMobile || mobile;
    this.formData.fillIdNo = fillIdNo;
    this.formData.fillAddress = fillAddress;
    this.formData.fillCarModel = fillCarModel;
  }

  /** 编辑用户信息 */
  editUserInfo() {
    const {
      fillName, fillMobile, fillIdNo, fillAddress
    } = this.formData;
    const fillNameLen = fillName?.length;
    const fillIdNoLen = fillIdNo?.length;
    const fillAddressLen = fillAddress?.length;
    if (fillName && fillNameLen > 20) {
      uni.showToast({
        icon: 'none',
        title: '请输入不超过20位字符长度的姓名/称呼',
      });
      return;
    }
    if (fillMobile && !mobileReg.test(fillMobile)) {
      uni.showToast({
        icon: 'none',
        title: '请输入11位手机号码',
      });
      return;
    }
    if (fillIdNo && fillIdNoLen > 18) {
      uni.showToast({
        icon: 'none',
        title: '身份证号码不得超过18个长度',
      });
      return;
    }
    if (fillAddress && fillAddressLen > 60) {
      uni.showToast({
        icon: 'none',
        title: '居住地址不得超过60个长度',
      });
      return;
    }
    const { clueId } = this;
    const {
      userId,
      fillName: oldName,
      fillMobile: oldMobile,
      fillIdNo: oldIdNo,
      fillCarModel: oldCarModel,
      fillAddress: oldAddress
    } = this.data;
    const sendData = {
      clueId,
      oldName,
      oldMobile,
      oldIdNo,
      oldCarModel,
      oldAddress,
      ...this.formData,
    };
    try {
      addThreadRecord(clueId, userId, 4, sendData);
      uni.showToast({
        icon: 'none',
        title: '保存成功',
      });
      const timer = setTimeout(() => {
        this.queryDetail();
        clearTimeout(timer);
      }, 200);
    } catch (error) {
      //
    }
    this.closeDialog();
  }

  /** 打开修改标签弹出框 */
  openLabelFormDataDialog() {
    this.dialogName = '修改标签';
    this.editLabelForm.label = 0;
    this.editLabelForm.reason = '';
  }

  editLabelForm: any = {
    label: null,
    reason: ''
  };

  // 潜客
  qiankeLabelList = labelList.filter(a => a.id === 2);

  // 已报名
  baominLabelList = bmLabelList;

  // 无意向
  noyixiangLabelList = noyxLabelList;

  handLabelRedioActive(val: number) {
    this.editLabelForm.label = val;
  }

  /** 修改标签 */
  editLabel() {
    const { editLabelForm, data, clueId } = this;
    const reasonLen = editLabelForm.reason?.length;
    if (editLabelForm.reason && (reasonLen < 5 || reasonLen > 100)) {
      uni.showToast({
        icon: 'none',
        title: '请输入5-100位字符长度的原因',
      });
      return;
    }
    const sendData = { ...editLabelForm };
    addThreadRecord(clueId, data.userId, 1, sendData);
    const timer = setTimeout(() => {
      this.queryDetail();
      clearTimeout(timer);
    }, 200);
    this.closeDialog();
  }

  /** 拨打电话 */
  callPhone(userId: any, mobile: string) {
    if (this.$platFormPc) {
      uni.showToast({
        icon: 'none',
        title: '请在手机端操作此功能',
      });
      return;
    }
    makePhoneCall(mobile);
    const { clueId } = this;
    addThreadRecord(clueId, userId, 3);
  }

  /** 发消息 */
  sendMsg(userId: any, userImId: string) {
    uni.navigateTo({
      url: `../../../package_im/pages/TUI-Chat/chat?conversationID=C2C${userImId}`,
    });
    const { clueId } = this;
    addThreadRecord(clueId, userId, 2);
  }
}
