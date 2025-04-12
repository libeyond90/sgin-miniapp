// pages/index/index.js
let app = getApp()
const {
  get,
  post,
  form
} = require('../../utils/mini.js')

const config = require('../../utils/config.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  go(e){
    let {
      type
    } = e.currentTarget.dataset;
    switch(type){
      case "1":
        wx.navigateTo({
          url: '/pages/index/index',
        })
        break
      case "2":
        wx.navigateTo({
          url: '/pages/gpt/index/index',
        })
        break
        case "3":
          wx.openChannelsUserProfile({
            finderUserName: 'sphMzhLn1hQaIoA',
            success(res){
              console.log('成功',res)
            },
            fail(err){
              console.log('失败',res)
            }
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
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

  }
})