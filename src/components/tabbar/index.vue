<template>
  <view class='tab_bar'>
    <template v-if="isStudent">
      <view v-for="(item, index) in tabList" :key="index" class="tab_list_wrap">
        <view class='tab_list' @click="changeTab(item, index)" v-if="!item.login || authFlag">
          <image class="icon" :src="currentIndex == index ? item.selectedIconPath : item.iconPath"/>
          <view class="title">{{item.title}}</view>
          <view class="badge" v-if="index === 2 && hasUnread"></view>
        </view>
        <button class='tab_list' open-type='getPhoneNumber' @getphonenumber='verifyTelAccredit' v-else>
          <image class="icon" :src="currentIndex == index ? item.selectedIconPath : item.iconPath"/>
          <view class="title">{{item.title}}</view>
        </button>
      </view>
    </template>
    <template v-else>
      <view class='tab_list2' v-for="(item, index) in tabList" :key="index" @click="changeTab(item, index)">
        <image class="icon" :src="currentIndex == index ? item.selectedIconPath : item.iconPath"/>
        <view class="title">{{item.title}}</view>
        <view class="badge" v-if="index === 2 && hasUnread"></view>
      </view>
      <view class="add_box" @click="toPublish">
        <text class="iconfont">&#xe6af;</text>
      </view>
    </template>
  </view>
</template>

<script lang='ts'>
import {
  Component,
  Vue,
  Prop,
  Watch
} from 'vue-property-decorator';
import {
  verifyTelAccredit
} from '@/assets/js/common';
import { getGlobalData } from '@/assets/js/global_data';

const studentTabList = [
  {
    title: '首页',
    pagePath: '../../public/home_new/index',
    iconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_shouye_default.png',
    selectedIconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_shouye_selected.png'
  }, {
    title: '动态',
    pagePath: '../../public/dynamic/index',
    iconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_dongtai_default.png',
    selectedIconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_dongtai_selected.png',
    login: true
  }, {
    title: '消息',
    pagePath: '../../../package_im/pages/TUI-Conversation/conversation/conversation',
    iconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_xiaoxi_default.png',
    selectedIconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_xiaoxi_selected.png',
    subscribe: true
  }, {
    title: '我的',
    pagePath: '../../public/my/index',
    iconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_wode_default.png',
    selectedIconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_wode_selected.png'
  }
];

const studentTabList2 = [
  {
    title: '首页',
    pagePath: '../../../../pages/public/home_new/index',
    iconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_shouye_default.png',
    selectedIconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_shouye_selected.png'
  }, {
    title: '动态',
    pagePath: '../../../../pages/public/dynamic/index',
    iconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_dongtai_default.png',
    selectedIconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_dongtai_selected.png',
    login: true
  }, {
    title: '消息',
    pagePath: '../../../package_im/pages/TUI-Conversation/conversation/conversation',
    iconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_xiaoxi_default.png',
    selectedIconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_xiaoxi_selected.png',
    subscribe: true
  }, {
    title: '我的',
    pagePath: '../../../../pages/public/my/index',
    iconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_wode_default.png',
    selectedIconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_wode_selected.png'
  }
];

const coachTabList = [
  {
    title: '首页',
    pagePath: '../../public/home_new/index',
    iconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_shouye_default.png',
    selectedIconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_shouye_selected.png'
  }, {
    title: '动态',
    pagePath: '../../public/dynamic/index',
    iconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_dongtai_default.png',
    selectedIconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_dongtai_selected.png',
    login: true
  },
  // {
  //   title: '线索',
  //   pagePath: '../../public/thread/index',
  //   iconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_xiaoxi_default.png',
  //   selectedIconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_xiaoxi_selected.png'
  // },
  {
    title: '线索',
    pagePath: '../../public/thread_new/index',
    iconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_xiaoxi_default.png',
    selectedIconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_xiaoxi_selected.png'
  },
  {
    title: '我的',
    pagePath: '../../public/my/index',
    iconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_wode_default.png',
    selectedIconPath: 'https://file.aicar365.com/mini-program/tabbar/tab_icon_wode_selected.png'
  }
];

