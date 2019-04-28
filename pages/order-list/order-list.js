const order = require('../../utils/model/order.js')
var app = getApp()
Page({
  data: {
    ////默认是待付款【0-待付款，1-待发货，2-待收货，3-已完成】
    status: [
      {
        name: '全部',
        value: -1,
      },
      {
        name: '待付款',
        value: 0
      },
      {
        name: '待发货',
        value: 1
      },
      {
        name: '待收货',
        value: 2
      },
      {
        name: '已完成',
        value: 3
      }
    ],

    tabIndex: 0,

    list_order: [],

    list: {
      order: []
    },

    page: {
      size: 10,
      index: 0,
      next: true
    }
  },

  onLoad: function (options) {
    var network = require('../../utils/network.js');
    network.network();
    //默认加载全部订单
    let that = this;
    that.setData({ tabIndex: options.ind })
    let obj = new order(app, that);

    let status = that.data.status[that.data.tabIndex].value;

    obj.getPageList(status, false);
  },

  bindViewTab: function (e) {

    let that = this;

    let obj = new order(app, that);

    let name = e.currentTarget.dataset.method;

    if (name == 'changetab') {

      let index = e.currentTarget.dataset.index;

      that.setData({
        tabIndex: index,
        page: {
          size: 10,
          index: 0,
          next: true
        }
      })
      that.data.list_order = [];

      obj.getPageList(that.data.status[index].value, false);

    }

    if (name == 'topay') {

      wx.redirectTo({
        url: '../pay/index?orderid=' + e.currentTarget.dataset.id,
      })

      return
    }

    if (name == 'tocancel') {

      //取消订单，只有未付款状态可以取消
      wx.showModal({
        title: '提示',
        content: '确认取消这个订单？',
        success: function (res) {
          if (res.confirm) {

            let orderid = e.currentTarget.dataset.id;

            let index = e.currentTarget.dataset.index;

            that.data.list_order[index].status = -1;//splice(index, 1);
            let obj = new order(app, that);
            obj.cancel(orderid)
          } else if (res.cancel) {
          }
        }
      })
      return;
    }
    // 确认收货
    if (name == 'receipt') {
      wx.showModal({
        title: '请在收货后确认',
        // content: '确认取消这个订单？',
        success: function (res) {
          if (res.confirm) {
            let orderid = e.currentTarget.dataset.id;
            let index = e.currentTarget.dataset.index;
            that.data.list_order[index].status = 3;//splice(index, 1);
            that.data.list_order.splice(index, 1);
            let obj = new order(app, that);
            obj.shouhuo(orderid)
          } else if (res.cancel) {
          }
        }
      })
    
    
    
    }

  },

  onReachBottom: function () {

    let that = this;

    let obj = new order(app, that);

    let status = that.data.status[that.data.tabIndex].value;

    obj.getPageList(status, true);

  },

})