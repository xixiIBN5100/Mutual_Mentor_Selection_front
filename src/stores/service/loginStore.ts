import { defineStore } from "pinia";
import { ref } from "vue";

const useLoginStore = defineStore("login", () => {
  const loginSession = ref(false);
  const token = ref<string|undefined>();
  const setLogin = (loginNewSession: boolean) => {
    loginSession.value = loginNewSession;
  };
  const setToken = (tokenCon: string|undefined) => {
    token.value = tokenCon;
  };

  return{
    loginSession,
    token,
    setLogin,
    setToken
  };
},{ persist: true });

export default useLoginStore;