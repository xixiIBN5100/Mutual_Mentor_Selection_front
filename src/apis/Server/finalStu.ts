import request from '@/apis/request'

const token = localStorage.getItem("token");

export default class finalStu{
  static async getFinalStu(){
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