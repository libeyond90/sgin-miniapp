/**
 * 2018-09-09
 * document: https://github.com/shixianqin/wx-calendar
 */

// import Lunar from "./lunar-calendar.js"
const {
  Solar,
  SolarWeek,
  Lunar,
  LunarMonth,
  HolidayUtil
} = require('./lunar-javascript/index.js')

/**
 * 缓存数据对象
 * @type {Object}
 */
const CHACE = {},

  // 规定对应索引的相邻索引
  SIBLING = [{
    prev: 2,
    next: 1
  }, {
    prev: 0,
    next: 2
  }, {
    prev: 1,
    next: 0
  }],

  // 规定每一行距离顶部的高度
  TOP_VALUES = {
    "35": [0, 120, 240, 360, 481],
    "42": [0, 95, 190, 289, 385, 481]
  },

  // 匹配 “日”
  MATCH_DAY = /\-\d+$/,

  // 每个月的总天数
  MONTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


/**
 * 判断是否闰年
 * @param  {Year}
 * @return {Boolean}
 */
function isLeapYear(year) {
  return year % 400 == 0 || year % 4 == 0 && year % 100 != 0;
}

//阳历固定节日
function solarjr(date, mm, dd) {
  // const solar = {
  //   d0101: "元旦",
  //   d0214: "情人节",
  //   d0308: "妇女节",
  //   d0312: "植树节", //（中国特有）
  //   d0401: "愚人节",
  //   d0501: "劳动节",
  //   d0504: "青年节", //（中国五四青年节）
  //   d0601: "儿童节",
  //   d0701: "建党节",//香港回归
  //   d0801: "建军节",//香港回归
  //   d0910: "教师节", //（中国）
  //   d1001: "国庆节", //（中华人民共和国国庆）
  //   d1031: "万圣夜",
  //   d1101: "万圣节",
  //   d1111: "光棍节", //（源自中国，现多为电商购物节）
  //   //d1112:"退伍军人节",// （美国）
  //   d1224: "平安夜",
  //   d1225: "圣诞节"
  // }
  // let solarjr = solar["d" + toDouble(mm) + toDouble(dd)] || '';
  // if (!solarjr) {
  //   let d = SolarWeek.fromDate(date, 1);
  //   let w = Solar.fromDate(date)

  //   let m = SolarWeek.fromDate(date, 4);//星期四作为一周的起点
  //   const ofMonth = d.getIndex();

  //   //5月第二个星期天 母亲节
  //   if (d.getMonth() == 5 && ofMonth == 2 && w.getWeek() == 0) {
  //     solarjr = "母亲节"
  //   }

  //   //6月第三个星期天 父亲节
  //   if (d.getMonth() == 6 && ofMonth == 3 && w.getWeek() == 0) {
  //     solarjr = "父亲节"
  //   }

  //   //每年11月第四个星期四定为“感恩节”
  //   //每个月开始的第一天是周几
  //   if (d.getMonth() == 11 && m.getIndex() == 4 && w.getWeek() == 4) {
  //     solarjr = "感恩节"
  //   }

  // }
  // return solarjr
  const d = Solar.fromDate(date)
  const festivals = d.getFestivals() ;
  const solarjr = festivals && festivals.length>0 ?festivals[0]:'';
  return solarjr;
}

/**
 * 法定节假日
 * 
*/
function holidays(yyyy, mm, dd){
  let holiday = {};
  const d = HolidayUtil.getHoliday(yyyy, mm, dd);
  if(d){
    holiday.work = d.isWork();
    holiday.name = d.getName();
  }

  return holiday;
}

