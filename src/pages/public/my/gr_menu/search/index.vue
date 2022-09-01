<template>
  <view style="background: #fff;height: 100%;overflow-y: scroll;">
    <view class="el_height">
      <view class="date_box">
        <input type="text" class="search_box" placeholder="输入姓名/手机号/证件号" v-model="keyword" @confirm="getData">
        <view class="search_btn" @click="getData">查询</view>
      </view>
    </view>
    <view>
      <scroll-view class="scroll-container" scroll-x scroll-y>
        <view class="default_box" v-if="resList.length === 0">
          <image :src="defaultImg()" class="detault_img"></image>
          <view class="warn">暂无学员信息～</view>
        </view>
        <view class="table_header" v-else>
          <view>学员姓名</view>
          <view>学车记录</view>
          <view style="width: 100rpx">性别</view>
          <view style="width: 200rpx">联系方式</view>
          <view style="width: 300rpx">证件号码</view>
          <view style="width: 500rpx">接送地址</view>
          <view style="width: 170rpx">报名日期</view>
          <view>车型</view>
          <view>报名学时</view>
          <view>剩余学时</view>
          <view>门店</view>
        </view>
        <view class="table_line" v-for="(item, index) in resList" :key="index">
          <view>{{item.name}}</view>
          <view class="click_color" @click="showDetail(item)">{{item.name !== '合计' ? '查看' : ''}}</view>
          <view style="width: 100rpx">{{item.sex == 1 ? '男' : item.sex == 2 ? '女' : ''}}</view>
          <view class="click_color" style="width: 200rpx" @click="phoneOperate(item.mobile)">{{item.mobile}}</view>
          <view style="width: 300rpx">{{item.idNo}}</view>
          <view style="width: 500rpx">{{item.pickUpDetail}}</view>
          <view style="width: 170rpx">{{item.applyDate ? item.applyDate.split(' ')[0] : ''}}</view>
          <view>{{item.carModel}}</view>
          <view>{{item.sumPeriod}}</view>
          <view>{{item.surplusPeriod}}</view>
          <view>{{item.storeName}}</view>
        </view>
      </scroll-view>
    </view>
    <view class="pop_box" v-if="showDetailFlag"></view>
    <view class="detail_box" v-if="showDetailFlag">
      <span class="close iconfont" @click="showDetailFlag = false">&#xe634;</span>
      <scroll-view scroll-x scroll-y class="detail_scroll">
        <view class="detail_tit">学车记录</view>
        <view class="table_header">
          <view style="flex: 1.5">时间</view>
          <view style="flex: 1.5">时段</view>
          <view>教练</view>
          <view>约车学时</view>
          <view>剩余学时</view>
        </view>
        <view class="table_line" v-for="(item, index) in detailList" :key="index">
          <view style="flex: 1.5">{{item.appointDate}}</view>
          <view style="flex: 1.5">{{item.timeFrameName}}</view>
          <view>{{item.coachName}}</view>
          <view>{{item.period}}</view>
          <view>{{item.surplusPeriod}}</view>
        </view>
      </scroll-view>
    </view>
    <Phone :phoneNum.sync="phoneNum" v-if="phoneNum"></Phone>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CtjtAutoCenterNav from '@/components/auto_center_nav/index.vue';
import Phone from '../components/phone/index.vue';

let userId = '';
@Component({
  components: { CtjtAutoCenterNav, Phone }
})
export default class Arrange extends Vue {
  defaultImg= () => 'https://file.aicar365.com/mini-program/common/queshengye_banbiexinxi.png';

  tableHeader = ['学员姓名', '学车记录', '性别', '联系方式', '证件号码', '接送地址', '报名日期', '车型', '报名学时', '剩余学时', '门店'];

  resList = [];

  keyword = '';

  showDetailFlag = false;

  detailList = [];

  phoneNum = '';

  onLoad(options: any) {
    if (!uni.getStorageSync('mobile')) {
      uni.switchTab({
        url: '/pages/public/my/index'
      });
      return;
    }
    userId = options.userId;
  }

  async getData() {
    if (!this.keyword) {
      uni.showToast({
        icon: 'none',
        title: '请输入搜索内容'
      });
      return;
    }
    const data = {
      keyword: this.keyword,
      userId
    };
    this.resList = await this.$http.get('order/v1/scattered/queryStudentInfoToApplet', data);
    if (this.resList.length === 0) {
      uni.showToast({
        icon: 'none',
        title: '暂无该学员信息'
      });
    }
  }

  phoneOperate(phone) {
    if (!phone) return;
    this.phoneNum = phone;
  }

  async showDetail(item) {
    if (!item.id) return;
    this.detailList = await this.$http.get('assignment/v1/scattered/scheduling/queryAppointLogToApplet', { id: item.id });
    this.showDetailFlag = true;
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
  min-width: 1845rpx;
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
  width: 110rpx;
  text-align: center;
  font-size: 26rpx;
  border-bottom: solid #e5e5e5 1rpx;
  border-right: solid #e5e5e5 1rpx;
  white-space: pre-wrap;
  &:last-child{
    border-right: 0;
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
.search_box {
  flex: 1;
  margin-right: 20rpx;
  padding: 0 24rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 24rpx;
  font-size: 26rpx;
  background-color: @ctjt-bgcolor-primary;
  color: @ctjt-color-text-primary;
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
  .table_header, .table_line{
    min-width: auto;
  }
  .table_header view, .table_line view{
    flex: 1;
  }
}
</style>
