// pages/teacher/signUpdate/index.js
const { dateTimePicker } = require('../../../utils/dateTimePicker.js')
const mini = require('../../../utils/mini.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    formData: {
      name: '',
      latitude: '',
      longitude: '',
      address: '',
      distance: 100,
      deadline: null
    },
    dateTimeArray: null,
    dateTimeIndex: null,
    deadlineText: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initDateTimePicker()
    
    if (options.id) {
      this.setData({ id: options.id })
      this.fetchTaskDetail(options.id)
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

  },

  // 任务名称输入处理
  onNameInput(e) {
    this.setData({
      'formData.name': e.detail.value
    })
  },

  // 选择位置
  chooseLocations() {
    const that = this;
    // 先获取位置权限
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation']) {
          // 如果没有位置权限，则请求权限
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => {
              that.openLocationChooser();
            },
            fail: () => {
              wx.showModal({
                title: '需要位置权限',
                content: '请在设置中允许使用位置权限',
                confirmText: '去设置',
                success: (res) => {
                  if (res.confirm) {
                    wx.openSetting();
                  }
                }
              });
            }
          });
        } else {
          // 已有权限，直接打开选择器
          that.openLocationChooser();
        }
      },
      fail: () => {
        wx.showToast({
          title: '获取权限失败',
          icon: 'none'
        });
      }
    });
  },

  // 打开位置选择器
  openLocationChooser() {
    wx.chooseLocation({
      success: (res) => {
        console.log('位置选择成功：', res);
        if (res.latitude && res.longitude) {
          this.setData({
            'formData.latitude': res.latitude.toString(),
            'formData.longitude': res.longitude.toString(),
            'formData.address': res.name || res.address || '未知地点'
          });
        }
      },
      fail: (err) => {
        console.error('选择位置失败', err);
        // 判断是否是用户取消选择
        if (err.errMsg.indexOf('cancel') === -1) {
          wx.showToast({
            title: '选择位置失败',
            icon: 'none'
          });
        }
      }
    });
  },

  // 修改打卡范围
  onDistanceChange(e) {
    this.setData({
      'formData.distance': e.detail.value
    });
  },

  // 初始化时间选择器
  initDateTimePicker() {
    // 获取当前时间
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();

    // 设置最小时间为当前时间
    const minDate = new Date();

    // 设置最大时间为一年后
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    // 如果表单中已有截止时间，则使用表单中的时间
    let defaultDate = null;
    if (this.data.formData.deadline) {
      defaultDate = new Date(this.data.formData.deadline * 1000);
    }

    const picker = dateTimePicker(minDate.getFullYear(), maxDate.getFullYear(), defaultDate || minDate);
    this.setData({
      dateTimeArray: picker.dateTimeArray,
      dateTimeIndex: picker.dateTimeIndex
    });
  },

  // 优化截止时间选择
  onDeadlineChange(e) {
    const { dateTimeArray } = this.data
    const { value } = e.detail
    
    // 构建时间对象
    const year = parseInt(dateTimeArray[0][value[0]])
    const month = parseInt(dateTimeArray[1][value[1]]) - 1 // 月份需要减1
    const day = parseInt(dateTimeArray[2][value[2]])
    const hour = parseInt(dateTimeArray[3][value[3]])
    const minute = parseInt(dateTimeArray[4][value[4]])
    
    const date = new Date(year, month, day, hour, minute)
    const now = new Date()

    // 验证选择的时间是否有效
    if (date.getTime() <= now.getTime()) {
      wx.showToast({
        title: '截止时间必须大于当前时间',
        icon: 'none'
      })
      return
    }

    const timestamp = date.getTime()
    const deadlineText = this.formatDeadline(timestamp)

    this.setData({
      dateTimeIndex: value,
      'formData.deadline': timestamp,
      deadlineText
    })
  },

  // 优化时间列变化处理
  onDeadlineColumnChange(e) {
    const { column, value } = e.detail
    const { dateTimeArray, dateTimeIndex } = this.data
    
    // 更新当前列的索引
    dateTimeIndex[column] = value

    // 如果修改的是年或月，需要重新计算天数
    if (column === 0 || column === 1) {
      const year = dateTimeArray[0][dateTimeIndex[0]]
      const month = dateTimeArray[1][dateTimeIndex[1]]
      const days = this.getDaysInMonth(year, month)
      
      // 更新天数数组
      const dayArr = []
      for (let i = 1; i <= days; i++) {
        dayArr.push(i)
      }
      
      // 如果当前选择的日期超出了新的天数范围，重置为最后一天
      if (dateTimeIndex[2] >= dayArr.length) {
        dateTimeIndex[2] = dayArr.length - 1
      }
      
      // 更新天数数组
      dateTimeArray[2] = dayArr
    }

    this.setData({
      dateTimeArray,
      dateTimeIndex
    })
  },

  // 获取指定年月的天数
  getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate()
  },

  // 优化时间格式化显示
  formatDeadline(timestamp) {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const now = new Date()
    const diffDays = Math.floor((date - now) / (1000 * 60 * 60 * 24))
    
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')
    
    let timeText = `${year}年${month}月${day}日 ${hour}:${minute}`
    
    // 添加相对时间提示
    if (diffDays === 0) {
      timeText += ' (今天)'
    } else if (diffDays === 1) {
      timeText += ' (明天)'
    } else if (diffDays > 1 && diffDays <= 7) {
      timeText += ` (${diffDays}天后)`
    }
    
    return timeText
  },

    // 获取任务详情
  fetchTaskDetail(id) {
    wx.showLoading({ title: '加载中' })
    mini.get(`sign/${id}/detail`).then(res => {
      // 检查截止时间是否已过
      if (res.deadline && res.deadline < Date.now()) {
        wx.showModal({
          title: '提示',
          content: '该任务已过截止时间，无法修改',
          showCancel: false,
          success: () => {
            wx.navigateBack()
          }
        })
        return
      }

      this.setData({
        formData: {
          name: res.title,
          latitude: res.latitude,
          longitude: res.longitude,
          address: res.address,
          distance: res.distance,
          deadline: res.deadline
        },
        deadlineText: this.formatDeadline(res.deadline)
      })
      wx.hideLoading()
    })
  },

  // 表单提交
  async onSubmit() {
    const { formData, id } = this.data
    
    // 表单验证
    if (!formData.name.trim()) {
      return wx.showToast({
        title: '请输入任务名称',
        icon: 'none'
      })
    }
    if (!formData.latitude || !formData.longitude) {
      return wx.showToast({
        title: '请选择打卡位置',
        icon: 'none'
      })
    }
    if (!formData.deadline) {
      return wx.showToast({
        title: '请选择截止时间',
        icon: 'none'
      })
    }

    // 检查截止时间
    if (id && formData.deadline < Date.now()) {
      return wx.showToast({
        title: '已过截止时间，无法修改',
        icon: 'none'
      })
    }

    if (formData.deadline < Date.now()) {
      return wx.showToast({
        title: '请设置合理的截止时间',
        icon: 'none'
      })
    }

    wx.showLoading({ title: '提交中' })

    const params = {
      id: this.data.id,
      longitude: this.data.formData.longitude,
      latitude: this.data.formData.latitude,
      distance: this.data.formData.distance,
      deadline: this.data.formData.deadline,
      address: this.data.formData.address,
      title: this.data.formData.name,
      qdClassId: app.globalData.qdClassId
    }
    mini.post('sign/save', params).then(res => {
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    })
  }
})