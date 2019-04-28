/*
* 浏览记录  和  收藏  列表
*/

function historyOrFavorite(app, that) {
  this.common = app.init(that);
  /**
   * getHistoryList => 浏览记录列表
   */
  this.getHistoryList = function () {
    let name = 'history/view';
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        openid: app.globalData.openid,
      },
      relation: {
        left: {
          name: 'ewei_shop_member_history',
          field: 'id,goodsid'
        },
        right: {
          name: 'ewei_shop_goods',
          field: 'title,thumb,marketprice'
        },
        relation: 'ewei_shop_member_history.goodsid = ewei_shop_goods.id',
      },
      page: that.data.page,
      order: 'id desc'
    }
    this.common.request(name, data, this.callback);
  }
  /**
   * getFavoriteList => 收藏列表
   */
  this.getFavoriteList = function () {
    let name = 'favorite/view';
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        openid: app.globalData.openid,
        deleted: 0,
      },
      relation: {
        left: {
          name: 'ewei_shop_member_favorite',
          field: 'id,goodsid'
        },
        right: {
          name: 'ewei_shop_goods',
          field: 'title,thumb,marketprice,deleted'
        },
        relation: 'ewei_shop_member_favorite.goodsid = ewei_shop_goods.id',
      },
      page: that.data.page,
      order: 'id desc'
    }
    this.common.request(name, data, this.callback);
  }
  let obj = this;

  /**
   * delHistory => 删除足迹
   */
  this.delHistory = function () {
    let name = 'history/del';
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        openid: app.globalData.openid,
        goodsid: that.data.goodsId,
        deleted: that.data.deleted,
      },
    }
    this.common.request(name, data, this.callback, true).then(function () {
      obj.getHistoryList();
    });
  }

  /**
   *  delFavorite => 删除收藏
   */
  this.delFavorite = function () {
    let name = 'favorite/del';
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        openid: app.globalData.openid,

        goodsid: that.data.goodsid,
        // deleted: that.data.deleted,
        // id: that.data.id,
      },
      order: 'id desc',
    }
    this.common.request(name, data, this.callback, true).then(function (res) {
      if(res.data.data==1&&res.data.code==0){
        that.data.list.splice(that.data.index,1)
        that.setData({
          list:that.data.list
        })
      }
    });
  }

  this.callback = function (name, res) {
    let itemsList = that.data.itemsList;
    switch (name) {
      case 'history/view':                             //浏览记录列表
        var de = res.data.data;
        if (res.data.data.length == 0) {
          that.setData({
            page: {
              index: that.data.page.index,
              size: that.data.page.size,
              next: false
            },
          })
          return;
        }
        for (let i = 0; i < res.data.data.length; i++) {
          that.data.list.push(de[i])
        }
        that.setData({
          list: that.data.list
        })

        break;
      case 'favorite/view':                             //浏览记录列表
        var de = res.data.data;
        if (res.data.data.length == 0) {
          that.setData({
            page: {
              index: that.data.page.index,
              size: that.data.page.size,
              next: false
            },
          })
          return;
        }
        for (let i = 0; i < res.data.data.length; i++) {
          that.data.list.push(de[i])
        }
        that.setData({
          list: that.data.list
        })
        break;
      default:
        break;
    }
  }
  return this;
}

/**
 * 点击新增 ，删除  编辑 后返回
 */
module.exports.historyOrFavorite = {
  init: historyOrFavorite
}