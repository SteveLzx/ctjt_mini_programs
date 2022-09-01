export default (codeimg, target) => new Promise(resolve1 => {
  const query = wx.createSelectorQuery().in(target);
  query.select('#qrcodeBg')
    .fields({ node: true, size: true })
    .exec(async (res) => {
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      ctx.restore();
      const width = 375;
      const height = 375;
      canvas.width = width;
      canvas.height = height;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
      ctx.save();

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
      ctx.drawImage(img3, 0, 0, width, height);

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
