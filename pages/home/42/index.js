import { corp } from '../../../utils/model/corp'         //轮播
import { goods } from '../../../utils/model/goods'       //商品列表
import { category } from '../../../utils/model/category' //分类
import { special } from '../../../utils/model/special' //分类
var app = getApp()
Page({
  data: {
    list: {
      banner: [],     //banner轮播
      category: [],   //分类
      goods: [],      //商品
      category_sub: []
    },
    page: {
      size: 10,
      index: 0,
      next: true
    },
    isrecommand: 1,         //分类推荐，1推荐，0不推荐
    parentid: 0,                //父级id，0一级分类
    options: '',
    class_Sub: 0,
    redic: 1,
    hide: true,
    categoryId:-1
  },
  onLoad: function () {
    let that = this
    that.setData({
      opid: app.globalData.openid,
    })
    corp.init(app, that).getBanner();
    goods.init(app, that).getPageList('goods');
    category.init(app, that).isrecommandClass();
    special.init(app, that).single()
  },

  onShow: function () {
    let that = this
    corp.init(app, that).sysset();
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff',
    })
    var network = require('../../../utils/network.js');
    network.network();
  },

  onReachBottom: function () {
    let that = this;
    goods.init(app, that).getPageList('goods');
  },
  /** 获取分页数据，返回一个promise对象 */
  getPageList: function () {
    let that = this
    let promise = goods.init(app, that).getListByCategoryId();
    return promise;
  },
  //分类切换
  bindViewTab: function (e) {
    var that = this;
    var dataset = e.currentTarget.dataset;
    let goods_list = that.data.list.goods;
    console.log(dataset)
    this.setData({
      categoryId: dataset.index,
      ccate: dataset.id,
      list: {
        banner: that.data.list.banner,
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
  onShareAppMessage: function () { //页面分享
    var data = app.globalData
    return {
      title: '',
      desc: '',
      path: "pages/login/login"
    };
  },
})
