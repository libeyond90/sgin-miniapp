import { common } from '../service/common'

/**
 * 激励广告
 * 
*/

let rewardedVideoAd = null //广告实例
let tag = 0;//功能类型
let creatSuccess = false
class jl {

  /**
 * 初始化广告加载
 * @param tag 功能
 * @param callback 成功看完回调
 * @param failBack 没看完回调
 * @returns {string} base64编码后的密文
 */
  gdInit(tag,callback,failBack){
    console.log('创建广告实例')
    //tag = tag;
    if(wx.createRewardedVideoAd){
      rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: 'adunit-e5e385b3fa689068' })
      rewardedVideoAd.onLoad(() => {
        console.log('激励视频 广告加载成功')
        creatSuccess = true;
      })

      rewardedVideoAd.onError((err) => {
        console.log('激励视频 广告拉取失败', err)
        wx.showToast({
          icon:'none',
          title: '广告拉取失败'+JSON.stringify(err),
        })
      })
      rewardedVideoAd.onClose((res) => {
        console.log('关闭广告', res)
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
          // common.seeVideo(tag).then(res=>{
          //   //回调
          //   console.log('回调',callback)
          //   callback(res);
          //   //提示
          //   wx.showModal({
          //     title: '提示',
          //     content: '成功获取使用次数,剩余使用次数('+res+')',
          //     showCancel: false,
          //     complete: (res) => {
          //     }
          //   })
          // })
          callback(res);
        } else {
          //失败回调
          failBack();
        }
      })
    }
  }

  //返回次数
  showVideo(){
    //创建失败则
    if(!creatSuccess){
      //手动拉取
      rewardedVideoAd.show()
      .catch(() => {
          rewardedVideoAd.load()
          .then(() => rewardedVideoAd.show())
          .catch(err => {
            console.log('播放失败：'+err)
          // 正常播放结束，可以下发游戏奖励
          common.seeVideo(tag).then(res=>{
            counts = res;
            // 播放中途退出，不下发游戏奖励
            wx.showModal({
              title: '提示',
              content: '广告拉取失败，为了不影响使用还是奖励额外次数：'+counts,
              showCancel: false,
              complete: (res) => {
                if (res.cancel) {   
                  resolve(counts)
                }
              }
            })
          })
        })
      })
    }else{
      rewardedVideoAd.load()
      .then(() => rewardedVideoAd.show()).catch(err=>{
        console.log('播放失败：'+err)
      })
    }   
  }
}


module.exports = {
  jl:new jl()
}