// 班别组件
<template>
  <view class="item_goods">
    <image :src="imgDomain + item.photoUrl" mode="aspectFill" @click="toDetails(item)" class="goods_img"></image>
    <view class="price_share">
      <view class="price">
        <text class="unit">¥</text>
        <text class="nums">{{item.appPrice}}</text>
        <text class="old_p">¥{{item.appPrice + 200}}</text>
      </view>
      <view class="share">
        <!-- <span class="iconfont">&#xe695;</span> -->
        <span class="iconfont" @click="$emit('downloadPoster', {detail: item, type: 4, source: 'list'})" :data-detail="item" :data-type="4">&#xe69a;</span>
        <button class="share" open-type='share' :data-detail="item" :data-type="4" :data-source="'list'" v-if="!isCoach">
          <text class="iconfont">&#xe696;</text>
        </button>
        <button class="share" @click="$emit('coachShare', {detail: item, type: 4, source: 'list'})" :data-detail="item" :data-type="4" :data-source="'list'" v-else>
          <text class="iconfont">&#xe696;</text>
        </button>
      </view>
    </view>
    <view class="title" @click="toDetails(item)">
      <view class="label">报名有礼</view>
      {{item.appName}}
    </view>
    <view class="browse">
      <text>浏览{{item.browseNumber}}次</text>
      <!-- <text style="margin-left: 32rpx;">已报名{{item.registeredNumber}}</text> -->
    </view>
    <!-- <view class="sign_up">
      <Barrage :timeout="Math.floor(Math.random() * 4000) * (index + 1) + 4000"></Barrage>
    </view> -->
    <!-- 报名按钮 -->
    <view class="btns">
      <button class="sign_btn" @click="toDetails(item)">立即报名</button>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
// import { imgDomain } from '@/assets/js/config';
// import Barrage from '@/components/barrage/index.vue';

@Component
export default class ClassCom extends Vue {
  @Prop({
    default: {}
  }) item; // 内容详情

  @Prop({
    default: 1
  }) index; // 循环下标，用于滚动数据

  @Prop({
    default: false
  }) isCoach; // 是否显示为教练端

  imgDomain = 'https://file.aicar365.com/';

  // 跳转详情
  toDetails(item: any) {
    uni.navigateTo({
      url: `/pages/public/goods_detail/index?id=${item.id}`,
    });
  }
}

</script>

<style lang="less" scoped>
.item_goods {
  position: relative;
  border-radius: 24rpx;
  overflow: hidden;
  background-color: #fff;
  margin-bottom: 40rpx;
  .goods_img{
    width: 100%;
    max-height: 346rpx;
    vertical-align: top;
  }
  .price_share {
    padding: 28rpx 32rpx 12rpx;
    display: flex;
    justify-content: space-between;
    .price {
      display: flex;
      align-items: baseline;
      .unit {
        font-size: 32rpx;
        color: @ctjt-color-price;
        margin-right: 4rpx;
        line-height: 32rpx;
      }
      .nums {
        font-size: 56rpx;
        line-height: 56rpx;
        color: @ctjt-color-price;
        font-weight: 600;
      }
      .old_p {
        margin-left: 16rpx;
        font-size: 26rpx;
        line-height: 26rpx;
        color: @ctjt-color-text-secondary-one;
        text-decoration: line-through;
      }
    }
    .share {
      display: flex;
      .iconfont {
        height: 48rpx;
        font-size: 48rpx;
        color: @ctjt-color-text-main;
        padding: 0 24rpx;
        &:last-child{
          padding-right: 0;
        }
      }
    }
  }
  .title {
    .label{
      background: @ctjt-color-primary;
      padding: 0 8rpx;
      border-radius: 8rpx;
      display: inline-block;
      margin-right: 8rpx;
    }
    padding: 0 32rpx 0;
    line-height: 40rpx;
    font-size: 32rpx;
    // display: -webkit-box;
    // -webkit-box-orient: vertical;
    // -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: @ctjt-color-text-main;
  }
  .browse {
    padding: 64rpx 36rpx 28rpx;
    font-size: 26rpx;
    line-height: 26rpx;
    color: @ctjt-color-text-secondary-two;
  }
  .sign_up {
    padding: 0 32rpx 36rpx;
    display: flex;
    align-items: center;
    .image_list {
      display: flex;
      align-items: center;
      .item_img {
        width: 38rpx;
        height: 38rpx;
        border-radius: 50%;
        margin-right: 16rpx;
      }
    }
    .user {
      font-size: 26rpx;
      color: @ctjt-color-text-secondary-one;
      .tips {
        margin-left: 8rpx;
        color: @ctjt-color-text-secondary-two;
      }
    }
  }
  .btns {
    position: absolute;
    bottom: 20rpx;
    right: 32rpx;
    .sign_btn {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
      color: @ctjt-color-text-main;
      font-size: 32rpx;
      width: 200rpx;
      height: 70rpx;
      border-radius: 40rpx;
      background: @ctjt-color-primary;
    }
  }
}
</style>
