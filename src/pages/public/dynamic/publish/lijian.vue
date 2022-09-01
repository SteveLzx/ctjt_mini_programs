<template>
  <view class="l_wrap">
    <view class="activity_container">
      <ActivityForm :form-data.sync="formData" :show-warning="false">
        <!-- <template #uni-form-item>
          <view class="title">优惠券设置</view>
          <view class="coupon_settings_c" @click="handleToast">
            <text class="info_t">{{couponData}}</text>
            <text class="iconfont">&#xe6a3;</text>
          </view>
        </template> -->
      </ActivityForm>
      <view class="title mt_40">被分享人页面</view>
      <view class="dec">分享出去被分享人打开将看到以下页面</view>
      <view :class="['activity', { disable: downTimes }]">
        <view class="disble_wrap" v-if="downTimes">活动即将在 {{timeName}} 后开始</view>
        <view class="notice" v-if="!downTimes">
          <Notice :data="userData"></Notice>
        </view>
        <ActivityTurntable :list="awardsList" :sId="sId" :time="!downTimes ? formData.endDate : ''"></ActivityTurntable>
      </view>
    </view>
    <view class="down_share_container">
      <DownloadShareCommon @down="downloadShare" @coachShare="coachShare"/>
    </view>
    <DownloadPoster v-if="showDownloadPoster" @close="showDownloadPoster = false" :data="downloadPosterData"/>
    <CustomShare :visible.sync="shareVisible" :content.sync="shareContent"></CustomShare>
  </view>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { generateSceneId, resCountDown, schoolName } from '@/assets/js/common';
import { userData } from '@/pages/personal/invite/index';
import { schoolId } from '@/config/build_path';
import DownloadShareCommon from '@/components/download_share_common/index.vue';
import DownloadPoster from '@/components/download_poster/index.vue';
import CustomShare from '@/components/custom_share/index.vue';
import ActivityTurntable from '../components/activity_turntable/index.vue';
import Notice from '../components/notice/index.vue';
import ActivityForm from './activity_form.vue';

