
//环境配置

class Config {

  constructor(env = 'default') {

      const config = {
          develop: {        
              API_HOST: 'http://192.168.3.2:20000/lizhao',
              IMAGE_HOST: `https://apadog.com`,
              QQMap_KEY:'DWRBZ-IP2W5-2WGID-Q4GWT-7IPUO-LVFEL',
              GD_KEY:'c5dca99a8e7b505e2a7b500f1678a667',
              GD_MAP_KEY:'174c037019679f1e187041526d769a7f',
              DW:"",
              BZ:"备注 ",
          },
          release: {
              API_HOST: 'https://apadog.com/pocketDog',
              IMAGE_HOST: `https://apadog.com`,
              QQMap_KEY:'DWRBZ-IP2W5-2WGID-Q4GWT-7IPUO-LVFEL',
              GD_KEY:'c5dca99a8e7b505e2a7b500f1678a667',
              GD_MAP_KEY:'174c037019679f1e187041526d769a7f',
              DW:"",
              BZ:"备注 ",
          },
          default: {
            API_HOST: 'https://apadog.com/pocketDog',
            IMAGE_HOST: `https://apadog.com`,
            QQMap_KEY:'DWRBZ-IP2W5-2WGID-Q4GWT-7IPUO-LVFEL',
            GD_KEY:'c5dca99a8e7b505e2a7b500f1678a667',
            GD_MAP_KEY:'174c037019679f1e187041526d769a7f',
            DW:"",
            BZ:"备注 ",
        }
      }

      const ENV = env.toLowerCase();

      return Object.assign(config.default, config[ENV], { ENV });
  }
}

const System = Object.assign({ environment: 'wechat' }, wx.getSystemInfoSync());


module.exports = {
  Config: new Config(wx.getAccountInfoSync().miniProgram.envVersion),    //服务器配置
  System
};