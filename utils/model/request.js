class http {


  post(url, data) {       //执行post请求

    let header = {
      'Content-Type': "application/json"
    }

    let headers = this.getHeader();

    for (let i in headers) {
      header[i] = headers[i];
    }

    let promise = this.httpsPromisify(wx.request)({
      url: url,
      header: header,
      method: "POST",
      data: data
    })

    return promise;
  }

  addHeader(obj) {       //添加请求头header
    this.header = obj;
  }

  getHeader() {          //获取请求头header
    return this.header;
  }

  httpsPromisify(fn) {  //封装的wx.request,返回一个promise对象
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

const request = new http().__proto__;

module.exports = request;