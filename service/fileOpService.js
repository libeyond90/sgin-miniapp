import {
  Config,
  System
} from '../utils/config'
import {
  xf_auth
} from '../utils/xf_auth'

const fileOpService ={

  

  toType(file){
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${Config.API_HOST}/ocr/to/${file.index}`, //仅为示例，非真实的接口地址
        filePath: file.src,
        name: 'file',
        header: {
          'Environment': System.environment,
          'aut':xf_auth.certificate(),
          'openid':wx.getStorageSync('aut')
          // 'aut': 'RuoYouShiWu',
          // 'openid': 'o8umZ6xA6i_BA8e8aSgUbPBcwpy4',
          // 'Environment': 'wechat'
        },
        formData:{
          filename:file.filename,
          password:file.password,
          type:file.index
        },
        success (res){
          console.log(res)
          const result = JSON.parse(res.data)
          if(result.code == 0){
            resolve(result.data);
          }else{
            toMain(result.msg)
          }
        },fail(err){
          console.log(err)
          toMain()
        }
      })
    })
  },

  upload(file){
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${Config.API_HOST}/fileOp/${file.type}/convertsFiles`, //仅为示例，非真实的接口地址
        filePath: file.src,
        name: 'file',
        header: {
          'Environment': System.environment,
          'aut':xf_auth.certificate(),
          'openid':wx.getStorageSync('aut')
          // 'aut': 'RuoYouShiWu',
          // 'openid': 'o8umZ6xA6i_BA8e8aSgUbPBcwpy4',
          // 'Environment': 'wechat'
        },
        formData:{
          filename:file.filename,
          password:file.password,
          type:file.index
        },
        success (res){
          console.log(res)
          const result = JSON.parse(res.data)
          
          if(result.code == 0){
            resolve(result.data);
          }else{
            toMain(result.msg)
          }
        },fail(err){
          console.log(err)
          toMain()
        }
      })
    })
  },

}


const toMain = function (title) {
  wx.hideLoading({
      complete: (res) => {},
  })
  wx.showToast({
    icon:'none',
    title: title?title:'服务器异常，请检查网络',
  })
}

module.exports = {
  fileOpService
};