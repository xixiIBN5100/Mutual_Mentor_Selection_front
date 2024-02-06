import axios from 'axios';
import {ref} from "vue";

interface requestConfigType{
  data : object;
  method:string;
  url:string;
  headers: object;
}

const useRequest = (config:requestConfigType) =>{
  const response = ref();
  response.value = undefined;

  const instance = axios.create({
    baseURL:"",
    timeout:1000,
  });
  response.value= instance(config);
  return response;
};

export default useRequest;
