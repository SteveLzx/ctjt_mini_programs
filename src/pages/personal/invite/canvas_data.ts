export default (detail?: any, config?: any, bgUrl?: string, qrCode?: string) => {
  // const job = Number(detail.type) === 1 ? `${detail.showStar > 0 ? ['一', '二', '三', '四', '五'][detail.showStar - 1] : '五'}星教练` : '金牌客服';
  console.log(111133333);
  return {
    width: 722,
    height: 1067,
    bgColor: '#D9221C',
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
        x: 262, y: 60, font: '32px', color: '#fff', w: 400, align: 'center', multiple: true, lineHeight: 36, text: `${detail.trueName} | ${detail.station}`
      },
      {
        x: 310, y: 122, font: '32px', color: '#fff', w: 380, multiple: true, lineHeight: 36, text: detail.drivingSchoolName
      },
      {
        x: 60, y: 217, font: '32px', color: '#fff', w: 660, multiple: true, lineHeight: 42, text: `推荐朋友报名学车即可获得${config && config.reward}元红包活动`
      },
      {
        x: 198, y: 337, font: '30px', color: '#FFEFBE', w: 660, multiple: true, lineHeight: 36, text: '送好友 免费学车抽奖机会'
      },
      {
        x: 80, y: 443, font: '56px', color: '#FFEFBE', w: 562, align: 'center', lineHeight: 64, text: `TA报名 您得${config && config.reward}元现金`
      },
      {
        x: 109, y: 470, font: '28px', color: '#FFEFBE', w: 660, multiple: true, lineHeight: 36, text: '报名成功还可以再获得一次免费抽奖机会'
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
