import { DateFormat } from '@/assets/js/common';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { labelList, FromList, searchTimeList } from './_enums';
import { bmLabelList, noyxLabelList, dateTimeExchangeBykey } from './_common';

@Component
export default class ThreadIndexNew extends Vue {
  // 默认用户头像
  defaultUserImg = () => 'https://file.aicar365.com/mini-program/common/dialogue_xueyuantouxiang.png';

  defaultImg = () => 'https://file.aicar365.com/mini-program/common/queshengye_banbiexinxi.png';

  current = 0;

  // 数据存储每个tab数据量
  threadCountArry: any = [0, 0, 0, 0];

  tabList: any = [
    { value: 0, label: '全部(0)' },
    { value: 1, label: '潜客(0)' },
    { value: 2, label: '已报名(0)' },
    { value: 3, label: '无意向(0)' }
  ];

  handleNavChange(e) {
    this.current = e;
  }

  /** 切换tab时候请求数据和当前tab的数据量 */
  swiperChange(event: any) {
    const { current } = event.detail;
    this.current = current;
    this.threadFlag = false;
    this.currentPage = 1;
    this.searchsItemList = [];
    this.reset();
    this.queryThreadList();
    this.queryStatics();
  }

  // 计算swiper高度
  swiperHeight = 0;

  getElHeight() {
    const query = uni.createSelectorQuery();
    query
      .selectAll('.el_height')
      .boundingClientRect((rect) => {
        if (rect instanceof Array) {
          uni.getSystemInfo({
            success: (res) => {
              let elHeight = 0;
              rect.forEach((item) => {
                elHeight += item.height;
                console.log('4444:', elHeight);
              });
              this.swiperHeight = res.windowHeight - elHeight; // 计算外层swiper高度
              console.log('swiperHeight:', this.swiperHeight);
            },
          });
        }
      })
      .exec();
  }

  // 线索列表
  threadList = [];

  threadFlag = false;

  // 当前页码
  currentPage = 1;

  total = 0;

  async queryThreadList() {
    const {
      current, currentPage, searchForm
    } = this;
    const {
      beginDate, endDate, keyword, formType: sceneTypes, searchLabels
    } = searchForm;
    const sendData = {
      current: currentPage,
      pageSize: 10,
      beginDate,
      endDate,
      keyword,
      sceneTypes,
      labelList: searchLabels,
      type: current
    };
    const body = await this.$http.post('sale/v1/mkt/clues', sendData);
    const { data = [], total } = body;
    if (this.currentPage === 1) this.threadList = [];
    this.threadList = this.threadList.concat(data);
    this.total = total;
    this.threadFlag = true;
  }

  /** 触底加载数据分页 */
  bindscrolltolower() {
    if (this.threadList.length >= this.total) return;
    this.currentPage += 1;
    this.queryThreadList();
  }

  // 线索统计
  statics: any = {};

  /** 获取顶部统计数据 */
  async queryStatics() {
    const {
      beginDate, endDate, keyword, formType: sceneTypes, searchLabels
    } = this.searchForm;
    const sendData = {
      beginDate,
      endDate,
      keyword,
      sceneTypes,
      labelList: searchLabels
    };
    const body = await this.$http.post('sale/v1/mkt/cluesCount', sendData);
    const {
      todayNew = 0, sum = 0, unFollowUp = 0, allPurpose = 0, defaultPurpose = 0, successPurpose = 0, otherPurpose = 0,
    } = body;
    this.statics = { todayNew, sum, unFollowUp };
    this.threadCountArry = [allPurpose, defaultPurpose, successPurpose, otherPurpose];
    this.tabList[0].label = `全部(${this.threadCountArry[0]})`;
    this.tabList[1].label = `潜客(${this.threadCountArry[1]})`;
    this.tabList[2].label = `已报名(${this.threadCountArry[2]})`;
    this.tabList[3].label = `无意向(${this.threadCountArry[3]})`;
  }

