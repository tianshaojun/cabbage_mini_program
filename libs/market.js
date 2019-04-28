const entity = require('entity.js');

/*
* 营销模块
* recount:重新计算金额
* enough:满额立减
*/
class market extends entity {

  constructor(app, that) {
    super(app, that);

    this.market = {};
  }

  init(){
    //读取营销配置

    this.market = {
      enough:{
        rules:this.getEnought()
      }
    }

  }



  /*
  * 计算优惠后金额
  * 满额减
  */
  recount(price){

     let last = price;
     let config = this.app.config.market;
     for(let name in config){
       console.log(name);
       if(config[name]){

        let cut = this[name](last,this.market[name].rules);

        last -=cut;
       }
     }

     return last;
  }

 
  /*
  * 满额减
  */
  enough(price, rules) {

    let index = 0;

    let isEnough = false;

    for (let i = 0; i < rules.length; i++) {

      if (price >= rules[i].enoughmoney) {

        isEnough = true;

        index = rules[i].enoughmoney >= rules[index].enoughmoney ? i : index;
      }
    }

    return isEnough ? rules[index].enoughdeduct : 0;
  }


  getEnought(){

    let enough = [
      {
        enoughmoney: 100,
        enoughdeduct: 10
      },
      {
        enoughmoney: 300,
        enoughdeduct: 25
      },
      {
        enoughmoney: 200,
        enoughdeduct: 18
      }
    ]

    return enough;
  }
}

module.exports = market