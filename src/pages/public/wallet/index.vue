<template>
  <view class="wt_wrap">
    <view class="header_section">
      <view class="total_container">
        <view class="total_count">
          <view class="dec">可提现余额(元) / 累计总金额(元)</view>
          <view class="money_number">
            <text>900</text>
            <text>/6,300</text>
          </view>
        </view>
      </view>
    </view>
    <view class="record_section">
      <scroll-view
        class="list"
        scroll-y="true"
        lower-threshold="40"
        @scrolltolower="scrollLower"
      >
        <view class="container">
          <view class="item" v-for="item in list" :key="item.id">
            <view class="date"
              ><view>{{ item.idNo }}</view
              ><view>400</view></view
            >
            <view class="content"
              ><view>{{ item.userName }}</view
              ><view>+200</view></view
            >
          </view>
          <view class="item no_more" v-if="status === 'nomore'"
            >没有更早的记录了</view
          >
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Wallet extends Vue {
  private list = [];

  // 是否还有数据需要加载，决定文本显示什么内容
  status = '';

  currentPage = 1;

  pages = 0; // 总页数

  total = 0;

  timer = null;

  // 触底加载更多
  scrollLower() {
    // this.status = 'loading';
    this.currentPage += 1; // 滚动条触到底部时page+1
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.getList();
      if (this.currentPage >= this.pages) {
        this.status = 'nomore';
      }
    }, 1000);
  }

  // 下拉刷新
  onPullDownRefresh() {
    this.currentPage = 1;
    this.status = '';
    this.getList();
  }

  async getList() {
    // uni.showNavigationBarLoading(); // 显示加载动画
    uni.showLoading({
      title: '加载中',
    });
    const sendData = {
      current: this.currentPage,
      pageSize: 10,
      batchNos: null,
    };
    const body = await this.$http.post('license/v1/paper/page', sendData);
    const {
      total, current, pageCount, data
    } = body;
    data.forEach((item: any) => {
      this.list.push(item);
    });
    this.total = total;
    this.currentPage = current;
    this.pages = pageCount;
    uni.stopPullDownRefresh(); // 停止刷新
    // uni.hideNavigationBarLoading(); // 关闭加载动画
    uni.hideLoading();
  }

  onShow() {
    this.getList();
  }
}
</script>
<style lang="less" scoped>
.wt_wrap {
  height: 100vh;
  .header_section {
    padding: 40rpx 30rpx;
    background-color: @ctjt-color-text-white;
    .total_container {
      background: url(https://file.aicar365.com/mini-program/marketing/wode_img_youyongjin.png)
        no-repeat;
      background-size: 100% auto;
      background-position: left top;
      border-radius: 24rpx;
      width: 690rpx;
      height: 230rpx;
      display: flex;
      align-items: center;
      .total_count {
        > view {
          color: @ctjt-color-text-main;
          padding-left: 32rpx;
        }
        .dec {
          font-size: 22rpx;
          line-height: 1;
          margin-bottom: 12rpx;
        }
        .money_number > text {
          color: @ctjt-color-text-main;
          line-height: 1;
          &:first-child {
            font-size: 56rpx;
          }
          &:last-child {
            font-size: 26rpx;
          }
        }
      }
    }
  }
  .record_section {
    height: calc(100% - 310rpx);
    margin-top: 24rpx;
    background-color: @ctjt-color-text-white;
    .list {
      position: absolute;
      bottom: 62rpx;
      top: 334rpx;
      width: 100%;
      .container {
        padding: 0 30rpx;
        height: auto;
        .item {
          padding: 32rpx 0;
          border-bottom: 1px solid @ctjt-color-border-two;
          &:last-child {
            border-bottom: 0;
          }
          .date {
            display: flex;
            justify-content: space-between;
            font-size: 22rpx;
            line-height: 22rpx;
            color: @ctjt-color-text-secondary-one;
            margin-bottom: 16rpx;
          }
          .content {
            display: flex;
            justify-content: space-between;
            font-size: 26rpx;
            line-height: 26rpx;
            color: @ctjt-color-text-secondary-three;
          }
        }
        .no_more {
          font-size: 24rpx;
          line-height: 1;
          color: @ctjt-color-text-secondary-one;
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          // height: 80rpx;
          background-color: @ctjt-bgcolor-primary;
        }
      }
    }
  }
}
</style>
