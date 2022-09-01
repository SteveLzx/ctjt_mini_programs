// import { imgDomain } from '@/assets/js/config';
import { darwRoundRect, schoolTelephone } from '@/assets/js/common';
import { schoolId as sId } from '@/config/build_path';

const imgDomain = 'https://file.aicar365.com/';
export const getClassCard = (detail: any, target) => new Promise(resolve1 => {
  const imgurl = imgDomain + (detail.photoUrlMain || detail.photoUrl);
  const query = wx.createSelectorQuery();
  query.select('#myCanvas')
    .fields({ node: true, size: true })
    .exec(async (res) => {
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const width = res[0].width;
      const height = res[0].height;
      ctx.restore();
      const dpr = wx.getSystemInfoSync().pixelRatio;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
      ctx.save();
      // 画图片
      let imgW = 0;
      let imgH = 0;
      const imgPromise = () => new Promise((resolve, reject) => {
        const code = canvas.createImage();
        code.onload = () => {
          uni.getImageInfo({
            src: imgurl,
            success: image => {
              imgW = image.width;
              imgH = image.height;
              resolve(code);
            }
          });
        };
        code.onerror = () => {
          reject(new Error(`fail to fetch image form: ${imgurl}`));
        };
        code.src = imgurl;
      });
      const img = await imgPromise();
      let top = 0;
      if (imgW < width) { // 画布宽度比图片宽度大，则调整图片高度
        imgH *= (width / imgW);
      }
      if (imgH > 173) { // 图片高度超出图片容器位置，则向上超出去
        top = -(imgH - 173) / 2;
      }
      ctx.drawImage(img, 0, top, width, imgH);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 173, width, height);
      darwRoundRect(16, 189, 72, 20, 4, ctx);
      ctx.restore();
      ctx.font = 'normal normal normal 16px PingFang SC';
      ctx.fillStyle = '#353535';
      ctx.fillText('报名有礼', 20, 205);
      let { appName } = detail;
      if (appName.length > 15) appName = `${appName.substring(0, 12)}...`;
      ctx.fillText(appName, 92, 204);
      ctx.font = 'normal normal normal 16px PingFang SC';
      ctx.fillStyle = '#E45450';
      ctx.fillText('¥', 20, 252);
      ctx.font = 'normal normal bold 28px PingFang SC';
      ctx.fillText(detail.appPrice, 30, 252);
      ctx.font = 'normal normal normal 13px PingFang SC';
      ctx.fillStyle = '#666';
      ctx.fillText(`¥${detail.originalPriceNum || (detail.appPrice + 200)}`, 103, 252);
      ctx.strokeStyle = '#666';
      ctx.strokeRect(103, 247, 38, 0.5);
      darwRoundRect(230, 225, 100, 35, 15, ctx);
      ctx.font = 'normal normal normal 16px PingFang SC';
      ctx.fillStyle = '#353535';
      ctx.fillText('立即报名', 250, 248);
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        canvasId: 'myCanvas',
        canvas,
        width,
        height,
        fileType: 'jpg',
        success: (result: any) => {
          resolve1(result.tempFilePath);
        },
        fail: error => {
          console.log(error);
        }
      });
    });
});

export const getStoreCard = (detail: any, target) => new Promise(resolve1 => {
  const photo = detail.photoUrl || detail.image;
  const photoList = JSON.parse(photo);
  const imgurl = imgDomain + photoList[0].photoUrl;
  const query = wx.createSelectorQuery();
  query.select('#myCanvas')
    .fields({ node: true, size: true })
    .exec(async (res) => {
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const width = res[0].width;
      const height = res[0].height;
      ctx.restore();
      const dpr = wx.getSystemInfoSync().pixelRatio / 1.2;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
      ctx.save();
      // 画图片
      let imgW = 0;
      let imgH = 0;
      const imgPromise = () => new Promise((resolve, reject) => {
        const code = canvas.createImage();
        code.onload = () => {
          uni.getImageInfo({
            src: imgurl,
            success: image => {
              imgW = image.width;
              imgH = image.height;
              resolve(code);
            }
          });
        };
        code.onerror = () => {
          reject(new Error(`fail to fetch image form: ${imgurl}`));
        };
        code.src = imgurl;
      });
      const dzPath = 'https://file.aicar365.com/mini-program/common/icon_dizhi.png';
      const dzPromise = () => new Promise((resolve, reject) => {
        const hb = canvas.createImage();
        hb.onload = () => {
          resolve(hb);
        };
        hb.onerror = () => {
          reject(new Error(`fail to fetch image form: ${dzPath}`));
        };
        hb.src = dzPath;
      });
      const dhPath = 'https://file.aicar365.com/mini-program/common/icon_dianhua.png';
      const dhPromise = () => new Promise((resolve, reject) => {
        const hb = canvas.createImage();
        hb.onload = () => {
          resolve(hb);
        };
        hb.onerror = () => {
          reject(new Error(`fail to fetch image form: ${dhPath}`));
        };
        hb.src = dhPath;
      });
      const img = await imgPromise();
      let top = 0;
      if (imgW < width) { // 画布宽度比图片宽度大，则调整图片高度
        imgH *= (width / imgW);
      }
      if (imgH > 193) { // 图片高度超出图片容器位置，则向上超出去
        top = -(imgH - 193) / 2;
      }
      ctx.drawImage(img, 0, top, width, imgH);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 193, width, height);

      const dzImg = await dzPromise();
      ctx.drawImage(dzImg, 16, 247, 13, 13);

      // const dhImg = await dhPromise();
      // ctx.drawImage(dhImg, 16, 221, 13, 13);

      let { name } = detail;
      if (name.length > 10) name = `${name.substring(0, 8)}...`;
      ctx.font = 'normal normal normal 16px PingFang SC';
      ctx.fillStyle = '#353535';
      ctx.fillText(name, 16, 224);
      ctx.font = 'normal normal normal 13px PingFang SC';
      ctx.fillStyle = '#666666';
      const coachInfo = uni.getStorageSync('coachInfo');
      const schoolId = uni.getStorageSync('schoolId');
      // const telphone = detail.telephone || (coachInfo.mobile) || schoolTelephone[schoolId && schoolId !== '0' ? schoolId : sId];
      // ctx.fillText(telphone, 33, 232);
      ctx.fillText(detail.address ? (detail.areaName + detail.address) : '点击获取', 33, 258);
      darwRoundRect(230, 200, 100, 35, 15, ctx);
      ctx.font = 'normal normal normal 16px PingFang SC';
      ctx.fillStyle = '#353535';
      ctx.fillText('立即报名', 250, 222);
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        canvasId: 'myCanvas',
        canvas,
        width,
        height,
        fileType: 'jpg',
        success: (result: any) => {
          resolve1(result.tempFilePath);
        },
        fail: error => {
          console.log(error);
        }
      });
    });
});
