/* eslint-disable */
import { regTel } from '@/assets/js/common';
import $http from '@/assets/js/request';
/* eslint-enable */
import { labelList, typeList } from './enums';

/**
 * @description 线索模块添加用户跟踪记录统一接口
  * @param type 1:标记为潜客 2:发起与客户的聊天 3:拨打了客户电话 4:填充用户信息 5:标记为已成交
*/
export function addThreadRecord(userId: number, type: number, formData?: {}, label?: number,) {
  const sendData = {
    ...formData,
    type,
    label,
    userId
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

export function nameFilter(item: any) {
  const {
    name = '', mobile = '', openId = '', fillName = '', fillMobile = ''
  } = item;
  return fillName || name || regTel(1, fillMobile || mobile) || openId?.substring(openId.length - 4);
}
