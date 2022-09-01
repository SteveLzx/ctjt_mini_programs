<template>
  <view class="content">
    <view class="content_t">
      <view class="title">
        <text class="iconfont">&#xe6b1;</text>支付成功
      </view>
      <view class="list">
        <view class="item">
          <text class="tit">支付金额</text>
          <text class="price">￥{{payAmount}}</text>
        </view>
        <view class="item">
          <text class="tit">商品信息</text>
          <text class="info">{{productName}}</text>
        </view>
      </view>
      <view class="tips">
        <text class="tit">温馨提示</text>
        <text class="info">请尽快完善报名信息并前往附近的门店完成录指纹、人脸采集和体检、方便我们为您在车管所注册学车信息。</text>
      </view>
      <view class="opt_box">
        <button class="detail" @click="toDetail">查看订单</button>
        <button class="info" @click="fill">完善报名信息</button>
      </view>
    </view>
    <SplitterBar :tit="'服务订单'" :splitterStyle="'padding: 30rpx 0;background: #f4f4f4;margin: 0;'"></SplitterBar>
    <view class="content_b">
      <view class="list">
        <view class="item" v-for="item in optList" :key="item.value">
          <span class="iconfont" v-html="item.icon"></span>
          <text class="text">{{item.label}}</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import SplitterBar from '@/components/splitter_bar/index.vue';
import { navigateToForm } from '@/assets/js/common';

@Component(
  {
    components: { SplitterBar }
  }
)
export default class SignUpSuccess extends Vue {
  private optList = [
    { value: 1, label: '拒绝吃拿卡要', icon: '&#xe62d;' },
    { value: 2, label: '随时随学', icon: '&#xe631;' },
    { value: 3, label: '一键投诉', icon: '&#xe62f;' },
    { value: 4, label: '收费透明', icon: '&#xe62e;' },
  ]

  payAmount = 0; // 支付金额

  productName = ''; // 商品信息

  orderId = ''; // 订单ID

  onLoad(options: any) {
    this.payAmount = options.payAmount;
    this.productName = options.productName;
    this.orderId = options.orderId;
  }

  fill() {
    navigateToForm(this.orderId);
  }

  toDetail() {
    uni.reLaunch({
      url: `/package_order/sign_up_order_detail/index?orderId=${this.orderId}`
    });
  }
}

</script>

<style lang="less" scoped>
.content{
  background: #fff;
}
.content_t {
  padding: 60rpx 0 56rpx;
  background-color: #fff;
  .title {
    font-size: 42rpx;
    color: @ctjt-color-text-main;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    .iconfont {
      font-size: 56rpx;
      color: @ctjt-color-primary;
      margin-right: 16rpx;
    }
  }
  .list {
    padding: 0 56rpx;
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 29rpx 0 31rpx 0;
      border-bottom: 1px solid @ctjt-color-border-two;
      .tit {
        font-size: 28rpx;
        color: @ctjt-color-text-secondary-two;
      }
      .price {
        font-size: 30rpx;
        color: @ctjt-color-price;
      }
      .info {
        font-size: 28rpx;
        color: @ctjt-color-text-main;
      }
    }
  }
  .tips {
    box-sizing: border-box;
    margin-top: 32rpx;
    padding: 0 51rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: @ctjt-color-text-secondary-two;
    .tit {
      font-size: 28rpx;
      margin-bottom: 6rpx;
    }
    .info {
      min-height: 108rpx;
      font-size: 24rpx;
      line-height: 36rpx;
      text-align: center;
    }
  }
  .opt_box {
    margin-top: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    .detail, .info {
      width: 240rpx;
      height: 70rpx;
      background-color: #fff;
      border: 1px solid @ctjt-color-text-main;
      font-size: 26rpx;
      color: @ctjt-color-text-main;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 35rpx;
    }
    .info {
      color: @ctjt-color-text-main;
      border: 0;
      margin-left: 80rpx;
      background: @ctjt-color-primary;
    }
  }
}

.content_b {
  height: 500rpx;
  background-color: #fff;
  .list {
    padding: 24rpx 0;
    display: flex;
    justify-content: space-between;
    .item {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .iconfont {
        font-size: 90rpx;
        color: @ctjt-color-primary;
      }
      .text {
        margin-top: 14rpx;
        font-size: 22rpx;
        color: @ctjt-color-text-main;
      }
    }
  }
}
</style>
