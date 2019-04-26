// pages/teacher/index.js
var app = getApp()
const teacherClasses = []


Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: null,
    longitude: null,
    accuracy: null,
    map_center: null,
    circles: null,
    color: '#0F0',

    teacherClasses: teacherClasses,
    chosedClass: '',
    value: [1],
    signing: false,
    s: null,
    courseId:null,
    course_detail_id: null,
    SingingCourseId: null,
    signingCourseStartTime: null,
    week_num: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    if (!this.data.accuracy || this.data.accuracy < 10) {
      wx.getLocation({
        type: 'gcj02',

        success: function (res) {
          console.log(res);
          //res.longitude += 0.0054558600000120805
          //res.altitude += -0.0025534699999987254
          // wx.openLocation({
          //   latitude: res.latitude,
          //   longitude: res.longitude,
          // })
          that.setData({
            longitude: res.longitude,
            latitude: res.latitude,
            accuracy: res.accuracy,
            color: '#00F',
            map_center: [{
              latitude: res.latitude,
              longitude: res.longitude,
              name: 'center',
            }],
            circles: [{
              latitude: res.latitude,
              longitude: res.longitude,
              radius: res.accuracy,
              fillColor: '#000000A0'
            }]
          })

        },
      })
    }
    wx.request({
      url: 'https://dragon2000.oicp.io:3000/api/teacherIsBusy',
      data: {
        user_num: app.data.user_num,
        user_id: app.data.user_id,
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data);
        if (res.data.msg == 'notBusy') {
          that.setData({
            signing: false,
          })
          app.data.signing = that.data.signing;
        }
        else if (res.data.msg == 'isBusy'){
          that.setData({
            signing: true,
            SingingCourseId: res.data.course_id,
            signingCourseStartTime: res.data.signingopentime,
          })
          for (var i = 0; i < app.data.courseList.length; i++) {
            if (that.data.SingingCourseId == app.data.courseList[i].id){
              that.setData({
                s: app.data.courseList[i].name + "@" + app.data.courseList[i].detail["0"].classroom + "星期" + app.data.weekNumber[app.data.courseList[i].detail["0"].day] + "第" + app.data.courseList[i].detail["0"].class_time + "," + (app.data.courseList[i].detail["0"].class_time + 1) + "节",
              })
              app.data.signInformation = that.data.courseList[i].name;
            }
          }
          app.data.courseStartTime = that.data.signingCourseStartTime;
          app.data.signing = that.data.signing;
        }
      }
    })
    wx.request({
      url: 'https://dragon2000.oicp.io:3000/api/teacherGetCoursesList',
      data: {
        user_num: app.data.user_num,
        user_id: app.data.user_id
      },
      method: 'POST',

      success: function (res) {
        if (res.data.msg == 'success') {
          console.log(res.data);
          that.setData({
            courseList: res.data.courses_info,
          })
          app.data.courseList = that.data.courseList;
          that.setData({
            chosedClass: app.data.courseList[0].name,
            course_detail_id: app.data.courseList[0].detail["0"].detail_id,
          })
          // console.log(that.data.chosedClass);
          // console.log(typeof app.data.courseList[0].detail["0"].class_time);
          for (let i = 0; i < app.data.courseList.length; i++) {
            teacherClasses.push(app.data.courseList[i].name + "@" + app.data.courseList[i].detail["0"].classroom + "星期" + app.data.weekNumber[app.data.courseList[i].detail["0"].day] + "第" + app.data.courseList[i].detail["0"].class_time + "," + (app.data.courseList[i].detail["0"].class_time + 1) + "节");
          }
          that.setData({
            teacherClasses: teacherClasses,
            courseId: app.data.courseList[0].id,
          })
        }
        else {
          console.log(res.data);
          wx.showToast({
            title: '错误',
            duration: 2000
          })
        }
      }
    })
  },

  btn_getLocation: function (e) {
    var that = this
    wx.getLocation({
      type: 'gcj02',
      // fail: function() {
      //   that.setData({
      //     busy: false
      //   })
      // },
      success: function (res) {
        console.log(res)
        // wx.openLocation({
        //   latitude: res.latitude,
        //   longitude: res.longitude,
        // })
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          accuracy: res.accuracy,
          color: '#00F',
        })
      },
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

    const val = e.detail.value
    var that = this
    that.setData({
      s: this.data.teacherClasses[val[0]]
    })
    this.data.s = this.data.teacherClasses[val[0]];
    var str = this.data.s.split("@");
    // console.log("s: " + this.data.s);
    for(var i = 0; i < app.data.courseList.length; i++){
      if(app.data.courseList[i].name == str[0])
      {
        that.setData({
          course_detail_id: app.data.courseList[i].detail["0"].detail_id,
          courseId: app.data.courseList[i].id,
        })
        // console.log("course_detail_id: " + that.data.course_detail_id);
        break;
      }
    }
    // console.log(that.data.courseId);
    this.setData({
      chosedClass: str[0],
    })


  },

  clickBtn: function (e) {
    var that = this
    wx.request({
      url: 'https://dragon2000.oicp.io:3000/api/teacherGetCourseNow',
      data: {
        user_num: app.data.user_num,
        user_id: app.data.user_id,
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data);
        if (res.data.msg == 'something'){
          if (res.data.course_detail_id == that.data.course_detail_id){
            wx.request({
              url: 'https://dragon2000.oicp.io:3000/api/teacherOpenSignIn',
              data: {
                course_detail_id: that.data.course_detail_id,
                location_x: that.data.latitude,
                location_y: that.data.longitude,
              },
              method: 'POST',
              success: function (twores) {
                console.log(twores.data);
                that.setData({
                  signing: true,
                  week_num: twores.data.week_num,
                })
                app.data.signCourse_week_num = that.data.week_num;
                app.data.signing = that.data.signing;
                app.data.signInformation = that.data.chosedClass;
                app.data.signCourse_detail_id = that.data.course_detail_id;
              }
            })
          }
          else
            wx.showToast({
              title: '该课不在本时间段',
            })

        }
        else if(res.data.msg == 'nothing'){
          wx.showToast({
            title: '本时间段您没有课',
          })
        }
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;

        var n = timestamp * 1000;
        var date = new Date(n);
        //年  
        var Y = date.getFullYear();
        //月  
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        //日  
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        //时  
        var h = date.getHours();
        //分  
        var m = date.getMinutes();
        //秒  
        var s = date.getSeconds();

        // console.log("当前时间：" + Y + "/" + M + "/" + D + "  " + h + ":" + m + ":" + s);  
        app.data.courseStartTime = Y + "/" + M + "/" + D + "  " + h + ":" + m + ":" + s;
      }
    })
    
   
  }
})