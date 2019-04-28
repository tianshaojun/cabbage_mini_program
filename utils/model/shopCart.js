//单选事件
function selectedItem(that, e) {
	var index = e.currentTarget.dataset.index;
	that.data.lists[index]['selected'] = !that.data.lists[index]['selected']
	that.setData({
		lists: that.data.lists
	})
	//重新计算
	reCount(that)
}
//全选事件
function selectedItemAll(that, e) {
	that.data.selectedAll = !that.data.selectedAll
	that.setData({
		selectedAll: that.data.selectedAll
	})
	for (var i = 0; i < that.data.lists.length; i++) {
		that.data.lists[i].selected = that.data.selectedAll
	}
	that.setData({
		lists: that.data.lists
	})
	reCount(that) //重新计算
}
function changeTotal(that, e) {//加减事件
	var index = e.currentTarget.dataset.index;
	var num = e.currentTarget.dataset.num
	that.data.lists[index].total = parseInt(that.data.lists[index].total) + parseInt(num)
	that.data.lists[index].total = that.data.lists[index].total < 1 ? 1 : that.data.lists[index].total

	var method = 'POST'
	var name = 'V2/Cart/update'
	var data = {
		openid: getApp().globalData.openid,
		token: getApp().globalData.projectId,
		id: e.currentTarget.dataset.id,
		total: that.data.lists[index].total
	}
	httpProcess(name, data, method, that)   //请求后台接口,更新数量

}
//重新计算
function reCount(that) {
	//选中的商品数量*价格    
	var num = 0
	var price = 0
	var length = that.data.lists.length
	var selectedNum = 0
	for (var i = 0; i < length; i++) {
		if (that.data.lists[i].selected) {//判断单选选中
			selectedNum += 1;
			num += parseInt(that.data.lists[i].total)
			price += parseInt(that.data.lists[i].total) * that.data.lists[i].marketprice
		}
	}
	that.setData({
		totalPrice: price.toFixed(2),
		totalNum: num,
		selectedAll: length === selectedNum ? true : false,
		isSelected: selectedNum > 0 ? true : false
	})
}
//结算
function goCom(that, e) {
	var cartId = []
	for (var i = 0; i < that.data.lists.length; i++) {//获取购物车ID  
		if (that.data.lists[i].selected) {
			cartId.push(that.data.lists[i].id)
		}
	}
	var cc = cartId.join(',');
	if (cartId.length > 0) {
		wx.navigateTo({
			url: '../userConfirm/userConfirm?memberid=' + cc + "&paystr=" + 2,
		})
	} else {
		wx.showToast({
			title: '请选择商品',
			icon: 'loading',
			duration: 1000
		})
	}

}
//加载事件
function load(that) {
	//获取购物车列表
	var method = 'GET'
	var name = 'V2/Cart/index'
	var data = {
		openid: getApp().globalData.openid,
		token: getApp().globalData.projectId,
		p: that.data.p,
		limit: that.data.limit
	}
	httpProcess(name, data, method, that)
}
function delItem(that, e) { //删除事件
	var id = e.currentTarget.dataset.goodid
	wx.showModal({
		title: '删除',
		content: '确认删除',
		success: function (res) {
			if (res.confirm) {
				var index = e.currentTarget.dataset.index
				var method = 'POST'
				var data = {
					openid: getApp().globalData.openid,
					token: getApp().globalData.projectId,
					ids: id + ','
				}
				that.data.lists.splice(index, 1)
				httpProcess('V2/Cart/delete', data, method, that)
			} else if (res.cancel) {
				that.setData({
					lists: that.data.lists
				})
			}
		}
	})
}
function callback(res, name, that) {    //数据回调函数，接口数据返回后的处理
	switch (name) {
		case 'V2/Cart/index': //获取购物车列表
			if (that.data.p === 1) {
				that.setData({
					lists: res.data.Response.Datalist,
					pageCount: res.data.Response.Pagecount
				})
			} else {
				var lists = that.data.lists
				for (var i = 0; i < res.data.Response.Datalist.length; i++) {
					lists.push(res.data.Response.Datalist[i])
				}
				that.setData({
					lists: lists,
					Pagecount: res.data.Response.Pagecount
				})
			}
			//重新计算
			reCount(that)
			break;
		case 'V2/Cart/delete':
			wx.showToast({
				title: '删除成功',
				icon: 'success',
				duration: 1000
			})
			that.setData({
				lists: that.data.lists
			})
			reCount(that) //重新计算
			break;
		case 'V2/Cart/update':
			that.setData({
				lists: that.data.lists
			})
			//重新计算
			reCount(that)
			break;
		default:
			break
	}
}
//执行http请求，勿动
function httpProcess(name, data, method, that) {
	var url = getApp().globalData.interface + name
	getApp().com.toDo(url, data, name, callback, method, that)
}
module.exports.load = load
module.exports.selectedItem = selectedItem
module.exports.selectedItemAll = selectedItemAll
module.exports.goCom = goCom
module.exports.changeTotal = changeTotal
module.exports.delItem = delItem