export const toLunar = (yyyy, mm, dd) =>{
  const date = new Date(yyyy, mm - 1, dd);
  // console.log('123',yyyy,mm,dd)
  const d = Lunar.fromDate(date);
  //const d = Lunar.fromYmd(yyyy,mm-1,dd);
  var lunarMonth = LunarMonth.fromYm(d.getYear(), d.getMonth());
  const Animal = d.getYearShengXiao();
  const IDayCn = d.getDayInChinese();
  const IMonthCn = d.getMonthInChinese() + '月';
  const yljr = d.getFestivals();
  const ylotherjr = d.getOtherFestivals()
  let festival = yljr.length > 0 ? yljr[0] : ''; //返回常用节日的数组，包括春节、中秋、元宵等，有可能同一天有多个，也可能没有。

  //添加自己的自定义节日
  if(!festival){
    if(d.getMonth() == 7 && d.getDay() == 15){
      festival = "中元节";
    }
  }

  
  const otherfestival = ylotherjr.length > 0 ? ylotherjr[0] : ''; //返回其他传统节日的数组，包括寒衣节、下元节、祭灶日等，有可能同一天有多个，也可能没有。
  const solar = solarjr(date, mm, dd);
  const Term = d.getJieQi();
  const cDay = d.getDay();
  const cMonth = d.getMonth();
  const cYear = d.getYear();
  const gzDay = d.getDayInGanZhi();
  const gzMonth = d.getMonthInGanZhi();
  const gzYear = d.getYearInGanZhi();
  const isLeap = lunarMonth.isLeap();
  const isTerm = Term ? true : false;
  const isToday = false;
  const lDay = d.getDay();
  const lMonth = d.getMonth();
  const lYear = d.getYear();
  const nWeek = d.getWeek();
  const ncWeek = d.getWeekInChinese();

  return {
    Animal,
    IDayCn,
    IMonthCn,
    Term,
    cDay,
    cMonth,
    cYear,
    gzDay,
    gzMonth,
    gzYear,
    isLeap,
    isTerm,
    isToday,
    lDay,
    lMonth,
    lYear,
    nWeek,
    ncWeek,
    festival,
    otherfestival,
    solar
  }

}


/**
 * 添加前缀 0
 * @param  {Number}
 */
function toDouble(value) {
  return value < 10 ? "0" + value : value;
}



/**
 * 获取今天的日期
 * @return {Array} 年，月，日
 */
function getToday() {
  let date = new Date();
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  ]
}


/**
 * 获取当前选择的日期距离顶部的高度
 * @param  {Array} view 当前的日期视图列表
 * @param  {String} date 当前旋转的日期，年-月-日
 * @return {Number}      
 */
function getTop(view, date) {
  return TOP_VALUES[view.length][Math.floor(view.findIndex(item => item.date == date) / 7)];
}

/**
 * 获取某月的总天数
 * @param  {Year}
 * @param  {Month}
 * @return {Number}
 */
function getTotalDay(year, month) {
  return month != 2 ? MONTHS[month - 1] : isLeapYear(year) ? 29 : 28;
}


/**
 * 创建 “月” 视图
 * @param  {Date}
 * @param  {Function}
 * @return {Array}
 */
