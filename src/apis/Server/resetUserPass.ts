import request from '@/apis/request';

export default class resetUserPass{
  static async getUserInfo(params:{
    page_num:string,
    page_size:string,
    user_name?:string,
  },token:string){
    return request({
      headers: {
        "Content-Type":"application/json",'Authorization':`Bearer ${token}`,
      },
      method:"get",
      url: "/api/admin/user",
      params: params,
    })
  }

  static async reset(data:{
    user_id:string,
  },token){
    return request({
      headers:{
        "Content-Type":"application/json",'Authorization':`Bearer ${token}`,
      },
      method:"put",
      url:"/api/admin/reset",
      data:data,
    })
  }
}