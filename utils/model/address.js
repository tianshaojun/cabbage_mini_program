/*
* 收货地址管理
*/

function address(app, that) {
  this.common = app.init(that);
  /**
   * 获取地址列表
   */
  this.getAddressList = function () {
    let name = 'address/select';
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        openid: app.globalData.openid
      },
      page: that.data.page,


      order: "isdefault desc"
    }
    this.common.request(name, data, this.callback);
  }
  let obj = this;
  /**
   * 新增收货地址
   */
  this.addAddress = function () {
    let name = 'address/add';
    let data = {
      condition: {
        uniacid: app.globalData.projectId,

      },
      data: {
        uniacid: app.globalData.projectId,
        openid: app.globalData.openid,
        realname: that.data.insertAddressVal.realname,         //姓名
        mobile: that.data.insertAddressVal.mobile,             //手机号
        province: that.data.insertAddressVal.province,         //省
        city: that.data.insertAddressVal.city,                 //市
        area: that.data.insertAddressVal.area,                 //区
        address: that.data.insertAddressVal.address,           //详细地址
      },
      order: 'id asc',
    }
    this.common.request(name, data, this.callback, true).then(function () {
      newAddressList(that)
      obj.getAddressList();
    });
  }
  /**
   * 编辑收货地址
   */
  this.editAddress = function () {
    let name = 'address/update';
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        openid: app.globalData.openid,
        id: that.data.editId
      },
      data: {
        realname: that.data.insertAddressVal.realname,
        mobile: that.data.insertAddressVal.mobile,
        province: that.data.insertAddressVal.province,
        city: that.data.insertAddressVal.city,
        area: that.data.insertAddressVal.area,
        address: that.data.insertAddressVal.address,
      },
      order: 'id desc'

    }
    this.common.request(name, data, this.callback, true).then(function () {
      newAddressList(that)
      obj.getAddressList();
    });
  }
  /*** 删除收货地址*/
  this.delAddress = function () {
    let name = 'address/del';
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        openid: app.globalData.openid,
        id: that.data.editId
      },
      order: 'id desc'
    }
    this.common.request(name, data, this.callback, true).then(function () {
      newAddressList(that)
      obj.getAddressList();
    });
  }
  /*** 设置默认地址*/
  this.setDefaultAddress = function () {
    let name = 'address/setDefault';
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        openid: app.globalData.openid,
        id: that.data.addressId
      }
    }
    this.common.request(name, data, this.callback);
  }
  this.callback = function (name, res) {
    let list = that.data.list;

    switch (name) {

      case 'address/select':                        //地址列表
        list.addressList = res.data.data;
        that.setData({
          list: list
        })
        break;
      default:
        break;
    }
  }
  return this;
}

/*** 点击新增 ，删除  编辑 后返回*/

function newAddressList(that) {
  that.setData({
    addStatus: true,
    listStatus: false,
  })
}
module.exports.address = {
  init: address
}