/* eslint-disable */
import $http from '@/assets/js/request';
import { schoolId as sId } from '@/config/build_path';
/* eslint-enable */
import { fileSetUrl, fileGetUrl } from './file_path';
import { getUUid } from './common';

const floder = 'mini-program';
const schoolId = uni.getStorageSync('schoolId') || sId;
/** 请求阿里签名 */
function getAliyuncs() {
  return new Promise((resolve, reject) => {
    $http.get('base/v1/oss/appPolicy', {
      RoleArn: `acs:ram::1625610608962527:role/oss-${fileSetUrl}`,
      RoleSessionName: `oss-${fileSetUrl}`,
    }).then((res: any) => {
      resolve(res);
    }).catch((err) => {
      //
    });
  });
}

/** 上传文件 单文件上传 */
export function putUploadFiles(tempPath: string, bussiness: string) {
  return new Promise((resolve, reject) => {
    uni.showLoading({
      title: '正在努力上传中..'
    });
    getAliyuncs().then(async (res: any) => {
      const {
        SecurityToken,
        AccessKeyId,
        AccessKeySecret,
        signature,
        policy
      } = res;
      try {
        const _type = tempPath.split('.')[1];
        const _fileName = `${getUUid()}.${_type}`;
        // 3.发起请求，上传OSS
        uni.uploadFile({
          url: `https://${fileSetUrl}.oss-cn-shenzhen.aliyuncs.com`, // oss地址
          filePath: tempPath,
          name: 'file',
          header: {
            'Content-Type': 'multipart/form-data'
          },
          formData: {
            host: 'oss-cn-shenzhen',
            key: `${floder}/${schoolId}/${bussiness}/${_fileName}`,
            OSSAccessKeyId: AccessKeyId,
            'x-oss-security-token': SecurityToken,
            AccessKeySecret,
            signature,
            policy
          },
          success: (re => {
            console.log(re);
            resolve(_fileName);
            uni.hideLoading();
          })
        });
      } catch (e) {
        console.log(e);
        uni.hideLoading();
        reject(e);
      }
    }).catch(() => {
      uni.hideLoading();
    });
  });
}
export function getUploadFiles(_fileName: string, bussiness: string) {
  const filePath = `${fileGetUrl}${floder}/${schoolId}/${bussiness}/${_fileName}`;
  return filePath;
}
