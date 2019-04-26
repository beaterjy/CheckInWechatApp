//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../auth/auth'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    // var that = this
    // wx.login({
    //   success: function (data) {
    //     // that.globalData.userCode = data.code
    //     wx.request({
    //       url: 'https://dragon2000.oicp.io:3000/api/login',
    //       data: {
    //         userCode: data.code
    //       },
    //       method: 'POST',
    //       success: function (res) {
    //         console.log(res.data)
    //         if (res.data.msg == 'got' && res.data.detail == 'student') {
    //           wx.redirectTo({
    //             url: '../student/index',
    //           })
    //         } else if (res.data.msg == 'got' && res.data.detail == 'teacher') {
    //           wx.redirectTo({
    //             url: '../teacher/index',
    //           })
    //         } else if (res.data.msg == 'miss') {
    //           wx.redirectTo({
    //             url: '../registe/index',
    //           })
    //         }
    //       }
    //     })
    //   }
    // })
  }
})
