var app = getApp()
import { goods } from '../../utils/model/goods'         //商品列表
import { category } from '../../utils/model/category'   //分类
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: 0,     //点击切换，销量和价格
    upAndDown: true,     //点击切换，价格上下
    clickNav: ['销量', '价格'],
    index: 0,
    sales: 'sales',
    marketprice: '',
    redic: 0,
    tab:0,
    list: {
      category_sub: [],   //二级分类
      goods: [],          //商品
    },
    page: {
      size: 10,
      index: 0,
      next: true
    },
    ccate: 0,   //分类id
    sortIndex: 0,
    redic:1,
    isrecommand:1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    wx.setNavigationBarTitle({
      title: options.title//页面标题为路由参数
    })
    that.setData({
      options: options,
      tab:options.index,
      ccate: options.categoryId,
      name:options.title
    })
    let id = options.classid
    // category.init(app, that).selectedItem(id);
    category.init(app, that).isrecommandClass();
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
    if (nav == that.data.sortIndex){
      that.setData({ desc: !that.data.desc})
    } else { that.setData({ desc: false })}
    that.setData({
      // desc: !that.data.desc,
      nav: nav,
      sortIndex:nav,
      list: {
        category_sub: that.data.list.category_sub,   //二级分类
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
  //分类切换
  tabNav: function (e) {
    var that = this;
    var dataset = e.currentTarget.dataset;
    let goods_list = that.data.list.goods;
    this.setData({
      tab: dataset.index,
      ccate: dataset.id,
      list: {
        category_sub: that.data.list.category_sub,
        goods: []
      },
      page: {
        size: 10,
        index: 0,
        next: true
      },
      name: dataset.name,
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