import { Component, Vue } from 'vue-property-decorator';
import { nickNameReg } from '@/assets/js/verification_rules';
import { putUploadFiles, getUploadFiles } from '@/assets/js/upload_oss';
import getPressImage from '@/assets/js/press_utils';
import { queryNameCardInfo } from '../_common/index';

@Component
export default class EditNameCardIndex extends Vue {
  private formData: any = {
    visitorId: '',
    userType: null,
    icon: '',
    userName: '',
    sex: 1,
    mobile: '',
    wechatId: '',
    email: '',
    about: '', // 个人介绍
    drivingSchoolName: '',
    storeName: '',
    trainingPlaceName: '',
    roleName: '', // 职位
    subjects: [], // 带教科目
    carModel: [], // 车型
    tags: [
      {
        label: '带教年限',
        value: '',
      },
      {
        label: '毕业学员',
        value: '',
      },
      {
        label: '合格率',
        value: '',
      },
      {
        label: '好评率',
        value: '',
      },
      {
        label: '五星教练',
        value: '',
      },
    ],
  };

  private sexList = [
    {
      id: 0,
      label: '未知',
    },
    {
      id: 1,
      label: '男',
    },
    {
      id: 2,
      label: '女',
    },
    {
      id: 3,
      label: '其他',
    },
  ];

  // 带教科目 list
  private subjectsList = [
    {
      id: 2,
      label: '科目二',
    },
    {
      id: 3,
      label: '科目三',
    },
  ];

  /** 带教科目复选 */
  handSubjectActive(val: any) {
    if (this.formData.subjects.includes(val)) {
      // 反选的
      this.formData.subjects = this.formData.subjects.filter(
        (ele) => ele !== val
      );
    } else {
      // 选中的
      this.formData.subjects.push(val);
    }
  }

  // 带教科目 list
  private carModelList = [
    {
      id: 1,
      label: 'C1',
    },
    {
      id: 2,
      label: 'C2',
    },
  ];

  /** 车型复选 */
  handCarModelActive(val: any) {
    if (this.formData.carModel.includes(val)) {
      // 反选的
      this.formData.carModel = this.formData.carModel.filter(
        (ele) => ele !== val
      );
    } else {
      // 选中的
      this.formData.carModel.push(val);
    }
  }

  /** 从相册选择上传头像 */
  uploadAvatar() {
    uni.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      success: (res) => {
        const icon = res.tempFilePaths?.[0];
        console.log(icon);
        getPressImage('#avatarCanvas', icon).then((imageUrl: string) => {
          console.log('imageUrl:', imageUrl);
          putUploadFiles(imageUrl, 'head_pic').then((filename: any) => {
            // 获取头像
            this.formData.icon = getUploadFiles(filename, 'head_pic');
            console.log('imageUrl:', this.formData.icon);
          });
        });
      },
    });
  }

  /** 保存名片数据 */
  async submit() {
    const {
      // userName,
      // sex,
      // mobile,
      wechatId,
      about,
      // drivingSchoolName,
      // roleName,
      tags,
    } = this.formData;
    // if (!nickNameReg.test(userName) || !userName) {
    //   uni.showToast({
    //     icon: 'none',
    //     title: '请输入2-10位字符长度的中英文姓名/称呼',
    //   });
    //   return;
    // }
    // if (!mobile) {
    //   uni.showToast({
    //     icon: 'none',
    //     title: '获取电话号码失败',
    //   });
    //   return;
    // }
    if (wechatId?.length > 20) {
      uni.showToast({
        icon: 'none',
        title: '请输入最多20个字符的微信号',
      });
      return;
    }
    if (!about || about?.length > 100) {
      uni.showToast({
        icon: 'none',
        title: '请输入最多100个字符的个人介绍',
      });
      return;
    }
    // if (!drivingSchoolName) {
    //   uni.showToast({
    //     icon: 'none',
    //     title: '获取所属企业失败',
    //   });
    //   return;
    // }
    // if (!roleName) {
    //   uni.showToast({
    //     icon: 'none',
    //     title: '获取职位失败',
    //   });
    //   return;
    // }
    // if (sex === null) {
    //   uni.showToast({
    //     icon: 'none',
    //     title: '获取性别失败',
    //   });
    //   return;
    // }
    let labelValid = true;
    tags.forEach((item: any) => {
      const labelLen = item.label?.length;
      const valueLen = item.value?.length;
      if (labelLen > 4 || valueLen > 4) {
        labelValid = false;
      }
    });
    if (!labelValid) {
      uni.showToast({
        icon: 'none',
        title: '自定义标签最多输入4位字符',
      });
      return;
    }
    const sendData = {
      ...this.formData,
    };

    delete sendData.roleName;
    this.$http.post('user/v1/wechat/updateCardInfo', sendData);
    uni.showToast({
      icon: 'none',
      title: '保存成功',
    });

    uni.navigateBack({
      delta: 1
    });
  }

  private cardInfo = {};

  /** 获取名片信息 */
  async queryNameCardInfo() {
    const userId = uni.getStorageSync('userId');
    this.formData = await queryNameCardInfo(userId);
    const {
      subjects, carModel, userType, roleName
    } = this.formData;
    this.formData.subjects = subjects || [];
    this.formData.carModel = carModel || [];
    this.formData.visitorId = userId;
    if (userType === 3) { this.formData.roleName = '职能人员'; } else this.formData.roleName = roleName;
  }

  /** 处理tags默认值显示 */
  dealTags() {
    const tags = JSON.parse(JSON.stringify(this.formData.tags));
    const tagList = [];
    tags.forEach((item, i) => {
      const _item = item;
      const valueArry = {
        0: '五年+',
        1: '2600',
        2: '99%',
        3: '99%',
        4: ''
      };
      _item.value = !_item.value ? valueArry[i] : _item.value;
      tagList.push(_item);
    });
    this.formData.tags = tagList;
  }

  onShow() {
    this.queryNameCardInfo();
  }
}
