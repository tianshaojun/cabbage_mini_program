/*
* 公共方法
* getFreigh:邮费计算
*/
class common {

  constructor(app, that) {
    this.app = app;
    this.that = that;
    this.e = null;
  }

  /*
  * 满额立减
  * @price，订单金额
  * @rules，满减规则（列表）
  * @@rules.enoughmoney，满额
  * @@rules.enoughdeduct，减额
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



  process(e) {

    this.e = e;

    let tabType = e.type;

    switch(tabType){
      case 'tap':
      case 'submit':
      case 'change':
      let name = e.currentTarget.dataset.method;
      this[name]();
      break;
      default:
      this[tabType]();break;

    }

    return ;
    if (tabType == 'tap') {

      let name = e.currentTarget.dataset.method;
      console.log(name);
      this[name](); return;
    }

    if (tabType == 'submit') {
      let name = e.currentTarget.dataset.method;
      this[name](); return;
    }

    if (tabType == 'change'){

    }

    this[tabType]();
  }

}

module.exports = common