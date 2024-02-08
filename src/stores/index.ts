import { defineStore } from "pinia";
import useLoginStore from "./service/loginStore";
import useUserStore from "./service/userStore";

export const useMainStore = defineStore("main", () => {
  return {
    useLoginStore,
    useUserStore
  };
});