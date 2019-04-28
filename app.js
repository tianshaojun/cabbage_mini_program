import {
  com
} from 'utils/common'
const request = require('libs/request.js')
App({
  onLaunch: function() {
    var that = this;
    this.http = request;
    if (wx.getExtConfig) {
      wx.getExtConfig({
        success: function(res) {
          console.log(res)
          that.globalData.projectId = res.extConfig.projectId;
          that.globalData.accessToken = res.extConfig.accessToken;
          that.globalData.themes = res.extConfig.themes
          that.getOpenid();
          // that.getUserInfo();
        }
      })
    }
  },
  getUserInfo: function() {
    var that = this;
    wx.login({
      success: function(res) {
        var code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
        //获取用户openid
        let promise = com.init(that, null).getOpenid(code);
        that.promise = promise;
        promise.then(function(res) {

          var openid = res.data.data.openid

          that.globalData.openid = openid;
          console.log("openid==" + res.data.data.openid)
          if (openid === '' || openid === 0) {
            // wx.redirectTo({
            //   url: "/pages/pagelogs/pagelogs",
            // })
            return;
          }
        })

        wx.getUserInfo({
          success: function(res) {
            that.globalData.userInfo = res.userInfo
          }
        })
      }
    })
  },
  http: null,
  globalData: {
    // accessToken: '06d9b82b3e1d03060ca2aabafe23978a',
    // projectId=51 ， 
    // accessToken: '27df28f6c6542b2913e1f9360703b8f7',projectId: '47',
    accessToken: 'c8da2ac0b45a9831422bea6500aae130',
    projectId: '135',
    project: 'com',
    openid: '',
    userInfo: null,
    shopinfolo: '',
    host: 'https://open.vdongchina.com/',
    version: "v1.06.190124", //版本号
    themes: '01', //模板号
    /*01便利店    02母婴       03珠宝      04服装售卖（h5）  05看吧  06水果屋    07手机售卖  08变美app 09双十一抢购 
      10美家家居  11书店       12服饰Lite  13女裤   14双十一 15玉器店 16商城     17-22商城
      23农产品    24仿玩物志   25水果拼团   26商城Lite       27逛校园 28药必达   29婚庆LIte  30美食圈  31洗浴 Lite  32理发
      33天顺驾校  34纹身       35保险       36有家家具       37化妆品小程序      38票务      39简约版   40日化  41妙汇 
      42看吧      43法律Lite   44鲜花Lite   45礼到  46母婴小程序     47美容造型塑形      48妈妈厨房  49玩转户外  50美美发
    */
    // host: 'http://192.168.1.112/apis/public/index.php/',
  },
  config: {
    debug: false,
    version: 'v2.2017年09月15日11点',
    themes: '30',
    projectId: '4',
    cdn: 'http://7xj1w4.com1.z0.glb.clouddn.com/wxapps/tpl/meizhuang/',
    market: {
      enough: false, //满减开启
    }
  },
  promise: null,

  init: function(that) {

    let app = this;

    let common = com.init(app, that);

    return common;
  },
  getOpenid: function() {
    var openid = wx.getStorageSync('app.openid') || 0

    let that = this;

    if (openid != 0) {
      that.globalData.openid = openid;
    }
    // 登录
    wx.login({
      success: res => {

        let url = that.globalData.host + that.globalData.project + '/' + 'user/getOpenid';
        let data = {
          condition: {
            uniacid: that.globalData.projectId,
            code: res.code
          }
        }
        that.http.post(url, data).then(function(res) {
          // that.getUserinfo();
          wx.setStorageSync('app.openid', res.data.data.openid);
          that.globalData.openid = res.data.data.openid;
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  serinfo: function(e) {
    var that = this;
    console.log(e)
    if (e.detail.errMsg != "getUserInfo:ok") {
      console.log("11111111111111")
      setTimeout(function() {
        wx.switchTab({
          url: '../home/' + that.globalData.themes + '/index'
        })
      }, 500)
      return
    }
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              setTimeout(function() {
                console.log("2222222")
                wx.switchTab({
                  url: '../home/' + that.globalData.themes + '/index'
                })
              }, 500)
              wx.setStorage({
                key: 'getauthorization',
                data: '1',
              })
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
            },
          })
        }
      }
    })

    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     setTimeout(function () {
    //         wx.switchTab({
    //           url: '../home/' + that.globalData.themes + '/index'
    //         })

    //     },500)
    //     // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //     wx.getUserInfo({
    //       success: res => {
    //         // 可以将 res 发送给后台解码出 unionId
    //         that.globalData.userInfo = res.userInfo;
    //         // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //         // 所以此处加入 callback 以防止这种情况
    //         if (that.userInfoReadyCallback) {
    //           that.userInfoReadyCallback(res)
    //         }
    //       }
    //     })

    //   }
    // })
  },
  http: null,

})