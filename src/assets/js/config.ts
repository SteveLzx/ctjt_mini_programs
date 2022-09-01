import { runEnv } from '@/config/build_path';

const imgDoaminList = {
  dev: 'https://file.dev.aicar365.com/',
  test: 'https://file.test.aicar365.com/',
  prod: 'https://file.aicar365.com/'
};
export const imgDomain = imgDoaminList[runEnv] || 'https://file.aicar365.com/';

export const proImgDomain = 'https://file.aicar365.com/';

export default {};
