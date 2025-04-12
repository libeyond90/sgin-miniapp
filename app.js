// app.js
import { post,get } from './utils/mini.js'
import {Config} from './utils/config'

App({
  login(){

    return new Promise((resolve, reject) => {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        const params = {
          code:res.code
        }
        post(`common/login`,params).then(res=>{
          // console.log('res.openid',res)
          wx.setStorageSync('aut',res)
          resolve(res)
        })
      }
    })
    })
  },
  onLaunch() {
    console.log('onLaunch',18871857790)
    //不需要登入，暂时不需要缓存
    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    
    // console.log('加载字体')
    // wx.loadFontFace({
    //   global:true,
    //   family: 'al_dd_font',
    //   source: `url(https://apadog.com/fonts/MICROSS.TTF)`,//`url(${fonts_host}/fonts/sy.ttf") al.ttf`
    //   success(res){
    //     console.log('加载字体',res)
    //   } ,
    //    fail: function (res) {
    //     console.log('加载字体失败',res)
    //   },
    // })

    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
      wx.showToast({
        title: '新版本下载失败',
      })
    })
    //this.login()
  },
  globalData: {
    userInfo: null,//登入用户信息
    qdClassId:'',//当前班级id
    classCounts:{},//班级老师学生数
    key:'35b1d69b643f4176b5c493167ffbc81b',//和风天气的key
    cityId:'',//选择的城市
    cityName:'',//城市名
    getLocation:'',//自动获得的地理位置
    date: [],//从今天开始的一周日期
    tempMin: [],//七日最低温度
    tempMax: [],//七日最高温度
    humidity: []//七日相对湿度
  }
})
