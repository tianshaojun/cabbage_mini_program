// pages/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    redic:1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.hideShareMenu()
    that.setData({
      options: options,
      
    })
    var network = require('../../utils/network.js');
    network.network();
  },
  onShow:function(){
    this.setData({
      userInfo: getApp().globalData.userInfo,
      shopinfolo: getApp().globalData.shopinfolo,
      tel: getApp().globalData.shopinfolo.sets.shop.tel
    })
    console.log(getApp().globalData.shopinfolo)
  },
  indent: function (e) {
    wx.navigateTo({
      url: '../order-list/order-list?ind=' + e.currentTarget.dataset.ind,
    })

  },

  //拨打商家电话
  makeAcall:function(e){
    wx.makePhoneCall({
      phoneNumber: getApp().globalData.shopinfolo.sets.shop.tel //仅为示例，并非真实的电话号码
    })
  }
})