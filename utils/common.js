/*
* 公共方法：调用接口
*/
let es6 = require('es6-promise.js');

import { field } from 'config.field';

function init(app, that) {

  this.getOpenid = function (code) {

    let name = 'user/getopenid';

    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        code: code
      }
    }

    let promise = this.requestPromise(name, data);

    return promise;

  }

  //获取分页列表数据
  this.getNextPageList = function (name) {

    let next = that.data.page.next;
    if (!next) {

      console.log('没有下一页了！');
      return
    }

    that.data.page.index += 1

    let promise = that.getPageList();

    promise.then(function (res) {
      that.setData({ loading: true })
      if (res.data.data.length == 0) {

        let page = that.data.page;

        page.next = false;

        that.setData({
          page: page, 
          hide: false
        })
      }
      if (res.data.data.length<that.data.page.size){
        that.setData({
          hide: false
        })
      }

      //追加内容
      let list = that.data.list;

      for (let i = 0; i < res.data.data.length; i++) {

        list[name].push(res.data.data[i]);
      }

      that.setData({

        list: list
      })

    })

  }

  this.request = function (name, data, callback, promise = false) {

    let call = this.requestPromise(name, data);


    if (promise) {

      return call;
    }

    call.then(function (res) {

      callback(name, res)
    })
  }

  this.requestPromise = function (name, data) {

    let url = this.getApiPath(name);

    let header = {};
    header['Content-Type'] = "application/json";
    header['accessToken'] = app.globalData.accessToken;
    header['projectId'] = app.globalData.projectId;
    header['field'] = field.get(name);

    let promise = this.httpsPromisify(wx.request)({
      url: url,
      header: header,
      method: "POST",
      data: data
    })

    return promise;

  }

  this.getApiPath = function (name) {

    return app.globalData.host + app.globalData.project + '/' + name;

  }

  this.httpsPromisify = function (fn) {
    return function (obj = {}) {
      return new Promise((resolve, reject) => {
        obj.success = function (res) {
          resolve(res)
        }

        obj.fail = function (res) {
          reject(res)
        }

        fn(obj)
      })
    }
  }


  return this;

}

module.exports.com = {
  init: init
}