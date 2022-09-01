/* eslint-disable */
import { DateFormat, regTel } from '@/assets/js/common';
import $http from '@/assets/js/request';
/* eslint-enable */
import { labelList, typeList } from './_enums';

/**
 * @description 线索模块添加用户跟踪记录统一接口
  * @param type
  * 1:修改标签 2:发起与客户的聊天 3:拨打了客户电话 4:填充用户信息 5:添加用户备注
*/
export function addThreadRecord(clueId: string, userId: string, type: number, formData?: {}) {
  const sendData = {
    ...formData,
    clueId,
    userId,
    type
  };
  $http.post('sale/v1/mkt/trackRecords', sendData);
}

export function labelStatusFilter(val: number) {
  const _text = labelList.filter((a: any) => a.id === val);
  return _text[0]?.value;
}

export function typeStatusFilter(val: number) {
  const _text = typeList.filter((a: any) => a.id === val);
  return _text[0]?.value;
}

/** 匹配姓名、称呼、手机号、openid显示 */
export function nameFilter(item: any) {
  const {
    name = '', nickname = '', mobile = '', openId = '', fillName = '', fillMobile = ''
  } = item;
  return fillName || name || nickname || regTel(1, fillMobile || mobile) || openId?.substring(openId.length - 4);
}

// 无意向
export const noyxLabelList = labelList.filter(a => a.id >= 5 && a.id <= 10);

// 已报名
export const bmLabelList = labelList.filter(a => a.id === 3 || a.id === 4);

/**
 * @param key 今天、昨天、三天内、七天内
 * @description 根据key匹配搜索时间
 * @returns {开始时间，结束时间}
 */
export function dateTimeExchangeBykey(key: string) {
  let beginDate = '';
  let endDate = '';
  const nowDate = new Date();
  switch (key) {
    case '今天':
      {
        const nowDayBegin = DateFormat(nowDate, 'yyyy-MM-dd');
        const nowDayEnd = DateFormat(nowDate, 'yyyy-MM-dd');
        beginDate = nowDayBegin; endDate = nowDayEnd;
      }
      break;
    case '昨天':
      {
        nowDate.setTime(nowDate.getTime() - 24 * 60 * 60 * 1000);
        const beforeDayBegin = DateFormat(nowDate, 'yyyy-MM-dd');
        const beforeDayEnd = DateFormat(nowDate, 'yyyy-MM-dd');
        beginDate = beforeDayBegin; endDate = beforeDayEnd;
      }
      break;
    case '三天内':
      {
        nowDate.setTime(nowDate.getTime() - 2 * 24 * 60 * 60 * 1000);
        const beforeThreeDayBegin = DateFormat(nowDate, 'yyyy-MM-dd');
        const beforeThreeDayEnd = DateFormat(new Date(), 'yyyy-MM-dd');
        beginDate = beforeThreeDayBegin; endDate = beforeThreeDayEnd;
      }
      break;
    case '七天内':
      {
        nowDate.setTime(nowDate.getTime() - 6 * 24 * 60 * 60 * 1000);
        const beforeSevenDayBegin = DateFormat(nowDate, 'yyyy-MM-dd');
        const beforeSevenDayEnd = DateFormat(new Date(), 'yyyy-MM-dd');
        beginDate = beforeSevenDayBegin; endDate = beforeSevenDayEnd;
      }
      break;
    default: beginDate = ''; endDate = '';
      break;
  }
  return { beginDate, endDate };
}
