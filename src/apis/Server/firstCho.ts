import request from '@/apis/request';

const token = localStorage.getItem("token")

export default class firstCho{
  static async choice(data:{
    teacher_id:number,
  }){
    return request({
      headers: {"Content-Type":"application/json",'Authorization':`Bearer ${token}`},
      method: "post",
      url: "/api/student/choose-teacher",
      data:data
    })
  }
  static async getStuInfo(){
    return request({
      headers: {"Content-Type":"application/json",'Authorization':`Bearer ${token}`},
      method: "get",
      url: "/api/student/info",
    })
  }
}