  /** tab 线索条数 */
  loadTabCount() {
    const { current, threadList } = this;
    this.threadCountArry[current] = threadList.length > 9999 ? '9999+' : threadList.length;
    switch (current) {
      case 0: this.tabList[0].label = `全部(${this.threadCountArry[0]})`;
        break;
      case 1: this.tabList[1].label = `潜客(${this.threadCountArry[1]})`;
        break;
      case 2: this.tabList[2].label = `已报名(${this.threadCountArry[2]})`;
        break;
      case 3: this.tabList[3].label = `无意向(${this.threadCountArry[3]})`;
        break;
      default:
        break;
    }
  }

  /* 下拉刷新 */
  threadTriggered1 = false;

  threadTriggered2 = false;

  threadTriggered3 = false;

  threadTriggered4 = false;

  threadBindrefresherrefresh1() {
    this.threadFlag = false;
    this.threadTriggered1 = true;
    this.currentPage = 1;
    this.queryThreadList();
    this.queryStatics();
    const timer = setTimeout(() => {
      this.threadTriggered1 = false;
      clearTimeout(timer);
    }, 1000);
  }

  threadBindrefresherrefresh2() {
    this.threadFlag = false;
    this.threadTriggered2 = true;
    this.currentPage = 1;
    this.queryThreadList();
    this.queryStatics();
    const timer = setTimeout(() => {
      this.threadTriggered2 = false;
      clearTimeout(timer);
    }, 1000);
  }

  threadBindrefresherrefresh3() {
    this.threadFlag = false;
    this.threadTriggered3 = true;
    this.currentPage = 1;
    this.queryThreadList();
    this.queryStatics();
    const timer = setTimeout(() => {
      this.threadTriggered3 = false;
      clearTimeout(timer);
    }, 1000);
  }

  threadBindrefresherrefresh4() {
    this.threadFlag = false;
    this.threadTriggered4 = true;
    this.currentPage = 1;
    this.queryThreadList();
    this.queryStatics();
    const timer = setTimeout(() => {
      this.threadTriggered4 = false;
      clearTimeout(timer);
    }, 1000);
  }

  async onShow() {
    this.queryThreadList();
    this.queryStatics();
  }

  onLoad(options: any) {
    const tab = options?.tab;
    this.current = Number(tab) || this.current;
    this.queryThreadList();
    this.queryStatics();
    this.$nextTick(() => this.getElHeight());
  }

  jumpDetail(detailId: string) {
    uni.navigateTo({
      url: `/pages/public/thread_new/detail?id=${detailId}`,
    });
  }

  searchDataByKeyword(val: string) {
    this.searchForm.keyword = val;
    this.threadFlag = false;
    this.currentPage = 1;
    this.queryThreadList();
    this.queryStatics();
  }

  dialogName = '';

  /** 关闭弹出框 */
  closeDialog() {
    const timer = setTimeout(() => {
      this.dialogName = '';
      clearTimeout(timer);
    }, 200);
  }

  /** 打开修改标签弹出框 */
  openSearchDialog() {
    this.dialogName = '筛选';
  }

  searchsItemList: any = [];

  clearSearItem() {
    this.searchsItemList = [];
    this.reset();
    this.threadFlag = false;
    this.currentPage = 1;
    this.queryThreadList();
    this.queryStatics();
    this.$nextTick(() => this.getElHeight());
  }

  searchForm = {
    keyword: '',
    searchTimeKey: null,
    beginDate: null,
    endDate: null,
    formType: [],
    searchLabels: [],
  };

  searchTimeList = searchTimeList;

  typeList = FromList;

  targetLabelList = labelList;

  // 潜客
  qiankeLabelList = labelList.filter(a => a.id >= 11 && a.id <= 13);

  // 已报名
  baominLabelList = bmLabelList;

  // 无意向
  noyixiangLabelList = noyxLabelList;

