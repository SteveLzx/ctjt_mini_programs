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
      <CtjtAutoCenterNav :flex="true" :list="tabList" :current="current" :trans-left="150" @change="index => current = index"></CtjtAutoCenterNav>
    </view>
    <view v-show="current === 0">
      <scroll-view class="scroll-container" scroll-x scroll-y>
      <!-- refresher-enabled
          :refresher-triggered="threadTriggered"
          @refresherrefresh="threadBindrefresherrefresh"> -->
        <view class="default_box" v-if="resList.length === 0">
          <image :src="defaultImg()" class="detault_img"></image>
          <view class="warn">暂无排班信息～</view>
        </view>
        <view class="table_header" v-else>
          <view class="date">日期</view>
          <view v-for="(item, index) in twoMenu" :key="index">{{item}}</view>
        </view>
        <view class="table_line" v-for="(item, index) in resList" :key="index">
          <view class="date">{{item.dateAndWeek}}</view>
          <view @click="phoneOperate(item, val)" v-for="(val, key) in twoMenu" :key="key"><rich-text :nodes="parseStr(item[val])"></rich-text></view>
        </view>
      </scroll-view>
    </view>
    <view v-show="current === 1">
      <scroll-view class="scroll-container" scroll-x scroll-y>
      <!-- refresher-enabled
          :refresher-triggered="threadTriggered"
          @refresherrefresh="threadBindrefresherrefresh"> -->
        <view class="default_box" v-if="resList.length === 0">
          <image :src="defaultImg()" class="detault_img"></image>
          <view class="warn">暂无排班信息～</view>
        </view>
        <view class="table_header" v-else style="width: 770rpx">
          <view class="date">日期</view>
          <view v-for="(item, index) in threeMenu" :key="index">{{item}}</view>
        </view>
        <view class="table_line" v-for="(item, index) in resList" :key="index" style="width: 770rpx">
          <view class="date">{{item.dateAndWeek}}</view>
          <view @click="phoneOperate(item, val)" v-for="(val, key) in threeMenu" :key="key"><rich-text :nodes="parseStr(item[val])"></rich-text></view>
        </view>
      </scroll-view>
    </view>
    <Phone :phoneNum.sync="phoneNum" :address="currentAddress" v-if="phoneNum"></Phone>
  </view>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import CtjtAutoCenterNav from '@/components/auto_center_nav/index.vue';
import Phone from '../components/phone/index.vue';

let userId = '';
const regx = /1[3|4|5|6｜7|8｜9]\d{9}/g;
@Component({
  components: { CtjtAutoCenterNav, Phone }
})
export default class Arrange extends Vue {
  defaultImg= () => 'https://file.aicar365.com/mini-program/common/queshengye_banbiexinxi.png';

  multiArray = [[], ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月']];

  multiIndex = [];

  twoMenu = ['07:30-09:30', '10:00-12:00', '13:30-15:30', '16:00-18:00', '18:30-20:30'];

  threeMenu = ['08:30-11:30', '14:00-17:00', '18:00-21:00'];

  beginDate = '';

  tabList = [
    {
      value: 1,
      label: '2小时班'
    }, {
      value: 2,
      label: '3小时班'
    }
  ];

  current = 0;

  resList = [];

  threadTriggered = false;

  phoneNum = '';

  currentAddress = '';

  @Watch('current')
  currentChange() {
    this.getData();
  }

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
      classes: this.current + 2,
      userId
    };
    this.resList = await this.$http.post('assignment/v1/scattered/scheduling/appletList', data);
  }

  bindStartDateChange(event) {
    const { value } = event.detail;
    const year = this.multiArray[0][value[0]];
    const month = this.multiArray[1][value[1]];
    this.beginDate = `${year.split('年')[0]}-${month.split('月')[0]}`;
    this.getData();
  }

  phoneOperate(item, val) {
    if (item[val]) {
      const phone = item[val].match(regx);
      if (phone && phone[0]) {
        this.phoneNum = phone[0];
      }
      if (item.address && item.address[val]) this.currentAddress = item.address[val];
    }
  }

  parseStr(str) {
    if (str) {
      let res = str.replace(/LF/g, ' ');
      const phone = res.match(regx);
      res = res.replace(phone, `<a style="color: #649AF4">${phone}</a>`);
      return res;
    }
    return '';
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
.scroll-container{
  .table_header, .table_line{
    white-space: nowrap;
    display: flex;
    width: 1175rpx;
  }
  .table_header{
    border-top: solid #e5e5e5 1rpx;
    background-color: @ctjt-bgcolor-primary;
    view{
      border: 0;
    }
  }
  .table_header view, .table_line view{
    display: flex;
    justify-content: center;
    align-items: center;
    height: inherit;
    padding: 10rpx 0;
    width: 200rpx;
    text-align: center;
    font-size: 26rpx;
    border-bottom: solid #e5e5e5 1rpx;
    border-right: solid #e5e5e5 1rpx;
    white-space: pre-wrap;
    &:last-child{
      border-right: 0;
    }
    &.date{
      width: 160rpx;
    }
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
</style>
