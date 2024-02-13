import request from '@/apis/request'

export default class getTeacherInfo {
  static async getInfo(params: {
    page_num: number,
    page_size: number,
  }){
    return request({
      headers:{
        "Content-Type":"application/json",
      },
      method:"get",
      url:"/api/student/teacher",
      params:params,
    })
  }

  static async choice(body){

  }
}