  handTimeRedioActive(val: string) {
    this.searchForm.searchTimeKey = val;
    if (val === '自定义') {
      this.searchForm.beginDate = null;
      this.searchForm.endDate = null;
    }
  }

  bindStartDateChange(e) {
    const { value } = e.target;
    this.searchForm.beginDate = value;
  }

  bindEndDateChange(e) {
    const { value } = e.target;
    this.searchForm.endDate = value;
  }

  get startDate() {
    return this.getDate('start');
  }

  get endDate() {
    return this.getDate('end');
  }

  getDate(type) {
    const date = new Date();
    let year: any = date.getFullYear();
    let month: any = date.getMonth() + 1;
    let day: any = date.getDate();
    let datestr = '';
    if (type === 'start') {
      year -= 5;// 最多查询5年范围内
      month = month > 9 ? month : `0${month}`;
      day = day > 9 ? day : `0${day}`;
      datestr = `${year}-${month}-${day}`;
    } if (type === 'end') {
      const date1 = new Date(this.searchForm.beginDate);
      date1.setTime(date1.getTime() - 24 * 60 * 60 * 1000); // 可开始日期===结束日期
      datestr = DateFormat(date1, 'yyyy-MM-dd');
    }
    return datestr;
  }

  handTypeActive(val: number) {
    if (this.searchForm.formType.includes(val)) {
      // 反选的
      this.searchForm.formType = this.searchForm.formType.filter(
        (ele) => ele !== val
      );
    } else {
      // 选中的
      this.searchForm.formType.push(val);
    }
  }

  handLabelActive(val: number) {
    if (this.searchForm.searchLabels.includes(val)) {
      // 反选的
      this.searchForm.searchLabels = this.searchForm.searchLabels.filter(
        (ele) => ele !== val
      );
    } else {
      // 选中的
      this.searchForm.searchLabels.push(val);
    }
  }

  /** tab标签不一样，当前筛选项的意向选项就不一样 */
  @Watch('current')
  currentChange(val: number) {
    const {
      targetLabelList, qiankeLabelList, baominLabelList, noyixiangLabelList
    } = this;
    let list: any = targetLabelList;
    switch (val) {
      case 0: list = labelList;
        break;
      case 1: list = qiankeLabelList;
        break;
      case 2: list = baominLabelList;
        break;
      case 3: list = noyixiangLabelList;
        break;
      default: list = targetLabelList;
        break;
    }
    this.targetLabelList = list;
  }

  /** 重置搜索 */
  reset() {
    this.searchForm.searchTimeKey = null;
    this.searchForm.beginDate = null;
    this.searchForm.endDate = null;
    this.searchForm.formType = [];
    this.searchForm.searchLabels = [];
  }

  /** 确定搜索 */
  sureSearch() {
    this.closeDialog();
    // 处理筛选时间
    const { searchTimeKey } = this.searchForm;
    if (searchTimeKey !== '自定义') {
      const searchTimeObj = dateTimeExchangeBykey(searchTimeKey);
      const { beginDate, endDate } = searchTimeObj;
      this.searchForm.beginDate = beginDate;
      this.searchForm.endDate = endDate;
    }
    // 处理筛选项
    this.dealSearchItemList();
    this.threadFlag = false;
    this.currentPage = 1;
    this.queryThreadList();
    this.queryStatics();
    this.$nextTick(() => this.getElHeight());
  }

  dealSearchItemList() {
    const { searchTimeKey, formType, searchLabels } = this.searchForm;
    const _type = this.typeList.filter(a => formType.includes(a.id));
    const _typeItem = _type.map((a: any) => a.value);
    const _searchLabels = this.targetLabelList.filter(a => searchLabels.includes(a.id));
    const _searchLabelsItem = _searchLabels.map((a: any) => a.value);
    const searchsItemList: any = [searchTimeKey, ..._typeItem, ..._searchLabelsItem];
    // 过滤空
    this.searchsItemList = searchsItemList.filter(a => a);
  }
}
