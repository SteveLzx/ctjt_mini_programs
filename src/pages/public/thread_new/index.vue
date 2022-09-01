<template>
  <view class="thread_container">
    <view class="el_height">
      <ThreadHead
        @openSearchDialog="openSearchDialog"
        @searchDataByKeyword="searchDataByKeyword"
      />
    </view>
    <view class="statics_wrap el_height">
      <view
        >今日:
        <text>{{
          statics.todayNew > 9999 ? '9999+' : statics.todayNew || 0
        }}</text></view
      >
      <view
        >总线索:
        <text>{{
          statics.sum > 9999 ? '9999+' : statics.sum || 0
        }}</text></view
      >
      <view
        >未跟进:
        <text>{{
          statics.unFollowUp > 9999
            ? '9999+'
            : statics.unFollowUp || 0
        }}</text></view
      >
    </view>
    <view
      class="el_height"
      v-if="searchsItemList && searchsItemList.length > 0"
    >
      <ThreadSearchItem
        :list="searchsItemList"
        @clearSearItem="clearSearItem"
      />
    </view>
    <!-- 导航 -->
    <view class="th_nav_wrap el_height">
      <CtjtAutoCenterNav
        :c-style="'padding:0; margin-right:40rpx;font-size: 28rpx; '"
        :list="tabList"
        :current="current"
        :trans-left="150"
        @change="handleNavChange"
      ></CtjtAutoCenterNav>
    </view>
    <view mark:name="tabThread">
      <swiper
        class="swiper"
        :current="current"
        @change="swiperChange"
        :style="{ height: swiperHeight ? swiperHeight + 'px' : 'auto' }"
        :class="{ b_f: threadFlag && threadList.length === 0 }"
      >
        <!-- 全部 -->
        <swiper-item>
          <scroll-view
            v-if="swiperHeight"
            :style="{ height: swiperHeight ? swiperHeight + 'px' : 'auto' }"
            scroll-y="true"
            refresher-enabled
            :refresher-triggered="threadTriggered1"
            @refresherrefresh="threadBindrefresherrefresh1"
            @scrolltolower="bindscrolltolower"
            lower-threshold="30"
          >
            <ThreadItemNew
              :list.sync="threadList"
              :list-flag="threadFlag"
              @jumpDetail="jumpDetail"
            />
          </scroll-view>
        </swiper-item>
        <!-- 潜客 -->
        <swiper-item>
          <scroll-view
            v-if="swiperHeight"
            :style="{ height: swiperHeight ? swiperHeight + 'px' : 'auto' }"
            :scroll-y="true"
            refresher-enabled
            :refresher-triggered="threadTriggered2"
            @refresherrefresh="threadBindrefresherrefresh2"
            @scrolltolower="bindscrolltolower"
            lower-threshold="30"
          >
            <ThreadItemNew
              :list.sync="threadList"
              :list-flag="threadFlag"
              @jumpDetail="jumpDetail"
            />
          </scroll-view>
        </swiper-item>
        <!-- 已报名 -->
        <swiper-item>
          <scroll-view
            v-if="swiperHeight"
            :style="{ height: swiperHeight ? swiperHeight + 'px' : 'auto' }"
            :scroll-y="true"
            refresher-enabled
            :refresher-triggered="threadTriggered3"
            @refresherrefresh="threadBindrefresherrefresh3"
            @scrolltolower="bindscrolltolower"
            lower-threshold="30"
          >
            <ThreadItemNew
              :list.sync="threadList"
              :list-flag="threadFlag"
              @jumpDetail="jumpDetail"
            />
          </scroll-view>
        </swiper-item>
        <!-- 无意向-->
        <swiper-item>
          <scroll-view
            v-if="swiperHeight"
            :style="{ height: swiperHeight ? swiperHeight + 'px' : 'auto' }"
            :scroll-y="true"
            refresher-enabled
            :refresher-triggered="threadTriggered4"
            @refresherrefresh="threadBindrefresherrefresh4"
            @scrolltolower="bindscrolltolower"
            lower-threshold="30"
          >
            <ThreadItemNew
              :list.sync="threadList"
              :list-flag="threadFlag"
              @jumpDetail="jumpDetail"
            />
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
    <!-- 修改标签弹出框start -->
    <CtjtBottomDialog
      :is-show="dialogName === '筛选'"
      :title="dialogName"
      @close="closeDialog"
    >
      <view slot="main" class="search_form_content">
        <view class="label_item">
          <view>时间</view>
          <radio-group class="item_radio_group">
            <view
              class="item_redio un_checked"
              v-for="(item, i) in searchTimeList"
              @click="handTimeRedioActive(item.value)"
              :class="{
                no_margin: (i + 1) % 3 === 0,
                checked: searchForm.searchTimeKey === item.value,
              }"
              :key="i"
              >{{ item.value }}</view
            >
          </radio-group>
          <view
            class="datepicker_wrap"
            v-if="searchForm.searchTimeKey === '自定义'"
          >
            <picker
              class="date_item"
              mode="date"
              :value="searchForm.beginDate"
              :start="startDate"
              @change="bindStartDateChange"
            >
              <view class="date_item_c">
                <view class="date_text">{{ searchForm.beginDate || '' }}</view>
                <text class="iconfont">&#xe6b4;</text>
              </view>
            </picker>
            <view class="date_tips">至</view>
            <picker
              class="date_item"
              mode="date"
              :value="searchForm.endDate"
              :start="endDate"
              @change="bindEndDateChange"
            >
              <view class="date_item_c">
                <view class="date_text">{{ searchForm.endDate || '' }}</view>
                <text class="iconfont">&#xe6b4;</text>
              </view>
            </picker>
          </view>
        </view>
        <view class="label_item">
          <view>来源</view>
          <checkbox-group class="item_radio_group">
            <view
              class="item_redio un_checked"
              v-for="(item, i) in typeList"
              @click="handTypeActive(item.id)"
              :class="{
                no_margin: (i + 1) % 3 === 0,
                checked: searchForm.formType.includes(item.id),
              }"
              :key="i"
              >{{ item.value }}</view
            >
          </checkbox-group>
        </view>
        <view class="label_item">
          <view>意向</view>
          <checkbox-group class="item_radio_group">
            <view
              class="item_redio un_checked"
              v-for="(item, i) in targetLabelList"
              @click="handLabelActive(item.id)"
              :class="{
                checked: searchForm.searchLabels.includes(item.id),
                no_margin: (i + 1) % 3 === 0,
              }"
              :key="i"
              >{{ item.value }}</view
            >
          </checkbox-group>
        </view>
      </view>
      <view slot="foot" class="foot_save_wrap">
        <button @click="reset">重置</button>
        <button @click="sureSearch">确定筛选</button>
      </view>
    </CtjtBottomDialog>
    <!-- end -->
    <Tabbar currentIndex="2" />
  </view>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import Tabbar from '@/components/tabbar/index.vue';
