//app.js
App({
  data: {
    dataSignCourse: null,
    information: null,//点击所选的课程的课程id
    signInformation: null,
    courseList: [],
    teacherCourseList: [
      { id: 1, name: '高等数学', address: '3307', time: '星期一第1,2节', totalStudent: 110},
      { id: 2, name: '网络编程', address: '3607', time: '星期二第7,8节', totalStudent: 120 },
      { id: 3, name: '汇编语言', address: '3407', time: '星期三第7,8节', totalStudent: 130 },
      { id: 4, name: '数据库', address: '3402', time: '星期五第1,2节', totalStudent: 140},
      { id: 5, name: '经典电影赏析', address: '3301', time: '星期四第11,12,13节', totalStudent: 150 },
      { id: 6, name: '计算机图形学', address: '3407', time: '星期三第11,12,13节', totalStudent: 160},
      { id: 7, name: '操作系统', address: '3506', time: '星期五第3,4节', totalStudent: 170},
    ],
    user_num: '',
    user_id: '',
    myList:[],
    weekNumber: ['日', '一', '二', '三', '四', '五', '六'],
    courseStartTime:null,
    signCourse_detail_id: null,
    signCourse_week_num: null,
    sign: false,
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this
    wx.login({
      success: function(data) {
        // that.globalData.userCode = data.code
         //console.log("OpenID: " + data.code);
        wx.request({
          url: 'https://dragon2000.oicp.io:3000/api/login',
          data: {
            code: data.code
          },
          method: 'POST',
          success: function (res) {
            console.log(res.data);
            if (res.data.msg == 'success' && res.data.role == 'student') {
              that.data.user_num = res.data.user_num;
              that.data.user_id = res.data.user_info.id;
              wx.redirectTo({
                url: '../../pages/student/StudentPage/index',
              })
            } 
            else if (res.data.msg == 'success' && res.data.role == 'teacher') {
              that.data.user_num = res.data.user_num;
              that.data.user_id = res.data.user_info.id;
              wx.switchTab({
                url: '../../pages/teacher/TeacherPage/index',
              })
            }
             else {
              wx.navigateTo({
                url: '../../pages/registe/index',
              })
            }
          }
        })
      }

    })
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (data) {
          that.globalData.userCode = data.code
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              //console.log(res)
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },

  globalData: {
    userInfo: null,
    userCode: null
  }
})