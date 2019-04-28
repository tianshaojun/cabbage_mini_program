function goodsDetail(app, that) {
  this.common = app.init(that);
  this.pageList = function () {
    let name = 'goods/select';       //同店推荐
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        isnew: that.data.isnew
      },
      order: "id desc",
      page: that.data.page,
    }
    this.common.request(name, data,null,true).then(function(res){
       var list=that.data.list;
       list.goods=res.data.data
       that.setData({
         list:that.data.list
       })
    });
  }

  this.getDetail = function () {
    let name = 'goods/query';       //商品详情
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        id: that.data.options.goodsid
      },
      order: "id desc",
      page: that.data.page,
      serialize: "thumb_url",
    }
    this.common.request(name, data, this.callback);
  }

  this.getSpec = function () {      //商品规格
    let name = 'spec/select';
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        goodsid: that.data.options.goodsid
      },
      order: "id desc",
    }
    let promise = this.common.request(name, data, null, true);
    var obj = this;
    promise.then(function (res) {
      let list = that.data.list;
      list.getSpec = res.data.data;
      that.setData({ list: list })
      if (list.getSpec != '' && list.getSpec != null && list.getSpec != undefined && res.data.code == 0) {
        for (let i = 0; i < list.getSpec.length; i++) {
          that.data.optionids.push(list.getSpec[i].items[0].id)
        }
        that.setData({
          optionids: that.data.optionids,
          two: that.data.optionids,
        })
        for (let i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].items[0].thumb != '') {
            that.setData({
              thumb: res.data.data[i].items[0].thumb,
            })
          }
        }
        for (let i = 0; i < list.getSpec.length; i++) {
          for (let j = 0; j < that.data.list.getSpec[i].items.length; j++) {
            if (that.data.list.getSpec[i].items[j].thumb != '') {
              that.setData({
                i: i
              })
            }
          }

        }
      }
      obj.getOption()
    })
  }
  this.getOption = function () {      //点击获取商品属性
    let name = 'option/select';
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        goodsid: that.data.options.goodsid
      },
      order: "id desc",
      page: {
        index: 1,
        size: 10
      }
    }
    var obj=this;
    this.common.request(name, data,null,true).then(function(res){
       that.setData({
         optionid:res.data.data
       })
       obj.opts()
    });
  }

  this.opts=function(){
    that.setData({
      two: that.data.optionids
    })
    var specs= that.data.two;
    var sort_specs_arr = sortSpecs(specs);

    var data = that.data.optionid;
    console.log(data)
    for (let i = 0; i < data.length; i++) {
      let arr =data[i].specs.split('_');
      let arr_sort = sortSpecs(arr);
      console.log(arr_sort)
      let math = isMatch(arr_sort, sort_specs_arr);
      if (math) {
        console.log(data[i])
        that.setData({
          opti:data[i].id,
          title: data[i].title,
          marketprice: data[i].marketprice,
          total: data[i].stock,
        })
        break
      }
    }
  }
  this.getParam = function () {
    let name = 'param/select';    //商品参数
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        goodsid: that.data.options.goodsid
      },
      order: "id desc",
    }
    this.common.request(name, data, this.callback);
  }
  this.getComment = function () {
    let name = 'comment/select';    //用户评论
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        openid: app.globalData.openid,
        goodsid: that.data.options.goodsid,
      },
      order: "id desc",
      page: that.data.page
    }
    this.common.request(name, data, this.callback);
  }
  this.getFavorite = function () {
    let name = 'favorite/query';    //是否收藏
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        openid: app.globalData.openid,
        goodsid: that.data.options.goodsid,
      },
      order: "id desc",
    }
    this.common.request(name, data, this.callback);
  }
  this.getChangeFavorite = function () {
    let name = 'favorite/add';    //点击收藏
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
      },
      data: {
        uniacid: app.globalData.projectId,
        openid: app.globalData.openid,
        goodsid: that.data.options.goodsid,
      },
      order: "id desc",
    }
    this.common.request(name, data, this.callback);
  }
  this.getDelFavorite = function () {
    let name = 'favorite/del';    //取消收藏
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        openid: app.globalData.openid,
        goodsid: that.data.options.goodsid,
      },
      order: "id desc",
    }
    this.common.request(name, data, this.callback);
  }
  this.getAddCart = function () {
    let name = 'cart/add';    //加入购物车
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
      },
      data: {
        uniacid: app.globalData.projectId,
        openid: app.globalData.openid,
        goodsid: that.data.options.goodsid,
        total: that.data.num,
        optionid: that.data.opti,
      },
    }
    this.common.request(name, data, this.callback);
  }
  this.callback = function (name, res) {
    let list = that.data.list;
    switch (name) {
      case 'goods/query':
        list.getDetail = res.data.data;
        if (list.getDetail != '' && list.getDetail != null && list.getDetail != undefined && res.data.code == 0) {
          that.setData({
            list: list,
            total: res.data.data.total,
            nodes: list.getDetail.content
          })
        }
        break;
      case 'spec/select':
        list.getSpec = res.data.data;
        if (list.getSpec != '' && list.getSpec != null && list.getSpec != undefined && res.data.code == 0) {

          that.setData({
            list: list,
            thumb: res.data.data[0].items[0].thumb
          })

        }
        break;
      case 'option/query':
        if (res.data.data != null && res.data.data != '') {
          let de = res.data.data;
          that.setData({
            marketprice: de.marketprice,
            total: de.stock,
            title: de.title,
            optionid: res.data.data.id
          })
        } else {
          let th = that.data.list.getDetail;
          console.log(th)
          that.setData({
            marketprice: th.marketprice,
            total: th.total,
            title: '',
            optionid: 0
          })
        }
        break;
      case 'param/select':
        list.getParam = res.data.data;
        if (list.getParam != '' && list.getParam != null && list.getParam != undefined && res.data.code == 0) {
          that.setData({
            list: list,
          })
        }
        break;
      case 'comment/select':
        list.getComment = res.data.data;
        if (list.getComment != '' && list.getComment != null && list.getComment != undefined && res.data.code == 0) {
          that.setData({
            list: list,
          })
        }
        break;
      case 'favorite/query':
        list.getFavorite = res.data.data;
        let favorite = that.data.favorite
        if (list.getFavorite != '' && list.getFavorite != null) {
          that.setData({
            favorite: 1,
          })
        } else {
          that.setData({
            favorite: 0,
          })
        }
        break;
      case 'favorite/add':
        list.getChangeFavorite = res.data.data;
        if (res.data.code == 0) {
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 1000,
          })
          that.setData({
            list: list,
            favorite: 1,
          })
        } else {
          wx.showToast({
            title: '收藏失败',
            icon: 'loading',
            duration: 1000,
          })
        }
        break;
      case 'favorite/del':
        list.getDelFavorite = res.data.data;
        if (res.data.code == 0) {
          wx.showToast({
            title: '取消成功',
            icon: 'success',
            duration: 1000,
          })
          that.setData({
            list: list,
            favorite: 0,
          })
        } else {
          wx.showToast({
            title: '取消失败',
            icon: 'loading',
            duration: 1000,
          })
        }
        break;
      case 'cart/add':
        list.getAddCart = res.data.data;
        console.log(res)
        if (res.data.code == 0) {
          that.setData({
            list: list,
          })
          wx.showToast({
            title: '加入成功',
            icon: 'success',
            duration: 1000,
          })
        } else {
          wx.showToast({
            title: '加入失败',
            icon: 'loading',
            duration: 1000,
          })
        }
        break;
      default:
        break;

    }
  }
  return this;
}
function isMatch(arr1, arr2){
  let match = arr1.length == arr2.length;
  if (match) {
    for (let i = 0; i < arr1.length; i++) {
      if (parseInt(arr1[i]) != parseInt(arr2[i])) {
        match = false;
        break;
      }
    }
  }
  return match;
}
//升序
function sortSpecs(data){
  for (let i = 0; i < data.length-1; i++) {
    for (let j = i + 1; j < data.length; j++) {
      if (data[i] > data[j]) {
        let temp = 0;
        temp = data[j];
        data[j] = data[i];
        data[i] = temp;
      }
    }
  }
  return data;
}
module.exports.goodsDetail = {
  init: goodsDetail,
}