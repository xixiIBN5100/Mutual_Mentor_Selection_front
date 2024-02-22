<template>
  <div class="edit-reason-div">
    <input :class="['Input-yellow', 'reasonInput']" v-model="reason_name"/>
    <textarea :class="['Textarea-yellow', 'adviceInput']" :cols="6" v-model="reason_content"></textarea>
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
import { ElNotification } from "element-plus";

const props = defineProps<{
  reasonId: number
}>();
const emit = defineEmits(["updateList"]);

const loginStore = useMainStore().useLoginStore();
const reason_name = ref();
const reason_content = ref();

const confirmEdit = () => {
  useRequest({
    data: {
      reason_id: props.reasonId,
      reason_name: reason_name.value,
      reason_content: reason_content.value
    },
    url: "/api/user/reason",
    method: "PUT",
    headers: { Authorization: loginStore.token },
    onSuccess(response) {
      console.log(response);
      ElNotification("成功修改理由");
      location.reload();
    },
    onError(error) {
      ElNotification("修改理由失败");
      console.log(error);
    },
  });
}

const newReason = () => {
  useRequest({
    data: {
      reason_name: reason_name.value,
      reason_content: reason_content.value
    },
    url: "/api/user/reason",
    method: "POST",
    headers: { Authorization: loginStore.token },
    onSuccess(response) {
      console.log(response);
      ElNotification("成功添加理由");
      emit("updateList", true);
    },
    onError(error) {
      ElNotification("添加理由失败");
      console.log(error);
    },
  });
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