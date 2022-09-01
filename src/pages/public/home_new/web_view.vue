<template>
  <div>
    <web-view :src="webUrl"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { schoolId } from '@/config/build_path';

const url = {
  16: 'https://www.caronline.cn?sourceType=wxApp',
  3374: 'https://www.0752sgjx.cn?sourceType=wxApp',
  370: 'https://www.peijia.cn?sourceType=wxApp',
  638: 'https://www.33331111.com?sourceType=wxApp'
};

@Component
export default class WebView extends Vue {
  webUrl = '';

  created() {
    this.webUrl = url[schoolId];
  }

  onShareAppMessage() {
    return {};
  }
}

</script>

<style lang="less" scoped>
