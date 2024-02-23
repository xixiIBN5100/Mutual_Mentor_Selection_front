import { defineStore } from "pinia";
import useLoginStore from "./service/loginStore";
import useUserStore from "./service/userStore";
import useChatStore from "./service/chatStore";
import usetemporaryStore from "./service/temporaryStore";

export const useMainStore = defineStore("main", () => {
  return {
    useLoginStore,
    useUserStore,
    useChatStore,
    usetemporaryStore
  };
},{ persist: true });