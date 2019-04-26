// pages/teacher/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseList: [
    ],
    weekNumber: ['日', '一', '二', '三', '四', '五', '六'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // console,log("onLoad");
    this.setData({
      courseList: app.data.courseList
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
  change: function (e) {
    // console.log(e.currentTarget.id);
    for (var i = 0; i < this.data.courseList.length; i++) {
      if (e.currentTarget.id == this.data.courseList[i].id) {
        app.data.information = this.data.courseList[i].name;
        break;
      }
    }
    // wx.redirectTo({
    wx.navigateTo({
      url: '../TeacherCourseContent/index'
    })
  }
})