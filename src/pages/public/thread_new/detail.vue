<template>
  <view class="th_detail_container">
    <view class="base_wrap">
      <view class="user_info_wrap el_height">
        <view class="user_base_info">
          <image class="avatar" :src="data.avatar || defaultUserImg()"></image>
          <view class="name_wrap">
            <view class="name_info">{{ nameFilter(data) }}</view>
            <view class="tags">
              <view class="title" v-if="data.type"
                >来自<text class="tags_type">{{
                  typeStatusFilter(data.type)
                }}</text
                >分享</view
              >
              <view class="date">{{ data.descriptionTime }}为最近访问时间</view>
            </view>
          </view>
          <view class="edit_wrap" @click="openFormDataDialog">
            <text class="iconfont edit_icon">&#xe6ab;</text>
            <text class="text_edit">编辑</text>
          </view>
        </view>
        <view class="user_other_info">
          <view class="other_item"
            ><view>姓名/称呼</view
            ><view>{{
              data.fillName || data.name || data.nickname
            }}</view></view
          >
          <view class="other_item"
            ><view>手机号码</view
            ><view>{{ data.fillMobile || data.mobile }}</view></view
          >
          <view class="other_item"
            ><view>年龄</view><view>{{ data.age }}</view></view
          >
          <view class="other_item"
            ><view>身份证号码</view><view>{{ data.fillIdNo }}</view></view
          >
          <view class="other_item"
            ><view>性别</view><view>{{ data.sex | sexFilter }}</view></view
          >
          <view class="other_item"
            ><view>居住地址</view
            ><view>{{ data.fillAddress | fillAddressFilter }}</view></view
          >
          <view class="last_other_item">
            <view
              class="default_label_tag"
              :class="{
                qianke_label_tag: labelStatusFilter(data.label) === '潜客',
                high_label_tag: labelStatusFilter(data.label) === '高意向',
                middle_label_tag: labelStatusFilter(data.label) === '中意向',
                low_label_tag: labelStatusFilter(data.label) === '低意向',
                baoming_label_tag: labelStatusFilter(data.label) === '已报名',
                graduate_label_tag: labelStatusFilter(data.label) === '已毕业',
              }"
              v-if="data.label"
              >{{ labelStatusFilter(data.label) }}</view
            >
            <view class="edit_label" @click="openLabelFormDataDialog"
              >修改标签</view
            >
          </view>
          <view class="statics_item">
            <view class="static"
              >访问次数:<text>{{
                data.visitCount > 9999 ? '9999+' : data.visitCount || 0
              }}</text></view
            >
            <view class="static"
              >沟通次数:<text>{{
                data.linkupCount > 9999 ? '9999+' : data.linkupCount || 0
              }}</text></view
            >
            <view class="static" v-if="data.fillCarModel"
              >学车类型:<text>{{ data.fillCarModel }}</text></view
            >
            <view class="static"
              >领取优惠券:
              <text>{{
                data.couponCount > 9999 ? '9999+' : data.couponCount || 0
              }}</text></view
            >
          </view>
        </view>
      </view>
    </view>
    <view class="thread_record_wrap el_height">
      <!-- 导航 -->
      <CtjtAutoCenterNav
        :c-style="'padding:0; margin-right:122rpx;font-size: 32rpx; '"
        :list="tabList"
        :current="current"
        :trans-left="150"
        @change="handleNavChange"
      ></CtjtAutoCenterNav>
    </view>
    <scroll-view :scroll-y="true" class="scroll-view">
      <swiper
        class="swiper"
        :current="current"
        @change="swiperChange"
        :style="{ height: swiperHeight + 'px' }"
        :class="{ b_f: threadRecordFlag && threadRecordList.length === 0 }"
      >
        <!-- 用户足迹 -->
        <swiper-item class="swiper_item">
          <scroll-view
            scroll-y="true"
            refresher-enabled
            :refresher-triggered="threadTriggered1"
            @refresherrefresh="threadBindrefresherrefresh1"
          >
            <ThreadRecordItem
              :list.sync="threadRecordList"
              :list-flag="threadRecordFlag"
            />
          </scroll-view>
        </swiper-item>
        <!-- 跟踪记录 -->
        <swiper-item class="swiper_item">
          <scroll-view
            :scroll-y="true"
            refresher-enabled
            :refresher-triggered="threadTriggered2"
            @refresherrefresh="threadBindrefresherrefresh2"
          >
            <ThreadRecordItem
              :list.sync="threadRecordList"
              :list-flag="threadRecordFlag"
            />
          </scroll-view>
        </swiper-item>
        <!-- 用户备注 -->
        <swiper-item class="swiper_item">
          <scroll-view
            :scroll-y="true"
            refresher-enabled
            :refresher-triggered="threadTriggered3"
            @refresherrefresh="threadBindrefresherrefresh3"
          >
            <ThreadRecordItem :list.sync="threadRecordList" :list-flag="false">
              <view slot="remark" class="user_remark_wrap">
                <view class="user_remark">
                  <textarea
                    v-model.trim="remarks"
                    placeholder="最多200个字符"
                  />
                </view>
                <view class="submit_remark_wrap"
                  ><button
                    aria-disabled="true"
                    :disabled="!remarks"
                    :class="{ disabled: !remarks }"
                    @click="submitRemarks"
                  >
                    提交
                  </button></view
                >
              </view>
            </ThreadRecordItem>
          </scroll-view>
        </swiper-item>
      </swiper>
    </scroll-view>
    <view class="operate_wrap">
      <button
        class="btn1"
        :disabled="data.userType === 2 || data.userType === 3"
        :class="{ disabled1: data.userType === 2 || data.userType === 3 }"
        @click="sendMsg(data.userId, data.userImId)"
      >
        发消息
      </button>
      <span class="mg_count" v-if="data.unreadMessageCount">{{
        data.unreadMessageCount
      }}</span>
      <button
        class="btn2"
        :disabled="!data.mobile"
        :class="{ disabled: !data.mobile }"
        @click="callPhone(data.userId, data.mobile)"
      >
        打电话
      </button>
    </view>
    <!-- 编辑基础信息弹出框start -->
    <CtjtBottomDialog
      :is-show="dialogName === '用户信息'"
      :title="dialogName"
      @close="closeDialog"
    >
      <view slot="main" class="edit_form_content">
        <view class="section_item">
          <view class="title">姓名/称呼</view>
          <input
            class="item_input"
            v-model.trim="formData.fillName"
            placeholder="不得超过20个字符"
          />
        </view>
        <view class="section_item">
          <view class="title">手机号码</view>
          <input
            class="item_input"
            v-model.trim="formData.fillMobile"
            placeholder="请输入11位手机号码"
          />
        </view>
        <view class="section_item">
          <view class="title">身份证号码</view>
          <input
            class="item_input"
            v-model.trim="formData.fillIdNo"
            placeholder="请输入身份证号码"
          />
        </view>
        <view class="section_item">
          <view class="title">居住地址</view>
          <input
            class="item_input"
            v-model.trim="formData.fillAddress"
            placeholder="请输入居住地址"
          />
        </view>
        <view class="section_item">
          <view class="title">学车类型</view>
          <radio-group class="item_radio_group">
            <view
              class="item_redio un_checked"
              v-for="(item, i) in carModelList"
              @click="handCarModelRedioActive(item.value)"
              :class="{
                checked: formData.fillCarModel.includes(item.value),
                no_margin: (i + 1) % 3 === 0,
              }"
              :key="i"
              >{{ item.value }}</view
            >
          </radio-group>
        </view>
      </view>
      <view slot="foot" class="foot_save_wrap">
        <button @click="editUserInfo">保存</button>
      </view>
    </CtjtBottomDialog>
    <!-- end -->
    <!-- 修改标签弹出框start -->
    <CtjtBottomDialog
      :is-show="dialogName === '修改标签'"
      :title="dialogName"
      @close="closeDialog"
    >
      <view slot="main" class="edit_form_content">
        <view class="user_info">
          <image class="avatar" :src="data.avatar || defaultUserImg()"></image>
          <view class="info">
            <view class="name">{{ nameFilter(data) }}</view>
            <view class="mobile">{{ data.mobile || data.fillMobile }}</view>
          </view>
        </view>
        <view class="ori_label">
          <view>当前系统意向度:</view>
          <view
            class="default_label_tag"
            :class="{
              qianke_label_tag: labelStatusFilter(data.label) === '潜客',
              high_label_tag: labelStatusFilter(data.label) === '高意向',
              middle_label_tag: labelStatusFilter(data.label) === '中意向',
              low_label_tag: labelStatusFilter(data.label) === '低意向',
              baoming_label_tag: labelStatusFilter(data.label) === '已报名',
              graduate_label_tag: labelStatusFilter(data.label) === '已毕业',
            }"
            v-if="data.label"
            >{{ labelStatusFilter(data.label) }}</view
          ></view
        >
        <view class="label_item">
          <view>潜客</view>
          <radio-group class="item_radio_group">
            <view
              class="item_redio un_checked"
              v-for="(item, i) in qiankeLabelList"
              @click="handLabelRedioActive(item.id)"
              :class="{
                checked: editLabelForm.label === item.id,
              }"
              :key="i"
              >{{ item.value }}</view
            >
          </radio-group>
        </view>
        <view class="label_item">
          <view>已报名</view>
          <radio-group class="item_radio_group">
            <view
              class="item_redio un_checked"
              v-for="(item, i) in baominLabelList"
              @click="handLabelRedioActive(item.id)"
              :class="{
                checked: editLabelForm.label === item.id,
              }"
              :key="i"
              >{{ item.value }}</view
            >
          </radio-group>
        </view>
        <view class="label_item">
          <view>无意向</view>
          <radio-group class="item_radio_group">
            <view
              class="item_redio un_checked"
              v-for="(item, i) in noyixiangLabelList"
              @click="handLabelRedioActive(item.id)"
              :class="{
                checked: editLabelForm.label === item.id,
                no_margin: (i + 1) % 3 === 0,
              }"
              :key="i"
              >{{ item.value }}</view
            >
          </radio-group>
        </view>
        <view class="label_remark_item">
          <textarea
            v-model.trim="editLabelForm.reason"
            placeholder="请填写做标记的详细原因"
          />
        </view>
      </view>
      <view slot="foot" class="foot_save_wrap">
        <button
          @click="editLabel"
          aria-disabled="true"
          :disabled="!editLabelForm.label"
          :class="{ disabled: !editLabelForm.label }"
        >
          提交标签
        </button>
      </view>
    </CtjtBottomDialog>
    <!-- end -->
  </view>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import CtjtAutoCenterNav from '@/components/auto_center_nav/index.vue';
