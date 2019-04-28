// pages/appointment/appointment.js
// var appointment = require('../../utils/model/appointment.js')
import { appointment } from '../../utils/model/appointment'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: [],
    appointmentTitle: [],    //预约类型
    reid: [],                //项目id值 
    reids: 0,
    dataset: "",
    index:0,
    str_arr:[],
    sid_arr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
		appointment.init(app, that).appointment();
  },
  onShow: function () {
    var that = this
    var network = require('../../utils/network.js');
    network.network();
    wx.hideShareMenu();
  },

  //预约类型事件
  bindRegionChange: function (e) {
    var that = this
    var datevae = e.detail.value;               //预约类型选择索引值
    var reidqie = that.data.sid_arr[datevae]       //项目id  
    that.setData({
      index: datevae,
      reids: reidqie
    });
  },
  //预约按钮事件
  formSubmit: function (e) {
    var that = this;
    console.log(e);
    var dataset = e.detail.value;
    that.setData({ dataset: dataset })
    var realname = dataset.realname                                     //姓名
    var mobile = dataset.mobile                                         //电话
    var telRegex = /^(13[0-9]|15[0-9]|18[0-9]|147|17[0-9])[0-9]{8}$/;   //手机号正则
    var mobileReg = telRegex.test(mobile)
    var remark = dataset.remark                                         //备注
    var reids = that.data.reids;                                        //预约id
    if (realname === '') {
      that.showToast('请输入姓名', 'loading')
      return
    }
    if (mobile === '') {
      that.showToast('请输入联系方式', 'loading')
      return
    }
    if (!mobileReg) {
      that.showToast('请输入正确的联系方式', 'loading')
      return
    }
    // if (realname && mobile && mobileReg) {
      appointment.init(app, that).appointmentForm()                              //预约
      return
    // }
  },
  //提示框方法
  showToast: function (title, icon) {
    wx.showToast({
      title: title,
      icon: icon,
      duration: 1000,
    })
  },
})