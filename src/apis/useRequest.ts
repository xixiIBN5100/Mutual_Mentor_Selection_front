import axios from "axios";
import { ref } from "vue";

interface requestConfigType{
  data?: object;
  params?: object | number;
  method:string;
  url:string;
  headers: {
    Authorization: string | undefined
    "Content-Type"?: string
  };

  /** 是否手动发起请求 */
  manual?:boolean;

  /** loading 延迟 单位 ms */
  loadingDelay?:number;

  /** 发起请求之前的 hook */
  onBefore?:()=> void;

  /** 成功接收到响应 hook */
  onSuccess?:(response:any) =>void;

  /** 请求失败 hook */
  onError?:(error:Error | {errMsg:string}) => string | void;

  /** 请求结束后 hook */
  onFinally?: () => void;
}

const useRequest = (config:requestConfigType) => {
  const loading = ref(false);
  const data = ref<object>();
  const error = ref<Error | { errMsg:string }>();

  const request = () => {
    data.value = undefined;
    error.value = undefined;
    config?.onBefore?.();
    const timer = setTimeout(()=>{
      loading.value = true;
    },config?.loadingDelay || 0);

    const instance = axios.create({
      baseURL:"https://phlin.love",
      timeout:1000,
    });

    /** 添加token */
    const token = localStorage.getItem("token");
    if(token){
      config.headers["Authorization"] = token;
    }

    instance(config).then((response)=>{
      config?.onSuccess?.(response);
      data.value = response.data;
    }).catch((e:Error | { errMsg:string}) => {
      const errMsg = config?.onError?.(e);
      console.log(errMsg);
      error.value = e;
    }).finally(() => {
      config?.onFinally?.();
      if(timer) clearTimeout(timer);
      loading.value = false;
    });
  };

  // onMounted(() => {
  // console.log("debug1");
  if(!config?.manual){
    request();
  }
  // });

  return{
    loading,
    data,
    error,
    run : request,
  };
};

export default useRequest;
