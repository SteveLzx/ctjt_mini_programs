<template>
  <view class="datetime-picker">
    <view
      class="mask"
      :class="{ show: show }"
      @touchmove.stop.prevent
      catchtouchmove="true"
      @click="_hide"></view>
    <view class="wrap" :class="{ show: show }">
        <view class="picker-header" @touchmove.stop.prevent catchtouchmove="true">
          <view
            class="btn-picker cancel"
            :style="{ color: color }"
            @click="_hide">取消</view>
          <view
            class="btn-picker submit"
            :style="{ backgroundColor: color }"
            @click="onSubmit"
          >确定</view>
        </view>
        <view class="picker-body">
          <picker-view :value="value" @change="handleChange">
            <picker-view-column>
              <view class="column-item" v-for="item in years" :key="item">
                {{ item }}年
              </view>
            </picker-view-column>
            <picker-view-column>
              <view class="column-item" v-for="item in months" :key="item">
                {{ item | formatNum }}月
              </view>
            </picker-view-column>
            <picker-view-column>
              <view class="column-item" v-for="item in days" :key="item">
                {{ item | formatNum }}日
              </view>
            </picker-view-column>
            <picker-view-column>
              <view class="column-item" v-for="item in hours" :key="item">
                {{ item | formatNum }}时
              </view>
            </picker-view-column>
            <picker-view-column>
              <view class="column-item" v-for="item in minutes" :key="item">
                {{ item | formatNum }}分
              </view>
            </picker-view-column>
            <picker-view-column>
              <view class="column-item" v-for="item in seconds" :key="item">
                {{ item | formatNum }}秒
              </view>
            </picker-view-column>
          </picker-view>
        </view>
    </view>
  </view>
</template>

<script lang="ts">
import console from '@/package_im/utils/console';

import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

const formatNumFunc = num => (num < 10 ? `0${num}` : `${num}`);

@Component({
  filters: {
    formatNum(num) {
      return formatNumFunc(num);
    }
  }
})
export default class CtjtDatatimePicker extends Vue {
  @Prop({ default: '' }) time!: string;

  @Prop({ default: false }) show!: boolean;

  date = new Date();

  value = []; // 选中值数组

  years = []; // 年

  year = 0

  months = []; // 月

  month = 0

  days = []; // 日

  day = 0

  hours = []; // 时

  hour = 0

  minutes = []; // 分

  minute = 0

  seconds = []; // 秒

  second = 0

  // 初始化时间列表
  init() {
    const { time } = this;
    if (time !== '') {
      this.date = new Date(time);
    }
    // 初始默认值
    this.year = this.date.getFullYear();
    this.month = this.date.getMonth() + 1;
    this.day = this.date.getDate();
    this.hour = this.date.getHours();
    this.minute = this.date.getMinutes();
    this.second = this.date.getSeconds();

    for (let i = 2000; i <= this.year + 20; i += 1) {
      this.years.push(i);
    }
    for (let i = 1; i <= 12; i += 1) {
      this.months.push(i);
    }
    for (let i = 1; i <= 31; i += 1) {
      this.days.push(i);
    }
    for (let i = 0; i <= 23; i += 1) {
      this.hours.push(i);
    }
    for (let i = 0; i < 60; i += 1) {
      this.minutes.push(i);
    }
    for (let i = 0; i < 60; i += 1) {
      this.seconds.push(i);
    }
    // 获取当前时间，给value赋值
    const {
      years, months, days, hours, minutes, seconds, year, month, day, hour, minute, second
    } = this;
    this.value[0] = years.indexOf(year);
    this.value[1] = months.indexOf(month);
    this.$nextTick(() => {
      this.value = [years.indexOf(year), months.indexOf(month), days.indexOf(day), hours.indexOf(hour), minutes.indexOf(minute), seconds.indexOf(second)];
    });
  }

  // 获取当前日期，设置日期
  getDays() {
    console.log('this.date', this.date);
    let selectedYear = this.date.getFullYear();
    let selectedMonth = this.date.getMonth() + 1;

    const days = [];
    if (this.show) {
      selectedYear = this.years[this.value[0]];
      selectedMonth = this.months[this.value[1]];
    }

    const totalDays = new Date(selectedYear, selectedMonth, 0).getDate();
    for (let i = 1; i <= totalDays; i += 1) {
      days.push(i);
    }

    this.days = days;
  }

  handleChange(e) {
    const value = e.detail.value;
    this.value = value;
    this.setSelectValue();
  }

  setSelectValue() {
    if (this.years[this.value[0]]) {
      this.year = this.years[this.value[0]];
    } else {
      this.year = this.years[this.years.length - 1];
    }
    this.month = this.months[this.value[1]];
    if (this.days[this.value[2]]) {
      this.day = this.days[this.value[2]];
    } else {
      this.day = this.days[this.days.length - 1];
    }

    this.hour = this.hours[this.value[3]];
    this.minute = this.minutes[this.value[4]];
    this.second = this.minutes[this.value[5]];
  }

  onSubmit() {
    this.setSelectValue();
    const result = {
      year: formatNumFunc(this.year),
      month: formatNumFunc(this.month),
      day: formatNumFunc(this.day),
      hour: formatNumFunc(this.hour),
      minute: formatNumFunc(this.minute),
      second: formatNumFunc(this.second),
      time: ''
    };
    const {
      year, month, day, hour, minute, second
    } = result;
    result.time = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    this.$emit('confirm', result);
    this._hide();
  }

  _hide() {
    this.$emit('update:show', false);
  }

  @Watch('show', { immediate: true })
  handleWatchShow(value: boolean) {
    if (value) {
      this.init();
    }
  }

  @Watch('month')
  handleWatchMonth() {
    this.getDays();
  }

  @Watch('year')
  handleWatchYear() {
    this.getDays();
  }
}
</script>

<style lang="less" scoped>
.datetime-picker {
  position: relative;
  z-index: 9;

  picker-view {
    width: 100%;
    height: 400rpx;
    margin-top: 16rpx;
  }

  .mask {
    position: fixed;
    z-index: 10;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.7);
    visibility: hidden;
    opacity: 0;
    transition: all 0.3s ease;;
    &.show {
      visibility: visible;
      opacity: 1;
    }
  }

  .wrap {
    z-index: 11;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    transition: all 0.3s ease;;
    transform: translateY(100%);
    &.show {
      transform: translateY(0);
    }
  }

  .btn-picker {
    width: 200rpx;
    height: 70rpx;
    border-radius: 35rpx;
    line-height: 70rpx;
    font-size: 32rpx;
    text-align: center;
    color: @ctjt-color-text-main;
  }

  .btn-picker.cancel {
    border: 2rpx solid @ctjt-color-border-one;
    background-color: @ctjt-color-text-white;
  }

  .btn-picker.submit {
    background-color: @ctjt-color-primary;
  }

  .picker-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 8rpx 8rpx;
    background-color: darken(@ctjt-color-text-white, 2%);
    background-color: @ctjt-color-text-white;
  }

  .picker-body {
    width: 100%;
    height: 420rpx;
    overflow: hidden;
    background-color: @ctjt-color-text-white;
  }

  .column-item {
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 100rpx;
    text-align: center;
  }
}
</style>
