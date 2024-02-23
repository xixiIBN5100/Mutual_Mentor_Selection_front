import { defineStore } from "pinia";
import { ref } from "vue";

const useChatStore = defineStore("chat", () => {
  const chatObjects = ref();
  chatObjects.value = [];
  const addChatObjects = (objId: number, objName: string) => {
    let flag = -1;
    for(let i=0; i<chatObjects.value.length; i++) {
      if(chatObjects.value[i][0] === objId){
        flag = i;
      }
    }
    if(flag === -1){
      chatObjects.value.push([objId, objName]);
    } else {
      chatObjects.value[flag][1] = objName;
    }
  };
  const resetChatObjects = () => {
    chatObjects.value = [];
  };

  return{
    chatObjects,
    addChatObjects,
    resetChatObjects
  };
},{ persist: true });

export default useChatStore;