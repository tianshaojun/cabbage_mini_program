class common {

  /*
  * 初始化函数
  */
  constructor(app, that) {

    this.app = app;
    this.that = that;

    this.uniacid = this.app.globalData.projectId;
    this.openid = this.app.globalData.openid;
    this.accessToken = this.app.globalData.accessToken;

    this.host = this.app.globalData.host;
    this.project = this.app.globalData.project;

    this.header = {
      'Content-Type': "application/json",
      'accessToken': this.accessToken,
      'projectId': this.uniacid
    }

    this.data = {
      condition: {
        uniacid: this.uniacid
      }
    }

  }

  /*
  * 获取condition
  */
  getCondition() {

    let condition = {};
    for (let i in this.data.condition) {
      condition[i] = this.data.condition[i];
    }

    return condition;
  }

  /*
  * 获取接口请求url
  */
  getPath(name) {
    return this.host + this.project + '/' + name;

  }

  /*
  * 添加header
  */
  addHeader(name, value) {
    this.header[name] = value;
  }


  /*
  * http请求
  */
  post(url, data) {

    let promise = this.httpsPromisify(wx.request)({
      url: url,
      header: this.header,
      method: "POST",
      data: data
    })

    return promise;
  }

  httpsPromisify(fn) {
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

}

module.exports = common