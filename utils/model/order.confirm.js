const father = require('../com.js');
const dispatch = require('dispatch.js');
class createorder extends father {
  constructor(app, that) {
    super(app, that);
    this.dispatch = new dispatch();
  }
  //创建订单
  createOrder(e) {
    let that = this.that;
    that.setData({
      // remark: e.detail.value.remark
    })
    //没有地址不能下单
    if (that.data.address == null) {
      wx.showToast({
        title: '请选择邮寄地址！',
        icon: 'loading',
        duration: 2000
      })
      return
    }
    wx.showToast({
      title: '正在下单..',
      icon: 'loading',
      duration: 2000
    })
    let name = 'order/confirm'
    let url = this.getPath(name);
    let param = this.data;
    param.condition.orderType = that.data.orderType;
    console.log(that.data.orderType);
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
          title:res.data.data,
          icon: 'error',
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
      order: 'isdefault desc'
    };

    let promise = this.post(url, param);

    promise.then(function (res) {

      that.setData({
        address: res.data.data
      })
    })
  }

  /*
 * 计算总价格等
 * */
  orderprocess(shop) {
    console.log(shop)
    let that = this.that;
    var dispatchInfoData = that.data.dispatchInfo
    //计算运费
    this.dispatch = new dispatch();
    var freight=0;
    if (dispatchInfoData == "" || dispatchInfoData == null || dispatchInfoData==undefined){
      freight= this.dispatch.getFreight(shop, 0);
    }else{
      freight = this.dispatch.getFreight(shop, that.data.dispatchInfo);
    }
    console.log(freight)
    let price =0;

    let arr_id = [];
    let totalNum = 0
    for (let i = 0; i < shop.length; i++) {
      let itemPrice = shop[i].option_price == 0 || shop[i].option_price == null ? shop[i].marketprice : shop[i].option_price;
      let tprice = parseFloat((itemPrice * shop[i].total).toFixed(2));
      price += tprice;
      let totals=shop[i].total
      totalNum += totals
      arr_id.push(shop[i].id);
    }
    let ids = arr_id.join(',');
    if (freight == NaN || dispatchInfoData == "NaN"){
      freight=0;
    }
    that.setData({
      totalNum: totalNum,
      ids: ids,
      goodsList: shop,
      allGoodsPrice: parseFloat(price).toFixed(2),
      yunPrice:parseFloat(freight).toFixed(2),
      allGoodsAndYunPrice: (parseFloat(price) + parseFloat(freight)).toFixed(2)
    })
  }
  /**
   *  获取立即下单数据：虽然一个商品，但是要包装成一个数组，与购物车保持一致
   */
  getBuynowData() {

    let that = this.that;
    let self = this;
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

    let selft = this;
    this.post(url, param).then(function (res) {
      let len = res.data.data.length;

      for (let i = 0; i < len; i++) {


        let price = res.data.data[i].option_price;

        price = price == null ? res.data.data[i].marketprice : price;


        price = price == null ? res.data.data[i].marketprice : price;

        res.data.data[i].option_title = res.data.data[i].option_title == null ? '' : res.data.data[i].option_title;

        res.data.data[i].price = price;
      }

      selft.orderprocess(res.data.data);

    })

  }

}

module.exports = createorder