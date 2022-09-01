export default {
  entryTime: 0,
  onLoad(options: any) {
    console.log('mixin_onLoad', options);
  },
  onShow() {
    console.log('mixin_onShow');
  },
  onHide() {
    console.log('mixin_onHide');
  },
  onReady() {
    console.log('mixin_onReady');
  },
  onUnload() {
    console.log('mixin_onUnload');
  },
  onPullDownRefresh() {
    console.log('mixin_onPullDownRefresh');
  },
};
