/** 预约 **/
function appointment(app, that) {
  this.common = app.init(that);
  // 预约类型
  this.appointment = function () {
    let name = 'diyformtype/select';
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
      },
    }
    let call = this.common.request(name, data, null, true).then(function (res) {
      if (res.data.data != '' && res.data.code == 0) {
        var dt = res.data.data
        for (let i = 0; i < res.data.data.length; i++) {
          that.data.str_arr.push(dt[i].title);
          that.data.sid_arr.push(dt[i].id)
        }
        console.log(that.data.str_arr)
        that.setData({
          str_arr: that.data.str_arr,
          sid_arr: that.data.sid_arr
        })
      }
    });
    return call;
  }
  // 提交表单
  this.appointmentForm = function () {
    let name = 'diyformdata/add';
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
      },
      data: {
        uniacid: app.globalData.projectId,
        openid: app.globalData.openid,
        username: that.data.dataset.realname,
        phone: that.data.dataset.mobile,
        typeid: that.data.sid_arr[that.data.index],
        remark: that.data.dataset.remark
      },
      order: 'id desc',
    }
    let call = this.common.request(name, data, null, true).then(function (res) {
      if (res.data.data != '' && res.data.code == 0) {
        wx.showToast({
          title: '预约成功',
          icon: 'succes',
          duration: 800,
          mask: true
        })
        setTimeout(function(){
          wx.redirectTo({
            url: '../appointment-list/appointment-list',
          })
        },2000)
      }
    });
    return call;
  }
  // 预约列表
  this.appointmentList = function () {
    let name = 'diyformdata/view';
    let data = {
      condition: {
        uniacid: app.globalData.projectId,
        openid: app.globalData.openid,
      },
      relation: {
        left: {
          name: 'ewei_shop_diyform_data',
          field: 'id,username,phone,status,remark'
        },
        right: {
          name: 'ewei_shop_diyform_type',
          field: 'title'
        },
        
        relation: 'ewei_shop_diyform_type.id = ewei_shop_diyform_data.typeid',
      },
      page: that.data.page,
      order: 'id desc'
    }
    let call = this.common.request(name, data, null, true).then(function (res) {
      if (res.data.data != '' && res.data.code == 0) {
       
        that.setData({
          appointmentList: res.data.data
        })
      }
    });
    return call;
  }
  return this;
}
module.exports.appointment = {
  init: appointment
}