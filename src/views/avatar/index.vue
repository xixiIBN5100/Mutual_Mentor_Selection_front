<template>
  <div :class="styles.background">
    <div :class="styles.contain">
      <card :class="styles['title-bar']" title="上传寸照" :bold-title="true" :is-fading-out=isFadingOut>
            <el-icon :class="styles['back-button']" :size="30" @click="() => jumpPage('/home')"><Back /></el-icon>
      </card>
      <div style="display: flex;justify-content: center">
      <card :class="styles['info-editer']" :is-fading-out=isFadingOut>
        <el-icon :class="styles['background-icon']" :size="200" color="#dfbf67"><Setting /></el-icon>
        <div style="display: flex;justify-content: center;flex-direction: column;align-items: center;margin-top: 45px">
          <el-avatar shape="square" size="large" :src="rentAvatarUrl"/>
        <input :class="styles['input-file']" type="file" name="file" @change="fileChange"/>
        <DarkButton style="margin-top: 10px" inner="确认上传" color="yellow" size="small" @click="uploadAvatar"/>
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
import { ref } from "vue";
import useRequest from "@/apis/useRequest";
import { ElNotification, ElAvatar } from 'element-plus'
import { useMainStore } from "@/stores";
isFadingOut.value = false;

const loginStore = useMainStore().useLoginStore();
const rentAvatarUrl = ref();
const file = ref();
const isUploaded = ref(false);

useRequest({
  params: {},
  method: "GET",
  url: "/api/student/info",
  headers: { Authorization: loginStore.token },
  onSuccess(data) {
    console.log(data);
    if(data.data.code === 200){
      rentAvatarUrl.value = data.data.data.avartar;
      console.log(rentAvatarUrl.value);
    }
  },
  onError(error) {
    console.log(error);
  },
});

const fileChange = (event) => {
  file.value = event.target.files[0];
  isUploaded.value = true;
  if(file.value.type != "image/jpeg" && file.value.type != "image/png"){
    file.value = null;
    ElNotification({
      title: 'Error',
      message: '文件格式错误，请选择正确的文件格式',
      type: 'error',
    });
  isUploaded.value = false;
  }
  console.log("debug: fC");
}

const uploadAvatar = () => {
  if(isUploaded.value) {
    const formData = new FormData();
    formData.append("avatar", file.value);
    console.log(file.value);
    useRequest({
      data: formData,
      method: "POST",
      url: "/api/user/avatar",
      headers: {
        Authorization: loginStore.token,
        'Content-Type': 'multipart/form-data'
      },
      onSuccess(data) {
        console.log(data);
        if(data.data.code === 200){
          rentAvatarUrl.value = data.data.data.avatar;
          console.log(rentAvatarUrl.value);
          ElNotification("头像更换成功");
        }
      },
      onError(error) {
        console.log(error);
      },
    });
  } else {
    ElNotification("请先上传文件");
  }
};

</script>