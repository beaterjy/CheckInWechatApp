// page/one/index.js
var app = getApp()
Page({
  data: {
    open: false,
    mark: 0,
    newmark: 0,
    startmark: 0,
    endmark: 0,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    staus: 1,
    translate: '',
    // courseList:[
    //   { id: 1, title: '高等数学@3307第一二节'},
    //   { id: 2, title: '网络编程@3607 第三四节' },
    //   { id: 3, title: '汇编语言@3407第七八节' },
    //   { id: 4, title: '数据库@3402第九十节' },
    //   { id: 5, title: '经典电影赏析@3301第十一至十三节' }
    //   ],
    signCourse: null,
    studentID: '',
    
      // myUser_num,
      // muUser_id
    userInfo: {},
    // course: { name: '数据库',time:'星期四第9，10节',addr:'3304',teach_name:'方芳芳'},
    isEmpty: false,
    SignInStarted :true,
//  new Date() + new Date(28800000);
    course_detail_id: null,
    course_title: null,
    class_time: null,
    classroom: null,
    isSigned: false,
    latitude:null,
    longitude:null,
  },

  onLoad: function (options) {
    // console,log("onLoad");
    var that = this
    that.setData({
      signCourse: app.data.dataSignCourse
    })
  },

  tap_ch: function (e) {
    if (this.data.open) {
      this.setData({
        translate: 'transform: translateX(0px)'
      })
      this.data.open = false;
    } else {
      this.setData({
        translate: 'transform: translateX(' + this.data.windowWidth * 0.65 + 'px)'
      })
      this.data.open = true;
    }
  },
  
  tap_start: function (e) {
    this.data.mark = e.touches[0].pageX;
    if (this.data.staus == 1) {
      // staus = 1指默认状态
      this.data.startmark = e.touches[0].pageX;
    } else {
      // staus = 2指屏幕滑动到右边的状态
      this.data.startmark = e.touches[0].pageX;
    }
  },
  
  tap_drag: function (e) {
    /*
     * 手指从左向右移动
     * @newmark是指移动的最新点的x轴坐标 ， @mark是指原点x轴坐标
     */
    this.data.newmark = e.touches[0].pageX;
    if (this.data.mark < this.data.newmark) {
      if (this.data.staus == 1) {
        if (this.data.windowWidth * 0.75 > Math.abs(this.data.newmark - this.data.startmark)) {
          this.setData({
            translate: 'transform: translateX(' + (this.data.newmark - this.data.startmark) + 'px)'
          })
        }
      }

    }
    /*
     * 手指从右向左移动
     * @newmark是指移动的最新点的x轴坐标 ， @mark是指原点x轴坐标
     */
    if (this.data.mark > this.data.newmark) {
      if (this.data.staus == 1 && (this.data.newmark - this.data.startmark) > 0) {
        this.setData({
          translate: 'transform: translateX(' + (this.data.newmark - this.data.startmark) + 'px)'
        })
      } else if (this.data.staus == 2 && this.data.startmark - this.data.newmark < this.data.windowWidth * 0.75) {
        this.setData({
          translate: 'transform: translateX(' + (this.data.newmark + this.data.windowWidth * 0.75 - this.data.startmark) + 'px)'
        })
      }

    }

    this.data.mark = this.data.newmark;

  },
  tap_end: function (e) {
    if (this.data.staus == 1 && this.data.startmark < this.data.newmark) {
      if (Math.abs(this.data.newmark - this.data.startmark) < (this.data.windowWidth * 0.2)) {
        this.setData({
          translate: 'transform: translateX(0px)'
        })
        this.data.staus = 1;
      } else {
        this.setData({
          translate: 'transform: translateX(' + this.data.windowWidth * 0.65 + 'px)'
        })
        this.data.staus = 2;
      }
    } else {
      if (Math.abs(this.data.newmark - this.data.startmark) < (this.data.windowWidth * 0.2)) {
        this.setData({
          translate: 'transform: translateX(' + this.data.windowWidth * 0.65 + 'px)'
        })
        this.data.staus = 2;
      } else {
        this.setData({
          translate: 'transform: translateX(0px)'
        })
        this.data.staus = 1;
      }
    }

    this.data.mark = 0;
    this.data.newmark = 0;
  },

  change:function(e){
    console.log(e);
    // console.log(e.currentTarget.id);
    for ( var i = 0; i < this.data.courseList.length; i++){
      if (e.currentTarget.id == this.data.courseList[i].id){
        app.data.information = this.data.courseList[i].title;
        break;
      }
    }
    // wx.redirectTo({
      wx.navigateTo({
      url: '../StudentSign/index'
    })
  },
  onLoad: function (options) {
    // try {
    //   var value = wx.getStorageSync('key')
    //   if (value) {
    //     // Do something with return value
    //   }
    // } catch (e) {
    //   // Do something when catch error
    // }
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        studentID: app.data.user_id,
      })
    })

    wx.request({
      url: 'https://dragon2000.oicp.io:3000/api/stuGetCourseNow',
      data: {
        user_num: app.data.user_num,
        user_id: app.data.user_id,
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data);
        if(res.data.msg == 'nothing'){
          that.setData({
              isEmpty: true,
          })
        }
        else if (res.data.msg == 'something'){
          that.setData({
            course_detail_id: res.data.course_detail_id,
            course_title: res.data.course_title,
            class_time: res.data.class_time,
            classroom: res.data.classroom,
            isSigned: res.data.isSigned,
          })
          
        }
      }
    })
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        that.setData({
           latitude : res.latitude,
           longitude : res.longitude,
        })
      }
    })

    // wx.request({
    //   url: 'https://dragon2000.oicp.io:3000/api/teacherIsBusy',
    //   data: {
    //     user_num: app.data.user_num,
    //     user_id: app.data.user_id,
    //   },
    //   method: 'POST',
    //   success: function (res) {
    //     console.log(res.data);
    //     // if (res.data.msg == 'notBusy') {
    //     //   that.setData({
    //     //     signing: false,
    //     //   })
    //     //   app.data.signing = that.data.signing;
    //     // }
    //     // else if (res.data.msg == 'isBusy') {
    //     //   that.setData({
    //     //     signing: true,
    //     //     SingingCourseId: res.data.course_id,
    //     //     signingCourseStartTime: res.data.signingopentime,
    //     //   })
    //     //   for (var i = 0; i < app.data.courseList.length; i++) {
    //     //     if (that.data.SingingCourseId == app.data.courseList[i].id) {
    //     //       that.setData({
    //     //         s: app.data.courseList[i].name + "@" + app.data.courseList[i].detail["0"].classroom + "星期" + app.data.weekNumber[app.data.courseList[i].detail["0"].day] + "第" + app.data.courseList[i].detail["0"].class_time + "," + (app.data.courseList[i].detail["0"].class_time + 1) + "节",
    //     //       })
    //     //       app.data.signInformation = that.data.courseList[i].name;
    //     //     }
    //     //   }
    //     //   app.data.courseStartTime = that.data.signingCourseStartTime;
    //     //   app.data.signing = that.data.signing;
    //     // }
    //   }
    // })
   
  },
  clickSignBtn: function(e){
    var that = this
    wx.request({
      url: 'https://dragon2000.oicp.io:3000/api/stuSignIn',
      data: {
        user_num: app.data.user_num,
        user_id: app.data.user_id,
        course_detail_id: that.data.course_detail_id,
        student_x: that.data.latitude,
        student_y: that.data.longitude,

      },
      method: 'POST',
      success: function (res) {
        console.log(res.data);
        if (res.data.msg == 'success') {
          wx.showToast({
            title: '签到成功',
          })
        }
        else if(res.data.msg == 'failed') {
          wx.showToast({
            title: '错误',
          })
        }

      }
    })
  },
  getLocation: function (e) {
    // console.log(this.data.courseInformation);
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })
        console.log(latitude);
        console.log(longitude);
      }
    })
  },

})