import { mobileReg } from '@/assets/js/verification_rules';
import {
  Component, Vue, Watch
} from 'vue-property-decorator';
import {
  addThreadRecord,
  labelStatusFilter,
  nameFilter,
} from './_common';

@Component
export default class ThreadIndex extends Vue {
  // 默认用户头像
  defaultUserImg = () => 'https://file.aicar365.com/mini-program/common/dialogue_xueyuantouxiang.png';

  defaultImg = () => 'https://file.aicar365.com/mini-program/common/queshengye_banbiexinxi.png';

  tabIndex = 1;

  tabList = [
    { value: 1, label: '商机' },
    { value: 2, label: '潜客' },
    { value: 3, label: '招生' },
  ];

  swiperChange(event: any) {
    this.tabIndex = event.detail.current + 1;
    this.cluesFlag = false;
    this.queryCluesList();
  }

  handleNavChange(e) {
    this.tabIndex = e + 1;
  }

  // 计算swiper高度
  swiperHeight = 0;

  getElHeight() {
    const query = uni.createSelectorQuery();
    query
      .selectAll('.el_height')
      .boundingClientRect((rect) => {
        if (rect instanceof Array) {
          uni.getSystemInfo({
            success: (res) => {
              let elHeight = 0;
              rect.forEach((item) => {
                elHeight += item.height;
              });
              this.swiperHeight = res.windowHeight - elHeight; // 计算外层swiper高度
            },
          });
        }
      })
      .exec();
  }

  cluesList = [];

  cluesFlag = false;

  async queryCluesList() {
    this.cluesList = await this.$http.get('sale/v1/mkt/clues', {
      type: this.tabIndex,
    });
    this.cluesFlag = true;
  }

  threadTriggered1 = false;

  threadTriggered2 = false;

  threadTriggered3 = false;

  threadBindrefresherrefresh1() {
    this.cluesFlag = false;
    this.threadTriggered1 = true;
    this.queryCluesList();
    const timer = setTimeout(() => {
      this.threadTriggered1 = false;
      clearTimeout(timer);
    }, 1000);
  }

  threadBindrefresherrefresh2() {
    this.cluesFlag = false;
    this.threadTriggered2 = true;
    this.queryCluesList();
    const timer = setTimeout(() => {
      this.threadTriggered2 = false;
      clearTimeout(timer);
    }, 1000);
  }

  threadBindrefresherrefresh3() {
    this.cluesFlag = false;
    this.threadTriggered3 = true;
    this.queryCluesList();
    const timer = setTimeout(() => {
      this.threadTriggered3 = false;
      clearTimeout(timer);
    }, 1000);
  }

  onLoad(options: any) {
    const tab = options?.tab;
    this.tabIndex = Number(tab) || this.tabIndex;
    this.queryCluesList();
    this.$nextTick(() => this.getElHeight());
  }

  // 弹出框显示
  private show = false;

  // 弹出框名字
  private title = '';

  // 默认用户信息
  private userInfo: any = {};

  /** 打开用户足迹、跟踪记录、用户备注、用户信息弹框 */
  openDialog(val: any) {
    const {
      text,
      userId,
      name,
      mobile,
      wxNo,
      fillName,
      fillMobile,
      fillWxNo,
      openId,
      label,
    } = val;
    this.title = text;
    this.show = true;
    this.userInfo = {
      userId,
      name,
      mobile,
      wxNo,
      fillName,
      fillMobile,
      fillWxNo,
      openId,
      label,
    };
  }

  /** 关闭弹出框 */
  closeDialog() {
    const timer = setTimeout(() => {
      this.show = false;
      if (this.title === '用户信息') {
        Object.keys(this.formData).forEach((key) => {
          this.formData[key] = null;
        });
      }
      if (this.title === '用户备注') {
        this.remarks = '';
      }
      clearTimeout(timer);
    }, 200);
  }

  // 编辑用户信息表单
  private formData: any = {
    fillName: '',
    fillMobile: '',
    fillWxNo: '',
  };

  /** 编辑用户信息 */
  editUserInfo() {
    const { fillName, fillMobile, fillWxNo } = this.formData;
    const fillNameLen = fillName?.length;
    const fillWxNoLen = fillWxNo?.length;
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
    if (fillWxNo && fillWxNoLen > 20) {
      uni.showToast({
        icon: 'none',
        title: '微信号不得超过20个长度',
      });
      return;
    }

    const {
      userId, fillName: oldName, fillMobile: oldMobile, fillWxNo: oldWxNo
    } = this.userInfo;
    const sendData = {
      oldName,
      oldMobile,
      oldWxNo,
      ...this.formData,
    };
    try {
      addThreadRecord(userId, 4, sendData);
      uni.showToast({
        icon: 'none',
        title: '保存成功',
      });
    } catch (error) {
      //
    }
    this.closeDialog();
    this.queryCluesList();
  }

  private labelStatusFilter(val: number) {
    return labelStatusFilter(val);
  }

  private nameFilter(item: any) {
    return nameFilter(item);
  }

  recordData: any = [];

  /** 获取用户足迹、跟踪记录、用户备注 */
  async queryRecordList(title: string) {
    const apiParam = {
      用户足迹: 'sale/v1/mkt/footprints',
      跟踪记录: 'sale/v1/mkt/trackRecords',
      用户备注: 'sale/v1/mkt/remarks',
    };
    const { userId } = this.userInfo;
    try {
      this.recordData = await this.$http.get(apiParam[title], { userId });
    } catch (error) {
      this.recordData = [];
    }
  }

  remarks = '';

  remarksSubDisabled = true;

  @Watch('remarks', { deep: true })
  onRemarksChange(newVal: string) {
    this.remarksSubDisabled = !newVal;
  }

  /** 添加用户备注 */
  async submitRemarks() {
    const { userId } = this.userInfo;
    const { remarks } = this;
    if (!remarks || remarks?.length > 200) {
      uni.showToast({
        icon: 'none',
        title: '请输入最多200个字符的备注',
      });
      return;
    }
    await this.$http.post('sale/v1/mkt/remarks', { userId, remarks });
    this.closeDialog();
  }

  @Watch('show')
  onShowChange(newVal: boolean) {
    if (newVal) {
      const { title } = this;
      if (title !== '用户信息') {
        this.queryRecordList(title);
      } else {
        // 用户信息绑定值
        this.bindUserInfo();
      }
    }
  }

  bindUserInfo() {
    const { fillName, fillMobile, fillWxNo } = this.userInfo;
    this.formData.fillName = fillName;
    this.formData.fillMobile = fillMobile;
    this.formData.fillWxNo = fillWxNo;
  }
}
