const buycart = require('../../utils/model/cart.js')
var app = getApp();
var initdata = function (that) {
  var list = that.data.cart
  for (var i = 0; i < list.length; i++) {
    list[i].txtStyle = ""
  }
  that.setData({ cart: list })
}

Page({
  data: {

    cartList: [],                //购物车列表
    page: {
      index: 1,
      size:6
    },
    totalPrice: 0,               //选中合计的总价格
    totalNum: 0,                 //总数量
    selectedAll: false,          //全选
    isSelected: false,           //左侧单选按钮是否有商品被选中
    delBtnWidth: 150,           //右侧删除按钮宽度单位（rpx）
    network: true
  },
  onShow: function () {   //监听页面加载
    var that = this
    wx.hideShareMenu()   //禁止分享    
    let obj = new buycart(app, that);
    obj.getList();
    wx.onNetworkStatusChange(function (res) {

      var networkType = res.networkType

      if (networkType == "none") {
        wx.showToast({
          title: '网络不流畅',
          icon: 'loading',
          duration: 3000
        })
        that.setData({ network:false})
      } else {
        that.setData({ network: true })
      }
    })
  },
  bindViewTab: function (e) {

    //绑定页面点击事件

    let that = this;

    let obj = new buycart(app, that);

    let tabType = e.type;

    switch (tabType) {

      case 'touchstart'://触摸开始

        obj.touchStar(e); break;

      case 'touchmove'://触摸移动

        obj.touchMove(e); break;

      case 'touchend'://触摸结束

        obj.touchEnd(e); break;

      case 'tap'://点击事件

        let name = e.currentTarget.dataset.method;

        let index = e.currentTarget.dataset.index;

        switch (name) {

          case 'selectedItem': //选中\取消单个商品         

            obj.selectedItem(index);

            break;

          case 'selectedAll':  //选中\取消全选

            obj.selectedAll();

            break;

          case 'deletedItem': //删除单个商品            
            wx.showModal({
              title: '是否确认删除此商品',
              success: function (res) {
                if (res.confirm) {
                  obj.deletedItem(index);
                }
              }
            })
            break;
          case 'changeTotal': //变更商品数量
            let num = e.currentTarget.dataset.num;
            obj.changeTotal(index, num);
            break;
          case 'toPay'://去结算
            obj.toPay(); 
            break;
          default:
            break;
        }
      default:
        break;
    }
  },
  toIndexPage: function () {
    wx.switchTab({
      url: '../home/' + app.globalData.themes+'/index'
    })
  }
})