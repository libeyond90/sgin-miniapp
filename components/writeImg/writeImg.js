// components/writeImg.js
var Utils = require('../../utils/util');
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    //画布宽
    canvasWidth:{
      type:Number,
      value:1080
    },
    //画布高
    canvasHeight:{
      type:Number,
      value:1862
    },
    //类型：1是手机拍照，0是上传图片
    type:{
      type:Number,
      value:1
    },
    canvasId:{
      type:String,
      value:'canvas'+(new Date()).getTime()
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    ratio :0
  },

  /**
   * 组件的方法列表
   */
  methods: {

    addWatermark(e){
    
      let _this = this
      let _wx = wx;
      //几号水印样式
      let sytype = e.sytype || 0;

      _this.setData({
        canvasId:'canvas'+(new Date()).getTime()
      })

      console.log("进入组件方法",e)

      if(!e.address){
        _wx.hideLoading()
        _wx.showToast({
          title: '获取当前地址有误，请联系管理员',
        })
        return;
      }

      if(!e.date || !e.time || !e.week){
        _wx.hideLoading()
        _wx.showToast({
          title: '获取当前时间有误，请联系管理员',
        })
        return;
      }

      //水印默认样式0 可选天气，其它样式暂不支持可选
      if(sytype>0 || (sytype==0 && e.haveWeather)){
        if(!e.weather || !e.temperature){
          _wx.hideLoading()
          _wx.showToast({
            title: '获取当前天气有误，请联系管理员',
          })
          return;
        }
      }


      let systemInfo = wx.getSystemInfoSync();

      console.log('宽高比',_this.data.ratio)
      console.log('手机信息',systemInfo)
      let dpr = systemInfo.pixelRatio;


      //核心画布方法
      return new Promise((resolve, reject) => {

        //定义初始值
        let font = 46;//字体
        let fillStyle = '#ffffff';//水印画笔颜
        let textBaseline = 'bottom';//底部对齐
        let scale = 1.3;
        let base_x = 25;//x轴 
        let base_y = 35;//文字离开底部的基础距离
        let font_y = 65;//文字行距

        let sy_2_font_y = 42//水印2 小文字间距
        let sy_2_mmw = 9//大小文字间隔
        let sy_2_minfont_h = 19;//水印2 小文字的叠高
        let fontBase = 1.19;///水印2小字体 基数
        let fontBase2 = 2;///水印2大字体基数
        let sy2_max_font = 110;
        let sy2_min_font = 40;
        let sy2_font_y = 50;

        console.log('水印模式',sytype)
        console.log('像素',dpr)
        console.log('渲染模式',_this.data.type)

        _wx.showLoading({
          title: '图片生成中...',
        })




      
      if(_this.data.type == 1){

        //手机拍摄        
        if(dpr>=3){
        //当像素大于3时，由于canvas问题会有白黑屏问题
          if(systemInfo.platform == 'ios'){
            //ios系统 当像素大于3 固定按像素1.5 调整
            dpr = 1.5;
          }else if(systemInfo.platform == 'android'){
            //android系统 当像素大于3 固定按像素1 调整
            dpr = 1;
          }

        _this.setData({
          canvasWidth:_this.data.canvasWidth / dpr,
          canvasHeight: _this.data.canvasHeight / dpr
        })

        //根据像素计算出基本信息
        font = font/dpr;//字体
        fillStyle = '#ffffff';//水印画笔颜
        textBaseline = 'bottom';//底部对齐
        base_x = base_x/dpr;//x轴 
        base_y = base_y/dpr;//文字离开底部的基础距离
        font_y = font_y/dpr;//文字行距
        sy_2_font_y = sy_2_font_y/dpr
        sy_2_mmw = sy_2_mmw/dpr
        sy_2_minfont_h = sy_2_minfont_h/dpr
        sy2_max_font = sy2_max_font/dpr;
        sy2_min_font = sy2_min_font/dpr;
        sy2_font_y = sy2_font_y/dpr
       }

      }else{

        if(systemInfo.platform == 'ios' && dpr<3){
            // font = 19;//字体
            // font_y = 24.5;//文字行距
            // base_x = 11;//x轴 
            // base_y = 14;
            // sy_2_mmw = 0;
            // sy_2_minfont_h = 9;
            // sy2_font_y = 20;
            // sy_2_font_y = 18;
    
            // // fontBase = 1.1;///水印2小字体 基数
            // // fontBase2 = 2.2;///水印2大字体基数
            // sy2_max_font = 49;
            // sy2_min_font = 16.6;
            const baseDpr = 2.7
            font = font/baseDpr;//字体
            fillStyle = '#ffffff';//水印画笔颜
            textBaseline = 'bottom';//底部对齐
            base_x = base_x/baseDpr;//x轴 
            base_y = base_y/baseDpr;//文字离开底部的基础距离
            font_y = font_y/baseDpr;//文字行距
            sy_2_font_y = sy_2_font_y/baseDpr
            sy_2_mmw = sy_2_mmw/baseDpr
            sy_2_minfont_h = sy_2_minfont_h/baseDpr
            sy2_max_font = sy2_max_font/baseDpr;
            sy2_min_font = sy2_min_font/baseDpr;
            sy2_font_y = sy2_font_y/baseDpr
            // _this.setData({
            //   canvasWidth:_this.data.canvasWidth / dpr,
            //   canvasHeight: _this.data.canvasHeight / dpr
            // })
        }else{
            const baseDpr = parseInt(dpr)
            font = font/baseDpr;//字体
            fillStyle = '#ffffff';//水印画笔颜
            textBaseline = 'bottom';//底部对齐
            base_x = base_x/baseDpr;//x轴 
            base_y = base_y/baseDpr;//文字离开底部的基础距离
            font_y = font_y/baseDpr;//文字行距
            sy_2_font_y = sy_2_font_y/baseDpr
            sy_2_mmw = sy_2_mmw/baseDpr
            sy_2_minfont_h = sy_2_minfont_h/baseDpr
            sy2_max_font = sy2_max_font/baseDpr;
            sy2_min_font = sy2_min_font/baseDpr;
            sy2_font_y = sy2_font_y/baseDpr
            _this.setData({
              canvasWidth:_this.data.canvasWidth / dpr,
              canvasHeight: _this.data.canvasHeight / dpr
            })
        }



      }
        

        let fontStr = font + 'px';
        let sy2_max_font_str = sy2_max_font + 'px';
        let sy2_min_font_str = sy2_min_font + 'px';
        //左右空格
        let font_width = 2 * base_x;
        const query = _this.createSelectorQuery();
        console.log('画布id'+this.data.canvasId)
        query.select('#'+this.data.canvasId).fields({
          node: true,
          size: true
        }).exec((res) => {
          let canvas = res[0].node;
          let ctx = canvas.getContext('2d');

          //根据像素赋值宽高
          canvas.width = _this.data.canvasWidth * dpr;
          canvas.height = _this.data.canvasHeight * dpr;
          ctx.scale(dpr, dpr)

          // 绘制背景图片
          const image = canvas.createImage();
          image.src = e.img;
          
          //图片渲染成功之后的回调，画入图片
          image.onload = function(){
            console.log(_this.data.canvasWidth,_this.data.canvasHeight )            
            ctx.drawImage(image, 0, 0, _this.data.canvasWidth, _this.data.canvasHeight);
            
            ctx.fillStyle = fillStyle;
            ctx.textBaseline = textBaseline;
       
            switch(sytype){

              //基础默认样式
              case 0:
                console.log('fonts',font,base_x,base_y,font_y,font_width)

                //计算地址宽度是否需要换行
                ctx.font = fontStr;
                let str = [];
                let allstr = [];
                if(e.remarks){
                  allstr.push(e.remarks)
                }
                Utils.transformContent(ctx,e.address,_this.data.canvasWidth-font_width,str)
                console.log('str',str)
                for(let i = str.length ; i>0 ; i--){
                  console.log('第'+i+'次写入文字：'+str[i-1])
                  allstr.push(str[i-1]);
                }
                allstr.push(e.date + ' ' + e.time + ':'+e.second)


                const weather = (sytype==0 && e.haveWeather)?' ' + e.weather + ' '+ e.temperature + '℃':''
                allstr.push(e.week+weather)
      
                for(let j=0;j<allstr.length;j++){
                  // 绘制文字
                  ctx.fillText(allstr[j], base_x, _this.data.canvasHeight- (base_y + (j*font_y)));
                }
                break;

              //大时间左边样式  
              case 1:

                console.log('fonts',sy2_max_font_str,sy2_min_font_str,base_y,font_y,font_width)
                str = [];
                allstr = [];
                if(e.remarks){
                  allstr.push(e.remarks)
                }

                ctx.font = sy2_min_font_str;
                Utils.transformContent(ctx,e.address,_this.data.canvasWidth-font_width,str)

                for(let i = str.length ; i>0 ; i--){
                  console.log('第'+i+'次写入文字：'+str[i-1])
                  allstr.push(str[i-1]);
                }
                for(let j=0;j<allstr.length;j++){
                  // 绘制文字
                  ctx.fillText(allstr[j], base_x, _this.data.canvasHeight- (base_y + (j*sy2_font_y)));
                }

                
                //写时间
                ctx.font = sy2_max_font_str;
                let y = (base_y + (allstr.length*sy2_font_y));
                ctx.fillText(e.time, base_x, _this.data.canvasHeight-y );

                
                const addWidth = Utils.strWidth(ctx,e.time);
                ctx.font = sy2_min_font_str;
                
                //写星期 天气
                ctx.fillText(e.week+ ' ' + e.weather + ' '+ e.temperature + '℃', base_x+sy_2_mmw +addWidth , 
                _this.data.canvasHeight- y-sy_2_minfont_h);

                ctx.fillText(e.date, base_x+sy_2_mmw +addWidth ,_this.data.canvasHeight- y-sy_2_font_y-sy_2_minfont_h);

                break;  

              case 2:
                //经纬度样式

                ctx.font = fontStr;
                str = [];
                allstr = [];
                if(e.remarks){
                  allstr.push(e.remarks)
                }
                allstr.push(e.latitude+'°N '+e.longitude+'°E' )
                Utils.transformContent(ctx,'位置：'+e.address,_this.data.canvasWidth-font_width,str)
                console.log('str',str)
                for(let i = str.length ; i>0 ; i--){
                  console.log('第'+i+'次写入文字：'+str[i-1])
                  allstr.push(str[i-1]);
                }
                allstr.push('天气：'+e.weather + '  '+ e.temperature + '℃' )
                allstr.push('日期：'+e.date + ' '+e.week)
                allstr.push('时间：'+e.time)    
                for(let j=0;j<allstr.length;j++){
                  // 绘制文字
                  ctx.fillText(allstr[j], base_x, _this.data.canvasHeight- (base_y + (j*font_y)));
                }
                break;

            }




          }



          //保存图片
          setTimeout(() => {
            _wx.canvasToTempFilePath({
              canvas,
              success: (res) => {
                console.log('图片地址',res)
                _this.setData({
                  id:'canvas'+(new Date()).getTime()
                })
                _wx.hideLoading()
                resolve(res.tempFilePath);
              },
              fail: (err) => {
                console.log(err)
                _wx.hideLoading()
                reject(new Error('转换为图片失败'));
              }
            });
          }, 300);

        });
      });
    }





    //画出对应图片
    /**
     * 方法说明
     * type 
     * 1.拍照生成 ； 0.上传图片生成
     * 
     * 拍照生成取固定的scale 像素比1.3。
     * 图片生成，取手机像素比。
     * 
     * 下面做了 2 -3像素的适配，适配不可能百分之百合适
     * 
     * 做了文字换行处理
     * 
     * */ 
    // addWatermark(e){
    //   let _this = this
    //   let _wx = wx;
    //   console.log("进入组件方法",e)

    //   if(_this.data.canvasWidth>1080){
    //     _this.setData({
    //       canvasWidth:1080
    //     })
    //   }

    //   if(_this.data.canvasHeight>1862){
    //     _this.setData({
    //       canvasHeight:1862
    //     })
    //   }
      
    //   return new Promise((resolve, reject) => {

    //     if(!e.address){
    //       _wx.hideLoading()
    //       _wx.showToast({
    //         title: '获取当前地址有误，请联系管理员',
    //       })
    //       return;
    //     }

    //     if(!e.date || !e.time || !e.week){
    //       _wx.hideLoading()
    //       _wx.showToast({
    //         title: '获取当前时间有误，请联系管理员',
    //       })
    //       return;
    //     }

    //     if(!e.weather || !e.temperature ){
    //       _wx.hideLoading()
    //       _wx.showToast({
    //         title: '获取当前天气有误，请联系管理员',
    //       })
    //       return;
    //     }

    //     let font = 'normal 46px null';//字体
    //     let fillStyle = '#ffffff';//水印画笔颜
    //     let textBaseline = 'bottom';//底部对齐
    //     let scale = 1.3;

    //     let base_x = 25;//x轴 
    //     let base_y = 37;//文字离开底部的基础距离
    //     let font_y = 62;//文字行距
    //     let maxWidth = 750 // 最大宽度，超出换行
    //     let font_width = base_x;

    //     _wx.showLoading({
    //       title: '图片生成中...',
    //     })

    //     const query = _this.createSelectorQuery();
        
    //     console.log('画布id'+this.data.id)
    //     query.select('#'+this.data.id).fields({
    //       node: true,
    //       size: true
    //     }).exec((res) => {
    //       let canvas = res[0].node;
    //       let ctx = canvas.getContext('2d');
    //       const systemInfo = wx.getSystemInfoSync();
    //       const dpr = systemInfo.pixelRatio;

    //       console.log('像素',dpr)

    //       if(this.data.type == 1){

    //         if(dpr>2){
    //           //根据像素，获取组件宽高比
    //           _this.setData({
    //             canvasWidth:_this.data.canvasWidth / dpr,
    //             canvasHeight: _this.data.canvasHeight / dpr
    //           })
    //           //获取画布宽高比
    //           canvas.width = _this.data.canvasWidth * dpr
    //           canvas.height = _this.data.canvasHeight * dpr
    //           ctx.scale(dpr, dpr)
    //           font = 'normal 14.6px null';//字体
    //           base_y = 16;//文字离开底部的基础距离
    //           font_y = 21;//文字行距
    //           base_x = 11;//x轴 
    //         }else{
    //           font = 'normal 42.5px null';//字体
    //           canvas.width = _this.data.canvasWidth * scale
    //           canvas.height = _this.data.canvasHeight * scale
    //           ctx.scale(scale, scale)
    //         }
    //         font_width = 2 * base_x;//

            
    //       }else{
    //         font_y = 21;//文字行距
    //         base_x = 13;//x轴 
    //         if(dpr>2){
    //           font = 'normal 17px null';//字体
    //           base_y = 20;//文字离开底部的基础距离
    //         }else{
    //           base_y = 25;//文字离开底部的基础距离
    //           font = 'normal 17px null';//字体
    //         }

    //         //自定义图片，子页面不管穿不穿canvas的宽高统一在父组件取
    //         canvas.width = _this.data.canvasWidth * dpr;
    //         canvas.height = _this.data.canvasHeight * dpr;
    //         ctx.scale(dpr, dpr)
    //       }
    //       // 绘制背景图片
    //       const image = canvas.createImage();
    //       image.src = e.img;
          
    //       image.onload = function(){
    //         console.log(_this.data.canvasWidth,_this.data.canvasHeight )
    //         ctx.drawImage(image, 0, 0, _this.data.canvasWidth, _this.data.canvasHeight);
    //         ctx.font = font;
    //         ctx.fillStyle = fillStyle;
    //         ctx.textBaseline = textBaseline;
    //         //计算地址宽度是否需要换行
    //         let str = [];
    //         let allstr = [];
    //         if(e.remarks){
    //           allstr.push(e.remarks)
    //         }
    //         Utils.transformContent(ctx,e.address,_this.data.canvasWidth-font_width,str)
    //         console.log('str',str)
    //         for(let i = str.length ; i>0 ; i--){
    //           console.log('第'+i+'次写入文字：'+str[i-1])
    //           allstr.push(str[i-1]);
    //         }
    //         allstr.push(e.date + ' ' + e.time)
    //         allstr.push(e.week+ ' ' + e.weather + ' '+ e.temperature + '℃')

    //         for(let j=0;j<allstr.length;j++){
    //           // 绘制文字
    //           ctx.fillText(allstr[j], base_x, _this.data.canvasHeight- (base_y + (j*font_y)));
    //         }
    //       }

    //       setTimeout(() => {
    //         _wx.canvasToTempFilePath({
    //           canvas,
    //           success: (res) => {
    //             console.log('图片地址',res)
    //             _wx.hideLoading()
    //             resolve(res.tempFilePath);
    //           },
    //           fail: () => {
    //             _wx.hideLoading()
    //             reject(new Error('转换为图片失败'));
    //           }
    //         });
    //       }, 200);

    //     });
    //   });
    // }
  },

})