@Component
export default class Tabbar extends Vue {
  @Prop({
    default: 0
  })
  currentIndex;

  tabList = [...studentTabList];

  isStudent = true;

  authFlag = false; // 是否展示授权

  hasUnread = false;

  created() {
    this.isStudent = !uni.getStorageSync('isCoach');
    if (this.currentIndex === 2) { // 消息页面需要调整跳转path的相对路径
      this.tabList = [...studentTabList2];
    }
    const $emitter = getGlobalData('$emitter');
    if (!uni.getStorageSync('mobile')) {
      $emitter.on('authorize', (flag: boolean) => {
        this.authFlag = true;
        this.isStudent = !uni.getStorageSync('isCoach');
      });
    } else {
      this.authFlag = true;
    }
    if (this.currentIndex === 2) {
      $emitter.on('getUnreadMsgNum', () => {
        this.getMsgTotal();
      });
    }
  }

  async getMsgTotal() {
    const imId = uni.getStorageSync('imId');
    if (!imId) return;
    const body = await this.$http.post('base/v1/im/getUnreadMsgNum', { id: imId });
    this.hasUnread = body && body.total > 0;
  }

  // 授权手机号回调
  verifyTelAccredit(e: any) {
    verifyTelAccredit(e);
  }

  @Watch('isStudent')
  roleChange() {
    this.tabList = this.isStudent ? [...studentTabList] : [...coachTabList];
  }

  changeTab(tab: any, index: number) {
    if (tab.subscribe) {
      // uni.requestSubscribeMessage({
      //   tmplIds: ['fDJfdE0GES6TX5sYpjlAn-1jjFdvYV-ZOmYaOf4DnvA'],
      //   fail: err => console.log(err)
      // });
    }
    uni.switchTab({
      url: tab.pagePath
    });
    this.getMsgTotal();
  }

  toPublish() {
    uni.navigateTo({
      url: '../dynamic/publish/new_index'
    });
  }
}

</script>

<style lang='less' scoped>
.tab_bar{
  background: #fff;
  position: fixed;
  z-index: 4;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16rpx 10rpx 0 10rpx;
  height: 84rpx;
  display: flex;
  box-shadow: 0px 1px 0px 0px rgba(229, 229, 229, 1);
  padding-bottom: constant(safe-area-inset-bottom); /*兼容 IOS<11.2*/
  padding-bottom: env(safe-area-inset-bottom); /*兼容 IOS>11.2*/
  text-align: center;
  .tab_list_wrap{
    flex: 1;
  }
  .tab_list{
    flex: 1;
    position: relative;
  }
  .tab_list2{
    width: 150rpx;
    position: relative;
    &:nth-child(3), &:nth-child(4){
      position: absolute;
    }
    &:nth-child(3){
      right: 150rpx;
    }
    &:nth-child(4){
      right: 0;
    }
  }
  .badge{
    width: 24rpx;
    height: 24rpx;
    border-radius: 50%;
    background: @ctjt-color-price;
    top: -8rpx;
    left: 50%;
    margin-left: 8rpx;
    position: absolute;
  }
  .icon{
    width: 46rpx;
    height: 46rpx;
    vertical-align: top;
  }
  .title{
    color: @ctjt-color-text-secondary-two;
    font-size: 20rpx;
    line-height: 1;
    margin-top: 4rpx;
  }
  .add_box{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -25rpx;
    background: #fff;
    width: 96rpx;
    height: 96rpx;
    border-radius: 50%;
    text-align: center;
    line-height: 100rpx;
    .iconfont{
      font-size: 80rpx;
      color: @ctjt-color-primary;
    }
  }
}
</style>
