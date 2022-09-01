 <template>
  <view class="search_item_wrap">
    <view class="text_wrap">筛选</view>
    <view class="search_wrap">
      <view class="search_item" v-for="item in list" :key="item">{{
        item
      }}</view>
    </view>
    <view class="clear_search" @click="$emit('clearSearItem')">
      <text class="clear_text">清除</text>
      <image class="icon_clear" :src="deleteIcon()"></image>
      <!-- <text class="iconfont icon_clear">&#xe6a3;</text> -->
    </view>
  </view>
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Emit, Watch
} from 'vue-property-decorator';

@Component
export default class ThreadSearchItem extends Vue {
  @Prop({ required: true }) list!: [];

  deleteIcon = () => 'https://file.aicar365.com/mini-program/common/icon/icon_delete_orange.png';
}
</script>
<style lang="less" scoped>
.search_item_wrap {
  height: 88rpx;
  padding: 0 30rpx;
  background-color: @ctjt-color-text-white;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  overflow: hidden;
  .text_wrap {
    line-height: 88rpx;
    font-size: 28rpx;
    margin-right: 24rpx;
  }
  .search_wrap {
    display: flex;
    align-items: center;
    overflow: scroll;
    width: 72%;
    .search_item {
      margin-right: 24rpx;
      height: 38rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
      color: @ctjt-color-label;
      border: 1rpx solid @ctjt-color-label;
      background-color: @ctjt-color-primary-20;
      border-radius: 24rpx;
      max-width: 300rpx;
      width: auto;
      display: flex;
      justify-content: center;
      word-break: keep-all;
    }
  }
  /deep/.search_wrap::-webkit-scrollbar {
    /* 隐藏滚动条，但依旧具备可以滚动的功能 */
    display: none;
  }
  .clear_search {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: @ctjt-color-text-white;
    box-shadow: -1rpx 0rpx 1rpx 0rpx @ctjt-bgcolor-primary;
    z-index: 2;
    position: absolute;
    right: 30rpx;
    padding: 30rpx 0;
    width: 110rpx;
    .clear_text {
      color: @ctjt-color-label;
      font-size: 28rpx;
      margin: 0 8rpx 0 19rpx;
      line-height: 1;
    }
    .icon_clear {
      width: 28rpx;
      height: 28rpx;
    }
  }
}
</style>
