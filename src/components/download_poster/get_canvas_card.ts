import { imgDomain } from '@/assets/js/config';
import { darwRoundRect, schoolTelephone, schoolName } from '@/assets/js/common';
import { schoolId } from '@/config/build_path';

/**
  * 	ctx:  canvas绘图上下文
  * 	str:  需要绘制的文本内容
  * 	draw_width:  绘制后的文字显示宽度
  * 	lineNum:  最大行数，多出部分用'...'表示， 如果传-1可以达到自动换行效果
  * 	startX:  绘制文字的起点 X 轴坐标
  * 	startY:  绘制文字的起点 Y 轴坐标
  *	  steps:  文字行间距
 */

function toFormateStr(ctx, str, drawWidth, lineNum, startX, startY, steps) {
  const strWidth = ctx.measureText(str).width;
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
        ctx.fillText(keyStr, startX, startpoint + 30);
        break;
      }
      startpoint += steps;
    }
  }
}

export default (detail: any, codeimg: string, target) => new Promise(resolve1 => {
  const carModel = detail.carModel || [];
  const subjects = detail.subjects || [];
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
      const imgPromise = () => new Promise((resolve, reject) => {
        const bg = canvas.createImage();
        bg.onload = () => {
          resolve(bg);
        };
        bg.onerror = () => {
          reject();
          uni.showToast({
            icon: 'none',
            title: '生成失败'
          });
        };
        bg.src = 'https://file.aicar365.com/mini-program/common/card_canvas_bg.png';
      });
      const width = dprT(375);
      const height = dprT(479);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);
      const img = await imgPromise();
      // 背景图
      ctx.drawImage(img, 0, 0, width, height);
      ctx.save();

      let picW = 0;
      let picH = 0;
      // const picUrl = 'https://p9.itc.cn/images01/20210729/f7f052b56e6440949fddea2e2d6c9e8e.png';
      const picUrl = detail.icon || 'https://file.aicar365.com/mini-program/common/card_default.png';
      const picPromise = () => new Promise((resolve, reject) => {
        const bg = canvas.createImage();
        bg.onload = () => {
          uni.getImageInfo({
            src: picUrl,
            success: image => {
              picW = image.width;
              picH = image.height;
              resolve(bg);
            }
          });
        };
        bg.onerror = () => {
          reject();
          uni.showToast({
            icon: 'none',
            title: '生成失败'
          });
        };
        bg.src = picUrl;
      });

      // 直线
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#E5E5E5';

      ctx.moveTo(dprT(31), dprT(445));
      ctx.lineTo(dprT(251), dprT(445));
      ctx.stroke();

      const pic = await picPromise();

      const picCanvasW = 188;
      const picCanvasH = 190;
      const picTop = 0; // 高度超过190的话向上超出，保证取图片最中心位置
      const picLeft = 0; // 宽度度超过188的话向左超出，保证取图片最中心位置

      // if (picW > picH) { // 头像宽大于高
      //   picCanvasW = (190 / picH) * picW;
      //   if (picCanvasW > 188) picLeft = (picCanvasW - 188) / 2;
      // } else {
      //   picCanvasH = (188 / picW) * picH;
      //   if (picCanvasH > 190) picTop = (picCanvasH - 190) / 2;
      // }

      // 画头像梯形
      ctx.save();
      ctx.beginPath();

      // 左上弧线
      ctx.arc(dprT(27), dprT(32), dprT(12), 1 * Math.PI, 1.5 * Math.PI);
      // 左直线
      ctx.moveTo(dprT(15), dprT(32));
      ctx.lineTo(dprT(15), dprT(198));
      // 左下弧线
      ctx.arc(dprT(27), dprT(198), dprT(12), 0.5 * Math.PI, 1 * Math.PI);
      // 下直线
      ctx.lineTo(dprT(27), dprT(210));
      // 右直线
      ctx.lineTo(dprT(173), dprT(210));
      ctx.lineTo(dprT(203), dprT(20));
      // 上直线
      ctx.lineTo(dprT(198), dprT(20));
      ctx.lineTo(dprT(27), dprT(20));

      ctx.fillStyle = 'transparent';
      ctx.fill();
      ctx.clip();

      ctx.drawImage(pic, dprT(15) - picLeft, dprT(20) - picTop, dprT(picCanvasW), dprT(picCanvasH));
      ctx.restore();

      // 带教类别框
      darwRoundRect(dprT(31), dprT(300), dprT(46), dprT(20), dprT(4), ctx);
      ctx.beginPath();
      ctx.arc(dprT(13 / 2 + 70), dprT(13 / 2 + 303), dprT(7 / 2), 0, Math.PI * 2, false);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.restore();
      if (carModel.length > 1) {
        darwRoundRect(dprT(89), dprT(300), dprT(46), dprT(20), dprT(4), ctx);
        ctx.beginPath();
        ctx.arc(dprT(13 / 2 + 128), dprT(13 / 2 + 303), dprT(7 / 2), 0, Math.PI * 2, false);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.restore();
      }
      darwRoundRect(dprT(carModel.length > 1 ? 147 : 89), dprT(300), dprT(59), dprT(20), dprT(4), ctx);
      ctx.beginPath();
      ctx.arc(dprT(13 / 2 + (carModel.length > 1 ? 198 : 141)), dprT(13 / 2 + 303), dprT(7 / 2), 0, Math.PI * 2, false);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.restore();
      if (subjects.length !== 1) {
        darwRoundRect(dprT(carModel.length > 1 ? 218 : 160), dprT(300), dprT(59), dprT(20), dprT(4), ctx);
        ctx.beginPath();
        ctx.arc(dprT(13 / 2 + (carModel.length > 1 ? 270 : 212)), dprT(13 / 2 + 303), dprT(7 / 2), 0, Math.PI * 2, false);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.restore();
      }
      const iconUrl = '../../static/images/card_canvas_icon.png';
      const iconPromise = () => new Promise((resolve, reject) => {
        const icon = canvas.createImage();
        icon.onload = () => {
          resolve(icon);
        };
        icon.onerror = () => {
          reject(new Error(`fail to fetch image form: ${iconUrl}`));
          uni.showToast({
            icon: 'none',
            title: '生成失败'
          });
        };
        icon.src = iconUrl;
      });

      const iconCan = await iconPromise();

      let list = detail.tags.filter(item => item.value || item.label);
      // let list = detail.tags || [];
      if (list.length === 0) { // 默认的
        list = [
          {
            label: '工作年限',
            value: '8年+'
          }, {
            label: '毕业学员',
            value: '1.2万'
          }, {
            label: '合格率',
            value: '100%'
          }
        ];
      }
      // 文字类
      const topList = [105, 93, 84, 70, 60];
      const firstTop = topList[list.length - 1];
      ctx.font = `normal normal normal ${dprT(14)}px PingFang SC`;
      ctx.fillStyle = '#353535';
      list.forEach((item, index) => {
        ctx.fillText(item.label, dprT(225), dprT(firstTop + index * 28));
        ctx.fillText(item.value, dprT(375 - ctx.measureText(item.value).width / 2 - 39), dprT(firstTop + index * 28));
        ctx.drawImage(iconCan, dprT(213), dprT(firstTop + index * 28 - 8), dprT(8), dprT(8));
      });

      const userType = detail.userType || uni.getStorageSync('userType');
      ctx.font = `normal normal normal ${dprT(18)}px PingFang SC`;
      ctx.fillText(userType !== 3 ? detail.userName : schoolName[schoolId], dprT(31), dprT(258));
      ctx.fillText(userType !== 3 ? detail.mobile : schoolTelephone[schoolId], dprT(156), dprT(354));

      ctx.font = `normal normal normal ${dprT(14)}px PingFang SC`;
      let { roleName } = detail;
      // 岗位名称截取
      if (roleName.length > 6) {
        roleName = `${roleName.substring(0, 6)}...`;
      }
      ctx.fillText(`${detail.drivingSchoolName} · ${roleName}`, dprT(76), dprT(286));
      ctx.fillText(carModel[0] || 'C1', dprT(46), dprT(315));
      if (carModel.length === 2) {
        ctx.fillText(carModel[1] || 'C2', dprT(104), dprT(315));
      }
      ctx.fillText(subjects[0] || '科目二', dprT(carModel.length === 2 ? 156 : 98), dprT(315));
      if (subjects.length !== 1) ctx.fillText(subjects[1] || '科目三', dprT(carModel.length === 2 ? 226 : 168), dprT(315));
      let defaultDes = detail.type === 2 ? `您好,我是${userType !== 3 ? detail.userName : schoolName[schoolId]} ,从业超过5年,带教合格学员超过2000,尤其擅长科目二教学,助您快速拿证,期待为您服务。` : `您好，我是${userType !== 3 ? detail.userName : schoolName[schoolId]},从业超过5年，服务学员超过2000，我将提供最优质的服务助您快速拿证。`;
      if (detail.about) defaultDes = detail.about;
      toFormateStr(ctx, defaultDes, dprT(220), 3, dprT(31), dprT(380), dprT(20));

      ctx.fillText('一对一学车咨询: ', dprT(46), dprT(352));
      ctx.font = `normal normal normal ${dprT(11)}px PingFang SC`;
      ctx.fillStyle = '#999999';
      ctx.fillText('长按识别进入小程序，拿证技巧一键掌握 ', dprT(31), dprT(460));

      const codePromise = () => new Promise((resolve, reject) => {
        const code = canvas.createImage();
        code.onload = () => {
          resolve(code);
        };
        code.onerror = () => {
          reject(new Error(`fail to fetch image form: ${codeimg}`));
          uni.showToast({
            icon: 'none',
            title: '生成失败'
          });
        };
        code.src = codeimg;
      });

      const img3 = await codePromise();
      ctx.drawImage(img3, dprT(264), dprT(370), dprT(80), dprT(80));

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
