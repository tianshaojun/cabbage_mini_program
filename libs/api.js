
/*
* Api请求类
* addParam:增加一个上行参数
* setParam:设置上行参数
*/
class api {

  constructor(app) {

    this.mode = 'flexible'; // normal,flexible

    this.app = app;

    this.http = this.app.http;

    this.accessToken = this.app.globalData.accessToken;
    this.uniacid = this.app.globalData.projectId;
    this.openid = this.app.globalData.openid;

    this.url = this.app.globalData.host + this.app.globalData.project;

    this.path = '';

    this.field = '*';

    this.header = {};

    this.data = {};

    //初始化设置header属性
    this.setProperty('header',{

      'Content-Type': "application/json",
      'accessToken': this.accessToken,
      'projectId': this.uniacid,
      'field': this.field
    })

    this.addParam('condition',{});
    this.setParam('condition','uniacid',this.uniacid);
  }

  addParam(key, value) {

    delete this.data[key];

    this.data[key] = value;
  }

  setParam(name, key, value) {

    if (key == '') this.data[name] = value;

    if (key != '') this.data[name][key] = value;
  }

  setProperty(name,value){
    this[name] = value;
  }

  request(){

    let url = this.url + '/' + this.path;

    let data = this.data;

    console.log(data);

    this.header.field = this.field;

    return this.http.post(url, data, this.header);
  }
}
module.exports = api