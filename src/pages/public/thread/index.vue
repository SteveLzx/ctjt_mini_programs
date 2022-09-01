<template>
  <view>
    <!--用户足迹、跟踪记录、用户备注弹框-->
    <view class="shade" v-if="show">
      <view class="content">
        <text class="iconfont close_icon" @click="closeDialog">&#xe634;</text>
        <view class="header">{{ title }}</view>
        <view class="list" v-if="title !== '用户信息'">
          <view
            class="default_box"
            v-if="recordData.length === 0 && title !== '用户备注'"
          >
            <image :src="defaultImg()" class="detault_img"></image>
            <view class="warn">暂无信息～</view>
          </view>
          <template v-else>
            <view class="user_wrap">
              <image class="avatar" :src="defaultUserImg()"></image>
              <view class="name_info"
                ><view class="name">{{ nameFilter(userInfo) }}</view>
                <view
                  v-if="userInfo.label"
                  class="label_tag"
                  :class="{
                    deal_label_tag:
                      labelStatusFilter(userInfo.label) === '已核券',
                    graduate_label_tag:
                      labelStatusFilter(userInfo.label) === '已毕业',
                  }"
                  >{{ labelStatusFilter(userInfo.label) }}</view
                >
              </view>
            </view>
            <view
              class="record_item"
              v-for="(item, i) in recordData"
              :key="i"
              :class="{ last_item: recordData.length === 1 }"
            >
              <view class="date_tag">{{ item.descriptionTime }}</view>
              <view class="text_tag">{{ item.description }}</view>
            </view>
            <template v-if="title === '用户备注'">
              <view class="user_remark">
                <textarea v-model.trim="remarks" placeholder="最多200个字符" />
              </view>
              <view class="btn_wrap"
                ><button
                  aria-disabled="true"
                  :disabled="remarksSubDisabled"
                  :class="{ bg_grey: remarksSubDisabled }"
                  @click="submitRemarks"
                >
                  提交
                </button></view
              >
            </template>
          </template>
        </view>
        <!--编辑用户信息start-->
        <view class="edit_wrap" v-else>
          <view class="section_item">
            <view class="title">姓名/称呼：</view>
            <input
              class="item_input"
              v-model.trim="formData.fillName"
              placeholder="不得超过20个字符"
            />
          </view>
          <view class="section_item">
            <view class="title">手机号码：</view>
            <input
              class="item_input"
              v-model.trim="formData.fillMobile"
              placeholder="请输入11位手机号码"
            />
          </view>
          <view class="section_item">
            <view class="title">微信号</view>
            <input
              class="item_input"
              v-model.trim="formData.fillWxNo"
              placeholder="请输入微信号码"
            />
          </view>
          <view class="btn_wrap"
            ><button @click="editUserInfo">保存</button></view
          >
        </view>
        <!--编辑用户信息end-->
      </view>
    </view>
    <!-- tab -->
    <view class="tabbar_container el_height">
      <CtjtAutoCenterNav
        :c-style="'padding: 0 30rpx; margin-right: 50rpx;'"
        :list="tabList"
        :current="tabIndex-1"
        :trans-left="150"
        @change="handleNavChange"
      ></CtjtAutoCenterNav>
    </view>
    <view mark:name="tabThread">
      <swiper
        class="swiper"
        :current="tabIndex - 1"
        @change="swiperChange"
        :style="{ height: swiperHeight ? swiperHeight + 'px' : 'auto' }"
      >
        <!-- 商机 -->
        <swiper-item :class="{ b_f: cluesFlag && cluesList.length === 0 }">
          <scroll-view
            v-if="swiperHeight"
            :style="{ height: swiperHeight ? swiperHeight + 'px' : 'auto' }"
            scroll-y="true"
            refresher-enabled
            :refresher-triggered="threadTriggered1"
            @refresherrefresh="threadBindrefresherrefresh1"
          >
            <ThreadItem
              :list.sync="cluesList"
              :list-flag="cluesFlag"
              @openDialog="openDialog"
            />
          </scroll-view>
        </swiper-item>
        <!-- 潜客 -->
        <swiper-item :class="{ b_f: cluesFlag && cluesList.length === 0 }">
          <scroll-view
            v-if="swiperHeight"
            :style="{ height: swiperHeight ? swiperHeight + 'px' : 'auto' }"
            :scroll-y="true"
            refresher-enabled
            :refresher-triggered="threadTriggered2"
            @refresherrefresh="threadBindrefresherrefresh2"
          >
            <ThreadItem
              :list.sync="cluesList"
              :list-flag="cluesFlag"
              @openDialog="openDialog"
            />
          </scroll-view>
        </swiper-item>
        <!-- 招生 -->
        <swiper-item :class="{ b_f: cluesFlag && cluesList.length === 0 }">
          <scroll-view
            v-if="swiperHeight"
            :style="{ height: swiperHeight ? swiperHeight + 'px' : 'auto' }"
            :scroll-y="true"
            refresher-enabled
            :refresher-triggered="threadTriggered3"
            @refresherrefresh="threadBindrefresherrefresh3"
          >
            <ThreadItem
              :list.sync="cluesList"
              :list-flag="cluesFlag"
              @openDialog="openDialog"
            />
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
    <Tabbar currentIndex="2" />
  </view>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import Tabbar from '@/components/tabbar/index.vue';
import CtjtAutoCenterNav from '@/components/auto_center_nav/index.vue';
import ThreadItem from './thread_item.vue';
import ThreadIndex from './index';

@Component({
  components: {
    Tabbar,
    CtjtAutoCenterNav,
    ThreadItem,
  },
})
export default class Thread extends ThreadIndex {}
</script>
<style lang="less" scoped>
@import url('./index.less');
.b_f {
  background: @ctjt-color-text-white;
}
</style>
