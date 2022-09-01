<template>
  <view class="setting_form">
    <form @submit="formSubmit">
      <slot name="uni-form-item"></slot>
      <view class="uni-form-item uni-column">
        <view class="title">活动时间</view>
        <view class="date_picker_container">
					<picker class="date_item" mode="date" :start="start" :value="formData.beginDate" @change="bindStartDateChange">
            <view class="date_item_c">
              <view class="date_text">{{formData.beginDate}}</view>
              <text class="iconfont">&#xe6b4;</text>
            </view>
					</picker>
          <!-- <input
            class="uni-input"
            placeholder="开始时间"
            name="startDate"
            :value="startDate"
            @click="() => { open = true; type = 1}"
            disabled
          /> -->
          <view class="date_tips">至</view>
					<picker class="date_item" mode="date" :start="start" :value="formData.endDate" @change="bindEndDateChange">
            <view class="date_item_c">
              <view class="date_text">{{formData.endDate}}</view>
              <text class="iconfont">&#xe6b4;</text>
            </view>
					</picker>
            <!-- <input
              class="uni-input"
              placeholder="结束时间"
              name="endDate"
              :value="endDate"
              @click="() => { open = true; type = 2}"
              disabled
            /> -->
        </view>
      </view>
      <view class="uni-form-item uni-column warning_item" v-if="showWarning">
        <label class="text_cls"
          >温馨提醒：给予介绍人的分销奖励由本人承担，公司不直接承担此部分费用，仅提供相关数据统计供参考，员工结算招生提成标准依据公司招生激励政策给予结算</label
        >
      </view>
    </form>
    <!-- <CtjtDatatimePicker :show.sync="open" :time="time" @confirm="datatimePickerConfirm"></CtjtDatatimePicker> -->
  </view>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
// import CtjtDatatimePicker from '@/components/datatime_picker/datatime_picker.vue';

type ParamsType = {
  [key: string]: any;
};
@Component({
  components: { }
})
export default class ActivityForm extends Vue {
  @Prop({ default: {} }) formData?: ParamsType;

  @Prop({ default: true }) showWarning?: boolean;

  start = ''

  created() {
    const time = new Date(new Date().getTime());
    const year = time.getFullYear();
    let month: any = time.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    let day: any = time.getDate();
    day = day < 10 ? `0${day}` : day;
    this.start = `${year}/${month}/${day}`;
  }

  type = 0;

  open = false;

  time = '';

  // datatimePickerConfirm(val: any) {
  //   console.log(val);
  //   const { type } = this;
  //   if (type === 1) {
  //     this.startDate = val.time;
  //   }
  //   if (type === 2) {
  //     this.endDate = val.time;
  //   }
  // }

  formSubmit(e) {
    const formdata = e.detail.value;
    console.log(formdata);
  }

  bindStartDateChange(e) {
    const { value } = e.target;
    const { formData } = this;
    const _formData = formData;
    _formData.beginDate = value;
    this.$emit('update:formData', _formData);
  }

  bindEndDateChange(e) {
    const { value } = e.target;
    const { formData } = this;
    const _formData = formData;
    _formData.endDate = value;
    this.$emit('update:formData', _formData);
  }
}
</script>

<style lang="less" scoped>
.uni-form-item {
  .title {
    padding: 40rpx 0 16rpx 0rpx;
    font-size: 32rpx;
    line-height: 32rpx;
    color: @ctjt-color-text-main;
  }
  .date_picker_container {
    display: flex;
    width: 100%;
    .date_item {
      flex: 1;
    }
    .date_item_c {
      display: flex;
      align-items: center;
      padding: 0 24rpx;
      height: 88rpx;
      line-height: 88rpx;
      border-radius: 24rpx;
      font-size: 26rpx;
      text-align: center;
      background-color: @ctjt-bgcolor-primary;
      color: @ctjt-color-border-one;
    }
    .date_text {
      flex: 1;
      line-height: 32rpx;
      font-size: 32rpx;
      color: @ctjt-color-text-main;
    }
    .iconfont {
      font-size: 36rpx;
      line-height: 36rpx;
    }
    .date_tips {
      height: 88rpx;
      line-height: 88rpx;
      font-size: 32rpx;
      color: @ctjt-color-text-main;
      margin: 0 31rpx;
    }
  }
}
.warning_item {
  margin: 16rpx 0 0 0;
  .text_cls {
    color: @ctjt-color-border-one;
    font-size: 22rpx;
  }
}
</style>
