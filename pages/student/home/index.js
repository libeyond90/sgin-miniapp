// pages/teacher/home/index.js
const app = getApp()
const mini = require('../../../utils/mini.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      name: '',
      position: ''
    },
    currentClass: {},
    taskList: [],
    filteredTaskList: [],
    signIn: 2, // 当前选中的状态筛选
    classCounts: {
      tcount: 0,
      scount: 0
    },
  },

  onTaskTap(e){
    console.log('e',e)
    const {id} = e.currentTarget.dataset.task
    wx.navigateTo({
      url: `/pages/student/signDetails/index?signid=${id}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
    // if (app.qdClassId) {
    //   this.fetchTaskList() // 每次显示页面时刷新列表
    // } 
    // 获取初始班级的人数统计
  },

  initUserInfo() {
    if (app.globalData.userInfo) {
      const { qdUser, qdClasses } = app.globalData.userInfo
      
      // 设置用户信息
      this.setData({
        userInfo: {
          name: qdUser.name || '',
          position: qdUser.position || ''
        }
      })

      //这里可以加入缓存  如果有缓存取缓存的班级

      // 设置班级信息（默认第一个）
      if (qdClasses && qdClasses.length > 0) {
        app.globalData.qdClassId = qdClasses[0].qdClassId
        this.setData({
          currentClass: {
            id: qdClasses[0].qdClassId,
            name: qdClasses[0].qdClassName,
            subject: qdClasses[0].subject
          }
        })
        // 初始化完班级信息后获取任务列表
        this.fetchTaskList(app.globalData.qdClassId)
        this.getClassCounts(app.globalData.qdClassId);
      }else{
        wx.showToast({
          icon:'error',
          title: '暂无班级',
        })
      }
    }
  },

  // 处理任务状态筛选
  onStatusChange(e) {
    const {type} = e.currentTarget.dataset
    console.log(e.currentTarget.dataset)
    console.log(type)
    this.setData({signIn:Number(type)})
    console.log(Number(type))
    this.fetchTaskList()
  },



  // 获取任务列表
  async fetchTaskList(classId) {
    wx.showLoading({ title: '加载中' })
    const params = {
      signIn:this.data.signIn
    }
    mini.post(`sign/${this.data.currentClass.id}/list`,params).then(res=>{
      this.setData({ taskList: res })
      wx.hideLoading()
    })
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
    this.initUserInfo()
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

  // 下拉刷新
  onPullDownRefresh() {
    const classId = this.data.currentClass.id
    if (classId) {
      this.fetchTaskList(classId).then(() => {
        wx.stopPullDownRefresh()
      })
    } else {
      wx.stopPullDownRefresh()
    }
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

  // 获取班级人数统计
  getClassCounts(classId) {
    mini.get(`/user/classCounts/${classId}`).then(res=>{
      app.globalData.classCounts = res
      this.setData({
        classCounts: res
      })
    })

  },

  // 在选择班级后调用
  onClassChange(e) {
    // ... existing code ...
    this.setData({
      currentClass: selectedClass
    });
    
    // 获取班级人数统计
    this.getClassCounts(selectedClass.id);
    
    // 获取任务列表
    this.getTaskList();
  },

})