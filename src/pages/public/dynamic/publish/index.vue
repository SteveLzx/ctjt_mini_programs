<template>
  <scroll-view class="p_wrap" scroll-y="true">
    <view class="content">
      <view class="title">选择想发布的动态活动</view>
      <view class="select_wrap">海报</view>
      <view class="c_poster" scroll-x scroll-y>
        <view class="item_box" @click="jumpToActivity(3, item)" v-for="item in posterList" :key="item.id">
          <image class="poster" :src="imgDomain + item.url"></image>
          <view class="label">{{item.name}}</view>
        </view>
      </view>
      <template v-if="dynamicTypeList.length > 0">
        <view class="select_wrap c_sale">营销活动</view>
        <view class="list">
          <view
            class="list_item"
            v-for="item in dynamicTypeList"
            :key="item.value"
            @click="jumpToActivity(item.value)"
          >
            <text class="iconfont" v-if="item.value === 4">&#xe6b2;</text>
            <text class="iconfont" v-if="item.value === 2">&#xe6b3;</text>
            <label class="type_text">{{ item.label }}</label>
          </view>
        </view>
      </template>
    </view>
  </scroll-view>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { schoolId } from '@/config/build_path';
import { imgDomain } from '@/assets/js/config';
import { setGlobalData } from '@/assets/js/global_data';

@Component
export default class Publish extends Vue {
  posterImg = `https://file.aicar365.com/mini-program/${schoolId}/common/gaokaohaibao.jpg?t=${new Date().getTime()}`;

  dynamicTypeList = [
    { value: 2, label: '立减' },
  ];

  imgDomain = imgDomain;

  posterList = [];

  async created() {
    if (schoolId === 16 && new Date().getTime() < new Date('2022/08/16').getTime()) {
      this.dynamicTypeList.unshift({ value: 4, label: '深港幸运大转盘' });
    }
    if (schoolId === 370 && new Date().getTime() < new Date('2022/07/20').getTime()) {
      this.dynamicTypeList.unshift({ value: 4, label: '广仁邀您抽大奖' });
    }
    if (schoolId === 638) {
      this.dynamicTypeList = [];
    }
    const data = await this.$http.get('sale/v1/mkt/schoolInfo');
    this.posterList = data.posters || [];
  }

  // 跳转到具体活动页
  jumpToActivity(type: number, item?: any) {
    const path = {
      1: 'fenxiao',
      2: 'lijian',
      3: 'nemt',
      4: 'coolschoolcar'
    };
    if (type === 3) {
      setGlobalData('posterDetail', item);
    }
    uni.navigateTo({
      url: `/pages/public/dynamic/publish/${path[type]}`,
    });
  }
}
</script>
<style lang="less" scoped>
.p_wrap {
  height: 100%;
  width: 100%;
  background-color: #fff;
  box-sizing: border-box;
  .content {
    height: 100%;
    padding: 40rpx 64rpx 0;
    padding-bottom: calc(100rpx +  constant(safe-area-inset-bottom)); /*兼容 IOS<11.2*/
    padding-bottom: calc(100rpx +  env(safe-area-inset-bottom)); /*兼容 IOS>11.2*/
    box-sizing: border-box;
    .title {
      font-size: 32rpx;
      line-height: 32rpx;
      color: @ctjt-color-text-main;
    }
    .c_poster {
      display: flex;
      margin-top: 24rpx;
      overflow: scroll;
      .item_box {
        margin-right: 20rpx;
        .poster {
          width: 280rpx;
          height: 604rpx;
          border-radius: 24rpx;
        }
        .label {
          line-height: 26rpx;
          color: @ctjt-color-text-main;
          font-size: 26rpx;
          text-align: center;
          margin-top: 8rpx;
        }
      }
    }
    .select_wrap {
      font-size: 26rpx;
      line-height: 26rpx;
      margin: 40rpx 0rpx 24rpx 0rpx;
      color: @ctjt-color-text-main;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .iconfont {
        font-size: 26rpx;
        line-height: 26rpx;
      }
    }
    .c_sale {
      margin-top: 56rpx;
    }
    .list {
      .list_item {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: @ctjt-bgcolor-primary;
        border-radius: 24rpx;
        height: 160rpx;
        margin-bottom: 32rpx;
        .iconfont {
          font-size: 34rpx;
          line-height: 34rpx;
          color: @ctjt-color-primary;
        }
        .type_text {
          margin-left: 8rpx;
          color: @ctjt-color-text-secondary-four;
          font-size: 32rpx;
          line-height: 32rpx;
        }
      }
    }
  }
}
</style>
