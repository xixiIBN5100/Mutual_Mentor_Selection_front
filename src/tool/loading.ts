import { ElLoading,ElNotification } from 'element-plus';

let loadingInstance:any = null;

const startLoading = () => {
  loadingInstance = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  });
  setTimeout(() => {
    loadingInstance.close()
    ElNotification({
      title: 'Error',
      message: '失败,网络错误',
      type: 'error',
      
    })
  }, 2000)
};

const closeLoading = () => {
  if (loadingInstance) {
    loadingInstance.close();
  }
};

export { startLoading, closeLoading };
