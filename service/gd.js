import { getOther } from '../utils/mini'
import { Config } from '../utils/config'


const gd ={

/**
 * 转换高德地图经纬度
 * */
convertLocations(latitude,longitude){
  return new Promise((resolve, reject) => {
    const locations = latitude+","+longitude
    getOther(`https://restapi.amap.com/v3/assistant/coordinate/convert?locations=${locations}&coordsys=gps&output=json&key=${Config.GD_KEY}`).then(res=>{    
      if(status(res)){
        const splitStr = res.locations.split(',');
        res.latitude = splitStr[0]
        res.longitude = splitStr[1]
        resolve(res)
        console.log('经纬度解析',res) 
      }else{
          wx.showToast({
            title: '经纬度解析有误',
            icon:'error'
          })
        }
      })
    }) 
  },

  address(locations){
    return new Promise((resolve, reject) => {
      getOther(`https://restapi.amap.com/v3/geocode/regeo?output=json&location=${locations}&key=${Config.GD_KEY}&radius=1000&extensions=base`).then(res=>{
        console.log('获取地址',res) 
        if(status(res)){
          resolve(res)
        }else{
          wx.showToast({
            title: '地址解析有误',
            icon:'error'
          })
        }
      })
    })
  },

   weather(code){
    return new Promise((resolve, reject) => {
      getOther(`https://restapi.amap.com/v3/weather/weatherInfo?parameters&key=${Config.GD_KEY}&city=${code}&extensions=base&output=JSON`).then(res=>{
        if(status(res)){
          resolve(res)
        }else{
          wx.showToast({
            title: '天气获取有误',
            icon:'error'
          })
        }
      })
    })
  },
},

  /**
   * 高德地图api 接口判断是否调用成功
   * 
  */
 status = (res) => {
  if(res && res.status && res.status === "1"){
    return true;
  }
  return false;
}










module.exports = {
  gd
};