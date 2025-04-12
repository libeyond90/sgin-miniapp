Component({
  properties: {
    isShow: {
      type: Boolean,
      value: false
    },
    mediaType:{
      //all  video  image  file
      type:String,
      value:'image'
    },
    // mediaType为file 生效
    extension:{
      type:Array,
      value:[]
    },
    counts:{
      type:Number,
      value:1
    },
    opTypes:{//选择的类型
      type:Array,
      value:['camera','album','msg']
    },
  },
  data: {

  },
  methods: {

    uploadImgTost(){
      const isShow = this.data.isShow?false:true
      this.setData({
        isShow
      })
      this.triggerEvent('updateShowStatus', { isShow});
    },
    //聊天端选择文件
    msgFile(){
      let _this = this
      //pc端判断
      wx.getSystemInfo({
        success: (res) => {
          // 判断是否是PC端
          if (res.platform === 'windows' || res.platform === 'mac') {
            wx.showToast({
              title: '微信不支持pc端选取聊天文件，请移步手机端',
              icon: 'none',
              duration: 2000
            });
            return;
          }
        }
      })
      wx.chooseMessageFile({
        count: 10,
        type: 'image',
        success (res) {
          _this.updateEvent(res.tempFiles)
          _this.uploadImgTost()
        }
      })
    },
    //选择文件
    media(e){
      let _this = this
      const {type} = e.currentTarget.dataset
      console.log('_this.data.mediaType',_this.data.mediaType)
      wx.chooseMedia({
        count: _this.data.counts,
        mediaType: [_this.data.mediaType],//['image','video'],
        sourceType: [`${type}`],
        sizeType:['original'],
        maxDuration: 10,
        camera: 'back',
        success(res) {
          _this.updateEvent(res.tempFiles)
          _this.uploadImgTost()
        }
      })
    },
    //绑定回调方法
    updateEvent(t) {
      this.triggerEvent("updateImageList", {
        list: t
      })
    },
  }
})