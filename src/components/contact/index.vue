<template>
  <view class="c_wrap">
    <view class="label">一对一学车咨询：</view>
    <button class="btn send_btn" v-if="showSendMessage" @click="_sendMessage">发消息</button>
    <button class="btn call_btn" @click="_callPhone">打电话</button>
  </view>
</template>

<script lang="ts">
import {
  Component, Vue, Emit, Prop
} from 'vue-property-decorator';

@Component
export default class Contact extends Vue {
  @Prop({ default: true }) showSendMessage: boolean

  /** 拨打电话 */
  @Emit('callPhoneCallback')
  _callPhone() {
    // 拨打电话
  }

  /** 发消息 */
  @Emit('sendMessageCallback')
  _sendMessage() {
    // 发消息
  }
}
</script>

<style lang="less" scoped>
.c_wrap {
  height: 126rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: @ctjt-color-text-white;
  padding: 0 30rpx;
  box-sizing: border-box; // 标准盒模型转换成ie盒模型
  .label {
    color: @ctjt-color-text-black;
    font-size: 32rpx;
  }
  .btn {
    width: 175rpx;
    height: 70rpx;
    line-height: 70rpx;
    box-sizing: border-box;
    border-radius: 35rpx;
    text-align: center;
    color: @ctjt-color-text-main;
  }
  .send_btn {
    line-height: 66rpx;
    border: 2rpx solid @ctjt-color-text-main;
    margin-right: 28rpx;
  }
  .call_btn {
    background: @ctjt-color-primary;
  }
}
</style>
