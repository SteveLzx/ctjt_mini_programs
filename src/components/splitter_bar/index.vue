<template>
  <view class="content" :style="splitterStyle">
    <span class="label"></span>
    <text style="margin: 0 32rpx;">{{tit}}</text>
    <span class="label"></span>
  </view>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class SplitterBar extends Vue {
  @Prop({ required: true }) tit!: string;

  @Prop({ required: false }) splitterStyle!: string;
}

</script>

<style lang="less" scoped>
.content {
  color: @ctjt-color-text-secondary-one;
  font-size: 26rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
  .label {
    width: 104rpx;
    height: 1rpx;
    background-color: #d8d8d8;;
  }
}
</style>
