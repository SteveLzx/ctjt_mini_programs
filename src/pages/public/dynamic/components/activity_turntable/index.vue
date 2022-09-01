<template>
  <view :class="['c_activity_turntable',`c_activity_turntable_${sId}}`, {'c_activity_turntable_nullbg': bgType === 1} ]">
    <template v-if="time">
      <view class="time" v-if="timer">活动即将在 {{timeName}} 后结束</view>
      <view class="time" v-else>活动已结束</view>
    </template>
    <view class="lottery_box">
      <Turntable :awardsList="list" :batch-id="batchId" :activity-id="activityId" :sId="sId" :disabled="disabled"></Turntable>
    </view>
  </view>
</template>
<script lang="ts">
import {
  Component, Vue, Watch, Prop
} from 'vue-property-decorator';
import { resCountDown } from '@/assets/js/common';
import Turntable from '../turn_table/index.vue';
import Notice from '../notice/index.vue';

@Component({
  components: { Turntable, Notice }
})
export default class ActivityTurntable extends Vue {
  @Prop({ default: [] }) list!: [];

  @Prop({ default: '' }) sId!: number | string

  @Prop({ default: '' }) batchId!: string

  @Prop({ default: '' }) activityId!: string

  @Prop({ default: '' }) time!: string

  @Prop({ default: true }) disabled!: boolean

  @Prop({ default: 0 }) bgType!: number

  timeName = '';

  timer = null

  @Watch('time')
  handleWatchTime(newVal: string) {
    // 存在并且大于当前时间
    clearInterval(this.timer);
    if (newVal && new Date().getTime() < new Date((`${newVal} 23:59:59`).replace(/-/g, '/')).getTime()) {
      const target = new Date((`${newVal} 23:59:59`).replace(/-/g, '/')).getTime();
      const now = new Date().getTime();
      let sub = target - now;
      this.timer = setInterval(() => {
        if (sub <= 0) {
          clearInterval(this.timer);
          this.timer = null;
        }
        this.timeName = resCountDown(sub);
        sub -= 1000;
      }, 1000);
    }
  }
}
</script>
<style lang="less" scoped>
  .c_activity_turntable {
    position: relative;
    height: 920rpx;
    border-radius: 24rpx;
    overflow: hidden;
    background: url('https://file.aicar365.com/mini-program/common/cctivity_dynamics_bg1.png') no-repeat;
    background-size: 100% auto;
    &.c_activity_turntable_370{
      background: url('https://file.aicar365.com/mini-program/370/common/ld_bg.png') no-repeat;
      background-size: 100% auto;
    }
    &.c_activity_turntable_638{
      background: url('https://file.aicar365.com/mini-program/638/common/ld_bg.png') no-repeat;
      background-size: 100% auto;
    }
    &.c_activity_turntable_3374{
      background: url('https://file.aicar365.com/mini-program/3374/common/ld_bg.png') no-repeat;
      background-size: 100% auto;
    }
    &.c_activity_turntable_16{
      background: url('https://file.aicar365.com/mini-program/16/common/ld_bg.png') no-repeat;
      background-size: 100% auto;
    }
    &.c_activity_turntable_nullbg {
      background: url('https://file.aicar365.com/mini-program/common/cctivity_dynamics_bg_def.jpg') no-repeat;
      background-size: 100% auto;
    }
  }
  .time {
    width: 100%;
    position: absolute;
    top: 194rpx;
    text-align: center;
    font-size: 32rpx;
    line-height: 32rpx;
    color: @ctjt-color-text-white;
  }
  .lottery_box {
    position: absolute;
    bottom: 18rpx;
    left: 0;
    width: 100%;
  }
</style>
