<template>
<div :class='styles.background' v-loading='loading'>
  <div :class='styles.contain'>
    <Card title='第二轮选择' :boldTitle='true' :isFadingOut='isFadingOut'>
      <el-icon :size='30' class='back' @click='back'><Back /></el-icon>
    </Card>
    <Card title='学校为您分配的老师：' :class='[styles["info-card"]]' :isFadingOut='isFadingOut'>
      <span class='teacherName'>{{userStore.userSession.target_name}}</span>
    </Card>
    <Card :class='styles["info-card"]' title='提示：' :isFadingOut='isFadingOut'>
      <span>请联系分配到的老师，完成表格后上传</span>
      <el-button type="info" class='button' @click='download'>点击下载附件</el-button>
    </Card>
    <Card :class='[styles["info-card"],styles["detail-info"]]' :isFadingOut='isFadingOut'>
      <input type='file' name='file' @change='fileChange' />
      <el-button type="info" class='button' @click='submit'>提交</el-button>
    </Card>
  </div>
</div>
</template>

<script setup lang='ts'>
import styles from "./index.module.scss";
import { Card } from "@/components/index";
import { ref } from "vue";
import routes from '@/router';
import { useMainStore } from "@/stores";
import { ElNotification } from 'element-plus'
import axios from 'axios'

const isFadingOut = ref<boolean>(false);
const userStore = useMainStore().useUserStore();
let file = null;
const loading = ref<boolean>(false);

const back = ()=>{
  isFadingOut.value = true;
  setTimeout(()=>{
    routes.push('/home');
  },1000)
}

const download = () => {
  const link = document.createElement('a');
  link.download = "selection_table.docx";
  link.href = "http://47.115.209.120:8080/static/selection_table.docx";
  link.target = "_blank";
  link.style.display = "none";

  document.body.appendChild( link );
  link.click();
  document.body.removeChild( link );
}

const fileChange = (e) => {
  file = e.target.files[0];
  if(file.type != "application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
    file = null;
    ElNotification({
      title: 'Error',
      message: '文件格式错误，请选择正确的文件格式',
      type: 'error',
    });
  }
}

const submit = async () => {
  loading.value = true;
  if(file == null){
    ElNotification({
      title: 'Warning',
      message: '还没有选择文件！',
      type: 'warning',
    })
  }else{
    let _formData = new FormData();
    _formData.append("file",file);

    await axios.post("http://127.0.0.1:4523/m1/3977327-0-default/api/student/post",_formData).then((res)=>{
      if(res.data.code == 200){
        ElNotification({
          title: 'Success',
          message: '提交成功',
          type: 'success',
        })
      }else{
        ElNotification({
          title: 'Error',
          message: '提交失败',
          type: 'error',
        })
      }
    }).catch((e:Error | {errMsg:string})=>{
      loading.value = false;
      ElNotification({
        title: 'Error',
        message: e,
        type: 'error',
      })
    })
  }
  loading.value = false;
}
</script>

<style scoped>
.back{
  position: absolute;
  top: 17px;
  right: 20px;
}
.teacherName{
  position: relative;
  right: -120px;
}
.button{
  margin: 10px;
  width: 100px;
}
</style>