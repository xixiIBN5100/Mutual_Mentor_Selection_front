<template>
  <div :class='styles["background"]' v-loading="loading">
    <div :class='styles["contain"]' >
      <Card
        title = "第一轮选择"
        :boldTitle = "true"
      ></Card>
      <Card :class='styles["info-card"]' title='提示：'>
        <span>请先下载附件，填写完表格后上传</span>
        <el-button type="info" class='button' @click='download'>点击下载附件</el-button>
      </Card>
      <Card :class='[styles["info-card"],styles["detail-info"]]'>
        <input type='file' name='file' @change='fileChange' />
        <el-button type="info" class='button' @click='submit'>提交</el-button>
      </Card>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { Card, } from '@/components'
import styles from "./index.module.scss"
import { ElNotification } from 'element-plus'
import { ref, h} from "vue"
import axios from 'axios'

let file = null;
const loading = ref(false)
//http://47.115.209.120:8080/static/selection_table.docx
const download = () => {
  let link = document.createElement('a')
  link.download="selection_table.docx";
  link.href = "http://47.115.209.120:8080/static/selection_table.docx";
  link.target = "_blank";
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
  let _formData = new FormData();
  _formData.append("user","asdasd");
  _formData.append("file",file);

  await axios.post("http://127.0.0.1:4523/m1/3977327-0-default/api/student/post",_formData).then((res)=>{
    loading.value = false;
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
  });
}
</script>

<style scoped>
.button{
  margin: 15px;
  width: 100px;
}

body {
  margin: 0;
}
.example-showcase .el-loading-mask {
  z-index: 9;
}
</style>