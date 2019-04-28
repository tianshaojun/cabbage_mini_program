
/*
* 页面事件处理
* process:统一处理页面事件
*/
class page {

  constructor(that) {    
    this.that = that;
  }


  getMethod(e) {

    let tabType = e.type;

    let name = tabType;

    switch (tabType) {
      case 'tap':
      case 'submit':
      case 'change':
        name = e.currentTarget.dataset.method;       
        break;
      default:
        break;
    }

    return name;
  }

  message(title,callback){
    wx.showModal({
      title: '提示',
      content: title,
      success: function (res) {
        if (res.confirm) callback();
      }
    })
  }

  tips(title, icon) {
    wx.showToast({
      title: title,
      icon: icon,
      duration: 2000
    })
  }

  redirect(url){
    wx.redirectTo({
      url: url
    })
  }

  
  push(key,value) {

    let obj = {};

    obj[key] = value;

    this.that.setData(obj);
  }
}
module.exports = page