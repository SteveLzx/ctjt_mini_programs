<template>
  <view class="l_wrap">
    <view class="activity_container">
      <view class="title mt_40">领取页面</view>
      <view class="dec">介绍再次转发给被推荐人或更多层级转发，打开将看到以下页面</view>
      <view :class="['activity', { disable: downTimes }]">
        <view class="activity_mtitle">{{mainTitle}}</view>
        <view class="activity_stitle" v-if="sId !== 370">深港幸运大转盘</view>
        <view class="disble_wrap" v-if="downTimes">活动即将在 {{timeName}} 后开始</view>
        <view class="notice" v-if="!downTimes">
          <Notice :data="userData"></Notice>
        </view>
        <ActivityTurntable
          :bgType='1'
          :list="awardsList"
          :sId="sId"
          :activityId="activityId"
          :time="!downTimes ? activityData.endDate : ''"
        />
      </view>
      <view>
        <view class="title mt_40">活动说明</view>
        <view class="dec">活动开放时间为{{activityData.beginDate}} 至 {{activityData.endDate}}</view>
      </view>
      <mp-html :content="activityData.explainInfo"></mp-html>
    </view>
    <view class="down_share_container">
      <DownloadShareCommon @down="downloadShare" @coachShare="coachShare"/>
    </view>
    <DownloadPoster v-if="showDownloadPoster" @close="showDownloadPoster = false" :data="downloadPosterData"/>
    <CustomShare :visible.sync="shareVisible" :content.sync="shareContent"></CustomShare>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { generateSceneId, resCountDown, schoolName } from '@/assets/js/common';
import { userData } from '@/pages/personal/invite/index';
import { schoolId } from '@/config/build_path';
import DownloadShareCommon from '@/components/download_share_common/index.vue';
import DownloadPoster from '@/components/download_poster/index.vue';
import CustomShare from '@/components/custom_share/index.vue';
import MpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html.vue';
import ActivityTurntable from '../components/activity_turntable/index.vue';
import Notice from '../components/notice/index.vue';

@Component({
  components: {
    DownloadShareCommon, ActivityTurntable, Notice, DownloadPoster, MpHtml, CustomShare
  },
})
export default class CoolSchoolCar extends Vue {
  created() {
    /** 开启微信分享到好友和朋友圈 可以写在公共组件里面 */
    uni.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    });
    this.queryActivityById();
    this.queryAwards();

    uni.setNavigationBarTitle({
      title: schoolId === 370 ? '广仁邀您抽大奖' : '报名学车抽豪礼'
    });
  }

  // 计算标题
  get mainTitle() {
    return schoolId === 370 ? '广仁邀您抽大奖' : '您的好友邀您参与';
  }

  // 查询活动详情
  activityData: any = {}

  async queryActivityById() {
    this.activityData = await this.$http.get('sale/v1/mkt/activities/getActivityById', { id: this.activityId });
    this.handleWatchTime(this.activityData.beginDate);
  }

  // 转盘数据
  sId = schoolId;

  activityId = schoolId === 370 ? '756787890238798090' : '776291630264105226'

  awards = [];

  awardsList = [];

  shareVisible = false; // 自定义分享

  shareContent: any = {};

  // 获取转盘数据
  async queryAwards() {
    const sendData = {
      activityId: this.activityId,
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

  // 生成活动================================
  get downTimes() {
    const { beginDate } = (this as any).activityData;
    if (beginDate) {
      return new Date(beginDate).getTime() > new Date().getTime();
    }
    return false;
  }

  timer = null

  timeName = ''

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

  // 下载
  downloadShare() {
    this.createdDynamicsScene();
  }

  showDownloadPoster = false;

  downloadPosterData = {};

  async createdDynamicsScene() {
    const sendData = {
      id: this.activityId,
      name: this.activityData.name,
      photoUrlMain: schoolId === 370 ? 'https://file.aicar365.com/mini-program/common/share_poster_lj.jpg' : 'https://file.aicar365.com/mini-program/common/dongtai_yqxc.jpg'
    };
    this.downloadPosterData = {
      detail: sendData,
      type: 99
    };
    this.showDownloadPoster = true;
  }

  async coachShare() {
    const { name } = this.activityData;
    const imageUrl = schoolId === 370 ? 'https://file.aicar365.com/mini-program/common/share_card_lj.png' : 'https://file.aicar365.com/mini-program/common/share_card_yqxc.jpg';
    const dynamicsId = this.activityId;
    const sendData = {
      dynamicsId,
      publishExport: 1,
      publishFormat: 1,
      title: name,
      type: 99
    };
    const sceneId = await generateSceneId(sendData);
    this.shareContent = {
      title: `${schoolName[schoolId]}活动` || name,
      path: `/pages/public/dynamic/publish/share_landingpage?scene=${sceneId}`,
      imageUrl
    };
    if (schoolId === 16) {
      this.shareContent.title = '仲夏八月，畅享夏日特惠';
    }
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
      .activity_mtitle {
        position: absolute;
        top: 64rpx;
        width: 100%;
        font-size: 58rpx;
        line-height: 58rpx;
        text-align: center;
        font-weight: 600;
        color: #fef97c;
        background: -webkit-linear-gradient(-90deg, #fff, #fef97c);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        z-index: 1;
      }
      .activity_stitle {
        position: absolute;
        top: 140rpx;
        width: 100%;
        font-size: 34rpx;
        line-height: 34rpx;
        text-align: center;
        font-weight: 500;
        color: #fff;
        z-index: 1;
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
  .down_share_container {
    padding: 0rpx 30rpx;
    background-color: @ctjt-color-text-white;
    border-top: solid 1rpx @ctjt-color-border-two;
  }
}

</style>
