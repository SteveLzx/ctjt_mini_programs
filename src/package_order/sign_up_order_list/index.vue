<template>
  <view class="content">
    <view class="content_t" v-for="item in orderList" :key="item.orderId">
      <view class="pay_time">
        {{item.payTime}}
        <span>{{item.payStatus === 1 ? '待支付' : item.payStatus === 2 ? '已支付' : item.payStatus === 3 ? '支付失败' : ''}}</span>
      </view>
      <view class="goods_info" @click="toDetail(item)">
        <view class="image_box">
          <image class="img" :src="imgDomain + item.productUrl" mode="aspectFill"></image>
        </view>
        <view class="info_box">
          <view class="title">{{item.productName}}</view>
          <view class="is_installment" v-if="item.isInstallment === 1">分期缴费</view>
          <view class="is_installment" v-else>全额缴费</view>
        </view>
      </view>
      <view class="pay_amount">
        总价:￥<text class="text1">{{item.salePrice || 0}}</text>实付款:<text class="text2">￥{{item.amount || 0}}</text>
      </view>
      <view class="goods_btns" v-if="item.isIntact === 0 || item.balance > 0">
        <button class="btn" @click="fill(item)" v-if="item.isIntact === 0">完善信息</button>
        <button class="btn btn1" @click="wechatPay(item, 2)" v-if="item.balance > 0">支付尾款</button>
      </view>
    </view>
    <view class="default_page" v-if="orderList.length === 0">
      <image :src="defaultImg" class="default_img"></image>
      <view class="text">暂无订单～</view>
    </view>
  </view>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { imgDomain } from '@/assets/js/config';
import { wechatPay, navigateToForm, navigateToOrderDetail } from '@/assets/js/common';
import { setGlobalData } from '@/assets/js/global_data';

type DetailType = {
  orderId: string;
  balance: number;
  isInstallment: number;
  carModel: string;
}

@Component
export default class SignUpOrderDetail extends Vue {
  defaultImg = 'https://file.aicar365.com/mini-program/common/queshengye_zanwudigndan.png';

  imgDomain = imgDomain;

  onShow() {
    this.getOrderList();
  }

  orderList = [];

  async getOrderList() {
    const orderList = await this.$http.get('order/v1/app/getOrders');
    this.orderList = orderList || [];
  }

  async wechatPay(item: DetailType, key: number) {
    await wechatPay(item.orderId, item.balance, item.isInstallment, key);
    this.getOrderList();
  }

  fill(item: DetailType) {
    setGlobalData('carModel', item.carModel);
    navigateToForm(item.orderId);
  }

  toDetail(item: DetailType) {
    navigateToOrderDetail(item.orderId);
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
  margin-bottom: 32rpx;
  .pay_time{
    color: @ctjt-color-text-secondary-one;
    font-size: 24rpx;
    line-height: 80rpx;
    border-bottom: solid 1rpx @ctjt-color-border-two;
    margin-bottom: 24rpx;
    span{
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
.default_page{
  padding-top: 144rpx;
  text-align: center;
  .default_img{
    width: 422rpx;
    height: 326rpx;
  }
  .text{
    padding-top: 8rpx;
    line-height: 40rpx;
    font-size: 28rpx;
    color: rgb(102,102,102);
  }
}
.goods_btns {
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
    opacity: 0.9;
    &.btn1{
      color: #fff;
      background-image: linear-gradient(to right, #FF9600, #FF6D00);
      opacity: 0.66;
    }
  }
}
</style>
