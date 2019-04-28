/** 商品列表 **/
function goods(app, that) {
  this.common = app.init(that);
  this.getPageList = function (name) {
    this.common.getNextPageList(name);
  }
  this.getListByCategoryId = function () {
    let name = 'goods/select';
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        status: 1,
        deleted:0,
      },
      page: that.data.page,
    }
    // if (that.data.isrecommand == 1) {
    //   data.condition.isrecommand = that.data.isrecommand
    // }
    if (that.data.ccate > 0) { data.condition.ccate = that.data.ccate }
    if (that.data.nav == 1) {
      if (!that.data.desc) {
        data.order = 'marketprice desc'
      } else {
        data.order = 'marketprice asc'
      }
    } else if (that.data.nav == 0){
      if (!that.data.desc) {
        data.order = 'salesreal desc'
      } else {
        data.order = 'salesreal asc'
      }
    }else{
      data.order = 'displayorder desc'

    }
    let promise = true;
    let call = this.common.request(name, data, null, true);
    return call;
  }
  this.getSearchList = function (tipe) {
    if(tipe==1){
      that.setData({
        list: {
          goods: []
        }
      })
    }else {
      let page = that.data.page;
      if (page.next == false){
        return 
      }
      that.data.page.index += 1
    }
   
    let name = 'goods/select';
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        status: 1,
        deleted: 0,
      },
      search: {
        key: 'title',
        value: that.data.goodsname
      },
      page: that.data.page,
      order: 'displayorder desc'
    }
    let call = this.common.request(name, data, null, true).then(function (res) {
      if (res.data.data.length == 0) {
        let page = that.data.page;
        page.next = false;
        that.setData({
          page: page
        })
        return
      }
      //追加内容
      let list = that.data.list;
      for (let i = 0; i < res.data.data.length; i++) {
        list.goods.push(res.data.data[i]);
      }
      that.setData({
        list: list
      })
    });
  }
  return this;

}
module.exports.goods = {
  init: goods
}