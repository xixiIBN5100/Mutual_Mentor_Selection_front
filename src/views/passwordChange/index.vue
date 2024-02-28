<template>
  <div :class="styles.background">
    <div :class="styles.contain">
      <card :class="styles['title-bar']" title="密码修改" :bold-title="true" :is-fading-out=isFadingOut>
            <el-icon :class="styles['back-button']" :size="30" @click="() => jumpPage('/home')"><Back /></el-icon>
      </card>
      <div style="display: flex;justify-content: center">
      <card :class="styles['info-editer']" :is-fading-out=isFadingOut>
        <el-icon :class="styles['background-icon']" :size="200" color="#dfbf67"><Setting /></el-icon>
        <div style="display: flex;justify-content: center;flex-direction: column;align-content: center;align-items: center;height: 30vh">
        <div :class="styles['input-div']">原始密码:     <input :class="styles['Input-yellow']"  v-model="prePassword"/></div>
        <div :class="styles['input-div']">更改密码:     <input :class="styles['Input-yellow']" v-model="renPassword"/></div>
        <div :class="styles['input-div']">确认密码:     <input :class="styles['Input-yellow']" v-model="conPassword"/></div>
        </div>
        <div :class="styles['save-button']">
        <div v-if="!prePassword || !renPassword || !conPassword">请填写新密码和旧密码</div>
        <div v-else-if="renPassword !== conPassword">请确保两次新密码一致</div>
        <dark-button v-else inner="确认更改" size="small" color="yellow" @click="updatePassword"/>
        </div>
      </card>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import styles from "./index.module.scss";
import { Card, DarkButton } from "@/components/index";
import { jumpPage, isFadingOut } from "@/tool";
import {computed, ref} from "vue";
import useRequest from "@/apis/useRequest";
import { ElNotification } from 'element-plus'
import { useMainStore } from "@/stores";
isFadingOut.value = false;

const loginStore = useMainStore().useLoginStore();
const prePassword = ref<string>();
const renPassword = ref<string>();
const conPassword = ref<string>();
const confirm = computed(() => {
  if((!prePassword || !renPassword || !conPassword) || renPassword !== conPassword){
    return false;
  }else{}
  return true;
})
const updatePassword = () => {
  useRequest({
    data: {
      old_password: prePassword.value,
      new_password: renPassword.value
    },
    method: "PUT",
    url: "/api/user/reset",
    headers: { Authorization: loginStore.token },
    manual: false,
    onSuccess(data) {
      console.log(data);
      if(data.data.code === 200) {
        ElNotification.success("密码修改成功");
      }else if(data.data.code === 200502){
        ElNotification.warning("原始密码不正确");
      }
    },
    onError(error) {
      console.log(error);
      ElNotification.warning("密码修改失败");
    },
  });
};

</script>