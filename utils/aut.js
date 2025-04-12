//全局授权，拒绝时，直接跳转到设置页
export const setting = (scope) =>{
  let _wx = wx;
  return new Promise((resolve,reject) => {
    //获取授权信息
    _wx.getSetting({
      success(res) {
        console.log(res)
        //未授权
        if (!res.authSetting[scope]) {
          //进行授权
          _wx.authorize({
            scope: scope,
            success: (res) => {
              console.log('success',res)
              resolve('ok');
            },
            fail:(e)=>{
              console.log('fail',e)
              //授权被拒绝的话
              if(e.errMsg.indexOf("auth deny") != -1){
                _wx.showModal({
                  title:'提示',
                  content:'您拒绝了授权，是否打开设置页面进行授权',
                  success(res){
                    if(res.confirm){
                        wx.openSetting({
                          success(res){
                            console.log(scope,res)
                            resolve('ok');
                          }
                        })
                    }else{
                      reject('fail')
                    }
                  }
                })
              }
            }
          })
        }else{
          resolve('ok');
        }
      }
    })
  })
}

module.exports = {
  setting
}