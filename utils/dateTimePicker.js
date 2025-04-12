function withData(param) {
  return param < 10 ? '0' + param : '' + param;
}

function getLoopArray(start, end) {
  const start_num = start || 0;
  const end_num = end || 1;
  let array = [];
  for (let i = start_num; i <= end_num; i++) {
    array.push(withData(i));
  }
  return array;
}

function getMonthDay(year, month) {
  year = year || new Date().getFullYear();
  month = month || new Date().getMonth() + 1;
  let flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);
  let array = null;

  switch (month) {
    case '01':
    case '03':
    case '05':
    case '07':
    case '08':
    case '10':
    case '12':
      array = getLoopArray(1, 31);
      break;
    case '04':
    case '06':
    case '09':
    case '11':
      array = getLoopArray(1, 30);
      break;
    case '02':
      array = flag ? getLoopArray(1, 29) : getLoopArray(1, 28);
      break;
    default:
      array = '月份格式不正确，请重新输入！';
  }
  return array;
}

function getNewDateArry() {
  let newDate = new Date();
  let year = withData(newDate.getFullYear());
  let mont = withData(newDate.getMonth() + 1);
  let date = withData(newDate.getDate());
  let hour = withData(newDate.getHours());
  let minu = withData(newDate.getMinutes());

  return [year, mont, date, hour, minu];
}

function dateTimePicker(startYear, endYear, minDate = null) {
  const years = [];
  const months = [];
  const days = [];
  const hours = [];
  const minutes = [];
  
  const dateArr = minDate ? [...getNewDateArry()] : getNewDateArry();
  
  // 年份最小为当前年份，最大为当前年份加1年
  const curYear = new Date().getFullYear();
  const startY = startYear || curYear;
  const endY = endYear || (curYear + 1);

  // 年
  for (let i = startY; i <= endY; i++) {
    years.push(withData(i));
  }

  // 月
  for (let i = 1; i <= 12; i++) {
    months.push(withData(i));
  }

  // 日
  days.push(...getMonthDay(dateArr[0], dateArr[1]));

  // 时
  for (let i = 0; i <= 23; i++) {
    hours.push(withData(i));
  }

  // 分
  for (let i = 0; i <= 59; i++) {
    minutes.push(withData(i));
  }

  const dateTimeArray = [years, months, days, hours, minutes];
  
  const indexYear = dateTimeArray[0].indexOf(dateArr[0]);
  const indexMonth = dateTimeArray[1].indexOf(dateArr[1]);
  const indexDay = dateTimeArray[2].indexOf(dateArr[2]);
  const indexHour = dateTimeArray[3].indexOf(dateArr[3]);
  const indexMinute = dateTimeArray[4].indexOf(dateArr[4]);

  const dateTimeIndex = [indexYear, indexMonth, indexDay, indexHour, indexMinute];

  // 如果有最小日期限制
  if (minDate) {
    const minYear = minDate.getFullYear();
    const minMonth = minDate.getMonth() + 1;
    const minDay = minDate.getDate();
    const minHour = minDate.getHours();
    const minMinute = minDate.getMinutes();

    // 设置初始索引为最小时间
    dateTimeIndex[0] = years.indexOf(withData(minYear));
    dateTimeIndex[1] = months.indexOf(withData(minMonth));
    dateTimeIndex[2] = days.indexOf(withData(minDay));
    dateTimeIndex[3] = hours.indexOf(withData(minHour));
    dateTimeIndex[4] = minutes.indexOf(withData(minMinute));
  }

  return {
    dateTimeArray: dateTimeArray,
    dateTimeIndex: dateTimeIndex
  };
}

function updateMonthDays(year, month, dateTimeArray, dateTimeIndex) {
  const days = getMonthDay(year, month);
  dateTimeArray[2] = days;
  
  // 如果当前选择的日期超出了新的天数范围，则重置为最后一天
  if (dateTimeIndex[2] >= days.length) {
    dateTimeIndex[2] = days.length - 1;
  }
  
  return {
    dateTimeArray: dateTimeArray,
    dateTimeIndex: dateTimeIndex
  };
}

module.exports = {
  dateTimePicker: dateTimePicker,
  getMonthDay: getMonthDay,
  updateMonthDays: updateMonthDays
}; 