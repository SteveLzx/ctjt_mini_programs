<template>
  <view style="background: #fff;height: 100%;overflow-y: scroll;">
    <scroll-view style="height: 100%" scroll-y
    refresher-enabled
        :refresher-triggered="threadTriggered"
        @refresherrefresh="threadBindrefresherrefresh">
      <view class="default_box" v-if="resList.length === 0">
        <image :src="defaultImg()" class="detault_img"></image>
        <view class="warn">暂无学员信息～</view>
      </view>
      <view class="table_header" v-else>
        <view v-for="(item, index) in tableHeader" :key="index"
        :class="{'date': item === '电话', 'little': item === '序号', 'big': item === '最后练车时间'}">{{item}}</view>
      </view>
      <view class="table_line" v-for="(item, index) in resList" :key="index">
        <view class="little">{{index + 1}}</view>
        <view>{{item.name}}</view>
        <view class="date click_color" @click="phoneOperate(item.mobile)">{{item.mobile}}</view>
        <view class="big">{{item.appointDate}}</view>
        <view>{{item.surplusPeriod}}</view>
      </view>
    </scroll-view>
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

  tableHeader = ['序号', '学员', '电话', '最后练车时间', '剩余学时'];

  resList = [];

  threadTriggered = false;

  phoneNum = '';

  onLoad(options: any) {
    if (!uni.getStorageSync('mobile')) {
      uni.switchTab({
        url: '/pages/public/my/index'
      });
      return;
    }
    userId = options.userId;
    this.getData();
  }

  async getData() {
    const data = {
      userId
    };
    this.resList = await this.$http.post('assignment/v1/scattered/scheduling/queryMyStudentListToApplet', data);
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
.click_color{
  color: #649AF4;
}
.table_header, .table_line{
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
  word-break: break-all;
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
    flex: 1.5;
  }
  &.big{
    flex: 1.7;
  }
  &.little{
    width: 64rpx;
    flex: inherit;
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
