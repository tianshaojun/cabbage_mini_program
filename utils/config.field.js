/*
* 配置接口返回字段
*/

function getField(name) {

  let field = '*';
  let fields = {
		'banner/select':'id,advname,thumb,enabled,link',        //轮播图  
    'category/select' :'id,name,thumb,advimg',  //分类   
    'goods/search'    :'id,title,thumb,marketprice',
    'goods/select'    :'id,title,thumb,marketprice,productprice,status,salesreal,isnew,sales,description',
    'goods/query'     :'id,title,content,thumb,thumb_url,total,marketprice,productprice,issendfree,sales',
    'order/select'    :'id,ordersn,price,discountprice,paytype',
    'option/select'   :'id,title,thumb,marketprice,stock,specs',
    'address/default' :'id,realname,mobile,province,city,area,address',
    'dispatch/query'  :'id,dispatchname,firstprice,secondprice,firstweight,secondweight,express',
    'order/payinfo'   :'id,ordersn,createtime,price,status',
    'option/query'    :'id,title,thumb,stock,costprice,marketprice'
  }

  if(fields[name]==undefined){
    return field;
  }

  return fields[name];

}



module.exports.field ={
  get: getField
} 