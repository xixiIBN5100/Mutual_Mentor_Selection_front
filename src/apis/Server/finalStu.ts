import request from '@/apis/request'

export default class finalStu{
  static async getFinalStu(token:string){
    return request({
      headers:{
        "Content-Type":"application/json",
        'Authorization': `Bearer ${token}`,
      },
      method: "get",
      url: "/api/teacher/get-student",
    })
  }
}