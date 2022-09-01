<template>
  <view class="th_record_wrap">
    <view class="default_box" v-if="listFlag && list.length === 0">
      <image :src="defaultImg()" class="detault_img"></image>
      <view class="warn">暂无信息～</view>
    </view>
    <view
      class="record_item"
      v-for="(item, i) in list"
      :key="i"
      :class="{ last_item: list.length === 1 }"
    >
      <view class="date_tag">{{ item.descriptionTime }}</view>
      <view class="text_tag">{{ item.description }}</view>
    </view>
    <slot name="remark"></slot>
  </view>
</template>
<script lang="ts">
import {
  Component, Vue, Emit, Prop
} from 'vue-property-decorator';

@Component
export default class ThreadRecordItem extends Vue {
  @Prop({ required: true }) list!: [];

  @Prop({ required: true }) listFlag!: false;

  defaultImg = () => 'https://file.aicar365.com/mini-program/common/queshengye_banbiexinxi.png';
}
</script>
<style lang="less" scoped>
@import url('../common.less');
.th_record_wrap {
  padding: 0 30rpx 160rpx 30rpx;
  .record_item {
    overflow: hidden;
    border-bottom: 1px solid @ctjt-color-border-two;
    padding: 40rpx 0 16rpx 0;
    &:last-child {
      border-bottom: none;
    }
    .date_tag {
      font-size: 26rpx;
      line-height: 1;
      color: @ctjt-color-text-secondary-two;
      margin-bottom: 8rpx;
    }
    .text_tag {
      font-size: 26rpx;
      line-height: 38rpx;
      color: @ctjt-color-text-black;
      word-break: break-all;
    }
  }
  .last_item {
    border-bottom: 1px solid @ctjt-color-border-two !important;
  }
  .user_remark {
    margin-top: 40rpx;
    > textarea {
      background-color: @ctjt-bgcolor-primary;
      color: @ctjt-color-border-one;
      padding: 20rpx;
      height: 164rpx;
      width: calc(100% - 40rpx);
      border-radius: 24rpx;
    }
  }
}
</style>
