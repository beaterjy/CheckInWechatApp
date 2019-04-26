// pages/teacher/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseInformation: '1',
    courseList: [],
    weekNumber: ['日', '一', '二', '三', '四', '五', '六'],
    myindex: null,
    signinopens: [],
    mysigninrecords: [],
    myList:[],
    flag: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console,log("onLoad");
    var that = this
    that.setData({
      courseInformation: app.data.information,
      courseList: app.data.courseList
    })
    for (var i = 0; i < that.data.courseList.length; i++) {
      if (app.data.information == app.data.courseList[i].id) {
        that.setData({
            myindex: i,
        })
        break;
      }
    }
    // console.log(app.data.user_id);
    // console.log(app.data.courseList[that.data.index].name);
    // console.log(app.data.courseList[that.data.index].detail["0"].day);
    // console.log(app.data.courseList[that.data.index].detail["0"].class_time);
    // console.log(app.data.courseList[that.data.index].detail["0"].classroom);
    wx.request({
      url: 'https://dragon2000.oicp.io:3000/api/stuGetCourseSignInRecords',
      data: {
        user_id: app.data.user_id,
        course_name: app.data.courseList[that.data.myindex].name,
        course_day: app.data.courseList[that.data.myindex].detail["0"].day,
        course_time: app.data.courseList[that.data.myindex].detail["0"].class_time,
        classroom: app.data.courseList[that.data.myindex].detail["0"].classroom,
      },
      method: 'POST',
      success: function (res) {
        if (res.data.msg == 'success') {
          console.log(res.data);
          that.setData({
            flag: true,
            signinopens: res.data.signinopens,
            mysigninrecords: res.data.mysigninrecords,
          })


          for (var i = 0; i < that.data.signinopens.length; i++) 
            for (var j = 0; j < that.data.mysigninrecords.length; j++){
              if (that.data.signinopens[i] == that.data.mysigninrecords[j]){
                that.data.myList[i] = that.data.signinopens[i];
                continue;
              }
              else if (that.data.signinopens[i] != that.data.mysigninrecords[j] && i == j)
                   that.data.myList[i] = 0;
          }

          for (var i = 0; i < that.data.signinopens.length; i++) {
            if (i >= that.data.myList.length)
              that.data.myList[i] = 0;
          }

          app.data.myList = that.data.myList;
          that.setData({
            myList: app.data.myList ,
          })

        }
        else {
          wx.showToast({
            title: '错误',
            duration: 2000
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console, log("onShow")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})