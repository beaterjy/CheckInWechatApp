// pages/teacher/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseInformation: null,
    courseList: [
    ],
    startTime: null,
    course_detail_id: null,
    user_num: null,
    user_id: null,
    stu_unsign:[],
    stu_signed:[],
    signing: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      course_detail_id: app.data.signCourse_detail_id,
    })

    // wx.request({
    //   url: 'https://dragon2000.oicp.io:3000/api/',
    //   data: {
    //     course_detail_id: that.data.course_detail_id,
    //     user_num: app.data.user_num,
    //     user_id: app.data.user_id,
    //   },
    //   method: 'POST',
    //   success: function (res) {
    //     console.log(res.data);
    //     if (res.data.msg == 'success') {
    //       that.setData({
    //         stu_unsign: res.data.stu_unsign,
    //         stu_signed: res.data.stu_signed,
    //       })
    //     }
    //     else {
    //       wx.showToast({
    //         title: '错误',

    //       })
    //     }
    //   }
    // })
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
    // console, log("onShow");
    var that = this
    wx.request({
      url: 'https://dragon2000.oicp.io:3000/api/teacherGetCourseSignInDetail',
      data: {
        course_detail_id: app.data.signCourse_detail_id,
        week_num: app.data.signCourse_week_num,
      },
      method: 'POST',

      success: function (res) {
        if (res.data.msg == 'success') {
          console.log(res.data);
          that.setData({
            stu_unsign: res.data.stu_unsign,
            stu_signed: res.data.stu_signed,
          })
        }
        else {
          console.log(res.data);
          wx.showToast({
            title: '错误',
          })
        }
      }
    })
    
    that.setData({
      courseInformation: app.data.signInformation,
      courseList: app.data.courseList,
      startTime: app.data.courseStartTime,
      signing: app.data.signing,
    })
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