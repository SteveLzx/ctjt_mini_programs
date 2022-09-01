<template>
  <view class="content">
    <view class="content_t">
      <view class="pay_time">
        <text v-if="orderDetail.payDtoList && orderDetail.payDtoList[0]">{{orderDetail.payDtoList && orderDetail.payDtoList[0].payTime}}</text>
        <text class="text1">已支付<text v-if="orderDetail.balance > 0">首期款</text></text>
      </view>
      <view class="goods_info">
        <view class="image_box">
          <image class="img" :src="imgDomain + orderDetail.productUrl" mode="aspectFill"></image>
        </view>
        <view class="info_box">
          <view class="title">{{orderDetail.productName}}</view>
          <view class="is_installment" v-if="orderDetail.isInstallment === 1">分期缴费</view>
          <view class="is_installment" v-else>全额缴费</view>
        </view>
      </view>
      <view class="pay_amount">
        总价:￥<text class="text1">{{orderDetail.salePrice || 0}}</text> 实付款:<text class="text2">￥{{orderDetail.amount || 0}}</text>
      </view>
      <view class="goods_btns" v-if="orderDetail.isIntact === 0 || orderDetail.balance > 0">
        <button class="btn" @click="fill" v-if="orderDetail.isIntact === 0">完善信息</button>
        <button class="btn btn1" v-if="orderDetail.balance > 0" @click="wechatPay(2)">支付尾款</button>
      </view>
    </view>
    <view class="tabbar_container el_height">
      <text class="item_bar" @click="tabIndex = 1" :class="{'active': tabIndex === 1}">订单信息</text>
      <text class="item_bar" @click="tabIndex = 2" :class="{'active': tabIndex === 2}">支付信息</text>
    </view>
    <view v-if="tabIndex === 1">
      <view class="content_m">
        <view class="label_item">
          <text class="tit">订单编号</text>
          <text class="info">{{orderDetail.orderSeq}}</text>
        </view>
        <view class="label_item">
          <text class="tit">订单金额</text>
          <text class="info">￥{{orderDetail.salePrice || 0}}</text>
        </view>
        <view class="label_item">
          <text class="tit">手机号</text>
          <text class="info">{{orderDetail.mobile || '-'}}</text>
        </view>
      </view>
      <view class="content_b">
        <view class="label_item">
          <text class="tit">学员姓名</text>
          <text class="info">{{orderDetail.studentName || '-'}}</text>
        </view>
        <view class="label_item">
          <text class="tit">证件号码</text>
          <text class="info">{{orderDetail.idNo || '-'}}</text>
        </view>
        <view class="label_item">
          <text class="tit">证件地址</text>
          <text class="info flex_item">{{orderDetail.address || '-'}}</text>
        </view>
        <view class="label_item">
          <text class="tit">培训车型</text>
          <text class="info">{{orderDetail.carModel ? addCarModelText(orderDetail.carModel) : '-'}}</text>
        </view>
        <view class="label_item">
          <text class="tit">学车类型</text>
          <text class="info">{{orderDetail.learnTypeText || '-'}}</text>
        </view>
        <view class="label_item">
          <text class="tit">班别</text>
          <text class="info">{{orderDetail.className || '-'}}</text>
        </view>
        <view class="label_item" v-if="orderDetail.isIntact === 1 && orderDetail.driveType && orderDetail.learnTypeId == 2">
          <text class="tit">原驾驶证类型</text>
          <text class="info">{{orderDetail.driveType ? driveType[orderDetail.driveType - 1] : '-'}}</text>
        </view>
        <view class="label_item" v-if="orderDetail.isIntact === 1 && orderDetail.driveEndDate && orderDetail.learnTypeId == 2">
          <text class="tit">原证件有效期</text>
          <text class="info">{{(orderDetail.driveEndDate) ? (orderDetail.driveEndDate) : '-'}}</text>
        </view>
        <view class="label_item" v-if="orderDetail.isIntact === 1 && orderDetail.trainStageText && (orderDetail.learnTypeId == 3 || orderDetail.learnTypeId == 4)">
          <text class="tit">培训阶段</text>
          <text class="info">{{orderDetail.trainStageText || '-'}}</text>
        </view>
      </view>
    </view>
    <view v-else>
      <view class="content_m">
        <view class="label_item">
          <text class="tit">缴费方式</text>
          <text class="info">{{orderDetail.isInstallment === 1 ? '分期缴费' : '全额缴费'}}</text>
        </view>
        <view v-if="orderDetail.isInstallment === 1">
          <view class="label_item">
            <text class="tit">一期支付金额</text>
            <text class="info">￥{{orderDetail.payDtoList && orderDetail.payDtoList[0].amount || '-'}}</text>
          </view>
          <view class="label_item">
            <text class="tit">一期支付时间</text>
            <text class="info">{{orderDetail.payDtoList && orderDetail.payDtoList[0].payTime || '-'}}</text>
          </view>
        </view>
        <view v-else>
          <view class="label_item">
            <text class="tit">支付金额</text>
            <text class="info">￥{{orderDetail.amount || '-'}}</text>
          </view>
          <view class="label_item">
            <text class="tit">支付时间</text>
            <text class="info">{{orderDetail.payDtoList && orderDetail.payDtoList[0].payTime || '-'}}</text>
          </view>
        </view>
      </view>
      <view class="content_m" v-if="orderDetail.payDtoList && orderDetail.payDtoList[1]">
        <view class="label_item">
          <text class="tit">尾款支付金额</text>
          <text class="info">￥{{orderDetail.payDtoList && orderDetail.payDtoList[1] && orderDetail.payDtoList[1].amount || '-'}}</text>
        </view>
        <view class="label_item">
          <text class="tit">尾款支付时间</text>
          <text class="info">{{orderDetail.payDtoList && orderDetail.payDtoList[1] && orderDetail.payDtoList[1].payTime || '-'}}</text>
        </view>
      </view>
    </view>
    <view class="content_bottom">
      <view class="title">温馨提示</view>
      <view class="info">
        <text class="remark">
          为不影响您的学车进度，请在学车信息填报后尽快前往附近的服务门店完成录指纹、人脸采集和体检等事项。
        </text>
      </view>
      <view class="link" @click="toIndex">查看服务门店</view>
    </view>
  </view>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { imgDomain } from '@/assets/js/config';
