function network() {
    wx.onNetworkStatusChange(function (res) {

        var networkType = res.networkType
    
        if (networkType == "none") {
            wx.showToast({
                title: '网络不流畅',
                icon: 'loading',
                duration:3000
            })
        } else {
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
    })
}

module.exports.network = network