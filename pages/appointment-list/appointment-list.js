import { appointment } from '../../utils/model/appointment'
var app = getApp()
Page({
  data: {
    page:{index:1,size:10,next:true},                                    //页数    
    appointmentList: [],                     //预约列表
    options: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      options: options
    })
    wx.hideShareMenu();
    var network = require('../../utils/network.js');
    network.network();
  },
  load: function () {                                                 //预约列表
    var that = this
    appointment.init(app,that).appointmentList();
  },
  onShow: function () {
    wx.hideShareMenu()                             //禁止分享
    var that = this
    that.load()                                    //预约列表
  },
  onReachBottom: function () {                     //下拉加载
    let that = this
    var newPageIndex = that.data.p + 1;
    if (newPageIndex > that.data.count) {
      return
    }
    that.setData({
      p: newPageIndex
    })
    that.load();
  },
})