import { navigateToForm, wechatPay, addCarModelText } from '@/assets/js/common';
import { driveTypeFilter } from '@/assets/js/enums';
import { setGlobalData } from '@/assets/js/global_data';

@Component
export default class SignUpOrderDetail extends Vue {
  imgDomain = imgDomain;

  orderId = '';

  onLoad(options: any) {
    this.orderId = options.orderId;
    this.getDetail();
  }

  onShow() {
    if (this.orderId) this.getDetail();
  }

  driveType = driveTypeFilter;

  orderDetail: any = {};

  async getDetail() {
    const detail = await this.$http.get('order/v1/app/getOrder', { orderId: this.orderId });
    if (!detail) return;
    if (detail.learnType) {
      detail.learnTypeText = JSON.parse(detail.learnType).label;
      detail.learnTypeId = JSON.parse(detail.learnType).id;
    }
    if (detail.trainStage && detail.trainStage !== '{}') {
      detail.trainStageText = JSON.parse(detail.trainStage).label;
    }
    this.orderDetail = detail;
  }

  tabIndex = 1;

  toIndex() {
    uni.reLaunch({
      url: `/pages/public/home/index?schoolId=${uni.getStorageSync('schoolId')}&toShop=1`
    });
  }

  addCarModelText(carModel: string) {
    return addCarModelText(carModel);
  }

  fill() {
    setGlobalData('carModel', this.orderDetail.carModel);
    navigateToForm(this.orderDetail.orderId);
  }

  async wechatPay(key: number) {
    const { orderId, balance, isInstallment } = this.orderDetail;
    await wechatPay(orderId, balance, isInstallment, key);
    this.getDetail();
  }
}

</script>

