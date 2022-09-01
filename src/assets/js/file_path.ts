import { runEnv } from '@/config/build_path';

const apiGetUrl = {
  dev: 'https://file.dev.aicar365.com/',
  test: 'https://file.test.aicar365.com/',
  uat: 'https://file.uat.aicar365.com/',
  prod: 'https://file.aicar365.com/'
};
const apiSetUrl = {
  dev: 'ctjt-dev',
  test: 'ctjt-test',
  uat: 'ctjt-uat',
  prod: 'ctjt-release'
};
/** 获取oss上文件路径 */
export const fileGetUrl = apiGetUrl[runEnv] || '';

/** 往oss上传文件路径 */
export const fileSetUrl = apiSetUrl[runEnv] || '';
