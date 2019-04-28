import { goodsDetail } from '../../utils/model/goods-detail'    //商品详情信息
var app = getApp()
const goods = require('../../libs/goods.detail.js');

var obj = null;
Page({

  data: {
    details: ['图文详情', '产品参数', "同店推荐"],
    info: {},
    selected: [],
    hide: true,
    num: 1,
    orderType: 'cart',
    index: 0,
    specThumb: '',
    tab: 0,
    isnew: 1,
    favorite: 0, //收藏                            
    list: {
      getDetail: [],       //商品详情
      getSpec: [],         //商品规格
      getParam: [],        //商品参数
      getComment: [],      //商品评论
      goods: [],           //商品列表
      getOption: [],       //商品属性
      getFavorite: [],     //点击收藏
    },
    page: {
      size: 6,
      index: 1,
      next: true
    },
    redic: 0,
    sq:1
  },

  onShow: function () {
    var that = this;
    goodsDetail.init(app, that).getFavorite();      //是否收藏
  },
  onLoad: function (option) {

    let that = this;

    obj = new goods(app, that);

    obj.find(option.id);
    this.setData({
      options: option,
    })
    var network = require('../../utils/network.js');
    network.network();
  },
  collect: function (e) {
    var that = this;
    that.setData({
      favo: e.currentTarget.dataset.favo
    })
    goodsDetail.init(app, that).getChangeFavorite();      //点击收藏
  },
  delcollect: function (e) {
    var that = this;
    goodsDetail.init(app, that).getDelFavorite();         //取消收藏
  },
  tab: function (e) {
    var that = this;
    var tab = e.currentTarget.dataset.ind
    that.setData({
      page: {
        index: 1,
        size: 6,
        next: true
      },
      tab: tab,
      goodcontent: [],
      Datalist: [],
      list: {
        goods: [],           //商品列表
        // getDetail: that.data.list.getDetail,       //商品详情
        getSpec: that.data.list.getSpec,         //商品规格
        getParam: that.data.list.getParam,        //商品参数
        getComment: that.data.list.getComment,      //商品评论
        goods: [],           //商品列表
        getOption: that.data.list.getOption,       //商品属性
        getFavorite: that.data.list.getFavorite,     //点击收藏
      }
    })
    if (tab == 3) {
      that.recommend();
    } else if (tab == 0) {
      that.gras();
    } else if (tab == 1) {
      that.parter();
    } else if (tab == 2) {
      that.recommend();
      // that.comment();//评论
    }
  },
  // 图文详情
  gras: function () {
    var that = this;
    goodsDetail.init(app, that).getDetail();    //商品详情信息
  },
  // 产品参数
  parter: function () {
    var that = this;
    goodsDetail.init(app, that).getParam();
  },
  // 用户评论
  comment: function () {
    var that = this;
    goodsDetail.init(app, that).getComment();
  },
  // 同店推荐
  recommend: function () {
    var that = this;
    goodsDetail.init(app, that).pageList('goods');
  },
  bindViewTab: function (e) {
    obj.process(e);
  },
  onShareAppMessage: function () {
    var that = this
    return {
      title: app.globalData.shareTitle,
      desc: app.globalData.shareDesc,
      path: 'pages/goods-detail/goods-detail?id=' + that.data.options.id
    };
  },
})