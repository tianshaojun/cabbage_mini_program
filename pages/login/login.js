import {
  corp
} from '../../utils/model/corp' //轮播
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    versionnumber: 1,
    authorization: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var that = this;
    wx.getStorage({
      key: 'getauthorization',
      success: function(res) {
        if (res.data && res.data == 1) {
          setTimeout(function() {
            wx.switchTab({
              url: '../home/' + app.globalData.themes + '/index'
            })
          }, 1500)
          that.setData({
            authorization: 1
          })
        } else {
          that.setData({
            authorization: 0
          })
        }
      },
      fail: function() {
        that.setData({
          authorization: 0
        })
      }
    })
    that.setData({
      version: getApp().globalData.version
    })
    corp.init(app, that).sysset();
  },
  onShow: function() {
    var network = require('../../utils/network.js');
    network.network();
  },
  onGotUserInfo(e) {
    app.serinfo(e)
  }
})