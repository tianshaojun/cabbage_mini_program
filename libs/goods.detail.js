const API = require('api.js');        //引入接口处理类
const PAGE = require('page.js');      //引入页面处理类


/*
* 商品详情页对象
* find:获取商品详情
* showSpecs:显示规格弹窗
*/
class goodsdetail {

  constructor(app,that) {

    this.app = app;
    this.that = that;

    this.page = new PAGE(that);//引用页面类

    this.info = null;

    this.selected = [];

    this.num = 1;

    this.index = 0;

    this.specThumb = '';

    this.hide = true;

    this.orderType = 'cart';

  }

  process(e) {

    this.e = e;

    let method = this.page.getMethod(e);

    this[method]();
  }

  find(id) {

    let self = this;

    let api = new API(this.app);

    let field = 'id,title,thumb,thumb_url,weight,total,marketprice as price,content,issendfree,hasoption';

    api.setProperty('field', field);

    api.setProperty('path', 'goods/find');

    api.setParam('condition', 'id', id);

    api.request().then(function(res){

      self.info = res.data.data;

      self.specThumb = self.info.thumb;

      self.page.push('specThumb',self.specThumb);

      self.initSelected();

      self.setSelected(0,0);

      self.page.push('info',self.info);
    });
  }

  
  showSpecs(){

    this.orderType = this.e.currentTarget.dataset.ordertype;

    this.page.push('orderType',this.orderType);

    this.setHide();

    this.setIndex();


  }
  setHide(){

    this.hide = !this.hide;

    this.page.push('hide',this.hide);
  }

  /*
  * 根据选中的规格设置option索引,默认0，optionid=0
  */
  setIndex(){

    let specs = [];

    for (let i = 0; i < this.selected.length; i++) {

      let sIndex = this.selected[i];

      let id = this.info.specs[i].items[sIndex].id;

      specs.push(id);
    }

    let sort_selected = this.sort(specs);  //已排序的规格选中数组

    for (let i = 0; i < this.info.options.length; i++) {

      let arr = this.info.options[i].specs.split('_');

      let sort_arr = this.sort(arr);

      if (this.isMatch(sort_selected, sort_arr)) {

        this.index = i; break;
      }

    }

    this.page.push('index',this.index);
  }

  selectedSpecs(){

    let pindex = this.e.currentTarget.dataset.propertyindex;
    let subindex = this.e.currentTarget.dataset.propertychildindex;
    this.setSelected(pindex,subindex);

    this.setSpecThumb(pindex,subindex);

    this.setIndex();

    this.setNum();
  }

  /*
 * 点选规格项
 */
  setSelected(index, subIndex) {

    this.selected[index] = subIndex;

    this.page.push('selected', this.selected);
  }

  setSpecThumb(index,subIndex){
    console.log(this.specThumb)
    console.log(index,subIndex)
    this.specThumb = this.info.specs[index].items[subIndex].thumb==''?this.specThumb:this.info.specs[index].items[subIndex].thumb;
    console.log(this.info.specs);
    this.page.push('specThumb',this.specThumb);

  }

  initSelected(){
    
    for (let i = 0; i < this.info.specs.length; i++) {
      this.selected.push(0)
    }
  }

  changeNum(){

    let step = this.e.currentTarget.dataset.num;

    this.num = parseInt(this.num) + parseInt(step);

    this.setNum();
  }

  setNum(){

    let total = this.getCurrentTotal();
    this.num = this.num < 1 ? 1 : this.num;
    this.num = this.num > total ? total :this.num;

    this.page.push('num',this.num);
  }

  getCurrentTotal(){

    if(this.info.options[this.index].id == 0){

      return this.info.total;
    }

    return this.info.options[this.index].stock;
  }

  /*
 * 开启或关闭弹窗
 */
  closePopup() {

    this.hide = !this.hide;
    this.page.push('hide', this.hide);
  }



  addToCart(){

    let self = this;
    if (self.num < 1) {

      self.page.tips('库存不足', 'loading');
      return;
    }

    self.add(self.info.id, self.num, self.info.options[self.index].id);

    self.closePopup();

    self.page.tips('加入成功', 'sucess');
  }

  /*
  * 立即购买：跳转
  **/
  buynow() {

    let self = this;
    if (self.num < 1) {

      self.page.tips('最少购买1个', 'loading');
      return;
    }

    let total = this.getCurrentTotal();

    if (self.num > total) {

      self.page.tips('库存不足', 'loading');
      return
    }

    this.setLocalStorage();

    this.setLocalOrderItem('buyNow',0);

    let url = '../order-confirm/order-confirm';

    url += '?orderType=buyNow';

    this.page.redirect(url);
  }

  setLocalStorage(){

    let optionid = this.info.options[this.index].id;

    let weight = 0;

    weight = optionid== 0 ? this.info.weight : this.info.options[this.index].weight;

    let price = 0;

    price = optionid== 0 ? this.info.price : this.info.options[this.index].marketprice;


    let buyitem = {    //购买对象

      id: this.info.id,
      title: this.info.title,
      thumb: this.info.thumb,
      thumb_url: this.info.thumb_url,
      weight: weight,

      price: this.info.price,
      total: this.num,
      optionid: optionid,
      option_title: optionid==0?'':this.info.options[this.index].title,
      option_price: price,
      option_thumb: this.specThumb,
      option_weight: weight,
      issendfree: this.info.issendfree
    }

    wx.setStorage({
      key: "buynow",
      data: buyitem
    })

    console.log(buyitem);
  }

  setLocalOrderItem(orderType,ids){

    wx.setStorageSync('orderType',orderType);
    wx.setStorageSync('ids',ids);
  }
  /*
  * 比较两个数组是否相等 
  */
  isMatch(arr1, arr2) {

    let match = arr1.length == arr2.length;

    if (match) {

      for (let i = 0; i < arr1.length; i++) {

        if (parseInt(arr1[i]) != parseInt(arr2[i])) {
          match = false;
          break;
        }
      }
    }
    return match;
  }


  /*
  * 数组排序（升序）
  */

  sort(arr) {

    for (let i = 0; i < arr.length - 1; i++) {

      for (let j = i + 1; j < arr.length; j++) {

        if (arr[i] > arr[j]) {
          let temp = 0;
          temp = arr[j];
          arr[j] = arr[i];
          arr[i] = temp;
        }

      }
    }
    return arr;
  }

  add(id, num, optionid) {

    let api = new API(this.app);

    api.setProperty('path', 'cart/add');

    api.addParam('data', {});
    api.setParam('data', 'uniacid', api.uniacid);
    api.setParam('data', 'openid', api.openid);
    api.setParam('data', 'goodsid', id);
    api.setParam('data', 'total', num);
    api.setParam('data', 'optionid', optionid);

    api.request();
  }

}
module.exports = goodsdetail