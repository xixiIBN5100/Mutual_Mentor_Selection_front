<template>
  <div class="edit-reason-div">
    <input :class="['Input-yellow', 'reasonInput']" v-model="reason" />
    <textarea :class="['Textarea-yellow', 'adviceInput']" :cols="6" v-model="advice"></textarea>
    <dark-button v-if="reasonId !== -1" class="edit-reason-DarkButton" size="small" color="yellow" inner="确认编辑" @click="() => confirmEdit()" />
    <dark-button v-if="reasonId === -1" class="edit-reason-DarkButton" size="small" color="yellow" inner="新建理由" @click="() => newReason()" />
  </div>
</template>

<script setup lang="ts">
import "@/style/input.scss";
import useRequest from "@/apis/useRequest";
import { DarkButton } from "@/components/index";
import { useMainStore } from "@/stores";
import { ref } from "vue";

const props = defineProps<{
  reasonId: number
}>();

const loginStore = useMainStore().useLoginStore();
const reason = ref();
const advice = ref();

const confirmEdit = () => {/* 待定 */}

const newReason = () => {
  const { data: newReasonData } = useRequest({
    data: {
      reason: reason,
      advice: advice
      /* 数据待定 */
    },
    url: "/api/user/reason",
    method: "DELETE",
    headers: { Authorization: loginStore.token }
  });
  if("code" in newReasonData && newReasonData.code === 200){
    alert("已经成功添加 请刷新页面");
  } else {
    alert("添加失败 请寻求管理员帮助");
  }
}

</script>

<style>
.edit-reason-div {
  display: flex;
}

.reasonInput {
  width: 100px;
  margin-right: 20px;
}

.adviceInput {
  width: 35vw;
  margin-right: 30px;
}

.edit-reason-DarkButton {
  margin: 0 16px;
  display: inline-block;
}
</style>