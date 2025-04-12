import { get,post,put} from '../utils/mini'



const gpt ={

  /**
   * 取访问apiKey apiSecret appid 加密字符串
   */
  getResult(){
    return new Promise((resolve, reject) => {
      get(`gpt/result`).then(res=>{
        resolve(res)
      })
    })
  },
  apply(){
    return new Promise((resolve, reject) => {
      put(`gpt/apply`).then(res=>{
        resolve(res)
      })
    })
  }

}

module.exports = {
  gpt
};