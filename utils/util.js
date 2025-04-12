const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}


export const cameraTime = () => {
	const date = new Date();
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const weekDay = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()
	return {
		date: [year, month, day].map(formatNumber).join('-'),
    time:[hour, minute].map(formatNumber).join(':'),
    second:[second].map(formatNumber).join(':'),
		week: '星期'+weekDay
	}
}

//计算文字在画布宽度
/**
 * canvas绘图相关，把文字转化成只能行数，多余显示省略号
 * ctx: 当前的canvas
 * text: 文本
 * canvasWidth: 画布宽度
 * 
 * return str[]数组
 */
const transformContent = (ctx,text,canvasWidth,row)=>{

  //文字本身长度小于 屏幕宽度，push之后就返回
  if(ctx.measureText(text).width<=canvasWidth){
    row.push(text);
    return;
  }
  //大于屏幕宽度 分割数组
  var textArray = text.split(""); // 分割成字符串数组
  let temp = "";

  //遍历
  for (var i = 0; i < textArray.length; i++) {
    const rowstr = temp;//组装分割前字符串
    temp = temp + textArray[i];//组装字符串
    //是否超出屏幕宽度
    if (ctx.measureText(temp).width > canvasWidth) {
      row.push(rowstr)

      //如果超出宽度，重新调用自己，并且退出循环
      temp = text.substring(i, textArray.length);
      transformContent(ctx,temp,canvasWidth,row);
      break;
    }
  }
}

/*
*获取文字的占屏幕的长度 x轴
*/
const strWidth = (ctx,text)=>{
  return ctx.measureText(text).width
}


const shareMsg = (title,path,imageUrl)=>{
  const promise = new Promise(resolve => {
    setTimeout(() => {
      resolve({
        title,
        path,
        imageUrl
      })
    }, 200)
  })
  return {
    promise 
  }
} 


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

/**
 * 将时间戳格式化为日期字符串
 * @param {number} timestamp - 秒级时间戳
 * @returns {string} 格式化后的日期字符串 (YYYY-MM-DD HH:mm)
 */
const formatTimestamp = (timestamp) => {

  if (!timestamp) return '暂无时间';
  // 确保timestamp是数字
  timestamp = parseInt(timestamp);
  if (isNaN(timestamp)) return '时间格式错误';
  
  try {
    const date = new Date(timestamp * 1000);
    if (date.toString() === 'Invalid Date') return '无效日期';
    
    const year = date.getFullYear();
    const month = formatNumber(date.getMonth() + 1);
    const day = formatNumber(date.getDate());
    const hour = formatNumber(date.getHours());
    const minute = formatNumber(date.getMinutes());
    
    return `${year}-${month}-${day} ${hour}:${minute}`;
  } catch(e) {
    return '时间处理错误';
  }
}

module.exports = {
  shareMsg,
  formatTime,
  cameraTime,
  transformContent,
  strWidth,
  formatTimestamp
}
