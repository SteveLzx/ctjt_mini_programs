<template>
	<view>
		<view v-if="renderDom[0].type === 'order'" :class="'custom-message ' + (isMine ? 'my-custom' : '')">
			<image class="custom-image" :src="renderDom[0].imageUrl"></image>
			<view class="custom-content">
				<view class="custom-content-title">{{ renderDom[0].title }}</view>
				<view class="custom-content-description">{{ renderDom[0].description }}</view>
				<view class="custom-content-price">{{ renderDom[0].price }}</view>
			</view>
		</view>
		<view v-if="renderDom[0].type === 'consultion'" :class="'custom-message ' + (isMine ? 'my-custom' : '')">
			<view class="custom-content">
				<view class="custom-content-title">{{ renderDom[0].title }}</view>
				<view v-for="(item, index) in renderDom[0].item" :key="index" class="custom-content-description" :id="item.key">{{ item.key }}</view>
				<view class="custom-content-description">{{ renderDom[0].description }}</view>
			</view>
		</view>
		<view v-if="renderDom[0].type === 'evaluation'" :class="'custom-message ' + (isMine ? 'my-custom' : '')">
			<view class="custom-content">
				<view class="custom-content-title">{{ renderDom[0].title }}</view>
				<view class="custom-content-score">
					<image v-for="(item, index) in renderDom[0].score" :key="index" class="score-star" src="/static/images/star.png"></image>
				</view>
				<view class="custom-content-description">{{ renderDom[0].description }}</view>
			</view>
		</view>
		<view v-if="renderDom[0].type === 'group_create'" :class="'custom-message ' + (isMine ? 'my-custom' : '')">
			<view class="custom-content-text">{{ renderDom[0].text }}</view>
		</view>
		<view v-if="renderDom[0].type === 'c2cCalling' || renderDom[0].type === 'groupCalling'" :class="'custom-message ' + (isMine ? 'my-custom' : '')">
			<view class="custom-content-text">{{ renderDom[0].text }}</view>
		</view>
		<view v-if="renderDom[0].type === 'notSupport'" class="message-body-span text-message">
			<view class="message-body-span-text">{{ renderDom[0].text }}</view>
		</view>
	</view>
</template>

<script>
/* eslint-disable */
import { formateTime } from '../../../base/common.js';
export default {
	data() {
		return {};
	},
	components: {},
	props: {
		message: {
			type: Object,
			default: () => {}
		},
		isMine: {
			type: Boolean,
			default: true
		}
	},
	watch: {
		message: {
			handler: function(newVal) {
				this.setData({
					message: newVal,
					renderDom: this.parseCustom(newVal)
				});
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		// ???????????????????????????
		extractCallingInfoFromMessage(message) {
			const callingmessage = JSON.parse(message.payload.data);
			if (callingmessage.businessID !== 1) {
				return '';
			}
			const objectData = JSON.parse(callingmessage.data);
			switch (callingmessage.actionType) {
				case 1: {
					if (objectData.call_end >= 0 && !callingmessage.groupID) {
						return `???????????????${formateTime(objectData.call_end)}`;
					}
					if (callingmessage.groupID) {
						return '????????????';
					}
					if (objectData.data && objectData.data.cmd === 'switchToAudio') {
						return '??????????????????';
					}
					if (objectData.data && objectData.data.cmd === 'switchToVideo') {
						return '??????????????????';
					}
					return '????????????';
				}
				case 2:
					return '????????????';
				case 3:
					if (objectData.data && objectData.data.cmd === 'switchToAudio') {
						return '??????????????????';
					}
					if (objectData.data && objectData.data.cmd === 'switchToVideo') {
						return '??????????????????';
					}
					return '?????????';
				case 4:
					return '????????????';
				case 5:
					if (objectData.data && objectData.data.cmd === 'switchToAudio') {
						return '??????????????????';
					}
					if (objectData.data && objectData.data.cmd === 'switchToVideo') {
						return '??????????????????';
					}
					return '?????????';
				default:
					return '';
			}
		},
		parseCustom(message) {
			// ???????????????????????? data ????????????????????????????????????????????????
			if (message.payload.data === 'order') {
				const extension = JSON.parse(message.payload.extension);
				const renderDom = [
					{
						type: 'order',
						name: 'custom',
						title: extension.title || '',
						imageUrl: extension.imageUrl || '',
						price: extension.price || 0,
						description: message.payload.description
					}
				];
				return renderDom;
			} // ????????????

			if (message.payload.data === 'consultion') {
				const extension = JSON.parse(message.payload.extension);
				const renderDom = [
					{
						type: 'consultion',
						title: extension.title || '',
						item: extension.item || 0,
						description: extension.description
					}
				];
				return renderDom;
			} // ????????????

			if (message.payload.data === 'evaluation') {
				const extension = JSON.parse(message.payload.extension);
				const renderDom = [
					{
						type: 'evaluation',
						title: message.payload.description,
						score: extension.score,
						description: extension.comment
					}
				];
				return renderDom;
			} // ???????????????
			// ???????????????
			if (message.payload.data === 'group_create') {
				const renderDom = [
					{
						type: 'group_create',
						text: message.payload.extension
					}
				];
				return renderDom;
			}
			// ???????????????????????????
			const callingmessage = JSON.parse(message.payload.data);

			if (callingmessage.businessID === 1) {
				if (message.conversationType === 'GROUP') {
					if (message.payload.data.actionType === 5) {
						message.nick = message.payload.data.inviteeList ? message.payload.data.inviteeList.join(',') : message.from;
					}
					const _text = this.extractCallingInfoFromMessage(message);
					const groupText = `${_text}`;
					const renderDom = [
						{
							type: 'groupCalling',
							text: groupText,
							userIDList: []
						}
					];
					return renderDom;
				}
				if (message.conversationType === 'C2C') {
					const c2cText = this.extractCallingInfoFromMessage(message);
					const renderDom = [
						{
							type: 'c2cCalling',
							text: c2cText
						}
					];
					return renderDom;
				}
			}

			if (message.payload.data === 'group_create') {
				const renderDom = [
					{
						type: 'group_create',
						text: message.payload.extension
					}
				];
				return renderDom;
			}

			return [
				{
					type: 'notSupport',
					text: '[???????????????]'
				}
			];
		}
	}
};
/* eslint-enable */
</script>
<style>
@import './index.css';
</style>
