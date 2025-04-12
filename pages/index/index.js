// pages/index/index.js
var aut = require('../../utils/aut');
import { info } from '../../service/user.js'
var app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: app.userInfo
  },



  /**
   * 生命周期函数--监听页面加载
   */

  onLoad(options) {
    app.login().then(res => {
      info().then(infoRes => {
        console.log('infoRes',infoRes)
        //有账号 以及 班级 才能进入页面
        if (infoRes && infoRes.qdUser && infoRes.qdClasses) {
          app.globalData.userInfo = infoRes
          if (infoRes.qdUser.role === 'TEACHER') {
            wx.reLaunch({
              url: '/pages/teacher/home/index',
            })
          } else if (infoRes.qdUser.role === 'STUDENT') {
            wx.reLaunch({
              url: '/pages/student/home/index',
            })
          }
        } else {
          //进入注册页面
          wx.reLaunch({
            url: '/pages/register/index',
          })
        }
      })
    })

  },
  getAuth: function () {
    wx.getSetting({
      success: res => {
        this.setData({
          camera: res.authSetting['scope.camera'],
          writePhotosAlbum: res.authSetting['scope.writePhotosAlbum'],
          userLocation: res.authSetting['scope.userLocation']
        })
      }
    })
  },

  go(e) {
    let {
      type
    } = e.currentTarget.dataset;
    switch (type) {
      case "0":
        wx.navigateTo({
          url: '/pages/menu/menu',
        })
        break
      case "1":
        wx.navigateTo({
          url: '/pages/imgOp/imgOp',
        })
        break
      default:
        wx.showModal({
          title: '错误',
          content: '未知类型',
        })
        break
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    //this.getAuth()
  },

  handleContact(e) {
    //客服事件回调获取到用户所点消息的页面路径 path 和对应的参数 query。
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return shareMsg('签到系统', '/pages/index/index', '../../image/bg.jpg');
  },

  onShareTimeline() {
    // 绑定分享参数
    wx.onShareTimeline(() => {
      return {
        title: '签到系统',
        imageUrl: '../../image/bg.jpg',
      }
    })
  },

})