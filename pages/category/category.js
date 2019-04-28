import { category } from '../../utils/model/category'
var app = getApp()
Page({
  data: {
    list: {
      category: [],
      category_sub: []
    },
    parentid: 0,
    clickActive:'',
    options:'',
    class_Sub:1
  },
  onLoad: function (options) {
    let that = this;
    category.init(app, that).getParentList();
    var network = require('../../utils/network.js');
    network.network();
  },
  bindViewTab: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index;
    that.setData({
      clickActive: index
    });
    category.init(app, that).selectedItem(id);
  }
})