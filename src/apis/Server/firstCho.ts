import request from '@/apis/request';

export default class firstCho{
  static async choice(data:{
    teacher_id:number,
  },token:string){
    return request({
      headers: {"Content-Type":"application/json",'Authorization':`Bearer ${token}`},
      method: "post",
      url: "/api/student/choose-teacher",
      data:data
    })
  }
  static async getStuInfo(token:string){
    return request({
      headers: {"Content-Type":"application/json",'Authorization':`Bearer ${token}`},
      method: "get",
      url: "/api/student/info",
    })
  }

  static async getAdminTime(token:string){
    return request({
      headers: {"Content-Type":"application/json",'Authorization':`Bearer ${token}`},
      method: "get",
      url: "/api/user/admin/time",
    })
  }
}