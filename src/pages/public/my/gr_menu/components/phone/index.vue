<template>
  <view>
    <view class="pop_box" style="z-index: 10" @click="close"></view>
    <view class="menu">
      <view @click.stop="callphone">拨打</view>
      <view @click.stop="copy(1)">复制{{address ? '电话' : ''}}</view>
      <view @click.stop="copy(2)" v-if="address">复制地址</view>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { makePhoneCall } from '@/assets/js/common';

@Component
export default class Phone extends Vue {
  @Prop({
    default: ''
  }) phoneNum

  @Prop({
    default: ''
  }) address

  @Prop({
    default: false
  }) visible

  copy(key) {
    uni.setClipboardData({
      data: key === 1 ? this.phoneNum : this.address,
      success: () => {
        uni.showToast({
          title: '复制成功'
        });
        this.close();
      }
    });
  }

  callphone() {
    if (!this.phoneNum) return;
    makePhoneCall(this.phoneNum);
    this.close();
  }

  close() {
    this.$emit('update:phoneNum', '');
  }
}

</script>

<style lang="less" scoped>
.menu{
  width: 300rpx;
  border-radius: 10rpx;
  background: #fff;
  position: fixed;
  z-index: 11;
  left: 50%;
  top: 400rpx;
  text-align: center;
  transform: translateX(-50%);
  view{
    line-height: 88rpx;
    border-bottom: solid 2rpx #e5e5e5;
    &:last-child{
      border: 0;
    }
  }
}
</style>
