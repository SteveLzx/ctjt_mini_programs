import { darwRoundRect, schoolTelephone, schoolName } from '@/assets/js/common';
import { schoolId } from '@/config/build_path';

export default (detail: any, target) => new Promise(resolve1 => {
  const query = wx.createSelectorQuery();
  query.select('#cardCanvas')
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
      const imgurl = 'https://file.aicar365.com/mini-program/common/img_mingpianbg.png';
      const bgPromise = () => new Promise((resolve, reject) => {
        const bg = canvas.createImage();
        bg.onload = () => {
          resolve(bg);
        };
        bg.onerror = () => {
          reject(new Error(`fail to fetch image form: ${imgurl}`));
        };
        bg.src = imgurl;
      });
      darwRoundRect(10, 36, 325, 144, 12, ctx, '#fff');
      const img = await bgPromise();
      ctx.drawImage(img, 10, 36, 325, 144);
      ctx.restore();

      darwRoundRect(80, 195, 185, 44, 20, ctx);
      ctx.font = 'normal normal normal 16px PingFang SC';
      ctx.fillStyle = '#353535';
      ctx.fillText('保存', 156, 223);
      ctx.restore();

      const wechatUserInfo = uni.getStorageSync('wechatUserInfo');
      const avatarUrl = wechatUserInfo && wechatUserInfo.avatarUrl ? wechatUserInfo.avatarUrl : `https://file.aicar365.com/mini-program/${schoolId}/common/headportrait_normal.png`;
      const avatarPromise = () => new Promise((resolve, reject) => {
        const avatar = canvas.createImage();
        avatar.onload = () => {
          resolve(avatar);
        };
        avatar.onerror = () => {
          reject(new Error(`fail to fetch image form: ${avatarUrl}`));
          uni.showToast({
            icon: 'none',
            title: '生成失败'
          });
        };
        avatar.src = avatarUrl;
      });

      const img2 = await avatarPromise();
      ctx.beginPath();
      ctx.arc(60 / 2 + 40, 60 / 2 + 50, 60 / 2, 0, Math.PI * 2, false);
      ctx.fillStyle = 'red';
      ctx.fill();
      ctx.clip();
      ctx.drawImage(img2, 40, 50, 60, 60);
      ctx.restore();

      ctx.font = 'normal normal normal 16px PingFang SC';
      ctx.fillStyle = '#353535';
      const userType = detail.userType || uni.getStorageSync('userType');
      ctx.fillText(userType !== 3 ? detail.userName : schoolName[schoolId], 120, 74);
      ctx.fillStyle = '#666666';
      ctx.fillText(userType !== 3 ? detail.mobile : schoolTelephone[schoolId], 120, 96);
      ctx.fillText(detail.drivingSchoolName, 40, 140);

      // const dzImg = await dzPromise();
      // ctx.drawImage(dzImg, 16, 242, 13, 13);

      // const dhImg = await dhPromise();
      // ctx.drawImage(dhImg, 16, 221, 13, 13);

      // let { name } = detail;
      // if (name.length > 10) name = `${name.substring(0, 8)}...`;
      // ctx.font = 'normal normal normal 16px PingFang SC';
      // ctx.fillStyle = '#353535';
      // ctx.fillText(name, 16, 204);
      // ctx.font = 'normal normal normal 13px PingFang SC';
      // ctx.fillStyle = '#666666';
      // ctx.fillText(detail.telephone ? detail.telephone : '点击获取', 33, 232);
      // ctx.fillText(detail.address ? (detail.areaName + detail.address) : '点击获取', 33, 253);
      // darwRoundRect(230, 189, 100, 35, 15, ctx);
      // ctx.font = 'normal normal normal 16px PingFang SC';
      // ctx.fillStyle = '#353535';
      // ctx.fillText('立即报名', 250, 212);
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
