const father = require('../com.js');
class createorder extends father {

  //创建订单
  createOrder(e) {

    let that = this.that;
    // that.setData({
    //   remark: e.detail.value.remark
    // })

    //没有地址不能下单
    if (that.data.address == null) {
      wx.showToast({
        title: '收货地址空！',
        icon: 'loading',
        duration: 2000
      })
      return
    }


    wx.showLoading({
      title: '正在下单..',
      showCancel: false
    })

    let name = 'order/confirm'

    let url = this.getPath(name);

    let param = this.data;
    param.condition.orderType = that.data.orderType;
    if (param.condition.orderType == 'buyNow') {
      param.condition.optionid = that.data.goodsList[0].optionid;
      param.condition.buytotal = that.data.goodsList[0].total;
    }

    param.condition.addressid = that.data.address.id
    param.condition.remark = that.data.remark
    param.condition.ids = that.data.ids;
    param.condition.openid = this.openid;
    param.type = param.condition.orderType;

    this.post(url, param).then(function (res) {
      wx.hideLoading();

      let orderid = res.data.data.orderid;
      orderid = parseInt(orderid);

      if (orderid > 0) {

        wx.showToast({
          title: '下单成功！',
          icon: 'success',
          duration: 2000,
          success: function () {
            console.log('ok');
            wx.redirectTo({
              url: '../pay/index?orderid=' + orderid,
            })
          }
        })
      } else {
        wx.showToast({
          title: '下单失败！',
          icon: 'loading',
          duration: 2000
        })
      }

    })

  }

  //获取配送列表（含邮费）
  getDispatch() {

    let that = this.that;

    let name = "dispatch/query";

    let url = this.getPath(name);

    let param = {
      condition: {
        uniacid: this.uniacid,
        enabled: 1
      }
    }

    let promise = this.post(url, param);

    promise.then(function (res) {

      that.setData({
        dispatchInfo: res.data.data
      })
    })

    return promise;
  }

  /*
  * 获取默认收货地址
  */
  getAddress() {

    let that = this.that;

    let name = 'address/query';

    let url = this.getPath(name);

    let param = {
      condition: {
        uniacid: this.uniacid,
        openid: this.openid,
        isdefault: 1
      },
    };

    let promise = this.post(url, param);

    promise.then(function (res) {

      that.setData({
        address: res.data.data
      })
    })
  }

  /*
  * 
  */

  /*
   * 计算总价格等
   * */
  orderprocess(shop) {

    let that = this.that;
    //计算重量
    let weight = this.getWeight(shop);

    //计算运费

    let freight = this.getFreight(weight, that.data.dispatchInfo);


    let price = 0;

    let arr_id = [];
    for (let i = 0; i < shop.length; i++) {
      let tprice = parseFloat((shop[i].price * shop[i].total).toFixed(2));
      price += tprice;

      arr_id.push(shop[i].id);
    }

    let ids = arr_id.join(',');
    console.log(shop)
    that.setData({
      ids: ids,
      goodsList: shop,
      allGoodsPrice: price,
      yunPrice: freight,
      allGoodsAndYunPrice: (parseFloat(price) + parseFloat(freight)).toFixed(2)
    })
    console.log(that.data.goodsList)
  }

  /*
   * 计算商品总重量
   * */
  getWeight(data) {

    let weight = 0;
    for (let i = 0; i < data.length; i++) {

      //包邮不计算重量
      if (data[i].issendfree == 0) {

        weight += parseInt(data[i].weight * data[i].total);
      }
    }

    return weight;
  }
  /*
  * 计算邮费
  * weight:商品总重量
  */
  getFreight(weight, data) {


    let freight = data['firstprice'];

    if (weight > data['firstweight']) {

      let last = weight - data['firstweight'];

      let n = parseInt(last / data['secondweight']);

      let mod = last % data['secondweight'];

      if (mod != 0) {
        n += 1;
      }

      freight += n * data['secondprice']

    }

    return freight;
  }


  /**
   *  获取立即下单数据：虽然一个商品，但是要包装成一个数组，与购物车保持一致
   */
  getBuynowData() {

    let that = this.that;
    let self = this;
    console.log('buyNowMethod')
    //1、获取到配送方式，再获取当前要结算的商品
    wx.getStorage({
      key: 'buynow',
      success: function (res) {
        let shop = []
        console.log(res.data)
        shop.push(res.data);
        let len = shop.length;

        for (let i = 0; i < len; i++) {

          // let price = shop[i].option_price;

          // price = price == 0 ? shop[i].marketprice : price;
          // shop[i].price = price;
        }

        console.log(shop);

        self.orderprocess(shop);

      },
      error: function (res) {
        console.log(res);
      }
    })
  }

  getCartPayData(e) {

    let that = this.that;

    that.setData({
      ids: e.ids
    })

    let name = 'cart/select';

    let url = this.getPath(name);

    let param = this.data;
    param.condition.openid = this.openid;
    param.ids = e.ids;
    param.order="id desc";
    let selft = this;
    this.post(url, param).then(function (res) {
      let len = res.data.data.length;

      for (let i = 0; i < len; i++) {


        let price = res.data.data[i].option_price;
        console.log(price==null)
        price = price == null ? res.data.data[i].marketprice : price;


        // price = price == null ? res.data.data[i].marketprice : price;

        res.data.data[i].option_title = res.data.data[i].option_title == null ? '' : res.data.data[i].option_title;

        res.data.data[i].price = price;
      }

      selft.orderprocess(res.data.data);

    })

  }

}

module.exports = createorder