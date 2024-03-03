<template>
  <div :class="styles.background">
    <div :class="styles.contain">
      <card
          :title="'取消学生双向申请'"
          :bold-title="true"
          :class="styles.title"
          :is-fading-out="isFadingOut"
      >
        <el-icon :class="styles['back-button']" :size="30" @click="() => jumpPage('/home')"
        ><Back
        /></el-icon>
      </card>
      <div style="display: flex;justify-content: center">
      <card
          :title="'输入学生学号即可取消学生的双向申请'"
          :bold-title="true"
          :class="styles.title"
          :is-fading-out="isFadingOut"
      style="width: 60%;margin-top: 10vh;padding: 30px;height: 30vh">
        <div style="display: flex;justify-content: space-evenly;margin-top: 10vh">
        <el-input v-model="student_id" style="width: 240px" placeholder="请输入学生学号" ></el-input>
        <dark-button inner="确认取消" color="red" size="small" @click="deleteChoice"></dark-button>
        </div>
      </card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import styles from "@/views/adminDeleteChoice/index.module.scss";
import {closeLoading, isFadingOut, jumpPage, startLoading} from "@/tool";
import {Card,DarkButton} from "@/components";
import {ref} from "vue";
import useRequest from "@/apis/useRequest";
import {useMainStore} from "@/stores";
const loginStore = useMainStore().useLoginStore()
const student_id = ref<string>('');
isFadingOut.value = false;
const deleteChoice = () => {
  useRequest({
    data: {student_id: student_id.value},
    method: "DELETE",
    url: "/api/admin/post",
    headers: {Authorization: loginStore.token},
    manual: false,
    onBefore: () => startLoading(),
    onSuccess(data) {
      const res = data.data.data
      console.log(res)
    },
    onError(error) {
      console.log(error);
    },
    onFinally: () => closeLoading()
  });
  student_id.value = ''
}

</script>



<style scoped>

</style>