import CtjtBottomDialog from '@/components/bottom_dialog/index.vue';
import CtjtAutoCenterNav from '@/components/auto_center_nav/index.vue';
import ThreadHead from './components/thread_head.vue';
import ThreadSearchItem from './components/search_item.vue';
import ThreadItemNew from './components/thread_item.vue';
import ThreadIndexNew from './index';

@Component({
  components: {
    ThreadHead,
    ThreadSearchItem,
    CtjtBottomDialog,
    ThreadItemNew,
    CtjtAutoCenterNav,
    Tabbar,
  },
})
export default class ThreadNew extends ThreadIndexNew {}
</script>
<style lang="less" scoped>
.thread_container {
  box-sizing: border-box;
  .statics_wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    view {
      font-size: 28rpx;
      line-height: 28rpx;
      color: @ctjt-color-text-secondary-one;
      text {
        color: @ctjt-color-label;
        margin-left: 2rpx;
      }
    }
  }
  .th_nav_wrap {
    background-color: @ctjt-color-text-white;
    padding: 0 30rpx;
  }
  .search_form_content {
    padding: 0 30rpx;
    .label_item {
      margin-bottom: 72rpx;
      &:last-child {
        margin-bottom: 24rpx !important;
      }
      view {
        &:first-child {
          color: @ctjt-color-text-black;
          font-size: 32rpx;
          line-height: 1;
          margin-bottom: 24rpx;
        }
      }
      .item_radio_group {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .item_redio {
          width: 214rpx;
          height: 74rpx;
          border-radius: 37rpx;
          font-size: 26rpx;
          line-height: 1;
          color: @ctjt-color-text-main;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24rpx;
          margin-right: 24rpx;
        }
        .checked {
          width: 210rpx;
          height: 70rpx;
          background-color: @ctjt-color-btn-bgs !important;
          border: 2rpx solid @ctjt-color-primary;
        }
      }
      .datepicker_wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .date_item {
          flex: 1;
        }
        .date_item_c {
          height: 74rpx;
          border-radius: 37rpx;
          color: @ctjt-color-text-main;
          display: flex;
          align-items: center;
          text-align: center;
          background-color: @ctjt-bgcolor-primary;
          color: @ctjt-color-border-one;
        }
        .date_text {
          flex: 1;
          font-size: 26rpx !important;
          line-height: 1;
          color: @ctjt-color-text-main;
          margin-bottom: 0 !important;
        }
        .iconfont {
          font-size: 30rpx;
          line-height: 1;
          margin-right: 20rpx;
        }
        .date_tips {
          height: 74rpx;
          font-size: 26rpx;
          color: @ctjt-color-text-main;
          margin: 0 24rpx;
        }
      }
    }
    .label_remark_item {
      > textarea {
        font-size: 26rpx;
        background-color: @ctjt-bgcolor-primary;
        color: @ctjt-color-border-one;
        padding: 32rpx;
        height: 277rpx;
        width: calc(100% - 64rpx);
        border-radius: 24rpx;
      }
    }
  }

  .foot_save_wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16rpx 30rpx 32rpx 30rpx;
    border-top: solid 1rpx @ctjt-color-border-two;
    > button {
      background: @ctjt-color-primary;
      color: @ctjt-color-text-main;
      font-size: 32rpx;
      border-radius: 49rpx;
      width: 330rpx;
      height: 88rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .no_margin {
    margin-right: 0 !important;
  }
  .un_checked {
    background-color: @ctjt-bgcolor-primary;
  }
}
.b_f {
  background-color: @ctjt-color-text-white;
}
</style>
