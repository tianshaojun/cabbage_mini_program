/**分类*/
import { goods } from 'goods'
function init(app, that) {
  this.common = app.init(that);
  //获取一级分类
  this.getParentList = function () {
    let obj = this;
    let promise = this.getList('category');
    promise.then(function (res) {
      //加载完毕，模拟点选第一个
      let id = res.data.data[0].id;
      obj.selectedItem(id);
    })
  }
  //获取二级分类
  this.getSubList = function () {
    this.getList('category_sub');
  }
  //用户选中一级分类
  this.selectedItem = function (id) {
    that.setData({
      parentid: id
    })
    this.getSubList();
  }

  this.getList = function (level) {
    let name = 'category/select';
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        parentid: that.data.parentid,
        level: that.data.level,
        enabled: 1
      },
      order: 'displayorder desc'
    }
    let promise = this.common.request(name, data, null, true);
    promise.then(function (res) {
      let list = that.data.list;
      list[level] = res.data.data;
      that.setData({
        list: list,
      })
    })
    return promise;
  }
  this.isrecommandClass = function () {      //推荐分类
    let name = 'category/select';
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        goodsid: that.data.options.goodsid,
        isrecommand: that.data.isrecommand,
        level:2,
        enabled:1
      },
      order: "displayorder desc",
    }
    let promise = this.common.request(name, data, null, true);
    var obj = this;
    promise.then(function (res) {
      var list = that.data.list;
      list.category_sub=res.data.data
      that.setData({list:that.data.list});
      goods.init(app, that).getPageList('goods');
    })
  }
  return this
}
module.exports.category = {
  init: init
}