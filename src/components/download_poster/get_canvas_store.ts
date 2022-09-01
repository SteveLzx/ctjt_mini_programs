// import { imgDomain } from '@/assets/js/config';
import { darwRoundRect, schoolTelephone, schoolName } from '@/assets/js/common';
import { schoolId as sId } from '@/config/build_path';

function toFormateStr(ctx, str, drawWidth, lineNum, startX, startY, steps) {
  const strWidth = ctx.measureText(str).width;
  console.log(123, strWidth, drawWidth);
  let startpoint = startY;
  let keyStr = '';
  const sreLN = strWidth / drawWidth;
  const liner = Math.ceil(sreLN);
  const strlen = parseInt(String(str.length / sreLN), 10);
  if (strWidth < drawWidth) {
    ctx.fillText(str, startX, startY + 50);
  } else {
    for (let i = 1; i < liner + 1; i += 1) {
      const startPoint = strlen * (i - 1);
      if (i < lineNum || lineNum === -1) {
        keyStr = str.substr(startPoint, strlen);
        ctx.fillText(keyStr, startX, startpoint + (sreLN < 3 ? 30 : 0));
      } else {
        keyStr = `${str.substr(startPoint, strlen - 5)}...`;
        ctx.fillText(keyStr, startX, startpoint);
        break;
      }
      startpoint += steps;
    }
  }
}

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
      const height = dprT(410);
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
      // const dhPath = 'https://file.aicar365.com/mini-program/common/icon_dianhua.png';
      // const dhPromise = () => new Promise((resolve, reject) => {
      //   const hb = canvas.createImage();
      //   hb.onload = () => {
      //     resolve(hb);
      //   };
      //   hb.onerror = () => {
      //     reject(new Error(`fail to fetch image form: ${dhPath}`));
      //   };
      //   hb.src = dhPath;
      // });
      const dzImg = await dzPromise();
      ctx.drawImage(dzImg, dprT(16), dprT(247), dprT(13), dprT(13));

      // const dhImg = await dhPromise();
      // ctx.drawImage(dhImg, dprT(16), dprT(251), dprT(13), dprT(13));
      let { name } = detail;
      if (name.length > 10) name = `${name.substring(0, 8)}...`;
      ctx.font = `normal normal normal ${dprT(16)}px PingFang SC`;
      ctx.fillStyle = '#353535';
      ctx.fillText(name, dprT(16), dprT(234));
      ctx.font = `normal normal normal ${dprT(13)}px PingFang SC`;
      ctx.fillStyle = '#666666';
      const coachInfo = uni.getStorageSync('coachInfo') || {};
      const schoolId = uni.getStorageSync('schoolId') || sId;
      const userType = uni.getStorageSync('userType');

      // const telphone = detail.telephone || (coachInfo.mobile) || schoolTelephone[schoolId && schoolId !== '0' ? schoolId : sId];
      // ctx.fillText(telphone, dprT(33), dprT(262));
      const address = detail.provinceName + detail.cityName + detail.areaName + detail.address;
      const strWidth = ctx.measureText(address).width;
      console.log(strWidth);
      toFormateStr(ctx, address, dprT(310), 3, dprT(33), dprT(strWidth > dprT(310) ? 245 : 238), dprT(18));

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
      ctx.arc(dprT(60 / 2 + 24), dprT(60 / 2 + 296), dprT(60 / 2), 0, Math.PI * 2, false);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.clip();
      ctx.drawImage(img2, dprT(24), dprT(296), dprT(60), dprT(60));
      ctx.restore();

      ctx.font = `normal normal normal ${dprT(16)}px PingFang SC`;
      ctx.fillStyle = '#353535';
      ctx.fillText(userType === 3 ? schoolName[schoolId] : (detail.cardName || coachInfo.name || schoolName[schoolId]), dprT(99), dprT(332));
      ctx.font = `normal normal normal ${dprT(14)}px PingFang SC`;
      ctx.fillText('一对一学车咨询: ', dprT(29), dprT(383));
      ctx.font = `normal normal normal ${dprT((detail.mobile || coachInfo.mobile) && userType !== 3 ? 18 : 15)}px PingFang SC`;
      ctx.fillText(userType === 3 ? schoolTelephone[schoolId] : (detail.mobile || coachInfo.mobile || schoolTelephone[schoolId]), dprT(134), dprT(383));
      ctx.fillStyle = '#999';
      ctx.font = `normal normal normal ${dprT(11)}px PingFang SC`;
      ctx.fillText('长按识别  报名优惠 ', dprT(260), dprT(381));

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#E5E5E5';

      ctx.moveTo(dprT(253), dprT(296));
      ctx.lineTo(dprT(253), dprT(381));
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
      ctx.drawImage(img3, dprT(270), dprT(288), dprT(75), dprT(75));

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
          // console.log(error);
        }
      });
    });
});
