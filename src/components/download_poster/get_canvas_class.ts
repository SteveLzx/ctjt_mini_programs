// import { imgDomain } from '@/assets/js/config';
import { darwRoundRect, schoolTelephone, schoolName } from '@/assets/js/common';
import { schoolId as sId } from '@/config/build_path';

export default (detail: any, codeimg: string, target) => new Promise(resolve1 => {
  const { photoUrlMain, photoUrl, image } = detail;
  let photo = photoUrlMain || photoUrl || image;
  if (photo.includes('[') && photo.includes(']')) {
    photo = JSON.parse(photo)[0].photoUrl;
  }
  const imgDomain = 'https://file.aicar365.com/';
  const imgurl = (photo && photo.startsWith('http')) ? photo : imgDomain + photo;
  const query = wx.createSelectorQuery().in(target);
  query.select('#posterCanvas')
    .fields({ node: true, size: true })
    .exec(async (res) => {
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      ctx.restore();
      const dpr = wx.getSystemInfoSync().pixelRatio / 1.2;
      function dprT(data) {
        return data * dpr;
      }
      const width = dprT(375);
      const height = dprT(405);
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
            success: images => {
              imgW = images.width;
              imgH = images.height;
              resolve(code);
            }
          });
        };
        code.onerror = () => {
          reject(new Error(`fail to fetch image form: ${imgurl}`));
          uni.showToast({
            icon: 'none',
            title: '生成失败1'
          });
        };
        code.src = imgurl;
      });
      const img = await imgPromise();
      let top = 0;
      if (imgW < dprT(345)) { // 画布宽度比图片宽度大，则调整图片高度
        imgH *= (dprT(345) / imgW);
      }
      if (imgH > dprT(172)) { // 图片高度超出图片容器位置，则向上超出去
        top = -(imgH - dprT(172)) / 2;
      }
      darwRoundRect(dprT(15), dprT(28), dprT(345), dprT(172), dprT(15), ctx, '#fff');
      ctx.drawImage(img, 0, dprT(28) + top, width, imgH);
      ctx.restore();

      // darwRoundRect(dprT(16), 189, 72, 20, 4, ctx);
      darwRoundRect(dprT(16), dprT(216), dprT(72), dprT(20), dprT(4), ctx);
      ctx.restore();
      ctx.font = `normal normal normal ${dprT(16)}px PingFang SC`;
      ctx.fillStyle = '#353535';
      ctx.fillText('报名有礼', dprT(20), dprT(232));
      let { appName } = detail;
      if (appName.length > 15) appName = `${appName.substring(0, 12)}...`;
      ctx.fillText(appName, dprT(92), dprT(232));
      ctx.font = `normal normal normal ${dprT(16)}px PingFang SC`;
      ctx.fillStyle = '#E45450';
      ctx.fillText('¥', dprT(20), dprT(272));
      ctx.font = `normal normal bolder ${dprT(28)}px PingFang SC`;
      ctx.fillText(detail.appPrice, dprT(30), dprT(272));
      ctx.font = `normal normal normal ${dprT(16)}px PingFang SC`;
      ctx.fillStyle = '#666';
      ctx.fillText(`¥${detail.originalPriceNum || (detail.appPrice + 200)}`, dprT(103), dprT(272));
      ctx.strokeStyle = '#666';
      ctx.strokeRect(dprT(103), dprT(265), dprT(45), dprT(0.5));

      const avatarUrl = uni.getStorageSync('wechatUserInfo') && uni.getStorageSync('isCoach') ? uni.getStorageSync('wechatUserInfo').avatarUrl : `https://file.aicar365.com/mini-program/${sId}/common/headportrait_normal.png`;
      const avatarPromise = () => new Promise((resolve, reject) => {
        const avatar = canvas.createImage();
        avatar.onload = () => {
          resolve(avatar);
        };
        avatar.onerror = () => {
          reject(new Error(`fail to fetch image form: ${avatarUrl}`));
          uni.showToast({
            icon: 'none',
            title: '生成失败2'
          });
        };
        avatar.src = avatarUrl;
      });
      const img2 = await avatarPromise();
      ctx.beginPath();
      ctx.arc(dprT(60 / 2 + 24), dprT(60 / 2 + 291), dprT(60 / 2), 0, Math.PI * 2, false);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.clip();
      ctx.drawImage(img2, dprT(24), dprT(291), dprT(60), dprT(60));
      ctx.restore();

      const coachInfo = uni.getStorageSync('coachInfo') || {};
      const schoolId = uni.getStorageSync('schoolId') || sId;
      const userType = uni.getStorageSync('userType');

      ctx.font = `normal normal normal ${dprT(16)}px PingFang SC`;
      ctx.fillStyle = '#353535';
      ctx.fillText(userType === 3 ? schoolName[sId] : (detail.cardName || coachInfo.name || schoolName[schoolId]), dprT(99), dprT(327));
      ctx.font = `normal normal normal ${dprT(14)}px PingFang SC`;
      ctx.fillText('一对一学车咨询: ', dprT(29), dprT(378));
      ctx.font = `normal normal normal ${dprT((detail.mobile || coachInfo.mobile) && userType !== 3 ? 18 : 15)}px PingFang SC`;
      ctx.fillText(userType === 3 ? schoolTelephone[sId] : (detail.mobile || coachInfo.mobile || schoolTelephone[schoolId]), dprT(134), dprT(378));
      ctx.fillStyle = '#999';
      ctx.font = `normal normal normal ${dprT(11)}px PingFang SC`;
      ctx.fillText('长按识别  报名优惠 ', dprT(260), dprT(376));

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#E5E5E5';

      ctx.moveTo(dprT(251), dprT(291));
      ctx.lineTo(dprT(251), dprT(371));
      ctx.stroke();

      const codePromise = () => new Promise((resolve, reject) => {
        const code = canvas.createImage();
        code.onload = () => {
          resolve(code);
        };
        code.onerror = () => {
          reject(new Error(`fail to fetch image form: ${codeimg}`));
          uni.showToast({
            icon: 'none',
            title: '生成失败3'
          });
        };
        code.src = codeimg;
      });

      const img3 = await codePromise();
      ctx.drawImage(img3, dprT(270), dprT(283), dprT(75), dprT(75));

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
