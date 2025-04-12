// pages/student/signDetails/index.js
const app = getApp()
const mini = require('../../../utils/mini.js')
const util = require('../../../utils/util.js')
const aut = require('../../../utils/aut.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    signid: '',
    taskDetail: null,
    signStatus: {
      hasSigned: false,
      canSign: false,
      distance: 0,
      remainingTime: ''
    },
    userLocation: {
      latitude: '',
      longitude: ''
    },
    loading: true,
    countdown: {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    },
    countdownTimer: null,
    mapMarkers: [],
    mapCircles: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      signid: options.signid
    })
    this.requestLocationAuth()
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
    // 清除倒计时
    if (this.data.countdownTimer) {
      clearInterval(this.data.countdownTimer)
    }
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

  // 请求位置授权
  requestLocationAuth() {
    aut.setting('scope.userLocation').then(res=>{
      this.getUserLocation()
    }).catch(err=>{
      wx.showToast({
        title: '未获得位置权限',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    })
  },

  // 获取用户位置
  getUserLocation() {
    wx.showLoading({
      title: '获取位置中...'
    })
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          userLocation: {
            latitude: res.latitude,
            longitude: res.longitude
          }
        })
        this.fetchTaskDetail()
      },
      fail: (err) => {
        console.error('获取位置失败', err)
        wx.showToast({
          title: '获取位置失败',
          icon: 'error'
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      }
    })
  },

  // 获取任务详情
  fetchTaskDetail() {
    const { signid } = this.data
    wx.showLoading({
      title: '加载中...'
    })
    
    mini.post(`sign/${signid}/studentSignDetails`).then(res => {
      console.log('任务详情：', res)
      
      // 判断签到状态
      const hasSigned = res.qdSignLog != null
      const now = new Date().getTime()
      const deadline = new Date(res.qdSign.deadline).getTime()
      const isExpired = deadline < now
      
      // 计算用户与打卡点的距离
      const distance = this.calculateDistance(
        this.data.userLocation.latitude,
        this.data.userLocation.longitude,
        res.qdSign.latitude,
        res.qdSign.longitude
      )
      
      // 判断是否可以打卡
      const canSign = !hasSigned && !isExpired && distance <= res.qdSign.distance
      
      // 准备地图标记
      const mapMarkers = [
        {
          id: 1,
          latitude: res.qdSign.latitude,
          longitude: res.qdSign.longitude,
          width: 30,
          height: 30,
          iconPath: 'https://apadog.com/u.jpg',
          callout: {
            content: res.qdSign.address,
            fontSize: 12,
            borderRadius: 4,
            padding: 8,
            display: 'ALWAYS'
          }
        },
        {
          id: 2,
          latitude: this.data.userLocation.latitude,
          longitude: this.data.userLocation.longitude,
          iconPath: 'https://apadog.com/u.jpg',
          width: 25,
          height: 25,
          callout: {
            content: '您的位置',
            fontSize: 12,
            borderRadius: 4,
            padding: 8,
            display: 'ALWAYS'
          }
        }
      ]
      
      // 准备地图圆形
      const mapCircles = [
        {
          latitude: res.qdSign.latitude,
          longitude: res.qdSign.longitude,
          radius: res.qdSign.distance,
          color: '#1989fa33',
          strokeColor: '#1989fa',
          strokeWidth: 1
        }
      ]
      
      this.setData({
        taskDetail: res,
        loading: false,
        signStatus: {
          hasSigned,
          canSign,
          distance: Math.round(distance),
          remainingTime: isExpired ? '已过期' : ''
        },
        mapMarkers,
        mapCircles
      })
      
      // 如果未过期，启动倒计时
      if (!isExpired) {
        this.startCountdown(deadline)
      }
      
      wx.hideLoading()
    }).catch(err => {
      console.error('获取任务详情失败：', err)
      wx.showToast({
        title: '获取任务详情失败',
        icon: 'error'
      })
      this.setData({ loading: false })
      wx.hideLoading()
    })
  },
  
  // 计算两个坐标点之间的距离（米）
  calculateDistance(lat1, lng1, lat2, lng2) {
    lat1 = parseFloat(lat1)
    lng1 = parseFloat(lng1)
    lat2 = parseFloat(lat2)
    lng2 = parseFloat(lng2)
    
    const radLat1 = lat1 * Math.PI / 180.0
    const radLat2 = lat2 * Math.PI / 180.0
    const a = radLat1 - radLat2
    const b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2), 2) + 
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b/2), 2)))
    s = s * 6378.137 // 地球半径
    s = Math.round(s * 10000) / 10 // 转换为米
    return s
  },
  
  // 启动倒计时
  startCountdown(endTime) {
    // 清除之前的计时器
    if (this.data.countdownTimer) {
      clearInterval(this.data.countdownTimer)
    }
    
    const calculateRemaining = () => {
      const now = new Date().getTime()
      const remaining = endTime - now
      
      if (remaining <= 0) {
        clearInterval(this.data.countdownTimer)
        this.setData({
          'signStatus.canSign': false,
          'signStatus.remainingTime': '已过期'
        })
        return
      }
      
      // 计算剩余时间
      const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
      const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
      
      this.setData({
        countdown: {
          days,
          hours,
          minutes,
          seconds
        }
      })
    }
    
    // 立即计算一次
    calculateRemaining()
    
    // 设置定时器，每秒更新一次
    const timer = setInterval(calculateRemaining, 1000)
    this.setData({
      countdownTimer: timer
    })
  },
  
  // 执行签到
  onSign() {
    const { signid, taskDetail } = this.data
    
    if (!this.data.signStatus.canSign) {
      let message = '无法签到'
      if (this.data.signStatus.hasSigned) {
        message = '您已完成签到'
      } else if (this.data.signStatus.distance > taskDetail.qdSign.distance) {
        message = `距离超出打卡范围，请靠近打卡点`
      }
      
      wx.showToast({
        title: message,
        icon: 'none'
      })
      return
    }
    
    wx.showLoading({
      title: '获取位置中...'
    })
    
    // 重新获取位置，确保使用最新的位置信息
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true, // 使用高精度定位
      success: (res) => {
        // 获取当前时间
        const now = new Date().getTime()
        const deadline = new Date(taskDetail.qdSign.deadline).getTime()
        
        // 检查是否已过期
        if (deadline < now) {
          wx.hideLoading()
          wx.showToast({
            title: '签到时间已过期',
            icon: 'none'
          })
          return
        }
        
        // 计算最新距离
        const currentDistance = this.calculateDistance(
          res.latitude,
          res.longitude,
          taskDetail.qdSign.latitude,
          taskDetail.qdSign.longitude
        )
        
        // 检查是否在打卡范围内
        if (currentDistance > taskDetail.qdSign.distance) {
          wx.hideLoading()
          wx.showToast({
            title: `距离超出打卡范围(${Math.round(currentDistance)}米)`,
            icon: 'none'
          })
          return
        }
        
        // 使用微信小程序获取位置名称（如果有）
        let address = ''
        if (res.address) {
          address = res.address
        } else if (res.name) {
          address = res.name
        } else {
          // 如果没有位置名称，使用坐标
          address = `位置坐标(${res.latitude.toFixed(6)},${res.longitude.toFixed(6)})`
        }
        
        // 准备签到参数
        const params = {
          qdSignId: signid,
          longitude: res.longitude,
          latitude: res.latitude,
          address: address,
          createTime: now
        }
        
        wx.showLoading({
          title: '签到中...'
        })
        
        // 调用签到接口
        mini.post('signlog/in', params).then(res => {
          wx.showToast({
            title: '签到成功',
            icon: 'success'
          })
          
          // 更新签到状态
          this.setData({
            'signStatus.hasSigned': true,
            'signStatus.canSign': false,
            userLocation: {
              latitude: params.latitude,
              longitude: params.longitude
            }
          })
          
          // 重新获取详情
          setTimeout(() => {
            this.fetchTaskDetail()
          }, 1500)
        }).catch(err => {
          console.error('签到失败：', err)
          wx.showToast({
            title: '签到失败',
            icon: 'error'
          })
        }).finally(() => {
          wx.hideLoading()
        })
      },
      fail: (err) => {
        console.error('获取位置失败', err)
        wx.hideLoading()
        wx.showToast({
          title: '获取位置失败',
          icon: 'none'
        })
      }
    })
  }
})