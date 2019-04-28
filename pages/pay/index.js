const payment = require('../../utils/model/pay.js')
var app = getApp()
Page({
  data: {

    payinfo: {},

    orderid: 0,

    config: {},

    payok: false

  },
  tzindex: function () {//跳转首页
  },
  onLoad: function (options) {       //默认加载事件
    var network = require('../../utils/network.js');
    network.network();
    let that = this
    //options['orderid'] = 226;
    that.data.orderid = options['orderid'];
    let pay = new payment(app, that);
    pay.find(that.data.orderid);
  },
  bindViewTab: function (e) {
    let that = this;
    let name = e.currentTarget.dataset.method;

    switch (name) {

      case 'gohome'://回首页
        wx.switchTab({
          url: '../home/' + getApp().globalData.themes + '/index'
        })
        break;
      case 'goorder'://去订单页
        wx.switchTab({
          url: '../list/index',
        })
        break;
      case 'paynow'://立即支付
        var price = e.currentTarget.dataset.price
        // console.log(price*100>=1)
        // if (price * 100 >= 1) {
          if (that.data.payinfo.status > 0) {
            //已支付，请勿重复支付            
            wx.showModal({
              title: '已支付过！',
              content: '',
            })
            return;
          }
          let pay = new payment(app, that);
          wx.requestPayment(
            {
              'timeStamp': that.data.config.timeStamp,
              'nonceStr': that.data.config.nonceStr,
              'package': that.data.config.package,
              'signType': 'MD5',
              'paySign': that.data.config.paySign,
              'success': function (res) {
                pay.query(that.data.orderid);
              },
              'fail': function (res) {
                wx.showToast({
                  title: '支付取消',
                })
              },
              'complete': function (res) {
              }
            })
        // }else{
        //   wx.showModal({
        //     title: '不能支付！',
        //     content: '',
        //   })
        // }
        //调用微信支付
        break;
    }
  }
})