<style lang="less" scoped>
.content {
  padding: 24rpx;
  &_t, &_m, &_b, &_f {
    background-color: #fff;
    padding: 0 32rpx;
    border-radius: 8rpx;
  }
  &_t {
    padding: 0 32rpx;
  }
}
.content_t {
  padding-top: 0;
  .pay_time{
    color: @ctjt-color-text-secondary-one;
    font-size: 24rpx;
    line-height: 80rpx;
    border-bottom: solid 1rpx @ctjt-color-border-two;
    margin-bottom: 24rpx;
    .text1{
      float: right;
    }
  }
  .goods {
    &_info {
      display: flex;
      padding-bottom: 24rpx;
      border-bottom: solid 1rpx @ctjt-color-border-two;
      .image_box {
        width: 150rpx;
        height: 150rpx;
        .img {
          width: 100%;
          height: 100%;
        }
      }
      .info_box {
        margin-left: 24rpx;
        flex: 1;
        .title {
          font-size: 28rpx;
          color: @ctjt-color-text-main;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          line-height: 42rpx;
        }
        .is_installment{
          width: 106rpx;
          line-height: 34rpx;
          border-radius: 4rpx;
          color: @ctjt-color-btn-bgr;
          border: solid 1rpx @ctjt-color-btn-bgr;
          text-align: center;
          font-size: 24rpx;
          margin-top: 8rpx;
        }
        .price, .date {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .date {
          margin-top: 4rpx;
        }
        .tit {
          font-size: 28rpx;
          color: @ctjt-color-text-secondary-one;
        }
        .nums {
          font-size: 28rpx;
          color: @ctjt-color-price;
        }
      }
    }
    &_btns {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 8rpx 0 32rpx 0;
      .btn {
        box-sizing: border-box;
        width: 214rpx;
        height: 70rpx;
        color: @ctjt-color-btn-bgr;
        font-size: 26rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 35rpx;
        margin: 0 0 0 32rpx;
        padding: 0;
        border: 1rpx solid @ctjt-color-btn-bgr;
        background-color: #fff;
        &.btn1{
          color: #fff;
          background-image: linear-gradient(to right, #FF9600, #FF6D00);
          opacity: 0.66;
        }
      }
    }
  }
}
.pay_amount{
  line-height: 76rpx;
  color: @ctjt-color-text-main;
  font-size: 28rpx;
  text-align: right;
  .text1{
    font-weight: 600;
    font-size: 30rpx;
    margin-right: 24rpx;
  }
  .text2{
    color: red;
    font-weight: 600;
    font-size: 30rpx;
  }
}
.content_m, .content_b {
  margin-bottom: 32rpx;
  .label_item {
    display: flex;
    // align-items: center;
    justify-content: space-between;
    padding: 20rpx 0;
    border-bottom: 1rpx solid @ctjt-color-border-two;
    .flex_item{
      flex: 1;
      text-align: right;
      margin-left: 40rpx;
    }
    &:last-of-type {
      border-bottom: 0;
    }
    .tit {
      font-size: 28rpx;
      color: @ctjt-color-text-primary;
    }
    .info {
      font-size: 28rpx;
      color: @ctjt-color-text-secondary-two;
      word-break: break-all;
    }
  }
}
.content_f {
  margin-top: 32rpx;
  .title {
    padding: 20rpx 0;
    font-size: 28rpx;
    color: @ctjt-color-text-primary;
    border-bottom: 1rpx solid @ctjt-color-border-two;
  }
  .info {
    padding: 20rpx 0 33rpx 0;
    display: flex;
    flex-direction: column;
    font-size: 28rpx;
    .remark {
      color: @ctjt-color-text-secondary-two;
    }
    .link {
      color: #F48747;
      text-decoration: underline;
    }
  }
}
.tabbar_container {
  display: flex;
  align-items: center;
  height: 128rpx;
  padding: 32rpx 28rpx 24rpx;
  box-sizing: border-box;
  .item_bar {
    line-height: 72rpx;
    font-size: 36rpx;
    color: @ctjt-color-text-secondary-two;
    margin-right: 107rpx;
  }
  .active {
    font-size: 36rpx;
    font-weight: 500;
    color: @ctjt-color-btn-bgr;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      bottom: 5rpx;
      left: 50%;
      transform: translateX(-50%);
      height: 4rpx;
      width: 36rpx;
      background-color: @ctjt-color-btn-bgr;
    }
  }
}
.content_bottom{
  color: @ctjt-color-text-secondary-two;
  font-size: 28rpx;
  line-height: 40rpx;
  text-align: center;
  .title{
    margin-bottom: 8rpx;
  }
  .link{
    color: @ctjt-color-btn-bgr;
    text-decoration: underline;
  }
}
</style>
