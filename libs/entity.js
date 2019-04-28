/*
* 业务对象模型
* excute:请求接口(默认返回this对象，true返回promise对象)
*/
class entity{

  constructor(app,that){  
    this.app = app;
    this.that = that;

    this.http = this.app.http;

    this.promise = null;   
    this.accessToken = this.app.globalData.accessToken;
    this.uniacid = this.app.globalData.projectId;
    this.openid = this.app.globalData.openid;

    this.url = '';

    this.field = '*';

    this.header = {
      'Content-Type': "application/json",
      'accessToken': this.accessToken,
      'projectId': this.uniacid,
      'field': this.field
    }

    this.data = {
      condition:{},
      order:'',
      serialize:'',
      search:'',
      data:{},
      type:''
    }

    this.isPage = false;

    //初始化增加uniacid参数
    this.setCondition('uniacid',this.uniacid);
  }

  process(e) {

    this.e = e;

    console.log(this.e);

    let tabType = e.type;

    switch (tabType) {
      case 'tap':
      case 'submit':
      case 'change':
        let name = e.currentTarget.dataset.method;
        this[name]();
        break;
      default:
        this[tabType](); break;

    }
  }

  addParam(name,value){
    this.data[name] =value;
    console.log(this.data);
  }

  setType(name){
    this.data.type = name;
  }

  setCondition(name,value){
   
    this.data.condition[name] = value;
  }

  setOrder(name,value){
    this.data.order = [name, value].join(' ');
  }

  setSerialize(name){
    this.data.serialize = name;
  }

  setSearch(key,value){
    this.data.search.key = key;
    this.data.search.value = value;
  }

  setParam(name,value){
    this.data.data[name] = value
  }

  setHeader(name,value){
    this.header[name].value;   
  }
  setUrl(name){
    this.url = this.app.globalData.host + this.app.globalData.project + '/' + name;   
  }

  setField(name){
    this.field = name;  
  }
  setPage(mode = false){

    this.isPage = mode;
  }

  getData(){

    let param = {};

    for(let name in this.data){
      if(this.data[name]!=''){
        param[name] = this.data[name];
      }
    }

    if(this.isPage){
      param.page = this.that.data.page;
    }

    
    return param;
  }

  /*
 * 请求接口
 * mode:false返回当前对象，true返回promise
 */
  request(url, data, header, mode = false) {

    let call = this.http.post(url, data, header);

    if (!mode) {
      this.promise = call;
    }
    return mode ? call : this;
  }


  pushData(name) {
    let that = this.that;
    console.log(that.data.page)
    //处理分页   

    this.promise.then(function (res) {
      let data = {}
      data[name] = that.data[name];

      //如果数据列表空，表示最后一页了
      if (res.data.data.length == 0) {
        let page = that.data.page;
        page.next = false;
        that.setData({
          page: page
        })
        return
      }

      for (let i = 0; i < res.data.data.length; i++) {

        data[name].push(res.data.data[i]);
      }
      that.setData(data);
    })

    return this;
  }

  setData(name) {
    let that = this.that;
    this.promise.then(function (res) {
      let data = {}
      data[name] = res.data.data;

      that.setData(data);
    })

    return this;
  }

  excute(mode = false) {

    let data = this.getData();

    this.header.field = this.field;

    return this.request(this.url, data, this.header,mode);
  }
}

module.exports = entity