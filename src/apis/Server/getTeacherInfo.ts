import request from '@/apis/request'

const token = localStorage.getItem("token");

export default class getTeacherInfo {
  static async getInfo(params: {
    page_num: number,
    page_size: number,
  }){
    return request({
      headers:{
        "Content-Type":"application/json",'Authorization':`Bearer ${token}`
      },
      method:"get",
      url:"/api/student/teacher",
      params:params,
    })
  }

  static async choice(body){

  }
}