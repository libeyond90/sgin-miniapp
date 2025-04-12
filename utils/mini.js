
import { Config, System } from 'config'
import { xf_auth } from 'xf_auth.js'


//微信接口工具

const mini = {

    request: ({ url, data = {}, header = { 'Content-type': 'application/json' }, method = "GET", dataType = "json", responseType = "text", enableHttp2 = false, enableQuic = false, enableCache = false }) => {

        return new Promise((resolve, reject) => {
            header = Object.assign(header, {
                'Environment': System.environment,
                'aut':xf_auth.certificate(),
                'openid':wx.getStorageSync('aut')
            })

            //${System.environment}
            wx.request({
                url: `${Config.API_HOST}/${url}`, //开发者服务器接口地址
                data,           //请求的参数
                header: header, //设置请求的 header，header 中不能设置 Referer。 content-type 默认为 application/json
                timeout: 15000,  //超时时间，单位为毫秒
                method,         //HTTP 请求方法。OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                dataType,       //返回的数据格式, 非json,则不对返回的内容进行 JSON.parse
                responseType,   //响应的数据类型。text, arraybuffer
                enableHttp2,    //开启 http2
                enableQuic,     //开启 quic
                enableCache,    //开启 cache
                success: function (res) {
                    if (res.data.code == 0) {
                        resolve(res.data.data)
                        return;
                    }
                    //reject(res.data)
                    toError(res.data.msg)
                    // console.error(Config.API_HOST + url, res.data);
                },
                fail: function (res) {
                    reject(res)
                    toMain();
                    console.error(Config.API_HOST + url, res);
                }
            })
        })
    },

    request2: ({ url, data = {}, header = { 'Content-type': 'application/json' }, method = "GET", dataType = "json", responseType = "text", enableHttp2 = false, enableQuic = false, enableCache = false }) => {

      return new Promise((resolve, reject) => {
          header = Object.assign(header, {
              'Environment': System.environment
          })

          wx.request({
              url: `${url}`, //开发者服务器接口地址
              data,           //请求的参数
              header: header, //设置请求的 header，header 中不能设置 Referer。 content-type 默认为 application/json
              timeout: 15000,  //超时时间，单位为毫秒
              method,         //HTTP 请求方法。OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              dataType,       //返回的数据格式, 非json,则不对返回的内容进行 JSON.parse
              responseType,   //响应的数据类型。text, arraybuffer
              enableHttp2,    //开启 http2
              enableQuic,     //开启 quic
              enableCache,    //开启 cache
              success: function (res) {
                  resolve(res.data)
                  // console.error(Config.API_HOST + url, res.data);
              },
              fail: function (res) {
                  //reject(res)
                  //console.log('网络接口调用失败')
                  toMain();
                  //console.error(Config.API_HOST + url, res);
              }
          })
      })
  },

    //自定义头请求
    getOther: (url, data) => mini.request2({ url, data, method: "GET" }), 
    postOther: (url, data) => mini.request2({ url, data, method: "POST" }),

    get: (url, data) => mini.request({ url, data, method: "GET" }), //有非默认值的参数需求可自行修改
    post: (url, data) => mini.request({ url, data, method: "POST" }),
    put: (url, data) => mini.request({ url, data, method: "PUT" }),
    delete: (url, data) => mini.request({ url, data, method: "DELETE" }),
    form: (url, data) => mini.request({ url, data, header: { 'Content-type': 'application/x-www-form-urlencoded' }, method: "POST" }),


}

const toMain = function () {
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

const toError = function (msg) {
  wx.hideLoading({
      complete: (res) => {},
  })
  wx.showModal({
      complete: (res) => {},
      confirmText: '确定',
      content: msg,
      fail: (res) => {},
      showCancel: false,
      success: (result) => {
      },
      title: '错误',
  })
}


module.exports = mini;