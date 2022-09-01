<template>
  <view class="cv_wrap">
    <view class="list">
      <view class="default_box" v-if="cardList.length === 0">
        <image :src="defaultImg()" class="detault_img"></image>
        <view class="warn">暂无信息～</view>
      </view>
      <Coupon
        v-for="(item, index) in cardList"
        :key="index"
        :item="item"
      ></Coupon>
    </view>
    <view class="tips" v-if="cardList.length"
      ><text>卡券不能叠加使用</text></view
    >
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Coupon from './coupon.vue';

@Component({
  components: { Coupon },
})
export default class CardVoucher extends Vue {
  defaultImg = () => 'https://file.aicar365.com/mini-program/common/queshengye_banbiexinxi.png';

  cardList = [];

  /** 获取优惠券 */
  async queryCardVoucher() {
    try {
      const userId = uni.getStorageSync('userId');
      this.cardList = await this.$http.get('sale/v1/mkt/coupon/getMyCoupon', {
        userId,
      });
    } catch (error) {
      this.cardList = [];
    }
  }

  onShow() {
    this.queryCardVoucher();
  }
}
</script>
<style lang="less" scoped>
.cv_wrap {
  height: 100%;
  background-color: @ctjt-color-text-white;
  .list {
    padding: 40rpx 34rpx 0 34rpx;
    .default_box {
      color: @ctjt-color-text-primary;
      text-align: center;
      padding-top: 400rpx;
      font-size: 28rpx;
      background: #fff;
      padding-top: 144rpx;
      text-align: center;
      .detault_img {
        width: 422rpx;
        height: 326rpx;
      }
      .warn {
        font-size: 28rpx;
        color: @ctjt-color-text-secondary-one;
        line-height: 40rpx;
      }
    }
  }
  .tips {
    color: @ctjt-color-text-main;
    font-size: 26rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40rpx 0;
    width: 100%;
  }
}
</style>
