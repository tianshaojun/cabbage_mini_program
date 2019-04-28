/** 商户基础数据*/
function corp(app, that) {
  this.common = app.init(that);
  this.getBanner = function () {
    let name = 'banner/select';
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        enabled: 1
      }

    }
    this.common.request(name, data, this.callback);
  }
  this.callback = function (name, res) {
    let list = that.data.list;
    switch (name) {
      case 'banner/select':
        list.banner = res.data.data;
        that.setData({
          list: list
        })
        break;
      default:
        break;
    }
  }
  this.sysset = function () {
    let name = 'sysset/query';
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
      },
      serialize: 'sets',
    }
    let call = this.common.request(name, data, null, true).then(function (res) {
      if (res.data.data.sets.shop.name) {
        wx.setNavigationBarTitle({ title: res.data.data.sets.shop.name, })
      }
      if (that.data.versionnumber == 1) {
        console.log("opneis=====" + app.globalData.openid)
        setTimeout(function () {
          if (app.globalData.openid === '' || app.globalData.openid === 0) {
            wx.redirectTo({
              url: "/pages/pagelogs/pagelogs",
            })
          } else {   
            // wx.switchTab({
            //   url: '../home/' + getApp().globalData.themes + '/index'
            // })
          }
        }, 1500)

      }
      getApp().globalData.shopinfolo = res.data.data
      that.setData({ shopinfolo: res.data.data })
    });
  }
  return this;
}
module.exports.corp = {
  init: corp
}