function createView(dateStr, handler) {

  // 格式化日期, ios 只认识这样的：2018/9/9 ，不认识这样的：2018-9-9
  // 而且必须是 年/月/日，一个不能少
  dateStr = (dateStr + "-1").split('-').join("/");
  //console.log('dateStr', )
  // 获取今天的日期
  let todayStr = getToday().join("-"),
    date = new Date(dateStr),
    year = date.getFullYear(),
    month = date.getMonth() + 1,
    week = date.getDay(),

    // 上一个月份
    prevYear = month > 1 ? year : year - 1,
    prevMonth = month > 1 ? month - 1 : 12,

    // 下一个月份
    nextYear = month < 12 ? year : year + 1,
    nextMonth = month < 12 ? month + 1 : 1,

    // 本月的总天数
    totalDay = getTotalDay(year, month),

    // 格子中，结束本月最大的日期
    maxDay = totalDay + week,

    // 格子的开始日期
    startDay = getTotalDay(prevYear, prevMonth) - week,

    // 通过日期的数量，设置合适的格子数
    size = maxDay > 35 ? 42 : 35,

    index = 0, //0从 周日开始  1从周1开始
    view = [];

  while (++index <= size) {
    let item, lunar;

    if (index > maxDay) {

      // 下一个月份的数据
      item = {
        year: nextYear,
        month: nextMonth,
        day: index - maxDay,
        type: "next"
      }
    } else if (index > week) {

      // 当前月份的数据
      item = {
        year: year,
        month: month,
        day: index - week,
        type: "current"
      }
    } else {

      // 上一个月份的数据
      item = {
        year: prevYear,
        month: prevMonth,
        day: startDay + index,
        type: "prev"
      }
    }
    // 当前日期字符串形式
    item.date = item.year + "-" + item.month + "-" + item.day;

    // 计算农历
    //lunar = Lunar.solar2lunar(item.year, item.month, item.day);
    //console.log('item',date,item.year, item.month, item.day)
    // console.log(item.year, item.month, item.day)
    lunar = toLunar(item.year, item.month, item.day)
    item.holiday = holidays(item.year, item.month, item.day)
    // 每天对应的星期
    item.week = (index - 1) % 7;

    let label_stytle = 0;

    if(lunar.festival){
      item.label = lunar.festival
      label_stytle = 2;
    }

    if (!item.label) {
      item.label = lunar.solar;
      label_stytle = 2;
    }

    if (!item.label) {
      item.label = lunar.Term
      label_stytle = 0
    }

    if (!item.label) {
      item.label = lunar.IDayCn
      label_stytle = 0
    }

    item.label_stytle = label_stytle;

    //添加节假日
    //console.log(lunar.holiday)
    item.lunar = lunar;
    // 格子索引
    item.index = index - 1;

    // 标记今天
    if (item.date == todayStr) {
      item.isToday = true;
    }

    if (item.month == month) {
      item.isMonth = true;
    }



    // 自定义处理器
    if (handler) {
      handler(item, index);
    }
    // console.log('item',item)
    view.push(item);
  }

  return {
    view,
    year,
    month,
    totalDay,
    prevYear,
    prevMonth,
    nextYear,
    nextMonth
  }
}


/**
 * 
 */
class Calendar {
  constructor() {
    this.index = 0;
    this.currentMonth = "";
    this.prevMonth = "";
    this.nextMonth = "";
    this.currentWeek = "";
    this.prevWeek = "";
    this.nextWeek = "";
    this.currentDay = 1;
    this.currentView = {};
    this.watchValue = false;
    this.changed = false;
  }


  SIBLING = SIBLING;

  /**
   * 获取单个 “月” 视图，并且缓存
   * @param  {String} date       传入年份+月份的字符串形式
   * @param  {Boolean} setCurrent 是否标记为当前数据
   * @return {Array}             日期数据列表
   */
  getMonthView(date, setCurrent) {
    let view = CHACE[date] || (CHACE[date] = createView(date));
    if (setCurrent) {
      this.currentView = view;
      this.currentMonth = date;
      this.prevMonth = view.prevYear + "-" + view.prevMonth;
      this.nextMonth = view.nextYear + "-" + view.nextMonth;
    }
    return view.view
  }


  /**
   * 刷新 “月” 视图
   * @param  {Stirng} date 传入年份+月份的字符串形式
   * @return {Object}      日期视图列表，3个
   */
  refreshMonthViews(date) {
    let views = [],
      sibling = SIBLING[this.index];

    // 标记每份数据应该存在的位置，这很重要
    views[this.index] = this.getMonthView(date, true);
    views[sibling.prev] = this.getMonthView(this.prevMonth);
    views[sibling.next] = this.getMonthView(this.nextMonth);

    return {
      views
    }
  }



