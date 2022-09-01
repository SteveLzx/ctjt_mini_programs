<template>
  <div>
    <web-view :src="webUrl"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { schoolId, runEnv } from '@/config/build_path';
import { filterParams, generateSceneId } from '@/assets/js/common';
import { queryNameCardInfo } from '@/pages/public/_common/index';

@Component
export default class WebView extends Vue {
  webUrl = '';

  params = {
    scene: '',
    userId: '',
    id: ''
  };

  id = '';

  onLoad(options) {
    const { scene } = options;
    this.params = options;
    if (!this.params.userId) this.params = filterParams(scene); // 通过二维码过来的
    if (this.params.scene) {
      uni.setStorageSync('sceneId', scene);
    }
    const { id } = this.params;
    if (id) { // 预览
      this.id = id;
      this.preview(id);
      // this.preview(123);
    }
  }

  async preview(aId) {
    let coachInfo: any = {};
    if (this.params.userId) {
      coachInfo = await queryNameCardInfo(this.params.userId); // 分享出去的查询分享人的信息
    }
    const {
      id,
      mobile,
      name,
      userName,
      drivingSchoolName
    } = coachInfo;
    // let scene: any = '';
    // if (drivingSchoolName) { // 有驾校信息的查看才生成名片的场景
    //   scene = await generateSceneId({
    //     dynamicsId: id,
    //     publishExport: 13,
    //     publishFormat: 3,
    //     title: name || userName,
    //     type: 7,
    //     extra: {
    //       id: this.id,
    //       type: 'tweet'
    //     }
    //   });
    // }
    this.webUrl = `https://coach-h5${runEnv === 'prod' ? '' : '.test'}.aicar365.com/test/index?id=${aId}&sId=${schoolId}&mobile=${mobile || ''}&name=${name || userName || ''}&scene=${this.params.scene || ''}`;
    console.log(this.webUrl);
  }
}

</script>

<style lang="less" scoped>
.fixed_box{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 136rpx;
  background: #fff;
}
</style>
