import { address } from '../../utils/model/address'
var app = getApp()

Page({
  data: {
    list: {
      addressList: [],                     //地址列表
    },

    listStatus: false,                       //地址列表显示与隐藏
    addStatus: true,                         //新增表单显示与隐藏
    region: ['北京', '北京市', '东城区'],      //省市区初始值
    options: [],
    insertAddressVal: '',                    //新增地址值
    newAdd: '',                              //点击新增带值  2
    editId: '',                              //点击编辑传地址id
    addressId: '',                           //设置默认地址id
    code: '',
    page: {
      index: 1,
      size: 50,
    },
    anniu:true
  },
  /**
   * getAddressList => 获取地址列表
   */
  onLoad: function (options) {
    var that = this
    console.log(address)
    address.init(app, that).getAddressList();

  },
  onShow: function () {
    wx.hideShareMenu()                              //禁止分享
    var that = this
    var network = require('../../utils/network.js');
    network.network();
  },


  /**
   * name => addAddress   点击新增操作
   * name => cancel       点击取消操作
   * name => editBt       点击编辑操作
   * name => delBt        点击删除地址操作
   * name => setDefaultBt 点击设置默认操作
   */

  //绑定点击事件
  bindViewTab: function (e) {
    var that = this;
    // that.setData({
    //   anniu:false,
    // })
    let name = e.currentTarget.dataset.method;
    if (name == 'addAddress') {
      let newAdd = e.currentTarget.dataset.newadd;    // 2 
      let addStatus = that.data.addStatus
      let listStatus = that.data.listStatus
      that.setData({
        addStatus: false,
        listStatus: true,
        newAdd: newAdd,
        editLinkMan: '',
        editMobile: '',
        editAddress: '',
        region: ['北京', '北京市', '东城区'],      //省市区初始值
        anniu: true,
      });
    }

    if (name == "cancel") {
      that.setData({
        addStatus: true,
        listStatus: false,
        // anniu: true,
      })
    }

    if (name == "editBt") {
      var dataset = e.currentTarget.dataset
      var editId = dataset.editid                     //地址id
      var newAdd = dataset.newadd                     //点击编辑带的值  1
      var editLinkMan = dataset.editlinkman           //姓名
      var editMobile = dataset.editmobile             //手机号
      var editAddress = dataset.editaddress           //详细地址
      var editprovinceDefault = dataset.editprovince  //省
      var editcityDefault = dataset.editcity          //市
      var editareaDefault = dataset.editarea          //区
      var defaultAddress = []                         //默认地址空
      defaultAddress.push(editprovinceDefault)
      defaultAddress.push(editcityDefault)
      defaultAddress.push(editareaDefault)
      var addStatus = that.data.addStatus
      var listStatus = that.data.listStatus
      that.setData({
        addStatus: false,
        listStatus: true,
        editLinkMan: editLinkMan,                              //收货人
        editMobile: editMobile,                                //联系电话
        editAddress: editAddress,                              //详细地址
        newAdd: newAdd,                                        //编辑传 "1"
        editId: editId,                                        //地址id
        region: defaultAddress,                                //默认地址显示
        anniu:true
      })
    }
    if (name == "delBt") {
      wx.showModal({
        title: '删除',
        content: '确认删除该条地址？',
        success: function (res) {
          if (res.confirm) {
            address.init(app, that).delAddress();             //删除地址
            that.showToast('删除成功', 'success')

          } else if (res.cancel) {
            that.showToast('取消成功', 'success')
          }
        }
      })
    }

    if (name == "setDefaultBt") {
      var addressId = e.currentTarget.dataset.addressid      //地址id
      that.setData({
        addressId: addressId
      })
      address.init(app, that).setDefaultAddress();           //设置默认地址
      that.showToast('设置成功', 'success')
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 1000)

    }
  },


  /**
   *  formSubmit => 提交新增地址
   */

  formSubmit: function (e) {
    var that = this
    var inputVal = e.detail.value
    that.setData({
      
      insertAddressVal: inputVal                                        //新增值
    })

    var linkMan = inputVal.realname                                     //姓名
    var mobile = inputVal.mobile                                        //电话
    var isTel = inputVal.mobile
    var telRegex = /^(13[0-9]|15[0-9]|18[0-9]|147|17[0-9])[0-9]{8}$/;   //手机号正则
    var mobileReg = telRegex.test(isTel)
    var addressDetail = inputVal.address                                //详细地址

    var newAddress = that.data.newAdd
    console.log('newAddress=' + newAddress)
    if (linkMan === '') {
      that.showToast('请输入姓名', 'loading')
      return
    }
    if (mobile === '') {
      that.showToast('请输入联系方式', 'loading')
      return
    }
    if (!mobileReg) {
      that.showToast('请输入正确的联系方式', 'loading')
      return
    }

    if (addressDetail === '') {
      that.showToast('请输入详细地址', 'loading')
      return
    }
    if (linkMan && mobile && mobileReg && address && newAddress == 2) {
      address.init(app, that).addAddress();           //新增地址
      that.setData({
        anniu: false,
      })

      return
    } else if (linkMan && mobile && mobileReg && address && newAddress == 1) {
      that.setData({
        anniu: false,
      })
      address.init(app, that).editAddress();           //更新地址
    }
  },

  //提示框方法
  showToast: function (title, icon) {
    wx.showToast({
      title: title,
      icon: icon,
      duration: 1000,
    })
  },

  bindRegionChange: function (e) {              //省市区点击
    this.setData({
      region: e.detail.value
    })
  },

  //点击删除input值
  delVal: function (e) {
    var that = this
    var inputVal = e.target.dataset.index     //索引值
    console.log("inputval=" + inputVal)
    if (inputVal == 0) {
      that.setData({
        editLinkMan: '',
      })
    } else if (inputVal == 1) {
      that.setData({
        editMobile: '',
      })
    } else if (inputVal == 2) {
      that.setData({
        editAddress: '',
      })
    }
  },

  onReachBottom: function () {                     //上拉加载

  },
})
