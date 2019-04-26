// pages/teacher/index.js
const times = []
const emptyTimes =[]
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseInformation: '1',
    courseList: [
    ],
    times: times,
    signTimes: 0,
    value: [0],
    weekNumber: ['日', '一', '二', '三', '四', '五', '六'],
    signinopens:null,
    weekSigninopens:[],
    course_detail_id: null,
    week_num: 1,
    stu_unsign: [],
    stu_signed:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      courseInformation: app.data.information,
      courseList: app.data.courseList,
      times: emptyTimes,
    })
    for (var i = times.length - 1; i >= 0; i--){
      times.pop();
    }
   for(var i = 0; i < app.data.courseList.length; i++){
     if (that.data.courseInformation == app.data.courseList[i].name){
        that.setData({
          signinopens: app.data.courseList[i].detail["0"].signinopens.length,
          weekSigninopens: app.data.courseList[i].detail["0"].signinopens,
          course_detail_id: app.data.courseList[i].detail["0"].detail_id,
        })
        // console.log(that.data.signinopens);
        break;
     }
   }
    for (let i = 0; i < that.data.signinopens; i++) {
      times.push("第" + (i + 1) + 　"次" + "(第" + that.data.weekSigninopens[i] + "周)");
    }
    if(times != null)
     that.setData({
       times: times,
       signTimes: times[0],
     })
    var str = that.data.signTimes;
    that.data.week_num = that.data.weekSigninopens[str[1] - 1];
    wx.request({
      url: 'https://dragon2000.oicp.io:3000/api/teacherGetCourseSignInDetail',
      data: {
        course_detail_id: that.data.course_detail_id,
        week_num: that.data.week_num,
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data);
        if (res.data.msg == 'success') {
           that.setData({
             stu_unsign: res.data.stu_unsign,
             stu_signed: res.data.stu_signed,
           })
        } 
        else {
          wx.showToast({
            title: '错误',

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
    // console, log("onShow");
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

  },
  bindChange: function (e) {
    var that = this
    const val = e.detail.value
    that.setData({
      signTimes: that.data.times[val[0]],
    })
    var str = that.data.signTimes;
    that.data.week_num = that.data.weekSigninopens[str[1] - 1];
    
    wx.request({
      url: 'https://dragon2000.oicp.io:3000/api/teacherGetCourseSignInDetail',
      data: {
        course_detail_id: that.data.course_detail_id,
        week_num: that.data.week_num,
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data);
        if (res.data.msg == 'success') {
          that.setData({
            stu_unsign: res.data.stu_unsign,
            stu_signed: res.data.stu_signed,
          })
        }
        else {
          wx.showToast({
            title: '错误',

          })
        }
      }
    })

  }
})