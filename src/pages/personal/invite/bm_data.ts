export default (detail?: any, bgUrl?: string, qrCode?: string) => {
  // const job = Number(detail.type) === 1 ? `${detail.showStar > 0 ? ['一', '二', '三', '四', '五'][detail.showStar - 1] : '五'}星教练` : '金牌客服';
  console.log(111133333);
  return {
    width: 722,
    height: 1067,
    bgColor: '#6DCEB7',
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
        x: 262, y: 60, font: '32px', color: '#000', w: 400, align: 'center', multiple: true, lineHeight: 36, text: `${detail.trueName} | ${detail.station}`
      },
      {
        x: 310, y: 122, font: '32px', color: '#000', w: 380, multiple: true, lineHeight: 36, text: detail.drivingSchoolName
      },
    ],
    pics: [
      {
        x: 0, y: 0, w: 724, h: 1067, preload: true, src: bgUrl
      },
      {
        x: 557, y: 870, w: 133, h: 133, src: qrCode
      },
    ]
  };
};
