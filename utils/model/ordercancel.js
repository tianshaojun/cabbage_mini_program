    //取消订单
var inter = require('orderlist.js');
function cancel(that) {
  var methodstr = 'POST'
  var data = {
    openid: getApp().globalData.openid,
    token: getApp().globalData.projectId,
    id: that.data.id
  }
  httpProcess('V2/Order/cancel', data, methodstr, that);    
}

function callback(res, name, that) {    //数据回调函数，接口数据返回后的处理
  if (res.data.code==0){
    wx.showToast({
      title: "取消成功",
      icon: 'success',
      duration: 1000
    })
    that.setData({
      lists: [],
      pageIndex: 1
    })
    inter.orderList(that);
  }else{
    wx.showToast({
      title: "取消失败",
      icon: 'loading',
      duration: 1000
    })
  }
}
//执行http请求，勿动
function httpProcess(name, data, method, that) {
  var url = getApp().globalData.interface + name
  getApp().com.toDo(url, data, name, callback, method, that)
}
module.exports.cancel = cancel
