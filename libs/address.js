
const API = require('api.js');        //引入接口处理类
const PAGE = require('page.js');      //引入页面处理类

class address {

  constructor(app, that) {

    this.app = app;
    this.that = that;

    this.page = new PAGE(that);//引用页面类

    this.list = [];
    this.info = {};
    this.id = 0;

    this.status = true;//true，列表显示隐藏
    this.index = 0;
  }

  process(e) {

    this.e = e;

    console.log(this.e);

    let method = this.page.getMethod(e);

    this[method]();
  }

  /*
  * 数据库操作
  */

  select() {

    let self = this;

    let field = 'id,realname,mobile,province,city,area,address,isdefault';

    let api = new API(this.app);

    api.setProperty('path', 'address/select');
    api.setProperty('field', field);

    api.setParam('condition', 'openid', api.openid);

    api.request().then(function (res) {

      self.list = res.data.data;

      self.page.push('list', self.list);
    })
  }

  add() {

    let self = this;

    let api = new API(this.app);

    api.setProperty('path', 'address/add');

    api.addParam('data', {});
    api.setParam('data', 'uniacid', api.uniacid);
    api.setParam('data', 'openid', api.openid);
    api.setParam('data', 'realname', self.info.realname);
    api.setParam('data', 'mobile', self.info.mobile);
    api.setParam('data', 'address', self.info.address);
    api.setParam('data', 'province', self.info.province);
    api.setParam('data', 'city', self.info.city);
    api.setParam('data', 'area', self.info.area);

    return api.request();
  }

  del() {

    let api = new API(this.app);

    api.setProperty('path', 'address/del');

    api.setParam('condition', 'openid', api.openid);
    api.setParam('condition', 'id', this.id);

    return api.request();
  }

  update() {

    let self = this;

    let api = new API(this.app);

    api.setProperty('path', 'address/update');

    api.setParam('condition', 'openid', api.openid);
    api.setParam('condition', 'id', this.id);

    api.addParam('data', {});
    api.setParam('data', 'realname', self.info.realname);
    api.setParam('data', 'mobile', self.info.mobile);
    api.setParam('data', 'address', self.info.address);
    api.setParam('data', 'province', self.info.province);
    api.setParam('data', 'city', self.info.city);
    api.setParam('data', 'area', self.info.area);

    return api.request();
  }

  /*
  * 设为默认地址
  */
  setDefault() {

    let api = new API(this.app);

    let id = this.e.currentTarget.dataset.id;

    api.setProperty('path', 'address/setDefault');

    api.setParam('condition', 'openid', api.openid);
    api.setParam('condition', 'id', id);

    api.request();
  }

  /*
  * 查询一条
  */
  find(key, value) {

    let field = 'id,realname,mobile,province,city,area,address,isdefault';

    let api = new API(this.app);

    api.setProperty('path', 'address/query');
    api.setProperty('field', field);

    api.setParam('condition', 'openid', api.openid);
    api.setParam('condition', key, value);

    return api.request();
  }

  /*
  * 页面操作
  */

  showAdd() {

    this.id = 0;
    this.info = {};
    this.status = !this.status;

    this.page.push('id', this.id);
    this.page.push('status', this.status);
    this.page.push('info', this.info);
  }

  showEdit() {

    this.id = this.e.currentTarget.dataset.id;

    this.index = this.e.currentTarget.dataset.index;

    this.status = !this.status;

    this.page.push('id', this.id);
    this.page.push('status', this.status);

    let self = this;

    this.find('id', this.id).then(function (res) {

      self.info = res.data.data;

      let region = [self.info.province,self.info.city,self.info.area];

      self.page.push('region',region);

      self.page.push('info', self.info);
    })
  }

  deletedItem() {

    let self = this;

    this.page.message('确认删除', function () {

      self.id = self.e.currentTarget.dataset.id;

      self.del();

      self.list.splice(self.index, 1);

      self.page.push('status', !self.status);

      self.page.push('list', self.list);

      console.log(self.that.data.list);

    })
  }

  changeCity() {

   // this.region = this.e.detail.value;

    this.info.province = this.e.detail.value[0];

    this.info.city = this.e.detail.value[1];

    this.info.area = this.e.detail.value[2];

    this.page.push('region', this.e.detail.value);
  }


  getback() {

    //如果有address.comefrom则返回，否则返回列表页

    let url = wx.getStorageSync('address.comefrom') || 'address'

    return url;

  }


  save() {

    let self = this;

    //校验数据
    this.info.realname = self.e.detail.value.realname;
    this.info.mobile = self.e.detail.value.mobile;
    this.info.address = self.e.detail.value.address;

    var telRegex = new RegExp('^(13[0-9]|15[0-9]|18[0-9]|147|17[0-9])[0-9]{8}$'); //手机号正则

    var MobileReg = telRegex.test(this.info.mobile)

    if (this.info.realname == '') { this.page.tips('请输入用户名', 'loading'); return; }

    if (this.info.mobile == '') { this.page.tips('请输入手机号', 'loading'); return; }

    if (this.info.address == '') { this.page.tips('请输入地址', 'loading'); return; }

    if (!MobileReg) { this.page.tips('手机号格式错误', 'loading'); return; }

  
    let promise = this.id == 0 ?this.add():this.update();

    promise.then(function(res){

      if (res.data.data > 0){

        self.page.tips('成功', 'success');

        self.page.push('status',true);

        self.page.redirect(self.getback());

        return;
      }

      self.page.tips('失败', 'loading');
    })
  }

  comefrom(option) {
    
    if (option['comefrom']) {

      wx.setStorageSync('address.comefrom', option.comefrom);
    } else {
      wx.clearStorageSync('address.comefrom');
    }
  }

}
module.exports = address