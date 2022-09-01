<template>
  <view class="content">
    <!-- tab切换 -->
    <view class="tab_section">
      <view :class="['tab_label', 'active']" @click="tabIndex=1">
        <text class="label">身份证信息</text>
        <text class="icon_bg1 iconfont" @click.stop="toast">&#xe6b0;</text>
        <image class="icon" :src="svgSign" @click.stop="toast"></image>
      </view>
      <view :class="['tab_label tab_label2', { 'active': tabIndex === 2 }]" @click="toNext">
        <text class="label">学车类型</text>
      </view>
    </view>
    <view class="content_body">
      <!-- 自动扫描身份证 -->
      <view class="scan_idcard_section" v-show="tabIndex===1 && showSectionName==='scanIDCard'">
        <view class="tips_bg">
          <image class="img" :src="idCardBg"></image>
        </view>
        <view class="opt_btns">
          <ocr-navigator @onSuccess="success" certificateType="idCard" :opposite="false">
            <button class="btn">扫描身份证信息报名</button>
          </ocr-navigator>
        </view>
        <view class="no_saomiao">
          <text class="text">身份证不在身边？</text>
          <text class="btn" @click="showSectionName='inputIDCard'">手动输入</text>
        </view>
      </view>
      <!-- 手动输入身份证 -->
      <view class="input_idcard_section" v-show="tabIndex===1 && showSectionName==='inputIDCard'">
        <form>
          <view class="form_item">
              <view class="tit">身份证号码</view>
              <input class="form_input" placeholder-style="color:#999" type="idcard" placeholder="请输入" v-model.trim="formData.idNo" maxlength="18"/>
          </view>
          <view class="form_item">
              <view class="tit">姓名</view>
              <input class="form_input" placeholder-style="color:#999" placeholder="请输入" v-model.trim="formData.name" maxlength="10"/>
          </view>
          <view class="form_item" style="align-items: end">
              <view class="tit">身份证地址</view>
              <textarea class="form_textarea" auto-height="true" maxlength="59" placeholder-style="color:#999" placeholder="请输入" v-model.trim="formData.certificateAddress"/>
          </view>
        </form>
        <!-- 报错提示处 -->
        <view class="err_tips">{{partOneWarn}}</view>
        <!-- 操作按钮 -->
        <view class="opt_btns">
          <ocr-navigator @onSuccess="success" certificateType="idCard" :opposite="false" v-if="isScanCard">
            <button class="btn" style="margin-left:0">重新扫描</button>
          </ocr-navigator>
          <button class="btn" v-if="!isScanCard" @click="showSectionName='scanIDCard'">自动扫描身份证</button>
          <button class="btn next" @click="toNext">下一步</button>
        </view>
      </view>
      <!-- 学车类型 -->
      <view class="learning_car_type" v-if="tabIndex===2">
        <form>
          <view class="form_item">
              <view class="tit">手机号码</view>
              <input class="form_input" type="tel" maxlength="11" placeholder-style="color:#999" placeholder="请输入" v-model.trim="formData.mobile"/>
          </view>
          <view class="form_item">
              <view class="tit">学车类型</view>
              <picker :range="learnType" class="form_input" range-key="label" @change="bindLearnTypeChange">
                  <view class="form_input">{{learnType[formData.learnType - 1].label || '请选择'}}</view>
              </picker>
              <i class="iconfont">&#xe627;</i>
          </view>
          <view class="form_item" v-if="formData.learnType === 2">
              <view class="tit">原驾驶证类型</view>
              <picker :range="driveType" class="form_input" range-key="label" @change="bindDriveTypeChange">
                  <view class="form_input">{{driveType[formData.driveType - 1].label || '请选择'}}</view>
              </picker>
              <i class="iconfont">&#xe627;</i>
          </view>
          <view class="form_item" v-if="formData.learnType === 2">
              <view class="tit">原证件有效期</view>
              <picker mode="date" class="form_input" @change="bindEndDateChange">
                  <view class="form_input">{{formData.driveEndDate || '请选择'}}</view>
              </picker>
              <i class="iconfont">&#xe627;</i>
          </view>
          <view class="form_item" v-if="formData.learnType === 3 || formData.learnType === 4">
              <view class="tit">培训阶段</view>
              <picker :range="trainStage" class="form_input" range-key="label" @change="bindTrainStageChange">
                  <view class="form_input">{{trainStage[formData.trainStage - 1].label || '请选择'}}</view>
              </picker>
              <i class="iconfont">&#xe627;</i>
          </view>
        </form>
        <!-- 报错提示处 -->
        <view class="err_tips">{{partTwoWarn}}</view>
        <!-- 操作按钮 -->
        <view class="opt_btns">
          <button class="btn baocun" @click="submit">保存</button>
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { idCardNoUtil, mobileReg, nameReg } from '@/assets/js/verification_rules';
import { setGlobalData } from '@/assets/js/global_data';
import { driveType } from '@/assets/js/enums';

