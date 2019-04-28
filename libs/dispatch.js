class dispath {

  getFreight(data, dispatch) {

    console.log(dispatch);

    let distype = dispatch.calculatetype == 0;

    let first = distype ? dispatch['firstweight'] : dispatch['firstnum'];

    let second = distype ? dispatch['secondweight'] : dispatch['secondnum'];

    let firstprice = distype ? dispatch['firstprice'] : dispatch['firstnumprice'];

    let secondprice = distype ? dispatch['secondprice'] : dispatch['secondnumprice']; 
    let num = this.getNum(data, dispatch.calculatetype);
    console.log(data);
    console.log(num);
    let price = this.getPrice(num,first,firstprice,second,secondprice);
    console.log(price);
    return price;

  }

  /*
  * 获取计费商品重量（数量）
  * @list，计费商品对象集合
  * @list.weight，单品重量
  * @list.total，单品数量
  * @list.issendfree,是否包邮，1-包邮，0-不包邮
  * @mode，计费模式，0-计重，1-计数
  */
  getNum(list, mode = 0) {

    let num = 0;
    
    for (let i = 0; i < list.length; i++) {

      if (list[i].issendfree != 1) {
        let weight = list[i].optionid==0?list[i].weight:list[i].option_weight;
        
        num += mode == 0 ? weight * list[i].total : list[i].total;
        
      }
    }

    return num;
  }

  /*
  * 获取运费
  * @num，计费商品重量（数量）
  * @first，首重
  * @firstprice,首费
  * @second，续重
  * @secondprice，续费
  */
  getPrice(num, first, firstprice, second, secondprice) {

    let price = 0;

    if (num == 0) return price;

    price = parseFloat(firstprice);

    if (num > first) {

      let n = 0;

      let minus = num - first;

      n = parseInt( minus / second);
      
      n += minus % second == 0 ? 0 : 1;
      
      price += n * parseFloat(secondprice);
    }

    return price.toFixed(2);
  }
}
module.exports = dispath