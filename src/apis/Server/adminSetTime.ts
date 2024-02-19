import request from '@/apis/request'

const token = localStorage.getItem("token")

export default class adminSetTime{
  static async setTime(data:{
    time_by_admin:string,
    type:number,
  }){
    return request({
      headers:{"Content-Type":"application/json",'Authorization':`Bearer ${token}`},
      method:"post",
      url:"/api/admin/time",
      data:data,
    });
  }

  static async getBefore() {
    return request({
      headers:{"Content-Type":"application/json",'Authorization':`Bearer ${token}`},
      method:"get",
      url:"/api/user/admin/time",
    })
  }
}