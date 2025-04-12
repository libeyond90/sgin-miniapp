import { get,post,put } from '../utils/mini'
import {
  Config,
  System
} from '../utils/config'
import {
  xf_auth
} from '../utils/xf_auth'

const imgOpService ={

  toStrList(params){
    return new Promise((resolve, reject) => {
      post('ocr/toStrList',params).then(res=>{
        resolve(res)
      })
    })
  },

  toFile(params){
    return new Promise((resolve, reject) => {
      post('ocr/to',params).then(res=>{
        resolve(res)
      })
    })
  },
  toDyPdf(params){
    return new Promise((resolve, reject) => {
      post('fileOp/imageTo',params).then(res=>{
        resolve(res)
      })
    })
  },
  toExcel(params){
    return new Promise((resolve, reject) => {
      post('ocr/toExcel',params).then(res=>{
        resolve(res)
      })
    })
  },

  uploads(files){
        // 将图片数组映射为上传 Promise
        console.log('files',files)
        const uploadPromises = files.map(image => this.uploadImage(image.src));
        // 使用 Promise.all 处理所有上传 Promise
        return Promise.all(uploadPromises);
  },

  uploadImage(file){
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${Config.API_HOST}/imgOp/upload`, //仅为示例，非真实的接口地址
        filePath: file,
        name: 'file',
        header: {
          'Environment': System.environment,
          'aut': xf_auth.certificate(),
          'openid': wx.getStorageSync('aut')
        },
        success(res) {
          const result = JSON.parse(res.data)
          if(result.code == 0){
            resolve(result.data);
          }else{
            toMain(result.msg)
          }
        },
        fail(err) {
          toMain()
        }
      })
    })
  },


    /**
   * 图片操作
   * formData{
   *  suffix 更改格式
   *  mirr 镜像 X水平  Y垂直
   * }
   */
  op(file,formData) {
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '图片正在处理中，请耐心等待',
      })
      let _this = this;
      wx.uploadFile({
        url: `${Config.API_HOST}/imgOp/op`,
        // url: `${Config.API_HOST}/common/uploadCheckSny`, //仅为示例，非真实的接口地址
        filePath: file,
        name: 'file',
        header: {
          'Environment': System.environment,
          'aut': xf_auth.certificate(),
          'openid': wx.getStorageSync('aut')
        },
        formData,
        success(res) {
          let result = JSON.parse(res.data)
          console.log(result)
          if (result.code == 0) {
            //获取到微信异步id
            resolve(result.data)
            wx.hideLoading()
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
          if(err.errno == 600001){
            wx.showToast({
              icon:'none',
              title: '图片大小超出默认设置，请联系管理员',
            })
          }else{
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

        }
      })
    })
  },

  compress(file,ws) {
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '图片正在处理中，请耐心等待',
      })
      let _this = this;
      wx.uploadFile({
        url: `${Config.API_HOST}/imgOp/compress?ws=${ws}`,
        // url: `${Config.API_HOST}/common/uploadCheckSny`, //仅为示例，非真实的接口地址
        filePath: file,
        name: 'file',
        header: {
          'Environment': System.environment,
          'aut': xf_auth.certificate(),
          'openid': wx.getStorageSync('aut')
        },
        success(res) {
          let result = JSON.parse(res.data)
          console.log(result)
          if (result.code == 0) {
            //获取到微信异步id
            resolve(result.data)
            wx.hideLoading()
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

        // post(`/imgOp/compress`,file).then(res => {
        //   resolve(res)
        // })

    })
  },

  

}

module.exports = {
  imgOpService
};