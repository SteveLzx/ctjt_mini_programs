<template>
  <scroll-view class="scroll-container" :scrollLeft="scrollLeft" scroll-x="true">
    <view class="navbar flex_row_none_c">
      <view
        :style="cStyle"
        :class="['nav-item', { disflex: flex, current: current === index }]"
        v-for="(item, index) in list"
        :key="item.value"
        @touchmove.stop.prevent
        @click="tabClick(index)">{{ item.label }}</view>
    </view>
  </scroll-view>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class CtjtAutoCenterNav extends Vue {
  @Prop({ default: false }) flex!: boolean

  @Prop({ default: '' }) cStyle!: string

  @Prop({ default: 100 }) transLeft!: number

  @Prop({ default: 0 }) current!: number

  @Prop({ default: [] }) list!: []

  scrollLeft = 0;

  tabClick(index) {
    this.$emit('change', index);
    // 动态计算自动左滑的距离
    const query = uni.createSelectorQuery().in(this);
    /* eslint-disable */
    const that = this;
     /* eslint-enable */
    (query.selectAll('.nav-item') as any).fields({ size: true }).exec((res) => {
      let leftWidth = 0;
      for (let i = 0; i < index; i += 1) {
        leftWidth += res[0][i].width;
      }
      that.scrollLeft = leftWidth + res[0][index].width / 2 - that.transLeft;
    });
  }
}
</script>

<style lang="less" scoped>
.scroll-container {
	background: #fff;
	white-space: nowrap;
  box-sizing: border-box;
}
.navbar {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: center;
  line-height: 88rpx;
  height: 88rpx;
  box-sizing: border-box;
  background: #fff;
	.nav-item {
    font-size: 32rpx;
    color: @ctjt-color-text-main;
    padding: 0 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
    &.disflex {
      flex: 1;
      padding: 0;
    }
		// 选中状态
		&.current {
      position: relative;
      font-weight: 700;
      color: @ctjt-color-text-main;
      &::before {
        content: '';
        position: absolute;
        bottom: 12rpx;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 3rpx;
        height: 6rpx;
        width: 30rpx;
        background-color: @ctjt-color-primary;
      }
		}
	}
}
</style>
