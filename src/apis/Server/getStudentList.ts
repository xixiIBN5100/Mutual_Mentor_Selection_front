import request from "@/apis/request";

const getStudentListAPI = (param: number, token?: string) => {
  return request({
    method: "GET",
    url: "/api/teacher/student",
    params: { param },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
export default getStudentListAPI;
