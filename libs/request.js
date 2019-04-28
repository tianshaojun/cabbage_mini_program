/*
* http请求类
* @post
*/
let http =  {

  post(url, data, header,method = 'POST') {  
    
    let promise = this.httpsPromisify(wx.request)({
      url: url,
      header: header,
      method: method,
      data: data
    })

    return promise;
  },

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
module.exports = http;