type ObjType = {
  [key: string]: any;
}

@Component
export default class SignUpForm extends Vue {
  // 订单卡片背景图片
  idCardBg = 'https://file.aicar365.com/mini-program/common/id_card_bg.png';

  private tabIndex = 1;

  private showSectionName = 'scanIDCard';

  @Watch('showSectionName')
  showSectionNameChange() {
    this.partOneWarn = '';
  }

  private learnType = [
    {
      id: '1',
      label: '初学'
    }, {
      id: '2',
      label: '增驾'
    }, {
      id: '3',
      label: '本地转入'
    }, {
      id: '4',
      label: '异地转入'
    }
  ];

  driveType = driveType;

 private trainStage = [
   {
     id: '1',
     label: '已科目一未科目二'
   }, {
     id: '2',
     label: '已科目二未科目三'
   }, {
     id: '3',
     label: '已科目三未科目二'
   }, {
     id: '4',
     label: '已科目三未文明'
   }
 ]

  formData: ObjType = {
    idNo: '',
    name: '',
    certificateAddress: '',
    learnType: 1,
    driveType: 0,
    mobile: uni.getStorageSync('mobile'),
    driveEndDate: '',
    loginId: uni.getStorageSync('openId'),
    orderId: '',
    trainStage: 0,
  };

  onLoad(options: any) {
    const { orderId } = options;
    this.formData.orderId = orderId;
  }

  isScanCard = false; // 是否从扫描而来的数据

  success(res: any): void {
    const { target }: any = res;
    const { address, name, id } = target;
    this.formData.idNo = id.text;
    this.formData.name = name.text;
    this.formData.certificateAddress = address.text;
    this.showSectionName = 'inputIDCard';
    this.isScanCard = true;
  }

  partOneWarn = '';

  toNext() {
    const warnList: ObjType = {
      idNo: '请输入身份证号码',
      name: '请输入姓名',
      certificateAddress: '请输入身份证地址',
    };
    const keyList = ['idNo', 'name', 'certificateAddress'];
    let warnText = '';
    for (let i = 0; i < keyList.length; i += 1) {
      if (!this.formData[keyList[i]]) {
        warnText = warnList[keyList[i]];
        break;
      }
    }
    if (!nameReg.test(this.formData.name)) warnText = '请输入正确姓名';
    if (!idCardNoUtil.checkIdCardNo(this.formData.idNo)) warnText = '请输入正确身份证号码';
    this.partOneWarn = warnText;
    if (warnText) return;
    this.tabIndex = 2;
  }

  partTwoWarn = '';

  async submit() {
    this.partTwoWarn = '';
    if (!mobileReg.test(this.formData.mobile) || !this.formData.mobile) {
      this.partTwoWarn = '请输入正确手机号';
      return;
    }
    if (!this.formData.learnType) {
      this.partTwoWarn = '请选择学习类型';
      return;
    }
    // 增驾类型需要传原驾驶证类型和有效期
    if (this.formData.learnType === 2) {
      if (!this.formData.driveType) {
        this.partTwoWarn = '请选择原驾驶证类型';
        return;
      }
      if (!this.formData.driveEndDate) {
        this.partTwoWarn = '请选择原证件有效期';
        return;
      }
    } else {
      this.formData.driveType = 0;
      this.formData.driveEndDate = '';
    }
    // 异地/本地转入的需要选择培训阶段
    // if (this.formData.learnType === 3 || this.formData.learnType === 4) {
    //   if (!this.formData.trainStage) {
    //     this.partTwoWarn = '请选择培训阶段';
    //     return;
    //   }
    //   // this.formData.trainStage = JSON.stringify(this.trainStage[this.formData.trainStage - 1]);
    // } else {
    //   this.formData.trainStage = '';
    // }
    const data = {
      ...this.formData
    };
      // 异地/本地转入的需要选择培训阶段
    if (this.formData.learnType === 3 || this.formData.learnType === 4) {
      if (!this.formData.trainStage) {
        this.partTwoWarn = '请选择培训阶段';
        return;
      }
      data.trainStage = JSON.stringify(this.trainStage[this.formData.trainStage - 1]);
    } else {
      data.trainStage = '';
    }
    data.learnType = JSON.stringify(this.learnType[this.formData.learnType - 1]);
    await this.$http.post('user/v1/wechat/createStudentCar', data);
    uni.showToast({
      icon: 'none',
      title: '保存成功'
    });
    setGlobalData('studentCarMsg', this.formData);
    uni.navigateTo({
      url: '/package_order/sign_up_form_success/index'
    });
  }

  bindLearnTypeChange(e: any) {
    this.formData.learnType = Number(e.detail.value) + 1;
    if (this.formData.learnType === 3 || this.formData.learnType === 4) {
      this.formData.trainStage = '';
    }
    this.partTwoWarn = '';
  }

