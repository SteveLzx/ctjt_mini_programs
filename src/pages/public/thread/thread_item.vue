<template>
  <view class="t_wrap">
    <view class="default_box" v-if="listFlag && list.length === 0">
      <image :src="defaultImg()" class="detault_img"></image>
      <view class="warn">暂无信息～</view>
    </view>
    <view class="item" v-for="(item, i) in list" :key="i">
      <view class="content">
        <view class="user_info">
          <image class="avatar" :src="defaultUserImg()"></image>
          <view class="name_wrap">
            <view class="name_info"
              ><div class="name">{{ nameFilter(item) }}</div>
              <view
                class="label_tag"
                :class="{
                  deal_label_tag: labelStatusFilter(item.label) === '已核券',
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
                >来自{{ typeStatusFilter(item.type) }}分享</text
              >
            </view>
          </view>
          <view class="edit_wrap" @click="openDialog('用户信息', item)">
            <text class="iconfont">&#xe6ab;</text>
          </view>
        </view>
        <view class="text_content">
          <!-- <mp-html :content="dec"></mp-html> -->
          <mp-html :content="item.description"></mp-html>
        </view>
        <view class="operate_btns">
          <view
            class="btn1"
            @click="sendMsg(item.userId, item.userImId)"
            v-if="
              item.userType !== 2 && item.userType !== 3
            "
            >发消息<span class="mg_count" v-if="item.unreadMessageCount">{{
              item.unreadMessageCount
            }}</span></view
          >
          <view
            class="btn2"
            v-if="item.mobile"
            @click="callPhone(item.userId, item.mobile)"
            >打电话</view
          >
          <view class="btn3" v-if="!item.label" @click="remarkStatus(item)"
            >标记为潜客</view
          >
        </view>
      </view>
      <view class="bottom_menus">
        <view @click="openDialog('用户足迹', item)"> 用户足迹 </view>
        <view @click="openDialog('跟踪记录', item)"> 跟踪记录 </view>
        <view @click="openDialog('用户备注', item)"> 用户备注 </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { regTel, makePhoneCall } from '@/assets/js/common';
import {
  Component, Prop, Vue, Emit
} from 'vue-property-decorator';
import MpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html.vue';
import {
  addThreadRecord,
  labelStatusFilter,
  typeStatusFilter,
  nameFilter,
} from './_common';

@Component({
  components: { MpHtml },
})
export default class ThreadItem extends Vue {
  @Prop({ required: true }) list!: [];

  @Prop({ required: true }) listFlag!: false;

  defaultImg = () => 'https://file.aicar365.com/mini-program/common/queshengye_banbiexinxi.png';

  // 默认用户头像
  defaultUserImg = () => 'https://file.aicar365.com/mini-program/common/dialogue_xueyuantouxiang.png';

  regTel(type: number, tel: string) {
    return regTel(type, tel);
  }

  private nameFilter(item: any) {
    return nameFilter(item);
  }

  private labelStatusFilter(val: number) {
    return labelStatusFilter(val);
  }

  private typeStatusFilter(val: number) {
    return typeStatusFilter(val);
  }

  // 教练端imId
  imId = uni.getStorageSync('imId');

  @Emit('openDialog')
  openDialog(text: string, userInfo: any) {
    return { text, ...userInfo };
  }

  /** 标记为潜客 */
  remarkStatus(item: any) {
    const { userId } = item;
    addThreadRecord(userId, 1, {}, 2);
    const newI = JSON.parse(JSON.stringify(item));
    newI.label = 2;
    const newList = this.list.map((_item: any) => (_item.userId === userId ? newI : _item));
    this.$emit('update:list', newList);
  }

  /** 拨打电话 */
  callPhone(userId: any, mobile: string) {
    if (this.$platFormPc) {
      uni.showToast({
        icon: 'none',
        title: '请在手机端操作此功能',
      });
      return;
    }
    makePhoneCall(mobile);
    addThreadRecord(userId, 3);
  }

