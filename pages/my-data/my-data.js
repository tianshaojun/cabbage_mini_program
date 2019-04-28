// pages/mydata/mydata.js
var app = getApp()
var util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    myData: false,     //我的展示数据
    checked: true,      //男女默认选中
    myName: true,        //我的姓名弹框默认隐藏
    mySex: true,         //我的性别弹框默认隐藏
    btnGroup: true,       //取消确定按钮组
    index: 0,
    array: ['男', '女'],
    signImgUrl: '',
    myNickName: '',  //我的昵称
    def: '',  //默认值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var datumData = require('../../utils/mode/datum.js')
    datumData.datum(that);
    that.setData({
      userInfo: getApp().globalData.userInfo
    })
    wx.hideShareMenu();
    var network = require('../../utils/network.js');
    network.network();
  },
  clickName: function () {
    this.setData({
      myName: false,
      myData: true,
    })
  },
  //我的性别
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  //监控输入框输入的值并更新
  inputName: function (e) {
    this.setData({
      myNickName: e.detail.value.myNickName
    })
  },
  //删除按钮
  delBtn: function (e) {
    this.setData({
      myNickName: ''
    })
  },
  //确认值跟新
  myBut: function (e) {
    var that = this;
    console.log(e)
    var val = e.detail.value;
    that.setData({
      srt: val
    })
    if (val.realname.length == 0) {
      that.showToast('请输入昵称', 'loading')
    } else if (val.tel.length == 0) {
      that.showToast('请输入手机号', 'loading')
    } else if (val.weixin.length == 0) {
      that.showToast('请输入微信号', 'loading')
    } else {
      if (/^1[34578]\d{9}$/.test(val.tel)) {
        var updateDat = require('../../utils/mode/updateDatunm.js')
        updateDat.updateDatunm(that);
      } else {
        that.showToast('请正确输入手机号', 'loading')
      }
    }
  },
  //提示框方法
  showToast: function (title, icon) {
    wx.showToast({
      title: title,
      icon: icon,
      duration: 1000,
    })
  },
  //取消按钮
  cancelBtn: function () {
    this.setData({
      myName: true,
      mySex: true,
      myData: !this.data.myData,
      btnGroup: !this.data.btnGroup,
    })
  },
  // setPhotoInfo: function (res) {               //图片上传
  //   var that = this
  //   var url = getApp().globalData.uploadImgUrl
  //   wx.chooseImage({
  //     success: function (res) {
  //       that.setData({
  //         titleImgUrl: res.tempFilePaths[0]
  //       })
  //       wx.uploadFile({
  //         url: url + 'api/upload.php',
  //         filePath: res.tempFilePaths[0],
  //         name: 'file',
  //         header: {
  //           "Content-Type": "application/x-www-form-urlencoded"
  //         },
  //         success: function (res) {
  //           that.setData({
  //             titleImgUrl: res.data
  //           })
  //         },
  //       })
  //     },
  //   })
  // },
})