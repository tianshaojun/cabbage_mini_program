
function special(app, that) {
  //全部商品
  this.common = app.init(that);
  this.allShop = function () {
    let name = 'goods/select';    
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        status:1,
        deleted:0
      },
      order: "id asc",
    }
    this.common.request(name, data, null, true).then(function (res) {
      that.setData({
        allShop: res.data.data
      })
    });
  }
  //推荐
  this.isreShop = function () {
    let name = 'goods/select';
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        isrecommand: 1,
        status: 1,
        deleted: 0
      },
      order: "id asc",
    }
    this.common.request(name, data, null, true).then(function (res) {
      that.setData({
        isreShop: res.data.data
      })
    });
  }
  //热卖
  this.ishotShop = function () {
    let name = 'goods/select';
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        ishot:1,
        status: 1,
        deleted: 0
      },
      order: "id asc",
    }
    this.common.request(name, data, null, true).then(function (res) {
      that.setData({
        ishotShop:res.data.data
      })
    });
  }
  //新品
  this.isnewShop = function () {
    let name = 'goods/select';
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        isnew: that.data.isnew,
        status: 1,
        deleted: 0
      },
      order: "id asc",
    }
    this.common.request(name, data, null, true).then(function (res) {
      that.setData({
        isnewShop: res.data.data
      })
    });
  }
  this.single=function(){
    let name = 'goods/query';
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        isrecommand:1,
        status: 1,
        deleted: 0
      },
      order: "displayorder desc",
    }
    this.common.request(name, data, null, true).then(function (res) {
      that.setData({
        single: res.data.data
      })
    });
  }
  return this;
}
module.exports.special = {
  init: special
}