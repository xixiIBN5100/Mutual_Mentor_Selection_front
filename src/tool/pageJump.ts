import router from "@/router";
import { ref } from "vue";

const isFadingOut = ref(false);
const jumpPage = (url: string) => {
  isFadingOut.value = true;
  setTimeout(() => {
    router.push(url);
  },1000);
};

/*
使用说明：
在vue组件中导入card以及tool
同时将 isFadingOut 的值设定为 false
··· ts
import { Card } from "@/components/index";
import { jumpPage, isFadingOut } from "@/tool";
isFadingOut.value = false;
···
然后在card的属性中挂上 :is-fading-out=isFadingOut 即可
*/

export {
  isFadingOut,
  jumpPage
};