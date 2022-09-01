// 全局数据绑定
interface GlobalData {
  /* eslint-disable */
  [key: string]: any;
  /* eslint-enable */
}
const globalData: GlobalData = {};

// 给global添加属性
export const setGlobalData = <T>(key: string, val: T) => {
  globalData[key] = val;
};
// 获取global属性
export const getGlobalData = <T>(key: string) => globalData[key] || null;
