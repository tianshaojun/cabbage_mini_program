const father = require('../com.js')
class order extends father {

  /*
  * 取消订单
  */
  cancel(id) {
    let name = 'order/cancel';

    let url = this.getPath(name);

    this.openid = getApp().globalData.openid;

    this.data.condition.openid = this.openid;
    this.data.condition.id = id;
    let that = this.that;

    let call = this.post(url, this.data);

    call.then(function (res) {

      if (res.data.data == 1) {

        that.setData({
          list_order: that.data.list_order
        })

        wx.hideLoading();
        wx.showLoading({
          title: '成功',
          duration: 600
        })

      }
      wx.hideLoading();
    })

    return call;
  }
  shouhuo(id){
    let name = 'order/shouhuo';

    let url = this.getPath(name);

    this.openid = getApp().globalData.openid;

    this.data.condition.openid = this.openid;
    this.data.condition.id = id;
    let that = this.that;

    let call = this.post(url, this.data);

    call.then(function (res) {
      console.log('确认收货')
    
      if (res.data.data == 1) {
        that.setData({
          list_order: that.data.list_order
        })
        // wx.hideLoading();
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      }
      wx.hideLoading();
    })
  }

  /*
  * 商品分页列表
  */
  getPageList(status, push = false) {

    let that = this.that;

    if (!that.data.page.next) {
      console.log('没有下一页了！')
      return
    }

    that.data.page.index += 1;

    this.data.page = that.data.page

    this.getList(status, push);//获取商品列表
  }

  /*
  * 获取列表数据
  */
  getList(status, push = false) {

    let name = 'order/select';

    let url = this.getPath(name);

    let field = 'id,ordersn,price,discountprice,paytype,remark,createtime,status';

    this.addHeader('field', field);

    if (status != -1) {
      this.data.condition.status = status;
    }
    //this.openid = this.openid;
    this.data.condition.openid = this.openid;
    this.data.order = 'id desc';

    let that = this.that;
    this.post(url, this.data).then(function (res) {

      let list = that.data.list_order;

      if (push) {
        for (let i = 0; i < res.data.data.length; i++) {
          list.push(res.data.data[i]);
        }
      } else {
        list = res.data.data;
      }

      that.data.page.next = res.data.data.length > 0;

      that.setData({
        list_order: list,
        page: that.data.page
      })
    })
    //end

  }

}

module.exports = order