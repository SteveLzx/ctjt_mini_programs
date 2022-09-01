<template>
  <view class="thread_item_container">
    <view class="default_box" v-if="listFlag && list.length === 0">
      <image :src="defaultImg()" class="detault_img"></image>
      <view class="warn">暂无信息～</view>
    </view>
    <view class="th_item" v-for="(item, i) in list" :key="i">
      <view class="content">
        <view class="user_info">
          <image class="avatar" :src="item.avatar || defaultUserImg()"></image>
          <view class="name_wrap">
            <view class="name_info"
              ><view class="name">{{ nameFilter(item) }}</view>
              <view
                class="default_label_tag"
                :class="{
                  qianke_label_tag: labelStatusFilter(item.label) === '潜客',
                  high_label_tag: labelStatusFilter(item.label) === '高意向',
                  middle_label_tag: labelStatusFilter(item.label) === '中意向',
                  low_label_tag: labelStatusFilter(item.label) === '低意向',
                  baoming_label_tag: labelStatusFilter(item.label) === '已报名',
                  graduate_label_tag:
                    labelStatusFilter(item.label) === '已毕业',
                }"
                v-if="item.label"
                >{{ labelStatusFilter(item.label) }}</view
              >
            </view>
            <view class="tags">
              <text class="date">{{ item.descriptionTime }}</text>
              <text class="title" v-if="item.type"
                >来自<text class="tags_type">{{
                  typeStatusFilter(item.type)
                }}</text
                >分享</text
              >
            </view>
          </view>
        </view>
        <view class="static_total_wrap">
          <view class="static"
            >访问次数:<text>{{ item.visitCount }}</text></view
          >
          <view class="static"
            >沟通次数:<text>{{ item.linkupCount }}</text></view
          >
          <view class="jump_detail_wrap" @click="jumpDetail(item.id)">
            <text class="text_detail">详情</text>
            <text class="iconfont right_icon">&#xe6a3;</text>
          </view>
        </view>
      </view>
      <view class="operate_wrap">
        <button
          class="btn1"
          :disabled="item.userType === 2 || item.userType === 3"
          :class="{ disabled: item.userType === 2 || item.userType === 3 }"
          @click="sendMsg(item.id, item.userId, item.userImId)"
        >
          发消息<span class="mg_count" v-if="item.unreadMessageCount">{{
            item.unreadMessageCount
          }}</span>
        </button>
        <button
          class="btn2"
          :disabled="!item.mobile"
          :class="{ disabled: !item.mobile }"
          @click="callPhone(item.id, item.userId, item.mobile)"
        >
          打电话
        </button>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import {
  Component, Prop, Vue, Emit, Watch
} from 'vue-property-decorator';
import { regTel, makePhoneCall } from '@/assets/js/common';
import {
  addThreadRecord,
  labelStatusFilter,
  typeStatusFilter,
  nameFilter,
} from '../_common';

@Component
export default class ThreadItemNew extends Vue {
  @Prop({ required: true }) list!: [];

  @Prop({ required: true }) listFlag!: false;

  defaultImg = () => 'https://file.aicar365.com/mini-program/common/queshengye_banbiexinxi.png';

  // 默认用户头像
  defaultUserImg = () => 'https://file.aicar365.com/mini-program/common/dialogue_xueyuantouxiang.png';

  regTel(type: number, tel: string) {
    return regTel(type, tel);
  }

  /** 姓名行显示 */
  nameFilter(item: any) {
    return nameFilter(item);
  }

  /** 标签类别 */
  labelStatusFilter(val: number) {
    return labelStatusFilter(val);
  }

  /** 来源类别 */
  typeStatusFilter(val: number) {
    return typeStatusFilter(val);
  }

  @Emit('jumpDetail')
  jumpDetail(id: string) {
    return id;
  }

  /** 拨打电话 */
  callPhone(clueId: string, userId: any, mobile: string) {
    if (this.$platFormPc) {
      uni.showToast({
        icon: 'none',
        title: '请在手机端操作此功能',
      });
      return;
    }
    makePhoneCall(mobile);
    addThreadRecord(clueId, userId, 3);
  }

  /** 发消息 */
  sendMsg(clueId: string, userId: string, userImId: string) {
    uni.navigateTo({
      url: `../../../package_im/pages/TUI-Chat/chat?conversationID=C2C${userImId}`,
    });
    addThreadRecord(clueId, userId, 2);
  }
}
</script>
<style lang="less" scoped>
@import url('../common.less');
.thread_item_container {
  padding: 24rpx 30rpx;
  padding-bottom: calc(
    140rpx + constant(safe-area-inset-bottom)
  ); /*兼容 IOS<11.2*/
  padding-bottom: calc(
    140rpx + env(safe-area-inset-bottom)
  ); /*兼容 IOS>11.2*/ // 底部空隙
  .th_item {
    background-color: @ctjt-color-text-white;
    border-radius: 24rpx;
    margin-bottom: 24rpx;
    overflow: hidden;
    position: relative;
    .content {
      padding: 24rpx 30rpx 24rpx 30rpx;
      .user_info {
        display: flex;
        align-items: center;
        margin-bottom: 24rpx;
        .avatar {
          width: 90rpx;
          height: 90rpx;
          background: #fff2be;
          margin-right: 24rpx;
          border-radius: 50%;
        }
        .name_wrap {
          flex: 1;
          .name_info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 16rpx;
            position: relative;
            .name {
              color: @ctjt-color-text-black;
              font-size: 32rpx;
              line-height: 1;
              margin-right: 8rpx;
            }
          }
          .tags {
            font-size: 26rpx;
            line-height: 1;
            color: @ctjt-color-border-one;
            .date {
              margin-right: 8rpx;
            }
            .tags_type {
              color: @ctjt-color-label;
            }
          }
        }
      }
      .static_total_wrap {
        display: flex;
        position: relative;
        .static {
          font-size: 26rpx;
          line-height: 26rpx;
          border-radius: 8rpx;
          background-color: @ctjt-color-primary-40;
          margin-right: 24rpx;
          padding: 4rpx 8rpx;
          color: @ctjt-color-text-main;
          text {
            margin-left: 4rpx;
            color: @ctjt-color-text-secondary-five;
          }
        }
        .jump_detail_wrap {
          display: flex;
          align-items: center;
          position: absolute;
          top: 0;
          right: 0;
          padding: 8rpx 0 8rpx 8rpx;
          .text_detail {
            color: @ctjt-color-text-main;
            font-size: 26rpx;
            margin-right: 8rpx;
            line-height: 1;
          }
          .right_icon {
            font-size: 26rpx;
            margin-top: 4rpx;
          }
        }
      }
    }
    .operate_wrap {
      display: flex;
      border-top: solid 1rpx @ctjt-color-border-two;
      button {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0 !important;
        padding: 24rpx 0;
        font-size: 26rpx;
        color: @ctjt-color-text-main;
      }
      .btn1 {
        position: relative;
        z-index: 1;
        .mg_count {
          position: absolute;
          right: 108rpx;
          top: 13rpx;
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
      }
      .btn2 {
        background-color: @ctjt-color-primary;
      }
    }
  }
}
</style>
