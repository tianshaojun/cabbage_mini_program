/*
* 支付订单确认
* 1、获取待支付商品列表
* 2、获取配送方式
* 3、获取默认收货地址
* 4、选择配送方式
* 5、计算总金额
* 6、提交生成订单
*/
const user = require('../../utils/model/order.confirm.js')
var app = getApp()
Page({
  data: {
    goodsList: [],
    totalNum: 0,
    isNeedLogistics: 1, // 是否需要物流信息
    allGoodsPrice: 0,
    yunPrice: 0,
    allGoodsAndYunPrice: 0,
    orderType: "buyNow", //订单类型，购物车下单或立即支付下单，默认是购物车，
    ids: 0,     //单品购买id
    address: null,    //收货地址
    isHaveAddress: false, //是否有收货地址
    leg: 0,
    dispatchInfo: {},   //配送数据
    remark: '',
    page: {
      index: 1,
      size: 1
    },
    ord:true
  },
  onLoad: function (e) {
    var that = this;
    var network = require('../../utils/network.js');
    network.network();
    wx.getStorage({
      key: 'buynow',
      success: function (res) {
        console.log(res.data)
      }
    })

    that.setData({
      orderType: e.orderType
    })
    let obj = new user(app, that);
    obj.getDispatch().then(function (res) {
      that.setData({
        dispatchInfo: res.data.data
      })
      //获取商品列表
      switch (e.orderType) {
        case 'cart':
          obj.getCartPayData(e);
          break;
        default:
          obj.getBuynowData(e);
          break;
      }
    });
  },
  onShow: function () {
    var that = this;
    let obj = new user(app, that);
    obj.getAddress();
  },
  bindViewTab: function (e) {
    let that = this;
    let name = e.currentTarget.dataset.method;
    if (name == 'address') {
      wx.navigateTo({
        url: '../address/address?comefrom=../order/confirm/index',
      })
      return;
    }
    if (name == 'confirm') {
      that.setData({
        ord:false
      })
      let obj = new user(app, that);
      obj.createOrder(e);
    }
  },
  bindKeyInput: function (e) {
    this.setData({
      remark: e.detail.value,
      leg: e.detail.value.length
    })
  },
})
