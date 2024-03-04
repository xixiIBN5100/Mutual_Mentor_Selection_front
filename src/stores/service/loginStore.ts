import { defineStore } from "pinia";
import { ref } from "vue";

const useLoginStore = defineStore("login", () => {
  const loginSession = ref(false);
  const token = ref<string|undefined>();
  const homeTitle = ref<string>();
  const setLogin = (loginNewSession: boolean) => {
    loginSession.value = loginNewSession;
  };
  const setToken = (tokenCon: string|undefined) => {
    token.value = tokenCon;
  };
  const setHomeTitle = (msg: string) => {
    homeTitle.value = msg;
  };

  return{
    loginSession,
    token,
    homeTitle,
    setLogin,
    setToken,
    setHomeTitle
  };
},{ persist: true });

export default useLoginStore;