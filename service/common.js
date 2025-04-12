/**
 * 公共接口
 * 
*/
import { get,post,put } from '../utils/mini'
import {
  Config,
  System
} from '../utils/config'
import {
  xf_auth
} from '../utils/xf_auth'

const common ={

  /**
   * 获取访问次数
   */
  getCounts(type){
    return new Promise((resolve, reject) => {
      get(`/common/counts?type=${type}`).then(res=>{
        resolve(res)
      })
    })
  },

    /**
   * 获取访问次数
   */
  seeVideo(type){
    return new Promise((resolve, reject) => {
      put(`/common/seeVideo?type=${type}`).then(res=>{
        resolve(res)
      })
    })
  },

  checkStr(str){
    return new Promise((resolve, reject) => {
      post(`/common/msg_sec_check`,str).then(res=>{
        resolve(res)
      })
    })
  },

  upload(file) {
    return new Promise((resolve, reject) => {
      console.log('file',file)
      wx.uploadFile({
        url: `${Config.API_HOST}/common/uploadCheckSnyFileCopy`, //仅为示例，非真实的接口地址
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

}

module.exports = {
  common
};