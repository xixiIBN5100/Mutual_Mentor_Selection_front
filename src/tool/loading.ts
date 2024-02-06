import { ElLoading } from 'element-plus';

let loadingInstance:any = null;

const startLoading = () => {
  loadingInstance = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  });
  setTimeout(() => {
    loadingInstance.close()
    
  }, 2000)
};

const closeLoading = () => {
  if (loadingInstance) {
    loadingInstance.close();
  }
};

export { startLoading, closeLoading };
