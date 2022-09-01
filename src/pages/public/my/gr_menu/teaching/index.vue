<template>
  <view style="background: #fff;height: 100%;overflow-y: scroll;">
    <view class="el_height">
      <view class="date_box">
        选择年月
        <view class="date_picker_container">
          <picker class="date_item" mode="multiSelector" :range="multiArray" :value="multiIndex" @change="bindStartDateChange">
            <view class="date_item_c">
              <view class="date_text">{{(beginDate && beginDate.split('-')[0]) + '年' + (beginDate && beginDate.split('-')[1]) + '月'}}</view>
              <text class="iconfont">&#xe6b4;</text>
            </view>
          </picker>
        </view>
        <!-- <view class="search_btn" @click="getData">查询</view> -->
      </view>
    </view>
    <view>
      <scroll-view class="scroll-container" scroll-x scroll-y>
      <!-- refresher-enabled
          :refresher-triggered="threadTriggered"
          @refresherrefresh="threadBindrefresherrefresh"> -->
        <view class="default_box" v-if="resList.length === 0">
          <image :src="defaultImg()" class="detault_img"></image>
          <view class="warn">暂无带教信息～</view>
        </view>
        <view class="table_header" v-else>
          <view v-for="(item, index) in tableHeader" :key="index" :class="{'date': item === '日期'}">{{item}}</view>
        </view>
        <view class="table_line" v-for="(item, index) in resList" :key="index">
          <view>{{index + 1}}</view>
          <view class="date">{{item.date}}</view>
          <view :class="{'click_color': item.morning > 0}" @click="showDetail(1, item.date, item.morning)">{{item.morning}}</view>
          <view :class="{'click_color': item.noon > 0}" @click="showDetail(2, item.date, item.noon)">{{item.noon}}</view>
          <view :class="{'click_color': item.night > 0}" @click="showDetail(3, item.date, item.night)">{{item.night}}</view>
          <view>{{item.sum}}</view>
        </view>
        <view class="table_line" v-if="resList.length > 0">
          <view style="flex: 3">合计</view>
          <view>{{statistics.morning}}</view>
          <view>{{statistics.noon}}</view>
          <view>{{statistics.night}}</view>
          <view>{{statistics.sum}}</view>
        </view>
      </scroll-view>
    </view>
    <view class="pop_box" v-if="showDetailFlag"></view>
    <view class="detail_box" v-if="showDetailFlag">
      <span class="close iconfont" @click="showDetailFlag = false">&#xe634;</span>
      <scroll-view scroll-x scroll-y class="detail_scroll">
        <view class="detail_tit">{{detailTit}}</view>
        <view class="table_header">
          <view style="flex: 1.2">时间</view>
          <view>学员</view>
          <view>学时</view>
          <view style="flex: 1.2">电话</view>
        </view>
        <view class="table_line" v-for="(item, index) in detailList" :key="index">
          <view style="flex: 1.2">{{item.timeFrameName}}</view>
          <view>{{item.studentName}}</view>
          <view>{{item.period}}</view>
          <view class="click_color" @click="phoneOperate(item.studentMobile)" style="flex: 1.2">{{item.studentMobile}}</view>
        </view>
      </scroll-view>
    </view>
    <Phone :phoneNum.sync="phoneNum" v-if="phoneNum"></Phone>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Phone from '../components/phone/index.vue';

let userId = '';
@Component({
  components: { Phone }
})
export default class Arrange extends Vue {
  defaultImg= () => 'https://file.aicar365.com/mini-program/common/queshengye_banbiexinxi.png';

