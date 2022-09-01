<template>
  <view class="c_dynamic_child" :class="{ disable: downTimes }">
    <view class="disble_wrap" v-if="downTimes">活动暂未开始</view>
    <view class="content" @click="goShareLandingpage">
      <view class="tit">{{title}}</view>
      <view class="date">{{data.publishTime}}</view>
      <template v-if="data.type === 7">
        <view class="c_card">
          <view class="c_card_t">
            <image class="portrait"
            :src="detaultImg"
            mode="aspectFill"></image>
            <view class="info">
              <view class="name">{{cardNameFilter}}</view>
              <view class="c_mobile">
                <text class="iconfont">&#xe6a2;</text>
                <text class="mobile">{{cardMobileFilter}}</text>
              </view>
            </view>
          </view>
          <view class="c_card_b">{{cardCompanyFliter}}</view>
        </view>
      </template>
      <template v-else>
        <image
          class="img"
          :src="srcUrl"
          mode="aspectFill"
        ></image>
      </template>
      <view class="data">
        <text>
          <text v-if="data.publishCount !== undefined">发布 {{ data.publishCount | filterNums}}</text>
          <text>查看 {{ data.viewCount | filterNums}}</text>
          <text>转发 {{ data.forwardCount | filterNums}}</text>
          <!-- <text>成交 {{ data.publishCount | filterNums}}</text> -->
        </text>
        <!-- <text class="iconfont" v-show="true">&#xe69e;</text>
        <text class="iconfont" v-show="false">&#xe69d;</text> -->
      </view>
      <!-- <view class="data_detail_box" v-for="item in 3" :key="item">
        <DynamicSwipeLogsView></DynamicSwipeLogsView>
      </view> -->
    </view>
    <!--下载和分享按钮-->
    <DownloadShare
      :detail="data"
      :type="data.type"
      @down="down"
    />
  </view>
</template>
<script lang="ts">
import {
  Vue, Component, Prop, Emit
} from 'vue-property-decorator';
import DownloadShare from '@/components/download_share/index.vue';
// import DynamicSwipeLogsView from '@/pages/public/dynamic/components/swipe_logs_view/index.vue';
import { bigNumberTransform, schoolName, schoolTelephone } from '@/assets/js/common';
import { proImgDomain } from '@/assets/js/config';
import { schoolId } from '@/config/build_path';

@Component({
  components: { DownloadShare },
  filters: {
    filterNums(num: number) {
      return bigNumberTransform(num);
    }
  }
})
export default class DynamicListChild extends Vue {
  detaultImg = `https://file.aicar365.com/mini-program/${schoolId}/common/headportrait_normal.png`;

  @Prop({ default: {} }) data!: {}

  @Emit('download-share')
  down() {
    return this.data;
  }

  imgDomain = proImgDomain

  get srcUrl() {
    const { type, url } = (this as any).data;
    if (type === 5) return 'https://file.aicar365.com/mini-program/common/dongtai_huodong1.png';
    if (type === 6) return 'https://file.aicar365.com/mini-program/common/dongtai_li.jpg';
    if (type === 99) return schoolId === 370 ? 'https://file.aicar365.com/mini-program/common/dongtai_li.jpg' : 'https://file.aicar365.com/mini-program/common/dongtai_yqxc.jpg';
    return this.imgDomain + url;
  }

  get downTimes() {
    const { type, beginDate } = (this as any).data;
    if (type === 5 || type === 6) {
      return new Date(beginDate).getTime() > new Date().getTime();
    }
    return false;
  }

  get title() {
    const { type, title } = (this as any).data;
    if (type === 7) {
      return `${title}的名片`;
    }
    if (type === 5 || type === 6) {
      return `${title}营销活动`;
    }
    return title;
  }

  get cardNameFilter() {
    const { userType, cardName } = (this as any).data;
    return userType === 3 ? schoolName[schoolId] : cardName || schoolName[schoolId];
  }

  get cardMobileFilter() {
    const { userType, cardMobile } = (this as any).data;
    return userType === 3 ? schoolTelephone[schoolId] : cardMobile || schoolTelephone[schoolId];
  }

  get cardCompanyFliter() {
    const { userType, cardCompany } = (this as any).data;
    return userType === 3 ? schoolName[schoolId] : cardCompany || schoolName[schoolId];
  }

  // 跳转分享落地页
  goShareLandingpage() {
    const { id } = (this as any).data;
    uni.navigateTo({
      url: `/pages/public/dynamic/publish/share_landingpage?scene=${id}`,
    });
  }
}

</script>
<style lang="less" scoped>
  .c_dynamic_child {
    &.disable {
      .disble_wrap {
        display: block;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.7);
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        color: #fff;
        font-size: 32rpx;
        line-height: 528rpx;
      }
    }
  }
  .content {
    padding: 40rpx 32rpx;
    .tit {
      line-height: 32rpx;
      color: @ctjt-color-text-main;
      line-height: 32rpx;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
    }
    .date {
      color: @ctjt-color-text-secondary-two;
      font-size: 26rpx;
      line-height: 26rpx;
      padding: 16rpx 0 24rpx;
    }
    .img {
      width: 460rpx;
      max-height: 230rpx;
      border-radius: 16rpx;
      vertical-align: top;
    }
    .data {
      display: flex;
      justify-content: space-between;
      color: @ctjt-color-text-secondary-one;
      font-size: 26rpx;
      line-height: 26rpx;
      margin-top: 24rpx;
      text:not(.iconfont) {
        margin-right: 24rpx;
      }
    }
  }
  .data_detail_box {
    padding-top: 16rpx;
    overflow: hidden;
  }
  .c_card {
    width: 460rpx;
    height: 198rpx;
    padding: 33rpx;
    border-radius: 24rpx;
    background: url('https://file.aicar365.com/mini-program/common/img_mingpianbg.png') no-repeat;
    background-size: 100% auto;
    box-sizing: border-box;
    .c_card_t {
      display: flex;
      .portrait {
        width: 86rpx;
        height: 86rpx;
        border: 2rpx solid @ctjt-color-text-white;
        box-sizing: border-box;
        border-radius: 50%;
      }
      .info {
        flex: 1;
        margin-left: 25rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .name {
          line-height: 32rpx;
          color: @ctjt-color-text-main;
          font-size: 32rpx;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
        }
        .c_mobile {
          .iconfont {
            font-size: 26rpx;
            line-height:26rpx;
            color: @ctjt-color-text-secondary-one;
          }
          .mobile {
            line-height: 26rpx;
            color: @ctjt-color-text-secondary-one;
            font-size: 26rpx;
          }
        }
      }
    }
    .c_card_b {
      margin-top: 25rpx;
      line-height: 26rpx;
      color: @ctjt-color-text-secondary-one;
      font-size: 26rpx;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
    }
  }
</style>
