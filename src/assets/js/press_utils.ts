/** 通过canvas将图片压缩 */
// 将图片画在画布上并获取画好之后的图片的路径
const getCanvasImage = (canvasId, imagePath, targetWidth, targetHeight) => new Promise(resolve => {
  const query = wx.createSelectorQuery();
  query.select(canvasId)
    .fields({ node: true, size: true })
    .exec(async (res) => {
      const canvas = res[0].node;
      // 创建画布内容
      const ctx = canvas.getContext('2d');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const avatarPromise = () => new Promise((resolve1, reject1) => {
        const avatar = canvas.createImage();
        avatar.onload = () => {
          resolve1(avatar);
        };
        avatar.onerror = () => {
          reject1(new Error(`fail to fetch image form: ${imagePath}`));
          uni.showToast({
            icon: 'none',
            title: '生成失败'
          });
        };
        avatar.src = imagePath;
      });
      const img = await avatarPromise();
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      wx.canvasToTempFilePath({
        destWidth: targetWidth,
        destHeight: targetHeight,
        width: targetWidth,
        height: targetHeight,
        canvas,
        x: 0,
        y: 0,
        fileType: 'jpg',
        quality: 1, // 最高质量
        success: (canvasRes) => {
          resolve(canvasRes.tempFilePath);
        }
      });
    });
});

const getPressImage = (canvasId, imagePath, limitSize = 400) => new Promise(resolve => {
  // 判断图片尺寸是否满足要求
  wx.getFileInfo({
    filePath: imagePath,
    success: (res) => {
      console.log('原始图片大小:', res.size / 1024);
      if (res.size > limitSize * 1024) {
        // 图片重新设置长宽
        wx.getImageInfo({
          src: imagePath,
          success: async (imageInfo) => {
            const originWidth = imageInfo.width;
            const originHeight = imageInfo.height;
            getCanvasImage(canvasId, imagePath, originWidth, originHeight).then(pressImgPath => {
              resolve(pressImgPath);
              wx.getFileInfo({
                filePath: pressImgPath as string,
                success: (res1) => {
                  console.log('压缩后图片大小:', res1.size / 1024);
                }
              });
            });
          }
        });
      } else {
        resolve(imagePath);
      }
    }
  });
});

export default getPressImage;