  /** 发消息 */
  sendMsg(userId: any, userImId: string) {
    uni.navigateTo({
      url: `../../../package_im/pages/TUI-Chat/chat?conversationID=C2C${userImId}`,
    });
    addThreadRecord(userId, 2);
  }
}
</script>
<style lang="less" scoped>
.t_wrap {
  padding: 40rpx 30rpx;
  padding-bottom: calc(
    140rpx + constant(safe-area-inset-bottom)
  ); /*兼容 IOS<11.2*/
  padding-bottom: calc(
    140rpx + env(safe-area-inset-bottom)
  ); /*兼容 IOS>11.2*/ // 底部空隙
  .item {
    overflow: hidden;
    margin-bottom: 40rpx;
    background: @ctjt-color-text-white;
    border-radius: 24rpx;
    &:last-child {
      margin-bottom: 0rpx;
    }
    .content {
      padding: 32rpx 30rpx;
      .user_info {
        display: flex;
        align-items: center;
        margin-bottom: 32rpx;
        .avatar {
          width: 90rpx;
          height: 90rpx;
          background: #fff2be;
          margin-right: 40rpx;
          border-radius: 50%;
        }
        .name_wrap {
          flex: 1;
          .name_info {
            display: flex;
            margin-bottom: 16rpx;
            position: relative;
            .name {
              color: @ctjt-color-text-black;
              font-size: 32rpx;
              line-height: 1;
              margin-right: 8rpx;
            }
            .label_tag {
              padding: 4rpx 19rpx;
              border-radius: 8rpx;
              background-color: @ctjt-color-label;
              font-size: 26rpx;
              line-height: 1;
              color: @ctjt-color-text-white;
            }
            .deal_label_tag {
              color: @ctjt-color-text-secondary-five;
              background-color: @ctjt-color-text-white;
              border: 1rpx solid @ctjt-color-text-secondary-five;
            }
            .graduate_label_tag {
              color: @ctjt-color-text-secondary-six;
              background-color: @ctjt-color-text-white;
              border: 1rpx solid @ctjt-color-text-secondary-six;
            }
          }
          .tags {
            font-size: 26rpx;
            line-height: 1;
            color: @ctjt-color-border-one;
          }
        }
        .edit_wrap {
          padding: 10rpx 10rpx 10rpx 10rpx;
          position: relative;
          top: -28rpx;
          right: -10rpx;
          .iconfont {
            font-size: 44rpx;
            line-height: 1;
          }
        }
      }
      .text_content {
        display: flex;
        font-size: 26rpx;
        line-height: 38rpx;
        color: @ctjt-color-text-black;
        padding-right: 4rpx;
        // text {
        //   color: @ctjt-color-primary-70;
        // }
      }
      .operate_btns {
        display: flex;
        justify-content: flex-end;
        margin: 28rpx 0 0 0;
        view {
          width: 176rpx;
          border-radius: 40rpx;
          font-size: 26rpx;
          text-align: center;
        }
        .btn1 {
          line-height: 56rpx;
          border: 2rpx solid @ctjt-color-text-main;
          position: relative;
          .mg_count {
            position: absolute;
            right: 0;
            top: -25%;
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
        .btn2,
        .btn3 {
          margin-left: 55rpx;
          line-height: 60rpx;
          background-color: @ctjt-color-primary;
        }
      }
    }
    .bottom_menus {
      display: flex;
      border-top: solid 1rpx @ctjt-color-border-two;
      background-color: #fff;
      height: 75rpx;
      view {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 26rpx;
        line-height: 1;
        color: @ctjt-color-text-secondary-one;
        border-right: solid 1rpx @ctjt-color-border-two;
        &:last-child {
          border-right: none;
        }
      }
    }
  }
}
.default_box {
  color: @ctjt-color-text-primary;
  text-align: center;
  font-size: 28rpx;
  background: #fff;
  padding-top: 144rpx;
  text-align: center;
  .detault_img {
    width: 422rpx;
    height: 326rpx;
  }
  .warn {
    font-size: 28rpx;
    color: @ctjt-color-text-secondary-one;
    line-height: 40rpx;
  }
}
</style>
