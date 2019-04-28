
/*
* 购物车对象
* --------------------属性-----------------------
* list:[],购物车列表数据
* total:0,选中的商品数量
* price:0,选中的商品价格
* selectedAll:true,是否全选
* delBtnWidth:120,删除按钮宽度rpx
* startX:0,移动开始坐标
* index:0,当前操作列表索引

* --------------------方法.数据库操作----------------------
* select:获取购物车列表
* add:加入购物车
* del:删除购物车
* update:更新购物车

*---------------------方法.页面事件--------------------
* selectedItem:点选单个商品
* changeItem:加减单个商品数量
* deletedItem:删除单个商品
* selectedAll:点选全部
* touchstart:向左滑开始
* touchmove:向左滑移动
* touchuend:向左滑结束
* toPay:去结算
* goHome:去首页

*---------------------方法.隐患操作-------------------------
* reCount:计算选中商品价格
* init:初始化列表数据

*/

const API = require('api.js');        //引入接口处理类
const PAGE = require('page.js');      //引入页面处理类

class cart {

  constructor(app, that) {
   
    this.app = app;
    this.that = that;

    this.page = new PAGE(that);//引用页面类

    this.list = [];
    this.total = 0;
    this.price = 0;
    this.all = true;
    this.delBtnWidth = 120;
    this.startX = 0;
  }

  process(e){

    this.e = e;

    let method = this.page.getMethod(e);

    this[method]();
  }

  /*
  * 数据库操作
  */

  select() {

    let self = this;

    let api = new API(this.app);

    api.setProperty('path','cart/select');

    api.addParam('condition',{});    
    api.setParam('condition','uniacid',api.uniacid);
    api.setParam('condition','openid',api.openid);  

    api.request().then(function(res){

      self.init(res.data.data);

      self.reCount();
    })
  }

  add(id, num, optionid) {

    let api = new API(this.app);

    api.setProperty('path','cart/add');

    api.addParam('data',{});    
    api.setParam('data','uniacid',api.uniacid);
    api.setParam('data','openid',api.openid);
    api.setParam('data','goodsid',id);
    api.setParam('data','total',num);
    api.setParam('data','optionid',optionid);

    api.request();
  }

  del(id) {

    let api = new API(this.app);

    api.setProperty('path','cart/del');

    api.addParam('condition',{});
    api.setParam('condition','uniacid',api.uniacid);
    api.setParam('condition','openid',api.openid);
    api.setParam('condition','id',id);

    api.request();
  } 

  update(id, num) {

    let api = new API(this.app);

    api.setProperty('path', 'cart/update');

    api.addParam('condition', {});
    api.setParam('condition', 'uniacid', api.uniacid);
    api.setParam('condition', 'openid', api.openid);
    api.setParam('condition', 'id', id);

    api.addParam('data',{});
    api.setParam('data','total',num);

    api.request();
  }


  /*
  * 页面操作
  */

  
  selectedItem() {

    let index = this.e.currentTarget.dataset.index;

    this.list[index].selected = !this.list[index].selected;

    this.reCount();
  }

  changeItem() {

    let index = this.e.currentTarget.dataset.index;

    let num = this.e.currentTarget.dataset.num;

    let id = this.list[index].id;

    let total = parseInt(this.list[index].total) + parseInt(num);

    if (total < 1) return;

    this.list[index].total = total;

    this.update(id, total);

    this.reCount();
  }


  deletedItem() {

    let self = this;

    this.page.message('确认删除！', function () {

      let id = self.e.currentTarget.dataset.id;
      let index = self.e.currentTarget.dataset.index;

      self.del(id);

      self.list.splice(index, 1);

      self.reCount();
    })
  }

  selectedAll() {

    for(let i=0;i<this.list.length;i++){

      this.list[i].selected = !this.all;
    }

    this.reCount();
  }

 

  touchstart() {

    if (this.e.touches.length == 1) {

      this.startX = this.e.touches[0].clientX
     
      this.setData();
    }
  }

  touchmove() {

    let that = this.that;
    let index = this.e.currentTarget.dataset.index;

    if (this.e.touches.length == 1) {
      var moveX = this.e.touches[0].clientX;
      var disX = this.startX - moveX;

      var delBtnWidth = this.delBtnWidth;
      var left = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，container位置不变
        left = "margin-left:0rpx";
      } else if (disX > 0) {//移动距离大于0，container left值等于手指移动距离
        left = "margin-left:-" + disX + "rpx";
        if (disX >= delBtnWidth) {
          left = "left:-" + delBtnWidth + "rpx";
        }
      }

      this.list[index].left = left;

      this.setData();
    }
  }

  touchend() {
    let that = this.that;
    let index = this.e.currentTarget.dataset.index;
    if (this.e.changedTouches.length == 1) {
      var endX = this.e.changedTouches[0].clientX;
      var disX = this.startX - endX;

      var delBtnWidth = that.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left = disX > delBtnWidth / 2 ? "margin-left:-" + delBtnWidth + "rpx" : "margin-left:0rpx";

      this.list[index].left = left;

      this.setData();
    }
  }

  toPay() {

   
    console.log(this.total);
    if(this.total == 0) this.page.message('请选择结算商品！',function(){});

    if(this.total == 0) return;

    let ids = this.getIds();

    wx.setStorageSync('orderType','cart');
    wx.setStorageSync('ids',ids);

    wx.navigateTo({
      url:this.getPayUrl(ids)
    })
  }

  goHome() {
    wx.redirectTo({
      url: '../index/index',
    })
  }

  /*
  * 隐藏操作
  */

  reCount(){

    let num = 0
    let price = 0;

    let n = 0;
    let len = this.list.length;

    for (let i = 0; i < len; i++) {
      if (this.list[i].selected) {

        num += parseInt(this.list[i].total);
        price += parseInt(this.list[i].total) * this.list[i].marketprice;

        n += 1;
      }
    }

    this.all = n==len && len!=0;

    this.total = num;

    this.price = price.toFixed(2);

    this.setData();
  }

  init(data) {

    let len = data.length;

    this.list = data;

    for (let i = 0; i < len; i++) {

      this.list[i].selected = true;

      let price = this.list[i].option_price;

      price = this.list[i].optionid != 0 ? price : this.list[i].marketprice;

      let total = this.list[i].optionid != 0 ? this.list[i].stock : this.list[i].markettotal;

      this.list[i].marketprice = price;

      this.list[i].option_title = this.list[i].option_title == null ? '' : this.list[i].option_title;

      this.list[i].stock = total;
    }
  }

  getIds() {

    let data = [];

    for(let i=0;i<this.list.length;i++){

      if(this.list[i].selected) {

        data.push(this.list[i].id);  
      }     
    }

    return data.join(',');
  }

  getPayUrl(ids) {

    let orderType = 'cart';
    let url = '../order/confirm/index';
    url += '?orderType=' + orderType;
    url += '&ids=' + ids ;

    return url;
  }

  setData(){
    console.log(this)
    this.page.push('list',this.list);
    this.page.push('total',this.total);
    this.page.push('price',this.price);
    this.page.push('selectedAll',this.all);
  }
}
module.exports = cart