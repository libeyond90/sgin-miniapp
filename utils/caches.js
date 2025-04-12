let gpt_key = "video_gpt";//gpt 使用次数缓存key
let gpt_defult_counts = 10;

const caches = {

  //获取gpt次数
  getCounts(){
    return new Promise((resolve, reject) => {
      const res = this.getSync(gpt_key);
        if(!res){
          this.setSync(gpt_key,gpt_defult_counts).then(res=>{
            this.counts();
          })
        }else{
          resolve(parseInt(res))
        }
    })
    // return new Promise((resolve, reject) => {
    //    this.getSync(gpt_key).then(res=>{       
    //      if(!res){
    //       //如果取不到缓存就set 初始值10次
    //       this.setSync(gpt_key,gpt_defult_counts).then(res=>{
    //         //然后再取出
    //         this.counts();
    //       })
    //      }else{
    //       //反之直接赋值
    //       resolve(parseInt(res))
    //      }
    //    })
    // })
  },

  get(key){
    return new Promise((resolve, reject) => {
      wx.getStorageSync({
        key:gpt_key,
        success: function(res) {
         resolve(res.data)
       },
       fail: function() {
         wx.showModal({
           title: '提示',
           content: '获取缓存失败，请联系管理员',
         })
       }
      })
    })
  },

  set(key,value){
    return new Promise((resolve, reject) => {
      wx.setStorage({
        key:key,
        data:value,
        success: function() {
          console.log('写入value1成功')
          resolve()
        },
        fail: function(err) {
          wx.showModal({
            title: '提示',
            content: '写入缓存失败，请联系管理员：'+err,
          })
        }
      })
    })
  },

  getSync(key){
    try{
      // 同步接口立即返回值
      const value = wx.getStorageSync(key)
      console.log('获取key：'+value)
      return value;
    }catch (e) {
      wx.showModal({
        title: '提示',
        content: '获取缓存失败，请联系管理员：'+e,
      })
    }
  },

  setSync(key,value){
    try{
      wx.setStorageSync(key, value)
      console.log('设置缓存成功：'+value)
    }catch (e) {
      wx.showModal({
        title: '提示',
        content: '写入缓存失败，请联系管理员：'+e,
      })
    }
  }


}

module.exports = caches;