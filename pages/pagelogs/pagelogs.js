import { corp } from '../../utils/model/corp'         //轮播
var app=getApp();
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
    var network = require('../../utils/network.js');
    network.network();
    var that = this;
		that.setData({
			switab: 1
		})
    corp.init(app, that).sysset();
  },
})