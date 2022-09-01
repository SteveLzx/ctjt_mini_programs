<template>
  <view class="content">
    <view class="goods_section">
      <view class="image_box" v-if="productDetail.photoUrlMain">
        <image class="goods_img" mode="aspectFill" :src="imgDomain + productDetail.photoUrlMain"></image>
      </view>
      <view class="info_box">
        <view class="title">{{productDetail.name}}</view>
        <view class="price_nums">
          <text class="price">￥{{currentTrainingItem.salesPrice}}</text>
          <text class="nums">X 1</text>
        </view>
      </view>
    </view>
    <view class="pay_type_box" v-if="productDetail.isInstallment === 1">
      <view class="tit">
        请选择缴费方式<text class="icon_bg1 iconfont">&#xe6b0;</text>
      </view>
      <view class="pay_type" @click="payPrice = currentTrainingItem.salesPrice">
        全额缴费
        <text class="iconfont icon_select_active" v-if="payPrice === currentTrainingItem.salesPrice">&#xe6b1;</text>
        <text class="icon_select" v-else></text>
      </view>
      <view class="pay_type pay_type_2" @click="payPrice = productDetail.phaseOneAmount">
        分期缴费
        <text class="iconfont icon_select_active" v-if="payPrice === productDetail.phaseOneAmount">&#xe6b1;</text>
        <text class="icon_select" v-else></text>
        <view>一期支付￥{{productDetail.phaseOneAmount}}；尾款支付￥{{((currentTrainingItem.salesPrice - productDetail.phaseOneAmount) * 100).toFixed(0) / 100}}</view>
      </view>
    </view>
    <!-- 支付 -->
    <view class="fixed_container">
      <view class="price">
        <text class="text">需支付：</text>
        <text class="nums">¥{{payPrice}}</text>
      </view>
      <view class="submit">
        <button class="btn" @click="orderConfirm">立即支付</button>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { getGlobalData, setGlobalData } from '@/assets/js/global_data';
import { imgDomain } from '@/assets/js/config';
import { wechatPay } from '@/assets/js/common';

@Component
export default class Payment extends Vue {
  @Prop({ required: true }) tit!: string;

  currentTrainingItem: any = {}; // 当前规格

  productDetail: any = {};

  payPrice = 0; // 支付金额

  payAmount = 0; // 下单金额

  orderId = ''; // 订单ID

  imgDomain = imgDomain;

  created() {
    this.currentTrainingItem = getGlobalData('currentTrainingItem');
    this.productDetail = getGlobalData('productDetail');
    this.payPrice = this.currentTrainingItem.salesPrice;
  }

  async orderConfirm() {
    // 记录orderId和下单的价格,重新点击支付如果价格未改变，直接支付前面的单
    if (this.payAmount !== this.payPrice || !this.orderId) {
      uni.showLoading({
        title: ''
      });
      const data = {
        amount: String(this.payPrice),
        isInstallment: this.payPrice === this.productDetail.phaseOneAmount ? 1 : 0,
        productId: this.productDetail.id,
        productName: this.productDetail.name,
        classesName: this.productDetail.className,
        classesId: this.productDetail.classId,
        referrerId: getGlobalData('inviterId') || '',
        carModel: this.currentTrainingItem.label
      };
      const order = await this.$http.post('order/v1/app/confirm', data);
      this.payAmount = this.payPrice;
      this.orderId = order.orderId;
      uni.hideLoading();
    }
    await wechatPay(this.orderId, this.payPrice, this.payPrice === this.productDetail.phaseOneAmount ? 1 : 0, 1);
    setGlobalData('carModel', this.currentTrainingItem.label);
    uni.redirectTo({
      url: `/package_order/sign_up_success/index?payAmount=${this.payAmount}&productName=${this.productDetail.name}&orderId=${this.orderId}`
    });
  }
}

</script>

<style lang="less" scoped>

.content {
  padding: 24rpx;
}
.goods_section {
  background-color: #fff;
  padding: 32rpx 32rpx 26rpx;
  display: flex;
  border-radius: 8rpx;
  margin-bottom: 24rpx;
  .image_box {
    width: 260rpx;
    height: 202rpx;
    .goods_img {
      width: 100%;
      height: 100%;
      background-color: @ctjt-color-primary;
    }
  }
  .info_box {
    flex: 1;
    margin-left: 32rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .title {
      font-size: 32rpx;
      color: @ctjt-color-text-main;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .price_nums {
      margin-top: 55rpx;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      .price {
        font-size: 32rpx;
        color: @ctjt-color-price;
      }
      .nums {
        font-size: 20rpx;
        color: @ctjt-color-text-secondary-one
      }
    }
  }
}
.fixed_container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 32rpx;
  height: 98rpx;
  background-color: #F7F7FA;
  box-shadow: 0 4rpx 8rpx 4rpx rgba(0, 0, 0, 0.1);
  .price {
    display: flex;
    align-items: baseline;
    .text {
      font-size: 24rpx;
      color: @ctjt-color-text-main;
    }
    .nums {
      font-size: 32rpx;
      color: @ctjt-color-price;
    }
  }
  .submit {
    .btn {
      width: 240rpx;
      line-height: 60rpx;
      border-radius: 8rpx;
      background: @ctjt-color-primary;
      font-size: 26rpx;
      color: @ctjt-color-text-main;
    }
  }
}
.pay_type_box{
  border-radius: 8rpx;
  background: #fff;
  padding: 0 32rpx;
  > view{
    line-height: 100rpx;
    border-bottom: solid 1rpx @ctjt-color-border-two;
    color: @ctjt-color-text-main;
    font-size: 28rpx;
    position: relative;
    .icon_bg1{
      font-size: 22rpx;
      margin-left: 8rpx;
      color: @ctjt-color-primary;
      position: relative;
      top: -2rpx;
    }
    .icon_select{
      width: 40rpx;
      height: 40rpx;
      background: #d8d8d8;
      border-radius: 50%;
      position: absolute;
      right: 0;
      top: 50%;
      margin-top: -20rpx;
    }
    .icon_select_active{
      font-size: 40rpx;
      color: @ctjt-color-primary;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .pay_type_2{
    border: none;
    height: 126rpx;
    view{
      color: @ctjt-color-text-secondary-two;
      font-size: 22rpx;
      line-height: 22rpx;
      position: absolute;
      bottom: 26rpx;
    }
  }
}
</style>
