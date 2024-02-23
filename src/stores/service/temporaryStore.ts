import { defineStore } from "pinia";
import { ref } from "vue";

const usetemporaryStore = defineStore("temporary", () => {
  const isLaunchChat = ref(false);
  const launchedChatTeacherId = ref();
  const launchedChatTeacherName = ref();
  const setIsLaunchChat = (state: boolean) => {
    isLaunchChat.value = state;
  };
  const setLaunchedChatTeacherId = (id: number) => {
    launchedChatTeacherId.value = id;
  };
  const setLaunchedChatTeacherName = (name: string) => {
    launchedChatTeacherName.value = name;
  };

  return{
    isLaunchChat,
    setIsLaunchChat,
    launchedChatTeacherId,
    setLaunchedChatTeacherId,
    launchedChatTeacherName,
    setLaunchedChatTeacherName
  };
});

export default usetemporaryStore;