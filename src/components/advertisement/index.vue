<template>
  <view class="c_advertisement">
    <swiper class="swiper"
      :autoplay="true"
      :interval="5000"
      :duration="500"
      :circular="true"
      @change="swiperChange">
        <swiper-item v-for="(item, index) in list" :key="index">
          <view class="swiper_item">
            <image :src="item.type === 5 ? 'https://file.aicar365.com/mini-program/common/swiper_active_fx.jpg' : 'https://file.aicar365.com/mini-program/common/swiper_active_lj.jpg'" mode="widthFix"></image>
          </view>
        </swiper-item>
    </swiper>
    <!-- 指示点 -->
    <view class="swiper_dots">
      <text :class="['swiper_dot', { 'swiper_dot_active': current === index }]" v-for="(item, index) in list" :key="index"></text>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { imgDomain } from '@/assets/js/config';

@Component
export default class Advertisement extends Vue {
  @Prop({ default: [] }) list!: []

  imgDomain = imgDomain;

  current = 0;

  swiperChange(e) {
    const { current } = e.detail;
    this.current = current;
  }
}
</script>
<style lang="less" scoped>
.c_advertisement {
  position: relative;
}
.swiper {
  height: 230rpx;
  border-radius: 24rpx;
  overflow: hidden;
  .swiper_item {
    overflow: hidden;
    image {
      width: 100%;
      height: auto;
      border-radius: 24rpx;
    }
  }
}
.swiper_dots {
  width: 100%;
  position: absolute;
  bottom: 8rpx;
  display: flex;
  justify-content: center;
  z-index: 1;
  .swiper_dot {
    margin: 0 4rpx;
    width: 12rpx;
    height: 12rpx;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .swiper_dot_active {
    border-radius: 6rpx;
    width: 24rpx;
    background-color: @ctjt-color-primary;
  }
}
</style>
