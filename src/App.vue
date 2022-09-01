<script lang="ts">
import Vue from 'vue';
import { verifyLogin } from '@/assets/js/common';

export default Vue.extend({
  mpType: 'app',
  globalData: {},
  onLaunch(options) {
    uni.setStorageSync('scene', options.scene);
    // 第一次启动上报程序启动
    this.$track.send({
      event: 'st',
      extra: {
        page: options.path
      }
    });
    verifyLogin();
  },
  onShow() {
    // console.log('onShow');
  },
  onHide() {
    console.log('App Hide');
  }
});
</script>

<style lang="less">
/*每个页面公共css */
page {
  background-color: @ctjt-bgcolor-primary;
}
</style>
