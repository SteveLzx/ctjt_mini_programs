<template>
  <view class="content">
    <canvas
      type="2d"
      id="cardCanvas"
      style="width: 345px; height: 276px; position: fixed; top: 200%"
    ></canvas>
    <canvas
      type="2d"
      id="myCanvas"
      style="
        width: 345px;
        height: 276px;
        margin: 0;
        position: fixed;
        top: -200%;
      "
    ></canvas>
    <!-- <ShareLoading
      :type="type"
      :show-share="false"
      :show-contact="false"
      :sId="schoolId"
      :user-id="userId"
      :scene-id="sceneId"
      :user-type="userType"
      :source="'nameCard'"
      @down-store="downStore"
    >
      <template #share-content> -->
    <view class="name_card_info">
      <NameCardInfo ref="nameCardInfoRef" :show-mobile="true" :user-id="userId" @getCardInfo="getCardInfo"/>
    </view>
    <view class="card_menu">
      <view class="menu1" @click="showDownloadPoster = true">下载名片</view>
      <button open-type="share" class="menu2" :data-type="7">分享名片</button>
    </view>
    <!-- </template>
    </ShareLoading> -->
    <DownloadPoster
      v-if="showDownloadPoster"
      @close="showDownloadPoster = false"
      :data="downloadPosterData"
    />
  </view>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
// import ShareLoading from '@/components/share_loading/index.vue';
import DownloadPoster from '@/components/download_poster/index.vue';
import NameCardIndex from './index';
import NameCardInfo from './components/name_card_info/index.vue';

@Component({
  components: { NameCardInfo, DownloadPoster },
})
export default class NameCard extends NameCardIndex {}
</script>
<style lang="less" scoped>
.content {
  height: 100%;
  box-sizing: border-box;
  // background-color: @ctjt-color-text-white;
  overflow: hideen;
  .scroll_box {
    height: 100%;
  }
  .name_card_info {
    background-color: @ctjt-color-text-white;
    padding-top: 56rpx;
    margin-bottom: 24rpx;
  }
}
.card_menu {
  display: flex;
  padding: 20rpx;
  background: #fff;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  .menu1,
  .menu2 {
    flex: 1;
    line-height: 70rpx;
    text-align: center;
    font-size: 32rpx;
    color: @ctjt-color-text-main;
    border-radius: 40rpx;
  }
  .menu1 {
    line-height: 66rpx;
    border: solid 2rpx @ctjt-color-text-main;
    margin-right: 30rpx;
  }
  .menu2 {
    background: @ctjt-color-primary;
  }
}
</style>
