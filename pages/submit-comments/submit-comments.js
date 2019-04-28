// pages/comment/comment.js
var orderevaluate = require('../../utils/model/orderevaluate.js')
var app = getApp()
Page({
  data: {
    files: [],
    content: '',
    ImgUrl: '',
    imgs: []
  },
  onLoad: function (options) {
    var that = this
    wx.hideShareMenu()    //禁止分享
    that.setData({
      options:options
    })
    var network = require('../../utils/network.js');
    network.network();
    orderevaluate.getGoodsByOrdersn(that) ;   //获取订单下的商品id 
    orderevaluate.orderinfo(that);   //获取订单详情 
  },

  submitComment:function(e){
    var that = this
    if (e.detail.value.communityWords != '') {
      this.setData({
        content: e.detail.value.communityWords,
      })
      orderevaluate.commentSave(that)
    } else {
      wx.showToast({
        title: '请输入评价内容',
        icon: 'loading',
        duration: 1000,
      })
    }
  },

  // 上传图片功能接口暂无法接收
  setPhotoInfo: function (e) {               //图片上传
    var that = this
    wx.chooseImage({
      success: function (res) {
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        })
        console.log(res)
        that.uploadMuti(that, 'imgs', res)
      },
    })
  },

  uploadMuti: function (that, imgs, res) {
    let length = res.tempFilePaths.length;
    for (let i = 0; i < length; i++) {
      wx.uploadFile({
        url: 'https://wxapis.vdongchina.com/api/upload.php',
        filePath: res.tempFilePaths[i],
        name: 'file',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (e) {
          let tmp = that.data[imgs]
          tmp[i] = e.data
          that.setData({
            filearray: tmp
          })
        }
      })
    }
  },
  delBtn:function(e){
    var that=this;
    let index=e.currentTarget.dataset.index;
    that.data.files.splice(index,1);
    that.setData({
      files: that.data.files
    })
  },
  // 点击放大图
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

})