  bindDriveTypeChange(e: any) {
    this.formData.driveType = Number(e.detail.value) + 1;
  }

  bindTrainStageChange(e: any) {
    this.formData.trainStage = Number(e.detail.value) + 1;
  }

  bindEndDateChange(e: any) {
    this.formData.driveEndDate = e.detail.value;
  }

  toast() {
    uni.showToast({
      title: '该信息仅用于车管所注册,不会泄漏',
      icon: 'none'
    });
  }
}

</script>

<style lang="less">
page {
  background-color: #fff;
}
.tab_section {
  padding: 27rpx 56rpx 0;
  display: flex;
  align-items: center;
  .icon_bg1{
    font-size: 22rpx;
    margin-left: 8rpx;
    color: @ctjt-color-primary;
    position: relative;
  }
  .tab_label {
    flex: 1;
    color: @ctjt-color-text-secondary-two;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 105rpx;
    position: relative;
    .icon {
      width: 22rpx;
      height: 22rpx;
      margin-left: 8rpx;
    }
    &::after {
      position: absolute;
      left: 0;
      top: 0;
      content: '';
      width: 100%;
      height: 4rpx;
      background-color: @ctjt-color-primary;
    }
    &::before {
      width: 32rpx;
      height: 32rpx;
      background-color: @ctjt-color-primary;
      border-radius: 50%;
      text-align: center;
      line-height: 32rpx;
      content: '1';
      color: @ctjt-color-text-main;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -16rpx;
      z-index: 1;
      font-size: 26rpx;
    }
    &.tab_label2::before{
      background: @ctjt-color-text-secondary-two;
      color: #fff;
      content: '2';
    }
    &.tab_label2::after{
      background: @ctjt-color-border-two;
    }
    &.active {
      color: @ctjt-color-text-main;
      &::after, &::before{
        background-color: @ctjt-color-primary;
      }
    }
    .label {
      font-size: 28rpx;
      line-height: 74rpx;
    }
    .iconfont {
      font-size: 22rpx;
      margin-left: 8rpx;
    }
  }
}
.content_body {
  padding: 120rpx 0 0;
}
.input_idcard_section, .learning_car_type {
  padding: 0 56rpx;
  .form_item {
    // padding: 29rpx 0 31rpx 0;
    line-height: 100rpx;
    border-bottom: 1rpx solid @ctjt-color-border-two;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tit {
      width: 237rpx;
      font-size: 28rpx;
      color: @ctjt-color-text-primary;
    }
    .date_tit{
      border-bottom: solid #fff 1px;
      position: relative;
      bottom: -1px;
    }
    .form_input, .form_textarea {
      flex: 1;
      font-size: 28rpx;
      color: @ctjt-color-text-secondary-two;
    }
    .form_textarea {
      width: 100%;
      padding: 23rpx 0;
      line-height: 42rpx;
      margin-top: 10rpx;
      max-height: 200rpx;
    }
    .iconfont{
      color: @ctjt-color-text-secondary-two;
      font-size: 26rpx;
      position: relative;
      top: 7rpx;
    }
  }
  .err_tips {
    font-size: 24rpx;
    color: #E45450;
    padding: 24rpx 0 56rpx 0;
    text-align: center;
    height: 24rpx;
  }
  .opt_btns {
    display: flex;
    justify-content: center;
    .btn {
      width: 240rpx;
      height: 70rpx;
      padding: 0;
      margin: 0 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1rpx solid @ctjt-color-text-main;
      border-radius: 35rpx;
      background-color: #fff;
      color: @ctjt-color-text-main;
      font-size: 26rpx;
      &.next, &.baocun {
        color: @ctjt-color-text-main;
        border: 0;
        background: @ctjt-color-primary;
      }
    }

  }
}
.learning_car_type {
  .opt_btns {
    .baocun {
      width: 440rpx;
    }
  }
}
.scan_idcard_section {
  .tips_bg {
    margin: 0 auto;
    width: 571rpx;
    height: 358rpx;
    background-color: antiquewhite;
    .img {
      width: 100%;
      height: 100%;
    }
  }
  .opt_btns {
    width: 288rpx;
    margin: 66rpx auto 0;
    .btn {
      width: 288rpx;
      line-height: 70rpx;
      padding: 0;
      border-radius: 35rpx;
      font-size: 26rpx;
      color: @ctjt-color-text-main;
      border: 0;
      background: @ctjt-color-primary;
    }
  }
  .no_saomiao {
    margin-top: 23rpx;
    display: flex;
    justify-content: center;
    font-size: 28rpx;
    .text {
      color: @ctjt-color-text-secondary-two;
    }
    .btn {
      color: #E45450;
    }
  }
}
navigator {
  width: 240rpx;
}
</style>
