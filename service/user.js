import { get,post,put} from '../utils/mini'

function info(){
  return new Promise((resolve, reject) => {
    get('user/info').then(res=>{
      resolve(res)
    })
  })
}

module.exports = {
  info
};