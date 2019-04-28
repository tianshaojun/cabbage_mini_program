/*
* 商户数据处理：轮播图、分类、基础信息
*/
const father = require('../com.js')
class pay extends father {

  query(id){
    let that = this.that;

    wx.showToast({
      title: '正在处理,请勿退出..',
      duration: 2000
    })

    let name = 'pay/query';
    let url = this.getPath(name);
    let data = {
      condition:{
        uniacid:this.uniacid,
        openid:this.openid,
        orderid:id
      }
    }

    this.post(url, data).then(function(res){
      wx.showToast({
        title: '成功支付',
      })
      setTimeout(function(){
        wx.redirectTo({
          url: '../order-list/order-list?ind=0',
        })
      })
      if(res.data.data){
        that.setData({
          payok:true
        })
      }
    })
  }

  find(orderid){
    let that = this.that

    let name = 'order/query';

    let url = this.getPath(name);

    let data = {
      condition: {
        uniacid: this.uniacid,
        openid: this.openid,
        id: orderid
      }
    }

    let obj = this;

    let promise = this.post(url,data);

    promise.then(function (res) {
      console.log(res)
      that.setData({

        payinfo: res.data.data
      })
    })

    promise.then(function (res) {
      let name = 'pay/unifiedorder';
      let url = obj.getPath(name);
      let data = {
        condition: {
          uniacid: obj.uniacid,
          openid: obj.openid,
          orderid: orderid
        }
      }

      obj.post(url,data).then(function(res){
          that.setData({
            config: res.data.data
          })
      }, function(){
        wx.showModal({
          title: "信息错误请联系客服2",
        })
      })
    }, function () {
      wx.showModal({
        title: "信息错误请联系客服1",
      })
    })
  }
}
module.exports = pay;