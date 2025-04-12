// components/writeImg.js
var Utils = require('../../utils/util');
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    //是否展示当前组件，传参是为了重新渲染广告
    showSelectSy: {
      type: Boolean,
      value: false,
    },
    //类型：1是手机拍照，0是上传图片
    type:{
      type:Number,
      value:0
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectSy(e){
      this.triggerEvent('selectSy',e)
    },
    adLoad() {
      console.log('Banner 广告加载成功')
    },
    adError(err) {
      console.error('Banner 广告加载失败', err)
    },
    adClose() {
      console.log('Banner 广告关闭')
    }
    
  },

})