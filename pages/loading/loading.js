// pages/pagelogs/pagelogs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //调用应用实例的方法获取全局数据
    getApp().getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    //商户基本信息
    var inter2 = require('../../utils/mode/information.js');
    inter2.list(that);
    wx.hideShareMenu();
    var network = require('../../utils/network.js');
    network.network();
  },
})