<template>
	<view class="container">
		<!-- #ifdef MP-WEIXIN -->
		<!-- <tuicalling
		ref="TUICalling"
		id="TUICalling-component"
		:config="config">
	</tuicalling> -->
		<!-- #endif -->
		<view class="tui-chatroom-navigatorbar" v-if="false">
			<image class="tui-chatroom-navigatorbar-back" src="../../../static/assets/ic_back_white.svg" @tap="goBack" />
			<!-- 先查 remark；无 remark 查 (c2c)nick/(group)name；最后查 (c2c)userID/(group)groupID -->
			<view class="conversation-title">{{ conversationName }}</view>
		</view>
		<!-- <view class="group-profile"><TUI-group-profile v-if="isShow" id="groip-profile" :conversation="conversation" /></view> -->
		<view class="message-list" @tap="triggerClose"><TUI-message-list id="message-list" ref="messageList" :conversation="conversation" /></view>
		<view v-if="videoPlay" class="container-box" @tap.stop="stopVideoHander">
			<video
				v-if="videoPlay"
				class="video-message"
				:src="videoMessage.payload.videoUrl"
				:poster="videoMessage.payload.thumbUrl"
				object-fit="cover"
				error="videoError"
				autoplay="true"
				direction="0"
			/>
		</view>
		<view v-if="showChat" class="message-input">
			<TUI-message-input id="message-input" ref="messageInput" :conversation="conversation" @sendMessage="sendMessage" />
		</view>
	</view>
</template>

<script>
/* eslint-disable */
import logger from '../../utils/logger';
import TUIMessageList from '../../components/tui-chat/message-list/index';
import TUIMessageInput from '../../components/tui-chat/message-input/index';
// import TUIGroupProfile from '../../components/tui-group/group-profile/index';

const app = getApp();
export default {
	components: {
		TUIMessageList,
		TUIMessageInput,
	},
	props: {},
	data() {
		return {
			conversationName: '',
			conversation: {},
			messageList: [],
			isShow: false,
			showChat: true,
			conversationID: '',
			videoPlay: false,
			videoMessage: {},
			config: {
				sdkAppID: '',
				userID: '',
				userSig: '',
				type: 1,
				tim: null
			}
		};
	},
	created() {
		uni.$on('videoPlayerHandler', value => {
			this.videoPlay = value.isPlay;
			this.videoMessage = value.message;
		});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		// conversationID: C2C、 GROUP
		logger.log(` TUI-chat | onLoad | conversationID: ${options.conversationID}`);
		const { conversationID } = options;
		this.setData({
			conversationID
		});
		// #ifdef MP-WEIXIN
		// this.config = {
		// 	sdkAppID: app.globalData.SDKAppID,
		// 	userID: app.globalData.userInfo.userID,
		// 	userSig: app.globalData.userInfo.userSig
		// }
		// logger.log(`TUI-chat | TUICalling-config  | config:${JSON.stringify(this.callingConfig)}`);
		// // 挂载在 uni 上
		// uni.$wxTUICalling = this.$refs.TUICalling;
		// 		this.$nextTick(() => {
		// 			uni.$wxTUICalling.init()
		// })
		// #endif
		uni.$TUIKit
			.setMessageRead({
				conversationID
			})
			.then(() => {
				logger.log('TUI-chat | setMessageRead  | ok');
			});
		uni.$TUIKit.getConversationProfile(conversationID).then(res => {
			const { conversation } = res.data;
			this.conversation = conversation;
			this.setData({
				conversationName: this.getConversationName(conversation),
				isShow: conversation.type === 'GROUP'
			});
      console.log(this.getConversationName(conversation))
      uni.setNavigationBarTitle({
        title: this.getConversationName(conversation)
      });
		});

    const promise = uni.$TUIKit.setMessageRead({conversationID: 'C2Cexample'});
    promise.then(function(imResponse) {
      // 已读上报成功，所有 C2C 会话的 unreadCount 属性值被置为0
      console.log('已读上报成功，指定 ID 的会话的 unreadCount 属性值被置为0');
    }).catch(function(imError) {
      // 已读上报失败
      console.warn('setAllMessageRead error:', imError);
    });
	},
	mounted() {},
	onUnload() {
		// #ifdef MP-WEIXIN
		//   this.$refs.TUICalling.destroyed();
		// // #endif
	},
	methods: {
		stopVideoHander() {
			this.videoPlay = false;
		},
		getConversationName(conversation) {
			if (conversation.type === '@TIM#SYSTEM') {
				this.setData({
					showChat: false
				});
				return '系统通知';
			}

			if (conversation.type === 'C2C') {
				return conversation.remark || conversation.userProfile.nick || conversation.userProfile.userID;
			}

			if (conversation.type === 'GROUP') {
				return conversation.groupProfile.name || conversation.groupProfile.groupID;
			}
		},

		sendMessage(event) {
			// 将自己发送的消息写进消息列表里面
			this.$refs.messageList.updateMessageList(event.detail.message);
		},

		triggerClose() {
			if (this.showChat) {
				this.$refs.messageInput.handleClose();
			}
		},

		goBack() {
			const pages = getCurrentPages(); // 当前页面栈

			if (
				pages[pages.length - 2].route === 'pages/TUI-Conversation/create-conversation/create' ||
				pages[pages.length - 2].route === 'pages/TUI-Group/create-group/create' ||
				pages[pages.length - 2].route === 'pages/TUI-Group/join-group/join'
			) {
				uni.navigateBack({
					delta: 2
				});
			} else {
				uni.navigateBack({
					delta: 1
				});
			}

			uni.$TUIKit
				.setMessageRead({
					conversationID: this.conversationID
				})
				.then(() => {});
		}
	}
};
/* eslint-enable */
</script>
<style>
@import './chat.css';
</style>
