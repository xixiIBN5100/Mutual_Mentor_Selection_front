import axios from "axios";
const request = (config:object) => {
  const instance = axios.create({
    baseURL:"http://phlin.love",
    timeout:1000,
  });
  return instance(config);
};
export default request;