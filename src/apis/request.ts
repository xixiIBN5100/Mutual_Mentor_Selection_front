import axios from "axios";
const request = (config:object) => {
  const instance = axios.create({
    baseURL:"http://47.115.209.120:8080",
    timeout:1000,
  });
  return instance(config);
}
export default request;