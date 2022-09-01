<template>
  <view class="enc_wrap">
    <!-- <canvas
      type="2d"
      id="avatarCanvas"
      :style="{ width: cWidth + 'px', height: cHeight + 'px' }"
      style="position: fixed; top: 200%"
    ></canvas> -->
    <canvas
      type="2d"
      id="avatarCanvas"
      style="position: fixed; top: 200%"
    ></canvas>

    <view class="top">
      <view class="section photo_section">
        <view class="title">职业照</view>
        <view class="content" @click="uploadAvatar">
          <image class="avatar" :src="formData.icon"></image>
          <text class="iconfont">&#xe6a3;</text></view
        >
      </view>
      <view class="section basic_section">
        <view class="section_item">
          <view class="title">姓名/称呼</view>
          <input
            class="item_input grey"
            v-model.trim="formData.userName"
            disabled
          />
        </view>
        <view class="section_item">
          <view class="title">性别</view>
          <input
            class="item_input grey"
            v-model.trim="sexList[formData.sex].label"
            disabled
          />
        </view>
        <view class="section_item">
          <view class="title">电话号码</view>
          <input
            class="item_input grey"
            v-model.trim="formData.mobile"
            disabled
          />
        </view>
        <!-- <view class="section_item">
          <view class="title">微信号</view>
          <input
            class="item_input"
            v-model.trim="formData.wechatId"
            placeholder="不得超过20个字符"
          />
        </view> -->
        <view class="section_item">
          <view class="title">邮箱</view>
          <input
            class="item_input grey"
            v-model.trim="formData.email"
            disabled
          />
        </view>
      </view>
      <view class="section self_dec_section">
        <view class="section_item">
          <view class="title">个人介绍<label class="required">*</label></view>
          <textarea
            class="item_textarea"
            v-model.trim="formData.about"
            placeholder="最多100个字符"
          />
        </view>
      </view>
      <view class="section company_info_section">
        <view class="section_item">
          <view class="title">所属驾校</view>
          <input
            class="item_input grey"
            v-model.trim="formData.drivingSchoolName"
            disabled
          />
        </view>
        <view class="section_item">
          <view class="title">相关门店</view>
          <input
            class="item_input grey"
            v-model.trim="formData.storeName"
            disabled
          />
        </view>
        <view class="section_item">
          <view class="title">相关训练场</view>
          <input
            class="item_input grey"
            v-model.trim="formData.trainingPlaceName"
            disabled
          />
        </view>
        <view class="section_item">
          <view class="title">职位</view>
          <input
            class="item_input grey"
            v-model.trim="formData.roleName"
            disabled
          />
        </view>
        <view class="section_item" v-if="formData.userType === 2">
          <view class="title">带教科目</view>
          <checkbox-group class="item_checkbox_group">
            <view
              class="item_checkbox un_checked"
              v-for="(item, i) in subjectsList"
              @click="handSubjectActive(item.label)"
              :class="{ checked: formData.subjects.includes(item.label) }"
              :key="i"
              >{{ item.label }}</view
            >
          </checkbox-group>
        </view>
        <view class="section_item" v-if="formData.userType === 2">
          <view class="title">车型</view>
          <checkbox-group class="item_checkbox_group">
            <view
              class="item_checkbox un_checked"
              v-for="(item, i) in carModelList"
              @click="handCarModelActive(item.label)"
              :class="{ checked: formData.carModel.includes(item.label) }"
              :key="i"
              >{{ item.label }}</view
            >
          </checkbox-group>
        </view>
      </view>
      <view class="section setting_label_section">
        <view class="title">自定义标签</view>
        <view
          class="section_item"
          v-for="(item, index) in formData.tags"
          :key="index"
        >
          <input class="item_input" v-model.trim="item.label" />
          <input class="item_input" v-model.trim="item.value" />
        </view>
      </view>
    </view>
    <view class="section btn_wrap">
      <view class="save_btn" @click="submit">保存</view>
    </view>
  </view>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import EditNameCardIndex from './edit';

@Component
export default class EditNameCard extends EditNameCardIndex {}
</script>
<style lang="less" scoped>
.enc_wrap {
  height: 100%;
  .top {
    height: calc(100% - 176rpx);
    overflow: scroll;
  }
  .section {
    background-color: #fff;
    margin-bottom: 32rpx;
    padding: 0 30rpx;
    display: flex;
    flex-direction: column;
    &:last-child {
      margin-bottom: 0;
    }
    .title {
      font-size: 32rpx;
      line-height: 1;
      color: @ctjt-color-text-main;
      .required {
        font-size: 32rpx;
        line-height: 1;
        color: @ctjt-color-price;
      }
    }
    .section_item {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 24rpx;
      position: relative;
      &:first-child {
        padding-top: 24rpx;
      }
      .item_input {
        width: 486rpx;
        height: 88rpx;
        line-height: 88rpx;
        border-radius: 24rpx;
        padding-left: 24rpx;
        background-color: @ctjt-bgcolor-primary;
        color: @ctjt-color-text-main;
      }
      .iconfont {
        position: absolute;
        right: 24rpx;
        font-size: 26rpx;
        color: @ctjt-color-border-one;
      }
      .item_textarea {
        width: 462rpx;
        height: 184rpx;
        line-height: 10rpx;
        border-radius: 24rpx;
        padding: 20rpx;
        background-color: #f5f3f5;
        color: @ctjt-color-text-main;
      }
      .item_checkbox_group {
        width: 510rpx;
        height: 88rpx;
        display: flex;
        align-items: center;
        .item_checkbox {
          width: 156rpx;
          height: 72rpx;
          border-radius: 24rpx;
          font-size: 32rpx;
          line-height: 1;
          color: @ctjt-color-text-main;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 56rpx;
        }
      }
    }
    .item_text {
      font-size: 32rpx;
      color: @ctjt-color-text-main;
    }
    .grey {
      color: @ctjt-color-border-one !important;
    }
  }
  .photo_section {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .content {
      padding: 19rpx 0;
      display: flex;
      justify-content: center;
      align-items: center;
      .avatar {
        width: 72rpx;
        height: 72rpx;
        background: #fff2be;
        margin-right: 40rpx;
        border-radius: 50%;
        margin-right: 24rpx;
      }
      .iconfont {
        font-size: 26rpx;
        color: @ctjt-color-border-one;
      }
    }
  }
  .setting_label_section {
    padding: 40rpx 30rpx;
    .title {
      padding-bottom: 24rpx;
    }
    .section_item {
      .item_input {
        &:first-child {
          margin-right: 30rpx;
        }
      }
      &:last-child {
        padding-bottom: 0;
      }
    }
  }

  .btn_wrap {
    display: flex;
    justify-content: center;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 136rpx;
    padding: 0 56rpx;
    .save_btn {
      border-radius: 49rpx;
      font-size: 32rpx;
      line-height: 1;
      color: @ctjt-color-text-main;
      background-color: @ctjt-color-primary;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 638rpx;
      height: 88rpx;
    }
  }

  .checked {
    background-color: @ctjt-color-btn-bgs !important;
    border: 2rpx solid @ctjt-color-primary;
    width: 152rpx !important;
    height: 68rpx !important;
  }
  .un_checked {
    background-color: @ctjt-bgcolor-primary;
  }
}
</style>
