import axios from 'axios';
import {ref , onMounted} from "vue";

interface requestConfigType{
  data : object;
  method:string;
  url:string;
  headers: object;

  /** 是否手动发起请求 */
  manual?:boolean;

  /** loading 延迟 单位 ms */
  loadingDelay?:number;

  /** 发起请求之前的 hook */
  onBefore?:()=> void;

  /** 成功接收到响应 hook */
  onSuccess?:(response:any) =>void;

  /** 请求失败 hook */
  onError?:(error:Error | {errMsy:string}) => string | void;

  /** 请求结束后 hook */
  onFinally?: () => void;
}

const useRequest = (config:requestConfigType) =>{
  const loading = ref(false)
  const data = ref<object>();
  const error = ref<Error | { errorMsg:string }>();


  const request = () => {
    data.value = undefined;
    error.value = undefined;
    config?.onBefore?.();
    const timer = setTimeout(()=>{
      loading.value = true;
    },config?.loadingDelay || 0);

    const instance = axios.create({
      baseURL:"",
      timeout:1000,
    })

    /** 添加token */
    const token = localStorage.getItem('token');
    if(token){
      config.headers['Authorization'] = `Bearer ${token}`
    }

    instance(config).then((response)=>{
      config?.onSuccess?.(response);
      data.value = response.data;
    }).catch((e:Error | { errMsg:string}) => {
      const errMsy = config?.onError?.(e);
      error.value = e;
    }).finally(() => {
      config?.onFinally?.();
      if(timer) clearTimeout(timer);
      loading.value = false;
    });
  };

  onMounted(() => {
    if(!config?.manual){
      request();
    }
  })

  return{
    loading,
    data,
    error,
    run : request,
  }
};

export default useRequest;
