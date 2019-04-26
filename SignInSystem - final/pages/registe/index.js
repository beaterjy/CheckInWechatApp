// pages/registe/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    role: 'student',
    user_num: null,
    user_id: null,
    // testRole:'',
    // testUser_id:'',
    // testUser_name:'',
    // testVerify:'',
    // testCode:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  formSubmit: function (event) {
    
    // console.log(event.detail.value)
    var that = this
    var wx_code
    wx.login({
      success: function (data) {
        // that.setData({
        //   testRole: event.detail.value.radioGroup,
        //   testUser_id: event.detail.value.id,
        //   testUser_name: event.detail.value.name,
        //   testVerify: that.data.role,
        //   testCode: data.code
        // })
        wx.request({
          url: 'https://dragon2000.oicp.io:3000/api/registe',
          data: {
            role: event.detail.value.radioGroup,
            user_id: event.detail.value.id,
            user_name: event.detail.value.name,
            verify: that.data.role,
            code: data.code
          },
          method: 'POST',
          success: function (res) {
            console.log(res);
            that.setData({
              user_num: res.user_num,
              user_id: event.detail.value.id
            })
            app.data.user_num = that.data.user_num;
            app.data.user_id = that.data.user_id;
            if (res.data.msg == 'success' && res.data.role == 'student') {
              wx.redirectTo({
                url: '../student/StudentPage/index',
              })
            } else if (res.data.msg == 'success' && res.data.role == 'teacher') {
              wx.switchTab({
                url: '../teacher/TeacherPage/index',
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
      }
      
    })
    
    
    // if (this.data.role == "student") {
    //   // wx.redirectTo({
    //   wx.navigateTo({
    //     url: '../student/StudentPage/index'
    //   })
    // }
    // else if (this.data.role == "teacher"){
    //   // wx.redirectTo({
    //   wx.switchTab({
    //     url: '../teacher/TeacherPage/index'
    //   })
    //   console.log(this.data.role);
    // }
  },
  radioChanged: function (event) {
    this.data.role = event.detail.value;
    // console.log(app.data.show);
    // console.log(this.data.role);
  }
})