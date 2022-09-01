const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  configureWebpack: config => {
    config.plugins = [
      ...config.plugins,
      new CopyWebpackPlugin({
        patterns: [{
          from: path.resolve(__dirname, './project.config.json'),
          to: '[name].[ext]'
        }]
      })
    ];
  },
  css: {
    loaderOptions: {
      less: {
        globalVars: {
          hack: 'true; @import "~@/assets/css/common.less";'
        }
      },
    },
  }
};

if (process.env.NODE_ENV === 'development') {
  require('./mock/express.js');
}
// const fse = require('fs-extra');
/* eslint-disable */
// 获取到package.json 传过来的参数
let env = 'personal';  // 打包的是学员端or教练端
let runEnv = 'dev';  // 打包的是开发环境还是线上环境
let schoolId = 16;

process.argv.forEach((item) => {
  if (item.indexOf('-ctjt=') !== -1) {
    env = item.split('-ctjt=')[1];
  } else if (item.indexOf('-ctjt-path=') !== -1) {
    runEnv = item.split('-ctjt-path=')[1];
  } else if (item.indexOf('-schoolId=') !== -1) {
    schoolId = Number(item.split('-schoolId=')[1] || 16);
  }
});

// 动态配置 pages.json
// 获取对应项目pages.json
const pagesCurrFile = fs.readFileSync(path.resolve(__dirname, `./src/config/${env}.json`));
fs.writeFileSync(path.resolve(__dirname, './src/pages.json'), pagesCurrFile, 'utf8');

// 动态配置 微信appid
const manifestCurrFile = fs.readFileSync(path.resolve(__dirname, './project.config.json'));
const _copyManifestCurrFile = JSON.parse(manifestCurrFile.toString());
const schoolToAppId = {
  16: 'wxa72471f0dd8f67db',
  3374: 'wxef9787620a86a32c',
  370: 'wx67c99a085d3bc6f7',
  638: 'wx543d247638003343',
}
_copyManifestCurrFile.appid = schoolToAppId[schoolId];
fs.writeFileSync(path.resolve(__dirname, './project.config.json'), JSON.stringify(_copyManifestCurrFile), 'utf8');

// 写入env打包环境
const _buildPath = `/* eslint-disable */\n type envType = 'personal' | 'qiye';\n export let env: envType = '${env}';\n export let schoolId: number = ${schoolId};\n type runEnvType = 'prod' | 'dev' | 'test';\n export const runEnv: runEnvType = '${runEnv}';\n/* eslint-enable */\n`
fs.writeFileSync(path.resolve(__dirname, './src/config/build_path.ts'), _buildPath, 'utf8');
/* eslint-enable */
