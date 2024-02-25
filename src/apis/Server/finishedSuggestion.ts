import request from '@/apis/request';

export default class finishedSuggestion{
  static async getInfo(token:string){
    return request({
      headers: {
        "Content-Type" : "application/json",
        'Authorization': token,
      },
      method: "get",
      url: "/api/student/get-suggest",
    })
  }
}