@Component({
  components: {
    DownloadShareCommon, ActivityForm, ActivityTurntable, Notice, DownloadPoster, CustomShare
  },
})
export default class Lijian extends Vue {
  created() {
    /** 开启微信分享到好友和朋友圈 可以写在公共组件里面 */
    uni.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    });
    this.queryCoupon();
    this.queryAwards();
  }

  // 转盘数据
  sId = schoolId;

  awards = [];

  awardsList = [];

  shareVisible = false; // 自定义分享

  shareContent = {};

  // 获取转盘数据
  async queryAwards() {
    const sendData = {
      // activityId: 0,
      drivingSchoolId: schoolId
    };
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
  generateUserData(list) {
    let current = Math.floor(userData.length * Math.random());
    const awardsList = [...list].filter(item => item.unit !== '感谢');
    // 首先展示三等奖
    const two = awardsList.findIndex((item: any) => item.grade === 1);
    this.userData.push({
      ...userData[current],
      num: Math.ceil(5 * Math.random()),
      prizeName: awardsList[two].unit + awardsList[two].prizeName
    });
    setInterval(() => {
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

  // 查询所有有效的优惠券批次================================
  couponData = '';

  async queryCoupon() {
    const list = await this.$http.get('sale/v1/mkt/coupon/queryCoupon', { type: 1 });
    const { 0: data } = list;
    const {
      status, amount, id, name
    } = data;
    if (status === 1) {
      this.couponData = `全平台 全商品 立减优惠券 立减金额：¥${amount}`;
      this.formData.couponBatchId = id;
      this.formData.name = name;
      const userInfo = uni.getStorageSync('coachInfo');
      this.formData.drivingSchoolId = userInfo.drivingSchoolId;
    }
  }

  // 优惠券点击
  handleToast() {
    uni.showToast({
      title: '其他优惠券正在升级中...',
      icon: 'none'
    });
  }

  // 生成活动================================
  formData = {
    beginDate: '',
    bounty: 0,
    couponBatchId: 0,
    drivingSchoolId: 0,
    endDate: '',
    isShow: 1,
    name: '',
    type: 6,
    url: ''
  }

  get downTimes() {
    const { beginDate } = (this as any).formData;
    if (beginDate) {
      return new Date(beginDate).getTime() > new Date().getTime();
    }
    return false;
  }

  timer = null

  timeName = ''

  @Watch('formData.beginDate')
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

  createdActive() {
    return new Promise((resolve, reject) => {
    // 校验必填项
      const { beginDate, endDate } = this.formData;
      if (!beginDate || !endDate) {
        uni.showToast({
          title: '请选择活动开始和结束时间',
          icon: 'none'
        });
        reject();
        return;
      }
      if (new Date((`${beginDate} 23:59:59`).replace(/-/g, '/')).getTime() < new Date().getTime()) {
        uni.showToast({
          title: '活动开始时间不能小于当前时间',
          icon: 'none'
        });
        reject();
        return;
      }
      if (new Date(beginDate).getTime() > new Date(endDate).getTime()) {
        uni.showToast({
          title: '活动开始时间不能大于结束时间',
          icon: 'none'
        });
        reject();
        return;
      }
      this.$http.post('sale/v1/mkt/activities/addActivity', this.formData).then((body: any) => {
        const { activityId } = body;
        resolve(activityId);
      }).catch(() => {
        reject();
      });
    });
  }

  // 下载
  downloadShare() {
    this.createdActive().then((res: string) => {
      if (res) this.createdDynamicsScene(res);
    }).catch(() => {
      console.log('err');
    });
  }

  showDownloadPoster = false;

  downloadPosterData = {};

  async createdDynamicsScene(id: string) {
    const { name } = this.formData;
    const sendData = {
      id,
      name: `${name}`,
      photoUrlMain: 'https://file.aicar365.com/mini-program/common/share_poster_lj.jpg'
    };
    this.downloadPosterData = {
      detail: sendData,
      type: 6
    };
    this.showDownloadPoster = true;
  }

  async coachShare({ type, detail }) {
    const { name } = this.formData;
    const imageUrl = 'https://file.aicar365.com/mini-program/common/share_card_lj.png';
    const dynamicsId = await this.createdActive();
    const sendData = {
      dynamicsId,
      publishExport: 1,
      publishFormat: 1,
      title: name,
      type: 6
    };
    const sceneId = await generateSceneId(sendData);
    this.shareContent = {
      title: `${schoolName[schoolId]}活动` || name,
      path: `/pages/public/dynamic/publish/share_landingpage?scene=${sceneId}`,
      imageUrl
    };
    this.shareVisible = true;
  }

  // 分享
  onShareAppMessage() {
    return this.shareContent;
  }
}
</script>
<style lang="less" scoped>
.mt_40 {
  margin-top: 40rpx;
}
.l_wrap {
  .activity_container {
    background-color: @ctjt-color-text-white;
    padding: 24rpx 30rpx;
    margin-bottom: 24rpx;
    .title {
      color: @ctjt-color-text-main;
      font-size: 32rpx;
      line-height: 32rpx;
    }
    .dec {
      color: @ctjt-color-text-secondary-one;
      font-size: 26rpx;
      line-height: 26rpx;
      margin: 24rpx 0rpx 16rpx 0rpx;
    }
    .activity {
      position: relative;
      &.disable {
        .disble_wrap {
          display: block;
          text-align: center;
          background-color: rgba(0, 0, 0, 0.7);
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: 99;
          color: #fff;
          font-size: 32rpx;
          line-height: 430rpx;
          border-radius: 24rpx;
        }
      }
      .notice {
        position: absolute;
        width: 100%;
        top: 242rpx;
        z-index: 3;
      }
    }
    .uni-form-item {
      .title {
        padding: 20rpx 0;
      }
      .uni-input {
        height: 88rpx;
        line-height: 88rpx;
        border-radius: 24rpx;
        padding-left: 20rpx;
        background-color: @ctjt-bgcolor-primary;
        color: @ctjt-color-text-main;
      }
    }
  }
  .form_container {
    background-color: @ctjt-color-text-white;
    padding: 0rpx 30rpx;
    border-bottom: 1px solid @ctjt-color-border-two;
  }
  .down_share_container {
    padding: 0rpx 30rpx;
    background-color: @ctjt-color-text-white;
    border-top: solid 1rpx @ctjt-color-border-two;
  }
  .coupon_settings_c {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    height: 88rpx;
    margin: 16rpx 0 0 0;
    padding: 0 24rpx 0 16rpx;
    border-radius: 24rpx;
    background-color: @ctjt-bgcolor-primary;
    .info_t {
      line-height: 32rpx;
      color: @ctjt-color-text-main;
      font-size: 32rpx;
      text-align: left;
    }
    .iconfont {
      font-size: 26rpx;
      line-height: 26rpx;
      color: @ctjt-color-text-main;
    }
  }
}

</style>
