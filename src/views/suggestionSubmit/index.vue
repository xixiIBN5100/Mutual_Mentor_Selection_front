<template>
  <div :class="styles.background">
    <div :class="styles.contain">
      <card :class="styles['title-bar']" title="学生个人信息编辑" :bold-title="true" :is-fading-out=isFadingOut>
        <el-icon :class="styles['back-button']" :size="30" @click="() => jumpPage('/home')"><Back /></el-icon>
      </card>
      <card :class="styles['info-editer']" title="填写你的信息意见"  :is-fading-out=isFadingOut>
        <el-icon :class="styles['background-icon']" :size="200" color="#d89dac"><ChatLineRound /></el-icon>
        <textarea :class="styles['Textarea-pink']" v-model="suggestion"></textarea>
        <div :class="styles['save-button']">
          <dark-button size="small" inner="提交意见" color="pink" @click="submitSuggestion"/>
          <Hyperlinks color="pink" @click="switchAnony">
            匿名: 
            <el-icon v-if="anony" :size="20"><Check /></el-icon>
            <el-icon v-else :size="20"><Close /></el-icon>
          </Hyperlinks>
        </div>
      </card>
    </div>
  </div>
</template>

<script setup lang="ts">
import styles from "./index.module.scss";
import { Card, DarkButton, Hyperlinks } from "@/components/index";
import { jumpPage, isFadingOut } from "@/tool";
import { ref } from "vue";
import useRequest from "@/apis/useRequest";
import { useMainStore } from "@/stores";
isFadingOut.value = false;

const loginStore = useMainStore().useLoginStore();
const suggestion = ref<string>();
const anony = ref(true);

const switchAnony = () => {
  anony.value = !anony.value;
}

const submitSuggestion = () => {
  const { data: resData } = useRequest({
    data: {
      advice: suggestion.value,
      anonymity: anony.value
    },
    method: "POST",
    url: "/api/student/suggest",
    headers: { Authorization: loginStore.token },
  });
  if("code" in resData && resData.code == 200){
    alert("意见提交成功");
    jumpPage("/home");
  } else {
    alert("意见提交失败");
  }
};

</script>