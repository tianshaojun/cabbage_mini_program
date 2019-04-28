var app = getApp()
import { goods } from '../../utils/model/goods'       //商品列表
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputContent: [],
    boutique: getApp().globalData.boutique,
    goodsname: "",                                //输入的值       
    redic:1,    
    // shopList:[],
    list:{
      goods: [],      //商品
    },
    page:{
      index:1,
      size:10,
      next:true
    }      
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();   //禁止分享
    var network = require('../../utils/network.js');
    network.network();
  },

  bindKeyInput: function (e) {                          //监听input输入框值
    var that = this
    var id = e.detail.value.replace(/(\s*$)/g, "");     //输入值
    if (id === '') {
      that.setData({
        shopList: [],
        list: {
          goods: [],      //商品
        },
        page: {
          index: 1,
          size: 10,
          next: true
        } 
      })
    }
    that.setData({
      goodsname: id                                      //goodsname 输入值更新data
    })
    var network = require('../../utils/network.js');
    network.network();
  },

  searchBt: function () {                                 //搜索按钮
    var that = this
    var goodsname = that.data.goodsname                   //输入的值
    if (goodsname != '') {
      let that = this;
      goods.init(app, that).getSearchList(1);
    }
    that.setData({
      list: {
        goods: [],      //商品
      },
    })
  },
  clone: function () {                                    //清空输入框值
    var that = this;
    that.setData({
      goodsname:'',
      shopList: [],
      list: {
        goods: [],      //商品
      },
      page: {
        index: 1,
        size: 10,
        next: true
      }
    })
  },

  cancel: function () {                                   //取消按钮
    var that = this;
    wx.navigateBack({
      delta: 1
    })
  },
  onReachBottom:function(){
    let that = this;

    goods.init(app, that).getSearchList(2);
  }
})