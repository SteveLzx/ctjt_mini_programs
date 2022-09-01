// 身份证号码
type ProvinceAndCitys = {
  [key: string]: string;
}
export const idCardNoUtil = {
  /* 省,直辖市代码表 */
  provinceAndCitys: {
    'i11': '北京',
    'i12': '天津',
    'i13': '河北',
    'i14': '山西',
    'i15': '内蒙古',
    'i21': '辽宁',
    'i22': '吉林',
    'i23': '黑龙江',
    'i31': '上海',
    'i32': '江苏',
    'i33': '浙江',
    'i34': '安徽',
    'i35': '福建',
    'i36': '江西',
    'i37': '山东',
    'i41': '河南',
    'i42': '湖北',
    'i43': '湖南',
    'i44': '广东',
    'i45': '广西',
    'i46': '海南',
    'i50': '重庆',
    'i51': '四川',
    'i52': '贵州',
    'i53': '云南',
    'i54': '西藏',
    'i61': '陕西',
    'i62': '甘肃',
    'i63': '青海',
    'i64': '宁夏',
    'i65': '新疆',
    'i71': '台湾',
    'i81': '香港',
    'i82': '澳门',
    'i91': '国外'
  },

  /*每位加权因子*/
  powers: ['7', '9', '10', '5', '8', '4', '2', '1', '6', '3', '7', '9', '10', '5', '8', '4', '2'],

  /*第18位校检码*/
  parityBit: ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'],

  /*性别*/
  genders: { male: '男', female: '女' },

  /*校验地址码*/
  checkAddressCode: function (addressCode: string) {
    var check = /^[1-9]\d{5}$/.test(addressCode);
    if (!check) return false;
    return (idCardNoUtil.provinceAndCitys as ProvinceAndCitys)[`i${parseInt(addressCode.substring(0, 2))}`];
  },

  /*校验日期码*/
  checkBirthDayCode: function (birDayCode: string) {
    var check = /^[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))$/.test(birDayCode);
    if (!check) return false;
    var yyyy = parseInt(birDayCode.substring(0, 4), 10);
    var mm = parseInt(birDayCode.substring(4, 6), 10);
    var dd = parseInt(birDayCode.substring(6), 10);
    var xdata = new Date(yyyy, mm - 1, dd);
    if (xdata > new Date()) {
      return false; //生日不能大于当前日期
    } else if ((xdata.getFullYear() == yyyy) && (xdata.getMonth() == mm - 1) && (xdata.getDate() == dd)) {
      return true;
    } else {
      return false;
    }
  },

  /*计算校检码*/
  getParityBit: function (idCardNo: string) {
    var id17 = idCardNo.substring(0, 17);
    /*加权 */
    var power = 0;
    for (var i = 0; i < 17; i++) {
      power += parseInt(id17.charAt(i), 10) * parseInt(idCardNoUtil.powers[i]);
    }
    /*取模*/
    var mod = power % 11;
    return idCardNoUtil.parityBit[mod];
  },

  /*验证校检码*/
  checkParityBit: function (idCardNo: string) {
    var parityBit = idCardNo.charAt(17).toUpperCase();
    if (idCardNoUtil.getParityBit(idCardNo) == parityBit) {
      return true;
    } else {
      return false;
    }
  },

  /*校验15位或18位的身份证号码*/
  checkIdCardNo: function (idCardNo: string) {
    //15位和18位身份证号码的基本校验
    var check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo);
    if (!check) return false;
    //判断长度为15位或18位
    if (idCardNo.length == 15) {
      return idCardNoUtil.check15IdCardNo(idCardNo);
    } else if (idCardNo.length == 18) {
      return idCardNoUtil.check18IdCardNo(idCardNo);
    } else {
      return false;
    }
  },

  //校验15位的身份证号码
  check15IdCardNo: function (idCardNo: string) {
    //15位身份证号码的基本校验
    var check: string | boolean = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(idCardNo);
    if (!check) return false;
    //校验地址码
    var addressCode = idCardNo.substring(0, 6);
    check = idCardNoUtil.checkAddressCode(addressCode);
    if (!check) return false;
    var birDayCode = '19' + idCardNo.substring(6, 12);
    //校验日期码
    return idCardNoUtil.checkBirthDayCode(birDayCode);
  },

  //校验18位的身份证号码
  check18IdCardNo: function (idCardNo: string) {
    //18位身份证号码的基本格式校验
    var check: string | boolean = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(idCardNo);
    if (!check) return false;
    //校验地址码
    var addressCode = idCardNo.substring(0, 6);
    check = idCardNoUtil.checkAddressCode(addressCode);
    if (!check) return false;
    //校验日期码
    var birDayCode = idCardNo.substring(6, 14);
    check = idCardNoUtil.checkBirthDayCode(birDayCode);
    if (!check) return false;
    //验证校检码
    return idCardNoUtil.checkParityBit(idCardNo);
  },

  formateDateCN: function (day: string) {
    var yyyy = day.substring(0, 4);
    var mm = day.substring(4, 6);
    var dd = day.substring(6);
    return yyyy + '-' + mm + '-' + dd;
  },

  //获取信息
  getIdCardInfo: function (idCardNo: string) {
    var idCardInfo = {
      gender: '', //性别
      birthday: '' // 出生日期(yyyy-mm-dd)
    };
    if (idCardNo.length == 15) {
      var aday = '19' + idCardNo.substring(6, 12);
      idCardInfo.birthday = idCardNoUtil.formateDateCN(aday);
      if (parseInt(idCardNo.charAt(14)) % 2 == 0) {
        idCardInfo.gender = idCardNoUtil.genders.female;
      } else {
        idCardInfo.gender = idCardNoUtil.genders.male;
      }
    } else if (idCardNo.length == 18) {
      var aday = idCardNo.substring(6, 14);
      idCardInfo.birthday = idCardNoUtil.formateDateCN(aday);
      if (parseInt(idCardNo.charAt(16)) % 2 == 0) {
        idCardInfo.gender = idCardNoUtil.genders.female;
      } else {
        idCardInfo.gender = idCardNoUtil.genders.male;
      }

    }
    return idCardInfo;
  },

  /*18位转15位*/
  getId15: function (idCardNo: string) {
    if (idCardNo.length == 15) {
      return idCardNo;
    } else if (idCardNo.length == 18) {
      return idCardNo.substring(0, 6) + idCardNo.substring(8, 17);
    } else {
      return null;
    }
  },

  /*15位转18位*/
  getId18: function (idCardNo: string) {
    if (idCardNo.length == 15) {
      var id17 = idCardNo.substring(0, 6) + '19' + idCardNo.substring(6);
      var parityBit = idCardNoUtil.getParityBit(id17);
      return id17 + parityBit;
    } else if (idCardNo.length == 18) {
      return idCardNo;
    } else {
      return null;
    }
  }
};

// 手机号格式
export const mobileReg = /^1(3|4|5|6|7|8|9)\d{9}$/;

/** 验证座机号正则 */
export const tel_reg = /^\d{3,4}-\d{7,8}$/;

// 姓名格式校验
export const nameReg = /^[\u4e00-\u9fa5]{2,4}$/;

// 昵称格式校验，最长不得超10个字符的中英文正则表达式
export const nickNameReg = /^[a-zA-Z0\u4e00-\u9fa5]{2,10}$/;

// 邮箱地址验证
export const emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
