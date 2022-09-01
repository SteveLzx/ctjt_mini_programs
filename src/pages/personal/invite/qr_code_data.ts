export default (qrCode?: string, type?: number) => {
  // const job = Number(detail.type) === 1 ? `${detail.showStar > 0 ? ['一', '二', '三', '四', '五'][detail.showStar - 1] : '五'}星教练` : '金牌客服';
  console.log(111133333333555,);
  return {
    width: 722,
    height: 1067,
    bgColor: '#fff',
    paths: {
      rect: [ // 矩形
        // {
        //   x: 100.5, y: 120.5, w: 152, h: 44, type: 'fill', color: '#000000'
        // }
      ],
      triangle: [
        // {
        //   points: [
        //     { x: 40, y: 518 }, { x: 120, y: 518 }, { x: 40, y: 598 }
        //   ],
        //   type: 'fill',
        //   color: '#FF6D00'
        // }
      ],
      line: [

      ],
      circle: [
        // {
        //   x: 225, y: 353, w: 12, h: 12, r: 6, type: 'fill', color: '#fff'
        // },

      ],
    },
    texts: [
      {
        x: 0, y: 60, font: '50px', color: '#666', w: 722, align: 'center', lineHeight: 56, text: type === 0 ? '您的专属推荐二维码' : '您的专属报名二维码'
      },
    ],
    pics: [
      {
        x: 50, y: 200, w: 600, h: 600, src: qrCode
      },
    ]
  };
};
