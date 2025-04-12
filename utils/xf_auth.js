
const CryptoJS = require('../libs/crypto-js/crypto-js');
const Base64 = require('../libs/base64.js');
import { System } from '../utils/config'

var host = 'spark-api.xf-yun.com';
var path = '/v3.5/chat';
var httpUrl = 'https://'+host+path

var apiKey = '2e2c7c8e5e940aa7cb957b2354913eb0';
var apiSecret = 'MjcxMWJiM2FlMDI4NmE0Yjk5Nzk5MDZm';
var appid = "eb149c9f";

const xf_auth ={

/**
 * 获取科大讯飞的时间字符串
 * */  
rfc1123Date(){
// 获取当前时间
var now = new Date();

// 根据偏移量调整时间
var usEasternTime = new Date(now.getTime() + 260 * 1000);

// 获取星期几的英文缩写
var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var day = dayNames[usEasternTime.getUTCDay()];

// 获取日期
var date = ('0' + usEasternTime.getUTCDate()).slice(-2);

// 获取月份的英文缩写
var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var month = monthNames[usEasternTime.getUTCMonth()];

// 获取年份
var year = usEasternTime.getUTCFullYear();

// 获取时间
var hours = ('0' + usEasternTime.getUTCHours()).slice(-2);
var minutes = ('0' + usEasternTime.getUTCMinutes()).slice(-2);
var seconds = ('0' + usEasternTime.getUTCSeconds()).slice(-2);

// 拼接 RFC1123 格式的时间字符串
var rfc1123Date = day + ', ' +
                  date + ' ' +
                  month + ' ' +
                  year + ' ' +
                  hours + ':' +
                  minutes + ':' +
                  seconds + ' GMT';
                  console.log(rfc1123Date);
    return rfc1123Date;
  },

  /**
   * 获取科大讯飞的请求url
   * 
  */
  authurl(){
    console.log(apiKey)
    console.log(apiSecret)
    console.log(appid)
    var date = this.rfc1123Date();
    var algorithm = 'hmac-sha256'
    var headers = 'host date request-line'
    var signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`
    var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
    var signature = CryptoJS.enc.Base64.stringify(signatureSha)
    var authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
    var authorization =Base64.encode(authorizationOrigin)
    let url = `${httpUrl}?authorization=${authorization}&date=${encodeURIComponent(date)}&host=${host}`
    url = url.replace("http://", "ws://").replace("https://", "wss://")
    return url;
  },

  /**
   * gpt的加密信息
  */
  encryptGptKey(re){
    let str = this.decrypt(re)
    let strs = str.split('|')
    if(strs.length<3){
      wx.showToast({
        title: 'appkey获取失败',
      })
      return;
    }
    apiKey = strs[0];
    apiSecret = strs[1];
    appid = strs[2];
    let url = this.authurl() || '';
    return url
  },

  /**
   * 构造科大讯飞的请求body
   * * */
  msgBody(newQuestion){
    //构造参数
    var parameter = {};
    
    var chat = {
      domain:"generalv3.5",
      temperature:0.5,
      max_tokens:4096
    }
    parameter.chat = chat;

    var text = newQuestion

    var message = {
      text:text
    }

    var payload = {
      message:message
    }

    var header = {
      app_id:appid,
      uid:"18871857790"
    }

    var body={
      parameter,
      header,
      payload
    }
    return JSON.stringify(body)
  },



  /**
 * AES加密
 * @param plainText 明文
 * @param keyInBase64Str base64编码后的key
 * @returns {string} base64编码后的密文
 */
certificate() {
    // 获取当前用户是否登入，缓存存在openid
    var keyInBase64Str = '================'; //密匙，前后端对应
    let openid = wx.getStorageSync('aut')
    var timestamp = Math.floor(Date.now() / 1000); // 获取当前时间戳，单位为秒
    var combinedString = System.environment + '|'+'apadog' + '|' + openid + '|' + timestamp; // 将凭证、openid 和时间戳组合成一个字符串
    
    var key = CryptoJS.enc.Utf8.parse(keyInBase64Str);   //定义加密的密钥  密钥前端和后端必须一致  且为16位
    var srcs = CryptoJS.enc.Utf8.parse(combinedString);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    return encrypted.toString();
},

//解密方法
decrypt(word){
      // 获取当前用户是否登入，缓存存在openid
  var keyInBase64Str = '================'; //密匙，前后端对应
  var key = CryptoJS.enc.Utf8.parse(keyInBase64Str);   //定义加密的密钥  密钥前后一致 为16位
  var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}



}

module.exports = {
  xf_auth
};
