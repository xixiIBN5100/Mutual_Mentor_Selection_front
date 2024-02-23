<template>
  <div :class="styles.background">
    <div :class="styles.contain">
      <card :class="styles['title-bar']" title="我的私信" :bold-title="true" :is-fading-out=isFadingOut>
            <el-icon :class="styles['back-button']" :size="30" @click="() => jumpPage('/home')"><Back /></el-icon>
      </card>
      <card :class="styles['chat-window']" :is-fading-out=isFadingOut>
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
          <div :class="styles['chats']">
            <div v-for="msg in chatMsgList" :key="msg.index" :class="styles[msg.user_a_name === '' ? 'msg-div-front' : 'msg-div-me']">
              <div :class="styles['msg-name']">{{ msg.user_a_name === "" ? msg.user_b_name : msg.user_a_name }}</div>
              <div :class="styles['msg-message']">{{ msg.message }}</div>
            </div>
          </div>
          <div :class="styles['msg-bar']">
            <textarea :class="styles['Textarea-pink']" v-model="message"></textarea>
            <DarkButton inner="发送消息" color="pink" @click="sendMsg"/>
          </div>
        </div>
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
const chatStore = useMainStore().useChatStore();
const chaterList = chatStore.chatObjects;

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
    console.log(chatStore.chatObjects);
  },
  onError(error) {
    console.log(error);
  },
});

if(chaterList.length === 0) {
  if(userStore.userIdentity === "学生")
    ElNotification("暂无老师发送私信");
  else
    ElNotification("暂无学生发送私信");
}

const curChaterId = ref(-1);
const message = ref("");
const chatMsgList = ref();

const chooseChater = (id: number) => {
  curChaterId.value = id;
  receiveMsg(id);
}

const sendMsg = () => {
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
      ElNotification("私信发送成功");
      message.value = "";
    },
    onError(error) {
      console.log(error);
      ElNotification("私信发送失败");
    },
  });
  setTimeout(() => receiveMsg(curChaterId.value), 500);
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
    },
    onError(error) {
      console.log(error);
    },
  });
};

window.setInterval(() => receiveMsg(curChaterId.value), 5000);

</script>