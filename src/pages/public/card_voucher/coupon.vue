<template>
  <view class="item">
    <view
      class="item_wrap"
      :class="statusFilter(item.status) ? 'bg_red' : 'bg_grey'"
    >
      <view
        class="money"
        :class="statusFilter(item.status) ? 'red_c' : 'grey_c'"
        ><text>¥</text><text>{{ item.amount }}</text></view
      >
      <view class="reg_tag">
        <view
          class="top"
          :class="statusFilter(item.status) ? 'red' : 'grey'"
        ></view>
        <view
          class="bottom"
          :class="statusFilter(item.status) ? 'red' : 'grey'"
        ></view>
      </view>
      <view class="dec_wrap" :class="{ from_detail: from }">
        <view class="title">{{ item.name }}</view>
        <view class="mid">
          <view class="left">
            <view class="info">{{item.classesName || '适用于: 所有班别'}}</view>
            <view class="info">{{ item.beginDate }}-{{ item.endDate }}</view>
          </view>
          <view class="right" v-if="!from">
            <button
              @click="toClasses(item.status)"
              class="btn"
              :class="statusFilter(item.status) ? 'btn_red' : 'btn_grey'"
            >
              {{ statusTextFilter(item.status) }}
            </button>
          </view>
        </view>

        <view class="info last">优惠券码：{{ item.code }}</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Coupon extends Vue {
  @Prop({
    default: {},
  })
  item;

  @Prop({
    default: '',
  })
  from;

  statusFilter(status: number) {
    // 0:未领用 1:立即使用 2:已使用 3:已过期 4:已失效
    return status !== 2 && status !== 3 && status !== 4;
  }

  statusTextFilter(status: number) {
    const _text = {
      0: '未领用',
      1: '立即使用',
      2: '已使用',
      3: '已过期',
      4: '已失效',
    };
    return _text[status];
  }

  toClasses(status: number) {
    if (status === 1) {
      uni.switchTab({
        url: '/pages/public/home_new/index',
      });
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  overflow: hidden;
  margin-bottom: 40rpx;
  .item_wrap {
    display: flex;
    border-radius: 24rpx;
    .money {
      width: 160rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 26rpx 0;
      > text {
        &:first-child {
          font-size: 32rpx;
          line-height: 32rpx;
          margin-right: 4rpx;
        }
        &:last-child {
          font-size: 56rpx;
          line-height: 56rpx;
          font-family: Arial-BoldMT;
        }
      }
    }
    .reg_tag {
      width: 24rpx;
      position: relative;
      padding: 26rpx 0;
      > view {
        width: 20rpx;
        height: 20rpx;
        background-color: @ctjt-color-text-white;
        position: absolute;
        &:first-child {
          top: -12rpx;
          border-radius: 50%;
          // clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
          // -webkit-clip-path: polygon(
          //   0 50%,
          //   100% 50%,
          //   100% 100%,
          //   0 100%
          // ); // 向上半圆圈
        }
        &:last-child {
          bottom: -12rpx;
          border-radius: 50%;
          // clip-path: polygon(0 -50%, 100% -50%, 100% 50%, 0 50%);
          // -webkit-clip-path: polygon(
          //   0 -50%,
          //   100% -50%,
          //   100% 50%,
          //   0 50%
          // ); // 向下半圆圈
        }
      }
    }
    .dec_wrap {
      padding: 26rpx 0;
      margin-left: 8rpx;
      width: 498rpx;
      display: flex;
      flex-direction: column;
      &.from_detail {
        width: 384rpx;
      }
      > view {
        display: flex;
        align-items: center;
      }
      .title {
        margin-bottom: 16rpx;
        font-size: 32rpx;
        line-height: 1;
        color: @ctjt-color-text-secondary-four;
        font-family: PingFangSC-Medium;
      }
      .mid {
        justify-content: space-between;
        .right {
          margin-right: 24rpx;
          > button {
            font-size: 22rpx;
            line-height: 1;
            width: 132rpx;
            height: 40rpx;
            border-radius: 20rpx;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .btn_red {
            border: 2rpx solid @ctjt-color-price;
            color: @ctjt-color-price;
          }
          .btn_grey {
            border: 2rpx solid @ctjt-color-border-one;
            color: @ctjt-color-border-one;
          }
        }
      }
      .info {
        margin-bottom: 8rpx;
        font-size: 20rpx;
        line-height: 1;
        color: @ctjt-color-border-one;
      }
      .last {
        margin-bottom: 0;
      }
    }
  }
}
.grey_c {
  > text {
    color: @ctjt-color-text-secondary-two;
  }
}
.red_c {
  > text {
    color: @ctjt-color-price;
  }
}
.red {
  border: 1px solid @ctjt-color-border-three;
}
.grey {
  border: 1px solid @ctjt-color-border-two;
}

.bg_red {
  background: linear-gradient(to right, #fff2f2, #fbe9e8);
  background: -webkit-linear-gradient(to right, #fff2f2, #fbe9e8);
  border: 1rpx solid @ctjt-color-border-three;
}
.bg_grey {
  background-color: @ctjt-bgcolor-primary;
  border: 1rpx solid @ctjt-color-border-two;
}
</style>
