var app = getApp()
import { goods } from '../../utils/model/goods'         //商品列表
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navActive: 0,     //点击切换，销量和价格
    upAndDown: true,     //点击切换，价格上下
    clickNav: ['销量', '价格'],
    sortIndex: 0,
    index: 0,
    sales: 'sales',
    marketprice: '',
    // http://bug.vdongchina.com/zentao/bug-view-2050.html,
    nav:0,
    redic: 0,
    list: {
      category_sub: [],   //二级分类
      goods: [],          //商品
    },
    page: {
      size: 10,
      index: 0,
      next: true
    },
    ccate: 0,   //二级分类id
    redic:1
  },

  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: options.title//页面标题为路由参数
    })
    that.setData({
      ccate: options.categoryId
    })
    let id = options.categoryId
    goods.init(app, that).getPageList('goods');
    var network = require('../../utils/network.js');
    network.network();
    wx.hideShareMenu()
  },
  //点击切换，销量和价格排序
  navChange: function (e) {
    var that = this;
    var nav = e.currentTarget.dataset.nav;
    console.log(nav);
    console.log(that.data.index)
    if (nav == that.data.sortIndex) {
      that.setData({ desc: !that.data.desc })
    } else { that.setData({ desc: false }) }
    that.setData({
      nav: nav,
      sortIndex: nav,
      list: {
        goods: [],          //商品
      },
      page: {
        size: 10,
        index: 0,
        next: true
      },
    })
    goods.init(app, that).getPageList('goods');
  },
  onReachBottom: function () {
    let that = this;
    goods.init(app, that).getPageList('goods');
  },
  /*
  * 获取分页数据，返回一个promise对象
  */
  getPageList: function () {
    let that = this
    let promise = goods.init(app, that).getListByCategoryId();
    return promise;
  },

})