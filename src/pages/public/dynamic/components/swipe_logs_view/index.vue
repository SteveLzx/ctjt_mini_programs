<template>
  <view class="c_swipe_logs_view">
    <view class="data_tit">{{title}}</view>
    <view class="scroll_view">
      <scroll-view scroll-x="true" scroll-with-animation="true">
        <view class="user_box" v-for="item in 5" :key="item">
          <view class="user_av">
            <image
              src="https://file.aicar365.com/mini-program/common/huodongjiemian_banner.png"
              mode="aspectFill"
            ></image>
          </view>
          <view class="user_name">纸飞机教练纸飞机教练纸飞机教练</view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<script lang="ts">
import DownloadShare from '@/components/download_share/index.vue';

import {
  Vue, Component, Prop, Emit
} from 'vue-property-decorator';

@Component({
  components: { DownloadShare },
})
export default class DynamicSwipeLogsView extends Vue {
  @Prop({ default: '最近查看' }) title!: string
}
</script>

<style lang="less" scoped>
  .c_swipe_logs_view {
    background: @ctjt-bgcolor-primary;
    border-radius: 24rpx;
    display: -webkit-box;
    height: 94rpx;
    line-height: 94rpx;
    color: @ctjt-color-text-secondary-one;
    font-size: 26rpx;
    padding: 16rpx 0;
    margin-bottom: 16rpx;
    &:last-child {
      margin: 0;
    }
  }
  .data_tit {
    padding: 0 18rpx 0 24rpx;
    position: relative;
    &::after {
      content: '';
      width: 1rpx;
      height: 94rpx;
      background-image: linear-gradient(#f5f3f5, #e5e5e5, #f5f3f5);
      position: absolute;
      right: 1rpx;
      top: 50%;
      margin-top: -47rpx;
    }
  }
  .scroll_view {
    flex: 1;
    white-space: nowrap;
    .user_box {
      width: 33.3%;
      display: inline-block;
      text-align: center;
      position: relative;
      padding: 0 12rpx;
      box-sizing: border-box;
      &::before {
        content: '';
        width: 1rpx;
        height: 94rpx;
        background-image: linear-gradient(#f5f3f5, #e5e5e5, #f5f3f5);
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -47rpx;
      }
      .user_av {
        height: 60rpx;
        margin-bottom: 8rpx;
        image {
          width: 60rpx;
          height: 60rpx;
          border-radius: 50%;
          vertical-align: top;
        }
      }
      .user_name {
        line-height: 26rpx;
        color: @ctjt-color-text-secondary-two;
        overflow: hidden;
        width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>
