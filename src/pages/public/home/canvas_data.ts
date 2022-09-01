import { imgDomain } from '@/assets/js/config';

export default (detail: any, avatarUrl: string, inviterDetail: any) => {
  const job = Number(inviterDetail.type) === 1 ? `${inviterDetail.showStar > 0 ? ['一', '二', '三', '四', '五'][inviterDetail.showStar - 1] : '五'}星教练` : '金牌客服';
  return {
    width: 750,
    height: 1305,
    bgColor: '#fff',
    texts: [
      {
        x: 0, y: 80, font: '36px', color: '#000', w: 750, align: 'center', text: inviterDetail.drivingSchoolName
      },
      {
        x: 208, y: 130, font: '22px', color: '#000', text: '通过率全市第一'
      },
      {
        x: 370, y: 130, font: '22px', color: '#FD5A02', text: '*'
      },
      {
        x: 388, y: 130, font: '22px', color: '#000', text: '拒绝一切乱收费'
      },
      {
        x: 30, y: 910, font: '20px', color: '#FD5A02', text: '￥ '
      },
      {
        x: 50, y: 900, font: '46px', color: '#FD5A02', text: detail.price
      },
      {
        x: 50 + (String(detail.price).length * 30), y: 905, font: '22px', color: '#999999', text: `原价￥${detail.originalPrice}`
      },
      {
        x: 44, y: 970, font: '22px', color: '#FF4900', text: '深圳VIP白领班'
      },
      {
        x: 246, y: 970, font: '22px', color: '#FF4900', text: '限时特惠'
      },
      {
        x: 30, y: 1030, font: '22px', color: 'rgba(54, 55, 55, 100)', text: '"一年之计在于春，豪车到手前先拿证"'
      },
      {
        x: 147, y: Number(inviterDetail.type) === 1 ? 1150 : 1170, font: '26px', color: 'rgba(54, 55, 55, 100)', text: inviterDetail.userName
      },
      {
        x: 241, y: Number(inviterDetail.type) === 1 ? 1150 : 1170, font: '26px', color: 'rgba(102, 102, 102, 100)', text: job
      },
      {
        x: 147, y: 1190, font: '22px', color: 'rgba(102, 102, 102, 100)', text: Number(inviterDetail.type) === 1 ? `${inviterDetail.praiseNum}个学员好评` : ''
      },
      {
        x: 517, y: 1234, font: '20px 微软雅黑', color: 'rgba(153, 153, 153, 100)', text: '长按图片 报名优惠'
      }
    ],
    pics: [
      {
        x: 32, y: 170, w: 686, h: 686, r: 4, src: imgDomain + detail.photoUrlMain
      },
      {
        x: 31, y: 1117, w: 100, h: 100, r: 50, src: avatarUrl
      },
    ],
    paths: {
      rect: [
        {
          x: 30, y: 945, w: 176, h: 50, r: 24, type: 'fill', color: '#FFF3E5'
        },
        {
          x: 230, y: 945, w: 120, h: 50, r: 24, type: 'fill', color: '#FFF3E5'
        }
      ],
      circle: [
        {
          x: 31, y: 1117, w: 100, h: 100, r: 50, type: 'fill', color: '#D8D8D8'
        },
        {
          x: 548, y: 1090, w: 116, h: 116, r: 58, type: 'fill', color: '#D8D8D8'
        }
      ],
      line: [
        {
          x1: 50 + (String(detail.price).length * 30), y1: 905, x2: 50 + (String(detail.price).length * 30) + 30 + (String(detail.originalPrice).length * 20), y2: 905, lineWidth: 1, color: '#999999'
        },
        {
          x1: 448, y1: 1127, x2: 448, y2: 1207, lineWidth: 1, color: '#979797', dash: [5, 10]
        }
      ]
    }
  };
};
