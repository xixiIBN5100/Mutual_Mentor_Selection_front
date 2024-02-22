import request from '@/apis/request'

export default class teacherSetTime{
  static async setTime(data:{
    time_by_teacher:string;
  },token:string){
    return request({
      headers:{"Content-Type":"application/json",'Authorization':`Bearer ${token}`},
      method:"post",
      url:"/api/teacher/time",
      data:data,
    });
  }

  static async getAdminTime(token:string){
    return request({
      headers:{"Content-Type":"application/json",'Authorization': `Bearer ${token}`,},
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

