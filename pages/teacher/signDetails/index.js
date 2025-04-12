// pages/teacher/signDetails/index.js
const app = getApp()
const mini = require('../../../utils/mini.js')
import {formatTime} from '../../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scount:0,
    signid:'',
    taskDetail: {},
    signList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.setData({
      scount:app.globalData.classCounts.scount || 0,
      signid:options.signid
    })
    // 获取任务详情和签到列表
    this.fetchTaskDetail()
    this.fetchSignList()
    //this.fetchData()
  },

  // async fetchData() {
  //   const [detail, signList] = await Promise.all([
  //     mini.get(`/sign/${this.data.signid}/detail`),
  //     mini.get(`/sign/${app.globalData.qdClassId}/signInList`)
  //   ]);
  //   this.setData({
  //     taskDetail: detail,
  //     signList: signList || [],
  //   });
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('show')
    if(this.data.signid){
      this.fetchTaskDetail()
    }
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
    Promise.all([
      this.fetchTaskDetail(),
      this.fetchSignList()
    ]).finally(() => {
      wx.stopPullDownRefresh()
    })
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

  },

  // 获取任务详情
  fetchTaskDetail() {
    wx.showLoading({ title: '加载中' })
    mini.get(`sign/${this.data.signid}/detail`).then(res => {
      this.setData({
        taskDetail: res
      })
      wx.hideLoading()
    })
  },

  // 获取签到列表
  fetchSignList() {
    mini.get(`sign/${this.data.signid}/signInList`).then(res => {
      this.setData({
        signList: res || []
      })
    })
  },

  // 编辑任务
  onEditTask() {
    wx.navigateTo({
      url: `/pages/teacher/signUpdate/index?id=${this.data.taskDetail.id}`
    })
  },

  // 删除签到任务
  onDelete() {
    wx.showModal({
      title: '提示',
      content: '确定要删除该签到任务吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '删除中' })
          mini.post(`sign/${this.data.signid}/deletes`).then(() => {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1500
            })
            setTimeout(() => {
              wx.navigateBack()
            }, 1500)
          }).catch(err => {
            wx.showToast({
              title: '删除失败',
              icon: 'error'
            })
          }).finally(() => {
            wx.hideLoading()
          })
        }
      }
    })
  }
})