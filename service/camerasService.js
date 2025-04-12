import {
  get,
  post
} from '../utils/mini'
import {
  Config,
  System
} from '../utils/config'
import {
  xf_auth
} from '../utils/xf_auth'


const camerasService = {

  upload(file) {
    return new Promise((resolve, reject) => {

      wx.uploadFile({
        url: `${Config.API_HOST}/common/upload`, //仅为示例，非真实的接口地址
        filePath: file,
        name: 'file',
        header: {
          'Environment': System.environment,
          'aut': xf_auth.certificate(),
          'openid': wx.getStorageSync('aut')
        },
        success(res) {
          console.log(res)
          const result = JSON.parse(res.data)
          if (result.code == 0) {
            wx.hideLoading()
            resolve(result.data);
          } else {
            wx.hideLoading()
            wx.showModal({
              complete: (res) => {},
              confirmText: '确定',
              content: result.msg,
              fail: (res) => {},
              showCancel: false,
              success: (result) => {},
              title: '错误',
            })
          }
        },
        fail(err) {
          wx.hideLoading({
            complete: (res) => {},
          })
          wx.showModal({
            complete: (res) => {},
            confirmText: '重试',
            content: '无法连接服务器，请检查您的网络',
            fail: (res) => {},
            showCancel: false,
            success: (result) => {

            },
            title: '错误',
          })
        }
      })
    })
  },

  

  uploadCheck(file) {
    return new Promise((resolve, reject) => {
      let _this = this;
      wx.uploadFile({
        url: `${Config.API_HOST}/common/uploadCheckSny`,
        // url: `${Config.API_HOST}/common/uploadCheckSny`, //仅为示例，非真实的接口地址
        filePath: file,
        name: 'file',
        header: {
          'Environment': System.environment,
          'aut': xf_auth.certificate(),
          'openid': wx.getStorageSync('aut')
        },
        success(res) {
          const result = JSON.parse(res.data)
          console.log('result',result)
          if (result.code == 0) {
            _this.getImageStatus(result.data.trace_id).then(imgStatus=>{
              if(!imgStatus){
                wx.hideLoading();
                wx.showToast({
                  icon:'none',
                  title: '图片检测不合格',
                })
                reject(false)
              }else{
                resolve(result.data.url)
              }
            })
            //获取到微信异步id
            // let trace_id = result.data.trace_id;
            // let url = result.data.url;
            // const result = {
            //   url:url,
            //   trace_id:trace_id
            // }
            // resolve(result)
          } else {
            wx.hideLoading()
            wx.showToast({
              icon:'none',
              title: '图片上传失败',
            })
          }
        },
        fail(err) {
          console.log(err)
          wx.hideLoading({
            complete: (res) => {},
          })
          wx.showModal({
            complete: (res) => {},
            confirmText: '重试',
            content: '无法连接服务器，请检查您的网络',
            fail: (res) => {},
            showCancel: false,
            success: (result) => {

            },
            title: '错误',
          })
        }
      })
    })
  },

  getImageStatus(id){
    return new Promise((resolve, reject) => {
      get(`/wechat/getImageStatus?trace_id=${id}`).then(res => {
        resolve(res)
      })
    })
  },

  watermark(params) {
    return new Promise((resolve, reject) => {
      post(`camera/watermark`, params).then(res => {
        console.log('生成成功', res)
        resolve(res);
      })
    })
  }

}










module.exports = {
  camerasService
};