import CtjtBottomDialog from '@/components/bottom_dialog/index.vue';
import ThreadRecordItem from './components/thread_record_item.vue';
import ThreadDetailIndex from './detail';

@Component({
  components: { CtjtAutoCenterNav, CtjtBottomDialog, ThreadRecordItem },
})
export default class ThreadDetail extends ThreadDetailIndex {}
</script>
<style lang="less" scoped>
@import url('./common.less');
.th_detail_container {
  .scroll-view {
    background-color: @ctjt-color-text-white;
    .swiper {
      width: 100%;
      .swiper_item {
        overflow: scroll;
      }
      .user_remark_wrap {
        .user_remark {
          margin-top: 40rpx;
          > textarea {
            background-color: @ctjt-bgcolor-primary;
            color: @ctjt-color-border-one;
            padding: 20rpx;
            height: 280rpx; //164rpx;
            width: calc(100% - 40rpx);
            border-radius: 24rpx;
          }
        }
        .submit_remark_wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 56rpx; //48rpx;
          > button {
            background: @ctjt-color-primary;
            color: @ctjt-color-text-main;
            font-size: 32rpx;
            border-radius: 40rpx;
            width: 370rpx;
            height: 88rpx;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }
  .base_wrap {
    padding: 0 30rpx;
    .user_info_wrap {
      border-radius: 24rpx;
      background-color: @ctjt-color-text-white;
      padding: 32rpx 30rpx 35rpx 30rpx;
      margin: 24rpx 0;
      .user_base_info {
        display: flex;
        align-items: center;
        margin-bottom: 40rpx;
        position: relative;
        .avatar {
          width: 120rpx;
          height: 120rpx;
          background: #fff2be;
          margin-right: 8rpx;
          border-radius: 50%;
        }
        .name_wrap {
          .name_info {
            font-size: 32rpx;
            line-height: 1;
            color: @ctjt-color-text-black;
            margin-bottom: 16rpx;
          }
          .tags {
            font-size: 22rpx;
            line-height: 1;
            color: @ctjt-color-border-one;
            .title {
              margin-bottom: 12rpx;
              .tags_type {
                color: @ctjt-color-label;
                margin-bottom: 12rpx;
              }
            }
            .date {
              margin-right: 8rpx;
            }
          }
        }
        .edit_wrap {
          display: grid;
          text-align: center;
          position: absolute;
          top: 0;
          right: 0;
          padding: 8rpx 0 8rpx 8rpx;
          .text_edit {
            color: @ctjt-color-text-main;
            font-size: 20rpx;
            line-height: 20rpx;
          }
          .edit_icon {
            font-size: 38rpx;
          }
        }
      }
      .user_other_info {
        .other_item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 26rpx 0;
          border-top: 1rpx solid @ctjt-color-border-two;
          view {
            font-size: 28rpx;
            &:first-child {
              color: @ctjt-color-text-main;
            }
            &:last-child {
              color: @ctjt-color-border-one;
            }
          }
        }
        .last_other_item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 26rpx 0;
          border-top: 1rpx solid @ctjt-color-border-two;
          view {
            font-size: 28rpx;
          }
          .edit_label {
            color: @ctjt-color-price !important;
            position: relative;
            line-height: 28rpx;
            &::after {
              content: '';
              width: 112rpx;
              height: 2rpx;
              background-color: @ctjt-color-price;
              position: absolute;
              right: 0;
              top: 32rpx;
            }
          }
        }
        .statics_item {
          display: flex;
          flex-wrap: wrap;
          padding-top: 28rpx;
          border-top: 1rpx solid @ctjt-color-border-two;
          .static {
            font-size: 26rpx;
            line-height: 26rpx;
            border-radius: 8rpx;
            background-color: @ctjt-color-primary-40;
            margin: 0 24rpx 27rpx 0;
            padding: 4rpx 8rpx;
            color: @ctjt-color-text-main;
            text {
              margin-left: 4rpx;
              color: @ctjt-color-text-secondary-five;
            }
          }
        }
      }
    }
  }
  .thread_record_wrap {
    background-color: @ctjt-color-text-white;
    padding: 0 30rpx 0 61rpx;
    border-bottom: 1rpx solid @ctjt-color-border-two;
  }
  .operate_wrap {
    display: flex;
    border-top: solid 1rpx @ctjt-color-border-two;
    background-color: @ctjt-color-text-white;
    padding: 16rpx 30rpx 32rpx;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 49rpx;
      font-size: 32rpx;
      color: @ctjt-color-text-main;
    }
    .btn1 {
      z-index: 1;
      border: 2rpx solid @ctjt-color-text-main;
      margin-right: 30rpx;
      height: 84rpx;
      width: 326rpx;
    }
    .btn2 {
      height: 84rpx;
      width: 330rpx;
    }
    .mg_count {
      position: absolute;
      left: 330rpx;
      top: 8rpx;
      z-index: 2;
      content: '';
      width: 32rpx;
      height: 32rpx;
      background-color: @ctjt-color-price;
      border-radius: 50%;
      font-size: 22rpx;
      line-height: 1;
      color: @ctjt-color-text-white;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn2 {
      background-color: @ctjt-color-primary;
    }
  }
  .edit_form_content {
    padding: 0 30rpx 130rpx 30rpx;
    .section_item {
      margin-bottom: 24rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        font-size: 32rpx;
        line-height: 1;
        color: @ctjt-color-text-black;
        margin-bottom: 16rpx;
        .required {
          font-size: 32rpx;
          line-height: 1;
          color: @ctjt-color-price;
        }
      }
      .item_input {
        width: 486rpx;
        height: 88rpx;
        line-height: 88rpx;
        border-radius: 24rpx;
        padding-left: 24rpx;
        font-size: 28rpx;
        line-height: 1;
        background-color: @ctjt-bgcolor-primary;
        color: @ctjt-color-text-main;
      }
      .item_radio_group {
        width: 510rpx;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .item_redio {
          width: 156rpx;
          height: 72rpx;
          border-radius: 24rpx;
          font-size: 32rpx;
          line-height: 1;
          color: @ctjt-color-text-main;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24rpx;
          margin-right: 20rpx;
        }
        .checked {
          width: 152rpx;
          height: 68rpx;
          background-color: @ctjt-color-btn-bgs !important;
          border: 2rpx solid @ctjt-color-primary;
        }
      }
    }
    .user_info {
      display: flex;
      align-items: center;
      margin-bottom: 40rpx;
      .avatar {
        width: 90rpx;
        height: 90rpx;
        background: #fff2be;
        margin-right: 24rpx;
        border-radius: 50%;
      }
      .info {
        font-size: 32rpx;
        line-height: 32rpx;
        color: @ctjt-color-text-black;
        .name {
          margin-bottom: 10rpx;
        }
      }
    }
    .ori_label {
      display: flex;
      align-items: center;
      margin-bottom: 56rpx;
      view {
        &:first-child {
          color: @ctjt-color-text-black;
          font-size: 32rpx;
          line-height: 32rpx;
          margin-right: 8rpx;
        }
      }
    }
    .label_item {
      margin-bottom: 72rpx;
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
    }
    .label_remark_item {
      > textarea {
        font-size: 26rpx;
        background-color: @ctjt-bgcolor-primary;
        color: @ctjt-color-text-main;
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
    justify-content: center;
    padding: 16rpx 0 32rpx 0;
    border-top: solid 1rpx @ctjt-color-border-two;
    > button {
      background: @ctjt-color-primary;
      color: @ctjt-color-text-main;
      font-size: 32rpx;
      border-radius: 44rpx;
      width: 690rpx;
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
</style>
