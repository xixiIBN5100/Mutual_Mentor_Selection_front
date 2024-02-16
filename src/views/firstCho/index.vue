<template>
  <div :class='styles["background"]' v-loading="loading">
    <div :class='styles["contain"]' >
      <Card
        title = "第一轮选择"
        :boldTitle = "true"
        :isFadingOut = "isFadingOut"
      >
        <el-icon :size="30" class='back' @click='back'><Back /></el-icon>
      </Card>
      <Card v-if='is_not_cho' :class='styles["info-card"]' title='选择老师' :isFadingOut='isFadingOut'>
        <el-input v-model="input" placeholder="请输入想选择的教师的ID" />
        <div style='margin: 10px'>
          <el-button type="info" @click='choice'>选择</el-button>
        </div>
      </Card>
      <Card v-else :class='styles["info-card"]' title='你选择的老师：' :isFadingOut='isFadingOut'>
        <span v-if='userStore.userSession.target_name' class='target_name'>{{userStore.userSession.target_name}}</span>
        <span v-else class='target_name'>已选择，等待老师审批</span>
      </Card>
      <Card :class='styles["info-card"]' title='提示：' :isFadingOut='isFadingOut'>
        <span>请先下载附件，填写完表格后上传</span>
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
import { Card, } from '@/components';
import styles from "./index.module.scss";
import { useMainStore } from "@/stores";
import { ElNotification, ElMessageBox } from 'element-plus';
import firstCho from '@/apis/Server/firstCho';
import { ref, h} from "vue";
import axios from 'axios';
import routes from '@/router';

const isFadingOut = ref<boolean>(false);
let file = null;
const loading = ref(false)
const input = ref<number>();
const userStore = useMainStore().useUserStore();
const is_not_cho = ref<boolean>(true);

if(userStore.userSession.target_name != ""){
  is_not_cho.value = false;
}

// console.log(is_cho.value);

//http://47.115.209.120:8080/static/selection_table.docx
const choice = ()=>{
  if(input.value == undefined){
    ElNotification({
      title: 'Warning',
      message: '还没有选择老师！',
      type: 'warning',
    })
  }else{
    const data = ref({teacher_id:Number(input.value)});
    firstCho.choice(data.value).then((res)=>{
      if(res.data.code === 200){
        is_not_cho.value = false;
        ElMessageBox.alert('提交成功，等待教师审核','Success', {
          // if you want to disable its autofocus
          // autofocus: false,
          confirmButtonText: 'OK',})
      }
    })
  }
}

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

const back = ()=>{
  isFadingOut.value = true;
  setTimeout(()=>{
    routes.push('/home');
  },1000)
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
.back{
  position: absolute;
  right: 20px;
  top: 17px;
}
.target_name{
  position: relative;
  right: -120px;
}
</style>