  /**
   * 改变 “月” 视图
   * @param  {Number} index 当前的 swiper 索引
   * @return {Object}       直接设置返回的数据
   */
  changeMonthViews(index) {
    let info = this.getChangeInfo(index),
      month = info.direction + "Month";

    // 设置为当前数据，1
    this.getMonthView(this[month], true);

    return {
      ["views[" + info.index + "]"]: this.getMonthView(this[month]) // 修改对应的数据，2
    }
  }



  /**
   * 获取单个 “周” 视图
   * @param  {String} date       年-月-日
   * @param  {Boolean} setCurrent 是否标记为当前数据
   * @return {Object}            view: 日期视图数据，top: 距离顶部的高度
   */
  getWeekView(date, setCurrent) {
    let view = this.getMonthView(date.replace(MATCH_DAY, ""), setCurrent),
      top = getTop(view, date);
    if (setCurrent) {
      this.currentWeek = date;
      this.prevWeek = this.getDiffDate(date, -7);
      this.nextWeek = this.getDiffDate(date, 7);
      this.currentDay = date.split("-")[2];
    }
    return {
      view,
      top: -top
    }
  }


  /**
   * 刷新 “周” 视图
   * @param  {String} date 年-月-日
   * @return {Object}      直接设置返回的数据
   */
  refreshWeekViews(date) {
    let views = [],
      topValues = [],
      sibling = SIBLING[this.index],
      current = this.getWeekView(date, true),
      prev = this.getWeekView(this.prevWeek),
      next = this.getWeekView(this.nextWeek);

    // 标记每份数据应该存在的位置，这很重要
    views[this.index] = current.view;
    views[sibling.prev] = prev.view;
    views[sibling.next] = next.view;

    // 标记每份数据应该存在的位置，这很重要
    // 每一个视图相对于顶部的高度
    topValues[this.index] = current.top;
    topValues[sibling.prev] = prev.top;
    topValues[sibling.next] = next.top;

    return {
      views,
      topValues
    }
  }



  /**
   * 改变 “周” 视图
   * @param  {Number} index 当前 swiper 的索引
   * @return {Object}       直接设置返回的数据
   */
  changeWeekViews(index) {
    let info = this.getChangeInfo(index),
      week = info.direction + "Week",

      // 标记当前数据
      view = this.getWeekView(this[week], true),

      // 修改对应的数据
      siblingView = this.getWeekView(this[week]);

    return {
      ["views[" + info.index + "]"]: siblingView.view,
      ["topValues[" + info.index + "]"]: siblingView.top
    }
  }



  /**
   * 获取改变状态信息
   * @param  {Number} currentIndex 当前的 swiper 索引
   * @return {Object}              滑动方向和对应需改变的索引
   */
  getChangeInfo(currentIndex) {
    let direction = SIBLING[this.index].next == currentIndex ? "next" : "prev";
    return {
      direction,
      index: SIBLING[currentIndex][direction]
    }
  }



  /**
   * 转换传递的日期为数字，并且标记当前的 “日”
   * @param  {String} date 年-月-日
   * @return {String}      年-月
   */
  getValue(date) {
    let value = date ? date.split("-").map(Number) : getToday();
    date = value.join("-");
    if (value.length > 2) {
      this.currentDay = value.pop();
    } else {
      date += "-" + this.currentDay;
    }
    return {
      date,
      month: value.join("-")
    }
  }



  /**
   * 获取日期相差的日期，计算 “周”
   * @param  {String} date 年-月-日
   * @param  {Number} diff 相差数，一周，就是 7 天，上或下用正负表示
   * @return {String}      计算相差后的日期
   */
  getDiffDate(date, diff) {

    // 把 “日” 转换为数字，因为它需要计算
    let value = date.split("-");
    date = new Date(value[0], value[1] - 1, parseInt(value[2]) + diff);
    return [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    ].join("-")
  }
}


// export default Calendar;
module.exports = {
  Calendar,
  toLunar
};