<template>
  <view class="lm_wrap">
    {{ loadTextFilter() }}
  </view>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class LoadMore extends Vue {
  @Prop({
    default: {},
  })
  contentText!: any;

  @Prop({
    default: false,
  })
  status!: string;

  loadTextFilter() {
    const { status } = this;
    const { contentrefresh, contentdown, contentnomore } = this.contentText;
    const statusObj = {
      loading: contentrefresh,
      loadmore: contentdown,
      nomore: contentnomore,
    };
    return statusObj[status];
  }
}
</script>

<style lang="less" scoped>
.lm_wrap {
  font-size: 24rpx;
  line-height: 1;
  color: @ctjt-color-text-secondary-one;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80rpx;
  background-color: @ctjt-bgcolor-primary;
}
</style>