  multiArray = [[], ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月']];

  multiIndex = [];

  tableHeader = ['序号', '日期', '早班', '中班', '晚班', '合计'];

  beginDate = '';

  resList = [];

  threadTriggered = false;

  statistics = {};

  phoneNum = '';

  onLoad(options: any) {
    if (!uni.getStorageSync('mobile')) {
      uni.switchTab({
        url: '/pages/public/my/index'
      });
      return;
    }
    userId = options.userId;
    const date = new Date();
    const year = date.getFullYear();
    let month: number | string = date.getMonth() + 1;
    const day = date.getDate();
    if (day >= 26) month += 1;
    month = month > 9 ? month : `0${month}`;
    this.beginDate = `${year}-${month}`;
    this.multiArray[0] = this.multiArray[0].concat([`${year - 2}年`, `${year - 1}年`, `${year}年`, `${year + 1}年`]);
    this.multiIndex.push(this.multiArray[0].indexOf(`${year}年`));
    this.multiIndex.push(this.multiArray[1].indexOf(`${month}月`));
    this.getData();
  }

  async getData() {
    const data = {
      month: `${this.beginDate}-01`,
      userId
    };
    this.resList = await this.$http.post('assignment/v1/scattered/scheduling/schedulingListByCoach', data);
    this.resList.forEach((item, index) => {
      if (!item.date) {
        this.statistics = item;
        this.resList.splice(index, 1);
      }
    });
  }

  showDetailFlag = false;

  detailList = [];

  detailTit = '';

  async showDetail(classes, date, num) {
    if (num < 1) return;
    const data = {
      date,
      userId,
      classes
    };
    this.detailList = await this.$http.post('assignment/v1/scattered/scheduling/queryAppointInfoListToApplet', data);
    this.detailTit = `${date}${this.tableHeader[classes + 1]}带教情况`;
    this.showDetailFlag = true;
  }

  bindStartDateChange(event) {
    const { value } = event.detail;
    const year = this.multiArray[0][value[0]];
    const month = this.multiArray[1][value[1]];
    this.beginDate = `${year.split('年')[0]}-${month.split('月')[0]}`;
    this.getData();
  }

  phoneOperate(phone) {
    if (!phone) return;
    this.phoneNum = phone;
  }

  threadBindrefresherrefresh() {
    this.threadTriggered = true;
    this.getData();
    const timer = setTimeout(() => {
      this.threadTriggered = false;
      clearTimeout(timer);
    }, 1000);
  }
}
</script>

<style lang="less" scoped>
.date_box{
  display: flex;
  align-items: center;
  padding: 10rpx 30rpx;
  font-size: 30rpx;
}
.click_color{
  color: #649AF4;
}
.table_header, .table_line{
  white-space: nowrap;
  display: flex;
}
.table_header{
  border-top: solid #e5e5e5 1rpx;
  background-color: @ctjt-bgcolor-primary;
  view{
    border: 0;
  }
}
.table_header view, .table_line view{
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: inherit;
  padding: 10rpx 0;
  text-align: center;
  font-size: 26rpx;
  border-bottom: solid #e5e5e5 1rpx;
  border-right: solid #e5e5e5 1rpx;
  white-space: pre-wrap;
  &:last-child{
    border-right: 0;
  }
  &.date{
    flex: 2;
  }
}
.search_btn{
  background: #FFD944;
  border-radius: 30rpx;
  text-align: center;
  line-height: 68rpx;
  width: 130rpx;
  color: #353535;
  font-size: 30rpx;
}
.date_picker_container {
  flex: 1;
  margin: 0 30rpx 0 10rpx;
  .date_item {
    flex: 1;
  }
  .date_item_c {
    display: flex;
    align-items: center;
    padding: 0 24rpx;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 24rpx;
    font-size: 26rpx;
    text-align: center;
    background-color: @ctjt-bgcolor-primary;
    color: @ctjt-color-border-one;
  }
  .date_text {
    flex: 1;
    line-height: 32rpx;
    font-size: 32rpx;
    color: @ctjt-color-text-main;
  }
  .iconfont {
    font-size: 36rpx;
    line-height: 36rpx;
  }
}
.default_box{
  color: @ctjt-color-text-primary;
  text-align: center;
  padding-top: 400rpx;
  font-size: 28rpx;
  background: #fff;
  padding-top: 144rpx;
  text-align: center;
  .detault_img{
    width: 422rpx;
    height: 326rpx;
  }
  .warn{
    font-size: 28rpx;
    color: @ctjt-color-text-secondary-one;
    line-height: 40rpx;
  }
}
.detail_tit{
  background: @ctjt-bgcolor-primary;
  padding-left: 20rpx;
  font-size: 30rpx;
}
.detail_box{
  max-height: 50%;
  background: #fff;
  position: fixed;
  border-radius: 10rpx;
  left: 10rpx;
  right: 10rpx;
  top: 30%;
  // transform: translateY(-50%);
  z-index: 10;
  .close {
    font-size: 50rpx;
    position: absolute;
    top: -100rpx;
    right: 0;
    color: #fff;
    padding: 30rpx;
  }
}
.detail_scroll{
  border-radius: 10rpx;
  overflow: hidden;
}
</style>
