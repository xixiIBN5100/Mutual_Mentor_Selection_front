<template>
  <div :class="styles.background">
    <div :class="styles.contain">
      <card :class="styles['title-bar']" title="意见反馈" :bold-title="true" :is-fading-out=isFadingOut>
        <el-icon :class="styles['back-button']" :size="30" @click="() => jumpPage('/home')"><Back /></el-icon>
      </card>
      <card :class="styles['info-editer']" title="填写意见"  :is-fading-out=isFadingOut>
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
import { ElNotification } from 'element-plus'
import { useMainStore } from "@/stores";
isFadingOut.value = false;

const loginStore = useMainStore().useLoginStore();
const userStore = useMainStore().useUserStore();
const suggestion = ref<string>();
const anony = ref(true);

const switchAnony = () => {
  anony.value = !anony.value;
}

const submitSuggestion = () => {
  var getTime = new Date().getTime(); //获取到当前时间戳
  var time = new Date(getTime); //创建一个日期对象
  function nowDate(time: Date) {
    var year = time.getFullYear(); // 年
    var month = (time.getMonth() + 1).toString().padStart(2, '0'); // 月
    var date = time.getDate().toString().padStart(2, '0'); // 日
    var hour = time.getHours().toString().padStart(2, '0'); // 时
    var minute = time.getMinutes().toString().padStart(2, '0'); // 分
    var second = time.getSeconds().toString().padStart(2, '0'); // 秒
    return (
      year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second
    )
  }

  useRequest({
    data: {
      advice: suggestion.value,
      anonymity: anony.value
    },
    method: "POST",
    url: "/api/student/suggest",
    headers: { Authorization: loginStore.token },
    onSuccess(response) {
      if(response.data.code === 200){
      console.log(response);
      ElNotification.success("意见反馈成功");
      jumpPage("/home");
      }else{
        ElNotification.error(response.data.msg);
      }
    },
    onError(error) {
      console.log(error);
      ElNotification("意见反馈失败");
    },
  });
};

</script>