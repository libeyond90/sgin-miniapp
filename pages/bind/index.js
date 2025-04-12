// pages/bind/index.js
const mini = require('../../utils/mini.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    role: '',
    formData: {
      name: '',
      sex: '1',
      mobile: '',
      position: '',
      subject: '',
      className: '',
      classId: ''
    },
    classList: [], // 班级列表
    classIndex: 0
  },

  onSubmit(e) {
    const formData = e.detail.value;
    
    // 表单验证
    if (!formData.name.trim()) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      });
      return;
    }
    
    if (!formData.position.trim()) {
      wx.showToast({
        title: '请输入职务',
        icon: 'none'
      });
      return;
    }

    // 提交表单数据
    wx.showLoading({
      title: '提交中...'
    });

    // 这里添加你的表单提交逻辑
    // 例如调用后端API
    console.log('表单数据：', formData);

    // 模拟提交成功
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          // 提交成功后的跳转逻辑
          setTimeout(() => {
            wx.navigateBack();
          }, 2000);
        }
      });
    }, 1500);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { role } = options;
    // 确保角色值为大写
    const upperRole = role.toUpperCase();
    this.setData({ 
      role: upperRole,
      'formData.role': upperRole
    });
    
    if (upperRole === 'STUDENT') {
      this.fetchClassList();
    }
  },

  // 获取班级列表
  async fetchClassList() {
    try {
      // TODO: 调用获取班级列表的API
      const classList = [
        { id: '1', name: '计算机科学与技术1班' },
        { id: '2', name: '计算机科学与技术2班' }
      ];
      this.setData({ classList });
    } catch (error) {
      console.error('获取班级列表失败：', error);
      wx.showToast({
        title: '获取班级列表失败',
        icon: 'none'
      });
    }
  },

  // 性别选择改变
  onGenderChange(e) {
    this.setData({
      'formData.sex': e.detail.value
    });
  },

  // 班级选择改变
  onClassChange(e) {
    const index = e.detail.value;
    const classId = this.data.classList[index].id;
    this.setData({
      classIndex: index,
      'formData.classId': classId
    });
  },

  // 表单提交
  async onSubmit(e) {
    const formData = e.detail.value;
    formData.role = this.data.role; // 添加角色信息

    // 表单验证
    if (!this.validateForm(formData)) {
      return;
    }

    wx.showLoading({
      title: '提交中...',
      mask: true
    });

    try {
      // 使用 mini.js 的 post 方法调用接口
      const result = await mini.post('register/bind', formData);
      
      wx.hideLoading();
      wx.showToast({
        title: '绑定成功',
        icon: 'success',
        duration: 2000
      });

      // 延迟返回上一页
      wx.reLaunch({
        url: '/pages/index/index',
      })

    } catch (error) {
      console.error('绑定失败：', error);
      // mini.js 会自动处理错误提示，这里不需要额外处理
    }
  },

  // 表单验证
  validateForm(formData) {
    const { role } = this.data;

    if (!formData.name.trim()) {
      this.showError('请输入姓名');
      return false;
    }

    if (!formData.sex) {
      this.showError('请选择性别');
      return false;
    }

    if (role === 'TEACHER') {
      if (!formData.mobile) {
        this.showError('请输入手机号');
        return false;
      }

      if (!/^1[3-9]\d{9}$/.test(formData.mobile)) {
        this.showError('请输入正确的手机号');
        return false;
      }

      if (!formData.position.trim()) {
        this.showError('请输入职务');
        return false;
      }

      if (!formData.subject.trim()) {
        this.showError('请输入专业');
        return false;
      }

      if (!formData.className.trim()) {
        this.showError('请输入班级');
        return false;
      }
    }

    if (role === 'STUDENT') {
      if (!formData.classId) {
        this.showError('请输入班级ID');
        return false;
      }

      if (!/^\d+$/.test(formData.classId)) {
        this.showError('班级ID必须为数字');
        return false;
      }
    }

    return true;
  },

  // 显示错误提示
  showError(message) {
    wx.showToast({
      title: message,
      icon: 'none'
    });
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