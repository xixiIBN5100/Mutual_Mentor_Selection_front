<template>
  <div :class="styles.background">
    <div :class="styles.contain">
      <card :class="styles['title-bar']" title="我的私信" :bold-title="true" :is-fading-out=isFadingOut>
            <el-icon :class="styles['back-button']" :size="30" @click="back"><Back /></el-icon>
      </card>
      <card :class="styles['chat-window']" :is-fading-out=isFadingOut v-if="chaterList.length > 0">
        <div :class="styles['chat-bar']">
          <div
          :class="[styles['chater'], ch[0] === curChaterId ? styles['chosen-chater'] : undefined]"
          v-for="ch in chaterList"
          :key="ch[0]"
          @click="() => chooseChater(ch[0])"
          >{{ ch[1] }}</div>
        </div>
        <div :class="styles['horizon']"></div>
        <div :class="styles['chat-body']" v-if="curChaterId != -1">
          <div :class="styles['chats']" id="chat-chats">
            <div v-for="msg in chatMsgList" :key="msg.index" :class="styles[msg.user_a_name === '' ? 'msg-div-front' : 'msg-div-me']">
              <div :class="styles['msg-name']" v-if="msg.showName">{{ msg.user_a_name === "" ? msg.user_b_name : msg.user_a_name }}</div>
              <div :class="[styles['msg-message'],styles[msg.showName ? '' : 'no-name']]">{{ msg.message }}</div>
            </div>
          </div>
          <div :class="styles['msg-bar']">
            <textarea :class="styles['Textarea-pink']" v-model="message"></textarea>
            <DarkButton inner="发送消息" color="pink" @click="sendMsg"/>
          </div>
        </div>
      </card>
      <card v-else :class="styles.warning" :is-fading-out=isFadingOut>
        <div>暂无私信记录</div>
        <div v-if="userStore.userIdentity === '学生'">请前往教师列表私聊教师</div>
      </card>
    </div>
  </div>
</template>

<script setup lang="ts">
import styles from "./index.module.scss";
import { Card, DarkButton } from "@/components/index";
import { jumpPage, isFadingOut } from "@/tool";
import { ref } from "vue";
import useRequest from "@/apis/useRequest";
import { ElNotification } from 'element-plus'
import { useMainStore } from "@/stores";
isFadingOut.value = false;

const loginStore = useMainStore().useLoginStore();
const userStore = useMainStore().useUserStore();
const temporaryStore = useMainStore().usetemporaryStore();
const chatStore = useMainStore().useChatStore();
const chaterList = ref(chatStore.chatObjects);

useRequest({
  params: {},
  method: "GET",
  url: "/api/user/student",
  headers: { Authorization: loginStore.token },
  onSuccess(data) {
    const resData = data.data.data;
    console.log(resData);
    for(let i=0; i<resData.length; i++){
      chatStore.addChatObjects(resData[i].user_id, resData[i].name);
    }
    if(temporaryStore.isLaunchChat){
      temporaryStore.setIsLaunchChat(false);
      chatStore.addChatObjects(temporaryStore.launchedChatTeacherId, temporaryStore.launchedChatTeacherName);
      curChaterId.value = temporaryStore.launchedChatTeacherId;
    }
    chaterList.value = chatStore.chatObjects;
    console.log(chatStore.chatObjects);
  },
  onError(error) {
    console.log(error);
  },
});

const curChaterId = ref(-1);
const message = ref("");
const chatMsgList = ref();

const scrollDownChats = () => {
  let divEle = document.getElementById("chat-chats") as any;
  divEle.scrollTop = divEle.scrollHeight;
}

const chooseChater = (id: number) => {
  curChaterId.value = id;
  receiveMsg(id);
  scrollDownChats();
}

const sendMsg = () => {
  if(message.value === '' || message.value === undefined) {
    ElNotification("发送内容不得为空");
    return;
  }
  useRequest({
    data: {
      user_b_id: curChaterId.value,
      message: message.value
    },
    method: "POST",
    url: "/api/user/message",
    headers: { Authorization: loginStore.token },
    onSuccess(data) {
      console.log(data);
      message.value = "";
    },
    onError(error) {
      console.log(error);
      ElNotification("私信发送失败");
    },
  });
  setTimeout(() => {receiveMsg(curChaterId.value);scrollDownChats();}, 500);
  //给服务器喘息的时间
}

const receiveMsg = (id: number) => {
  useRequest({
    params: {
      user_id: id
    },
    method: "GET",
    url: "/api/user/message",
    headers: { Authorization: loginStore.token },
    onSuccess(response) {
      const resData = response.data.data;
      chatMsgList.value = resData;
      if(resData.length>0){
        chatMsgList.value[0].showName = true;
        for(let i=1; i<resData.length; i++)
        if(resData[i-1].user_a_name === resData[i].user_b_name || resData[i].user_a_name === resData[i-1].user_b_name){
          chatMsgList.value[i].showName = true;
        } else {
          chatMsgList.value[i].showName = false;
        }
      }
    },
    onError(error) {
      console.log(error);
    },
  });
};

const startReceive = setInterval(() => {
  if(curChaterId.value !== -1)
    setTimeout(() => receiveMsg(curChaterId.value), 0);
}, 5000);

const back = () => {
  clearInterval(startReceive);
  jumpPage("/home");
}

</script>