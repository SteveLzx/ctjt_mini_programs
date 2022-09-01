<template>
  <view class="container-conversation">
    <!-- <button @tap="login('234')">234登录</button>
    <button @tap="login('557959396575936857')">557959396575936857登录</button> -->
		<view class="scroll-box" v-if="queryConversation && conversationList.length > 0">
			<view class="uni-list margintop-bar">
				<view v-for="item in conversationList" :key="item.conversationID" @tap="handleRoute(item.conversationID)">
					<TUI-conversation-item :data-type="item.type" :conversation="item"></TUI-conversation-item>
				</view>
			</view>
		</view>
		<view class="bottom-back" v-if="false">
			<view class="bottom-area">
				<view v-if="showSelectTag" class="conversation-bubble" @tap.stop="handleEditToggle">
					<view v-for="(item, index) in array" :key="index" class="picker" :data-name="item.name" @tap="handleOnTap">{{ item.name }}</view>
				</view>
				<!-- <image @tap="showMore" class="btn-show-more" src="/static/assets/add.svg"></image> -->
			</view>
		</view>
    <view class="default_box" v-if="queryConversation && conversationList.length === 0">
      <image src="https://file.aicar365.com/mini-program/common/queshengye_banbiexinxi.png" class="detault_img"></image>
      <view class="warn">暂无更多消息～</view>
    </view>
    <Tabbar :currentIndex="2"/>
	</view>
</template>
<!-- 这里有个加载的补丁逻辑待优化，页面向SDK请求conversationList的时候会有时延，
造成页面的一个抖动，这里加一个if逻辑打一个补丁，后续继续优化 -->
<script>
/* eslint-disable */
import logger from '../../../utils/logger';
import TUIConversationItem from '../../../components/tui-conversation/conversation-item/index';
import TUIMessageList from '../../../components/tui-chat/message-list/index';
import { genTestUserSig } from '../../../debug/GenerateTestUserSig.js';
import { setTokenStorage } from '../../../utils/token';
import Tabbar from '@/components/tabbar/index.vue';
import { getGlobalData } from '@/assets/js/global_data';

const app = getApp();
console.log(app);

export default {
	data() {
		return {
			conversationList: [],
			showSelectTag: false,
      queryConversation: false,
			array: [
				{
					name: '发起会话'
				},
				{
					name: '发起群聊'
				},
				{
					name: '加入群聊'
				}
			]
		};
	},

	components: {
		TUIConversationItem,
		TUIMessageList,
    Tabbar
	},
	props: {},
  onShow() {
    if (uni.getStorageSync('im_token')) {
      this.getConversationList();
    }
    const $emitter = getGlobalData('$emitter');
    $emitter.emit('getUnreadMsgNum', true);
  },

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad() {
    const $emitter = getGlobalData('$emitter');
    $emitter.on('imLogin', () => {
      setTimeout(() => {
        this.getConversationList();
      }, 500);
    });
	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {
		uni.$TUIKit.off(uni.$TUIKitEvent.SDK_READY, this.onConversationListUpdated);
	},

	methods: {
    login(userID) {
      const userSig = genTestUserSig(userID).userSig;
      const SDKAppID = app.globalData.SDKAppID;
      app.globalData.userInfo = {
        userSig,
        userID
      };
      setTokenStorage({
        userInfo: app.globalData.userInfo
      });
      wx.setStorageSync(`TIM_${getApp().SDKAppID}_isTUIKit`, true);
      uni.$TUIKit.login({
        userID: userID,
        userSig: userSig
      }).then(() => {
        // 登入后拉去会话列表
        // this.getConversationList();
        uni.$TUIKit.on(uni.$TUIKitEvent.CONVERSATION_LIST_UPDATED, this.onConversationListUpdated);
      })
    },
		handleRoute(id) {
			const url = `../../TUI-Chat/chat?conversationID=${id}`;
			uni.navigateTo({
				url
			});
		},
		onConversationListUpdated(event) {
			logger.log('TUI-conversation | onConversationListUpdated  |ok');
      console.log('-----------------------');
      console.log(event);
			this.setData({
				conversationList: event.data
			});
		},

		getConversationList() {
      console.log('-=--------------------------');
			uni.$TUIKit.getConversationList().then(imResponse => {
        this.queryConversation = true;
				logger.log(`TUI-conversation | getConversationList | getConversationList-length: ${imResponse.data.conversationList.length}`);
				this.setData({
					conversationList: imResponse.data.conversationList
				});
			});
		},

		showMore() {
			this.setData({
				showSelectTag: !this.showSelectTag
			});
		},

		handleOnTap(event) {
			this.setData(
				{
					showSelectTag: false
				},
				() => {
					switch (event.currentTarget.dataset.name) {
						case '发起会话':
							this.$createConversation();
							break;

						case '发起群聊':
							this.$createGroup();
							break;

						case '加入群聊':
							this.$joinGroup();

						default:
							break;
					}
				}
			);
		},

		goHomePage() {
			// uni.navigateTo 不能跳转到 tabbar 页面，使用 uni.switchTab 代替
			uni.switchTab({
				url: '../../TUI-Index/index'
			});
		},

		handleEditToggle() {
			this.setData({
				showSelectTag: false
			});
		},

		$createConversation() {
			uni.navigateTo({
				url: '../create-conversation/create'
			});
		},

		$createGroup() {
			uni.navigateTo({
				url: '../../TUI-Group/create-group/create'
			});
		},

		$joinGroup() {
			uni.navigateTo({
				url: '../../TUI-Group/join-group/join'
			});
		}
	}
};
/* eslint-enable */
</script>
<style scoped>
@import './conversation.css';
.default_box{
  color: #E45450;
  text-align: center;
  padding-top: 400rpx;
  font-size: 28rpx;
  background: #fff;
  padding-top: 144rpx;
  text-align: center;
  height: 100%;
}
.detault_img{
  width: 422rpx;
  height: 326rpx;
}
.warn{
  font-size: 28rpx;
  color: #666666;
  line-height: 40rpx;
}
</style>
