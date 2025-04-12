var {imgOpService} = require('../../service/imgOpService');
import {Config} from '../../utils/config'
Component({
  options: {
    multipleSlots: !0
  },
  properties: {
    previewSize: {
      type: Number,
      value: 100
    },
    defaultImgList: {
      type: Array,
      value: [],
      observer(t) {
        if (t?.length && !this.data.dragImgList.length) {
          const e = this.getDragImgList(t);
          this.setUploaPosition(e.length), this.setData({
            dragImgList: e
          })
        }
      }
    },
    maxCount: {
      type: Number,
      value: 9
    },
    isShow:{
      type: Boolean,
      value: false
    },
    columns: {
      type: Number,
      value: 3
    },
    gap: {
      type: Number,
      value: 9
    },
    deleteStyle: {
      type: String,
      value: ""
    }
  },
  data: {
    counts:1,
    host:Config.IMAGE_HOST,
    dragImgList: [],
    containerRes: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    },
    currentKey: -1,
    currentIndex: -1,
    tranX: 0,
    tranY: 0,
    uploadPosition: {
      tranX: 0,
      tranY: 0
    }
  },
  lifetimes: {
    ready() {
      this.createSelectorQuery().select(".drag-container").boundingClientRect((({
        top: t,
        left: e
      }) => {
        this.setData({
          "containerRes.top": t,
          "containerRes.left": e
        })
      })).exec()
    }
  },
  methods: {
    longPress(t) {
      const e = t.mark.index,
        {
          pageX: a,
          pageY: i
        } = t.touches[0],
        {
          previewSize: s,
          containerRes: {
            top: n,
            left: r
          }
        } = this.data;
      this.setData({
        currentIndex: e,
        tranX: a - s / 2 - r,
        tranY: i - s / 2 - n
      })
    },
    touchMove(t) {
      if (this.data.currentIndex < 0) return;
      const {
        pageX: e,
        pageY: a
      } = t.touches[0], {
        previewSize: i,
        containerRes: {
          top: s,
          left: n
        }
      } = this.data, r = e - i / 2 - n, o = a - i / 2 - s;
      this.setData({
        tranX: r,
        tranY: o
      });
      const h = t.mark.key,
        g = this.getMoveKey(r, o);
      h !== g && this.data.currentKey !== h && (this.data.currentKey = h, this.replace(h, g))
    },
    getMoveKey(t, e) {
      const {
        dragImgList: a,
        previewSize: i,
        columns: s
      } = this.data, n = (t, e) => {
        const a = Math.round(t / i);
        return a >= e ? e - 1 : a < 0 ? 0 : a
      }, r = s * n(e, Math.ceil(a.length / s)) + n(t, s);
      return r >= a.length ? a.length - 1 : r
    },
    replace(t, e) {
      const a = this.data.dragImgList;
      a.forEach((a => {
        t < e ? a.key > t && a.key <= e ? a.key-- : a.key === t && (a.key = e) : t > e && (a.key >= e && a.key < t ? a.key++ : a.key === t && (a.key = e))
      })), this.getListPosition(a)
    },
    getListPosition(t) {
      const {
        previewSize: e,
        columns: a,
        gap: i
      } = this.data, s = t.map((t => (t.tranX = (e + i) * (t.key % a), t.tranY = Math.floor(t.key / a) * (e + i), t)));
      this.setData({
        dragImgList: s
      }), this.updateEvent(s)
    },
    touchEnd() {
      this.setData({
        tranX: 0,
        tranY: 0,
        currentIndex: -1
      }), this.data.currentKey = -1
    },
    updateEvent(t) {
      const e = [...t].sort(((t, e) => t.key - e.key)).map((t => t.src));
      this.triggerEvent("updateImageList", {
        list: e
      })
    },
    uploadImgTost(){

      let {
        dragImgList: t,
        maxCount: e
      } = this.data;

      this.setData({
        isShow: this.data.isShow?false:true,
        counts: e - t.length
      })


    },
    updateShowStatus(e){
      this.setData({
        isShow: e.detail.isShow
      })
    },
    //回调
    imagesCallBack(e){
      let {
        dragImgList: t
      } = this.data;
      let a = e.detail.list;
      try {
         let i = this.getDragImgList(a?.map((({
            tempFilePath: t
          }) => t)) || [], !1);
        console.log('i',i)
  
        wx.showLoading({
          title: '图片检测中',
        })

        imgOpService.uploads(i).then(res=>{    
          i.forEach((ele,index)=>{
            ele.src = res[index];
          })
          t = t.concat(i), this.setUploaPosition(t.length), 
            this.setData({
              dragImgList: t
            }), this.updateEvent(t)
            wx.hideLoading()
        })

      } catch (t) {
        console.log(t)
        wx.hideLoading()
        wx.showToast({
          title: '图片上传失败',
        })
      }

      
    },
    getContainerRect(t) {
      const {
        columns: e,
        previewSize: a,
        maxCount: i,
        gap: s
      } = this.data, n = t === i ? t : t + 1, r = Math.ceil(n / e);
      return {
        width: e * a + (e - 1) * s,
        height: r * a + s * (r - 1)
      }
    },
    getDragImgList(t, e = !0) {
      let {
        dragImgList: a,
        previewSize: i,
        columns: s,
        gap: n
      } = this.data;
      return t.map(((t, r) => {
        const o = (e ? 0 : a.length) + r;
        return {
          tranX: (i + n) * (o % s),
          tranY: Math.floor(o / s) * (i + n),
          src: t,
          id: o,
          key: o
        }
      }))
    },
    preImage(e){
      let _this = this;
      let arrString = _this.data.dragImgList.map(item => this.data.host + item.src);
      wx.previewImage({
        current:e.currentTarget.dataset.src,
        urls: arrString,
        success:(res)=>{
        },fail(err){
          console.log(err)
        }
      })
    },
    setUploaPosition(t) {
      const {
        previewSize: e,
        columns: a,
        gap: i
      } = this.data, s = {
        tranX: t % a * (e + i),
        tranY: Math.floor(t / a) * (e + i)
      }, {
        width: n,
        height: r
      } = this.getContainerRect(t);
      this.setData({
        uploadPosition: s,
        "containerRes.width": n,
        "containerRes.height": r
      })
    },
    deleteImg(t) {
      const e = t.mark.key,
        a = this.data.dragImgList.filter((t => t.key !== e));
      a.forEach((t => {
        t.key > e && t.key--
      })), this.getListPosition(a), this.setUploaPosition(a.length)
    }
  }
});