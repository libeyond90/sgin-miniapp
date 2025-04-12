Component({
  properties: {
    // 导航类型：home-首页，back-返回
    navType: {
      type: String,
      value: ''
    },
    // 标题
    title: {
      type: String,
      value: ''
    },
    // 是否显示底部边框
    showBorder: {
      type: Boolean,
      value: false
    }
  },

  data: {
    // 状态栏高度
    statusBarHeight: 0,
    // 导航栏高度
    navBarHeight: 0,
    // 胶囊按钮信息
    menuButtonInfo: null
  },

  lifetimes: {
    attached() {
      // 获取系统信息
      const systemInfo = wx.getSystemInfoSync();
      // 获取胶囊按钮位置信息
      const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
      
      this.setData({
        statusBarHeight: systemInfo.statusBarHeight,
        menuButtonInfo,
        // 导航栏高度 = 胶囊按钮顶部距离 + 胶囊按钮高度 + 5
        navBarHeight: menuButtonInfo.top + menuButtonInfo.height + 5
      });
    }
  },

  methods: {
    // 返回上一页
    handleBack() {
      wx.navigateBack({
        fail: () => {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      });
    },

    // 返回首页
    handleHome() {
      wx.reLaunch({
        url: '/pages/index/index'
      })
    }
  }
});

