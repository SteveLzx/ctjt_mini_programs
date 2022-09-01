import Vue from 'vue';
import http from '@/assets/js/request';
// import Mixin from '@/assets/js/mixin';
import Tracking from '@/assets/js/tracking';
import EventEmitter from '@/assets/js/emitter';
import { setGlobalData } from '@/assets/js/global_data';
import { env } from '@/config/build_path';
import App from './App.vue';
import ImMixin from './package_im/polyfill/mixins';
import InitIm from './package_im/polyfill/initIm';
import '@/assets/css/icon.less';

Vue.mixin(ImMixin); // im混入
Vue.mixin(InitIm); // im混入

Vue.config.productionTip = false;
Vue.prototype.$http = http;
Vue.prototype.show = 'true';
Vue.prototype.$isPersonal = env !== 'qiye';
Vue.prototype.$emitter = new EventEmitter();

// 埋点相关
const $track = new Tracking();
Vue.prototype.$track = $track;
setGlobalData('$track', $track);
Vue.mixin($track.getMixinData()); // 生命周期混入

uni.getSystemInfo({
  success: res => {
    Vue.prototype.$systemInfo = res;
    Vue.prototype.$platFormPc = res.platform === 'mac' || res.platform === 'windows';
  }
});

// 挂载事件监听器
setGlobalData('$emitter', new EventEmitter());

new App().$mount();

declare module 'vue/types/vue' {
  interface Vue {
    /* eslint-disable */
    $http: any;
    $isPersonal: boolean;
    $systemInfo: any
    $emitter: any;
    $platFormPc: boolean;
    /* eslint-enable */
  }
}
