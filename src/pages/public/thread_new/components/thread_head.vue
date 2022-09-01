<template>
  <view class="thd_container">
    <view class="input_wrap">
      <input
        class="item_input"
        v-model.trim="keyword"
        confirm-type="search"
        @confirm="doSearch"
        placeholder="请输入关键词进行搜索"
      />
      <image class="icon_search" :src="searchIcon()" @click="doSearch"></image>
      <!-- <text class="icon_search" @click="searchFun">&#xe6a8;</text> -->
    </view>
    <view class="sx_wrap" @click="$emit('openSearchDialog')">
      <image class="icon_shaixuan" :src="shaixuanIcon()"></image>
      <!-- <text class="icon_shaixuan">&#xe69f;</text> -->
      筛选
    </view>
  </view>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';

@Component
export default class ThreadHead extends Vue {
  keyword = '';

  searchIcon = () => 'https://file.aicar365.com/mini-program/common/icon/icon_sousuo.png';

  shaixuanIcon = () => 'https://file.aicar365.com/mini-program/common/icon/icon_shaixuan.png';

  @Emit('searchDataByKeyword')
  doSearch() {
    return this.keyword;
  }
}
</script>
<style lang="less" scoped>
.thd_container {
  background: @ctjt-color-text-white;
  height: 88rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 30rpx;
  .input_wrap {
    position: relative;
    display: flex;
    align-items: center;
    .icon_search {
      position: absolute;
      // left: 30rpx;
      width: 28rpx;
      height: 28rpx;
      padding: 20rpx 10rpx 20rpx 30rpx;
    }
    .item_input {
      position: relative;
      padding-left: 70rpx;
      height: 62rpx;
      width: 552rpx;
      background-color: @ctjt-bgcolor-primary;
      color: @ctjt-color-text-main;
      border-radius: 30rpx;
      font-size: 28rpx;
      line-height: 1;
      margin-right: 24rpx;
    }
  }
  .sx_wrap {
    display: grid;
    color: @ctjt-color-text-secondary-one;
    font-size: 20rpx;
    text-align: center;
    .icon_shaixuan {
      width: 44rpx;
      height: 44rpx;
    }
  }
}
</style>
