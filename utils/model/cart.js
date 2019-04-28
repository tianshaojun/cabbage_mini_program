/*
* 购物车操作类
*/
const father = require('../com.js')
class cart extends father {

  /*
  * 去结算
  */
  toPay() {
    let that = this.that;
    console.log(that.data.cart.list)
    let len = that.data.cart.list.length;

    let arr_id = [];
    var listsSelect = []
    for (let i = 0; i < len; i++) {
      if (that.data.cart.list[i].selected) {
        arr_id.push(that.data.cart.list[i].id);
        listsSelect.push(that.data.cart.list[i])
      }
      console.log(listsSelect)
      // 库存不足 
    }
    for (let i = 0; i < listsSelect.length; i++) {
      if (listsSelect[i].stock === 0) {
        wx.showModal({
          title: '提示',
          content: '您选择的商品库存为0！',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })

        return;
      }
    }
    //如果没有选择商品，则提示并返回

    if (arr_id.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择要结算的商品！',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })

      return;
    }

    let ids = arr_id.join(',');
    let orderType = 'cart';
    if (ids != '' && ids != ',') {
      let url = '../order-confirm/order-confirm';
      url += '?orderType=' + orderType;
      url += '&ids=' + ids;

      wx.navigateTo({
        url: url
      })
    }
  }
  touchStar(e) {
    let that = this.that;
    if (e.touches.length == 1) {
      that.setData({
        startX: e.touches[0].clientX
      });
    }
  }
  touchMove(e) {

    let that = this.that;
    let index = e.currentTarget.dataset.index;
    var cart = that.data.cart;
    cart.list = that.data.cart.list
    console.log(cart)
    for (var i = 0; i < cart.length; i++) {
      cart.list[i].txtStyle = ""
    }
    that.setData({ cart: cart })
    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var disX = that.data.startX - moveX;
      var delBtnWidth = that.data.delBtnWidth;
      var left = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，container位置不变
        left = "margin-left:0rpx";
      } else if (disX > 0) {//移动距离大于0，container left值等于手指移动距离
        left = "margin-left:-" + disX + "rpx";
        if (disX >= delBtnWidth) {
          left = "left:-" + delBtnWidth + "rpx";
        }
      }
      that.data.cart.list[parseInt(index)].left = left;

      that.setData({
        cart: that.data.cart
      })
    }
  }

  touchEnd(e) {
    let that = this.that;
    let index = e.currentTarget.dataset.index;
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = that.data.startX - endX;
      var delBtnWidth = that.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left = disX > delBtnWidth / 2 ? "margin-left:-" + delBtnWidth + "rpx" : "margin-left:0rpx";

      that.data.cart.list[parseInt(index)].left = left;

      that.setData({
        cart: that.data.cart
      })
    }
  }


  getList() {

    let obj = this;

    let that = this.that;

    let name = 'cart/select';

    let url = this.getPath(name);

    this.data.condition.openid = this.openid;

    let promise = this.post(url, this.data);

    promise.then(function (res) {
      console.log(res)

      let len = res.data.data.length;
      console.log(res.data.data + "55555555555555555555555555555")
      let list = res.data.data;

      for (let i = 0; i < len; i++) {
        list[i].selected = true;

        let price = list[i].option_price;

        price = price == null ? list[i].marketprice : price;

        let total = list[i].optionid != 0 ? list[i].stock : list[i].markettotal;

        list[i].marketprice = price;

        list[i].stock = total;
      }
      // console.log(list)
      obj.that.setData({
        cart: {
          list: list
        }
      })
      obj.reCount();


    })

  }

  //增减商品
  changeTotal(index, num) {
    let that = this.that;
    that.data.index = index;

    that.data.cart.list[index].total = parseInt(that.data.cart.list[index].total) + parseInt(num);
    //不能小于1
    that.data.cart.list[index].total = that.data.cart.list[index].total < 1 ? 1 : that.data.cart.list[index].total;

    //重新计算
    this.reCount();

    let name = 'cart/update';

    let url = this.getPath(name);

    this.data.condition.openid = this.openid;
    this.data.condition.id = that.data.cart.list[index].id

    this.data.data = {
      total: that.data.cart.list[index].total
    }

    //保存到购物车
    this.post(url, this.data);

  }

  /*
  * 选中\取消全部
  */
  selectedAll() {

    let obj = this;

    let b = this.that.data.cart.selectedAll;

    let len = this.that.data.cart.list.length;

    for (let i = 0; i < len; i++) {

      this.that.data.cart.list[i].selected = !b;
    }

    obj.reCount();

  }

  /*
  * 选中\取消一个商品
  */
  selectedItem(index) {

    this.that.data.cart.list[index].selected = !this.that.data.cart.list[index].selected;
    this.reCount();
  }

  /*
  * 删除一个商品
  */
  deletedItem(index) {

    let that = this.that;

    that.data.index = index;


    this.reCount();

    let name = 'cart/del';

    let url = this.getPath(name);

    this.data.condition.openid = this.openid;
    this.data.condition.id = that.data.cart.list[index].id;
    that.data.cart.list.splice(index, 1);
    // console.log()
    that.setData({ cart: that.data.cart })
    this.post(url, this.data);
    this.reCount();
  }

  /*
  * 重新计算商品价格
  */
  reCount() {
    console.log('00000000000000000')
    let num = 0
    let price = 0;

    let n = 0;

    let that = this.that;
    let len = that.data.cart.list.length;

    for (let i = 0; i < len; i++) {
      if (that.data.cart.list[i].selected) {

        num += parseInt(that.data.cart.list[i].total);
        price += parseInt(that.data.cart.list[i].total) * that.data.cart.list[i].marketprice;

        n += 1;
      }
    }
    console.log(len)
    let b = n == len && len != 0;
    //渲染到页面
    that.setData({

      cart: {
        list: that.data.cart.list,
        total: num,
        price: price.toFixed(2),
        selectedAll: b
      }
    })

    console.log(that.data.cart)

  }
}
module.exports = cart