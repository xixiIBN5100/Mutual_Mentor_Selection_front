import request from '@/apis/request'

export default class adminSetTime{
  static async setTime(data:{
    time_by_admin:string,
    type:number,
  },token:string){
    return request({
      headers:{"Content-Type":"application/json",'Authorization':`Bearer ${token}`},
      method:"post",
      url:"/api/admin/time",
      data:data,
    });
  }

  static async getBefore(token:string) {
    return request({
      headers:{"Content-Type":"application/json",'Authorization':`Bearer ${token}`},
      method:"get",
      url:"/api/user/admin/time",
    })
  }
}