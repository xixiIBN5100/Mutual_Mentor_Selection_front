import request from "@/apis/request";

const loginAPI = (data: { username: string; password: string; type: number }) => {
  return request({
    method: "POST",
    url: "/api/login",
    data: data,
    withCredentials: true
  });
};

export default loginAPI;
