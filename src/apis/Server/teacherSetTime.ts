import request from '@/apis/request'

const token = localStorage.getItem('token');

export default class teacherSetTime{
  static async setTime(data:{
    time_by_teacher:string;
  }){
    return request({
      headers:{"Content-Type":"application/json",'Authorization':`Bearer ${token}`},
      method:"post",
      url:"/api/teacher/time",
      data:data,
    });
  }

  static async getAdminTime(){
    return request({
      headers:{"Content-Type":"application/json"},
      method:"get",
      url:"/api/user/admin/time",
    })
  }

  static async getBeforeTime(){
    return request({
      headers:{"Content-Type":"application/json"},
      method:"get",
      url:"/api/user/teacher/time",
    })
  }
}
