<template>
<div :class='styles.background' v-loading='loading'>
  <div :class='styles.contain'>
    <Card title='第二轮选择' :boldTitle='true' :isFadingOut='isFadingOut'>
      <el-icon :size='30' class='back' @click='back'><Back /></el-icon>
      <span style="margin-left: 12px">截止时间：{{adminTime}}</span>
    </Card>
    <div style="display: flex;justify-content: space-evenly;margin-top: 10vh;">
    <div v-if='targetInfo.teacher_name !== "无"'>
      <Card title='最终导师：' :class='["finalTeacher",styles["detail-info"]]' :isFadingOut='isFadingOut'>
        <span style='position:relative; right: -60px'>{{targetInfo.teacher_name}}</span>
      </Card>
    </div>
    <div v-else>
      <Card title='选择信息' :class='[styles["info-card"]]' :isFadingOut='isFadingOut'>
        <span style="margin-left: 10px;margin-top: 30px">为您分配的导师是:&ensp;{{userStore.userSession.target_name}}</span>
        <span style="margin-left: 10px;margin-top: 10px">老师的状态：{{ check }}</span>
        <div v-if='targetInfo.target_agree === 2'>
          <span v-if='targetInfo.admin_agree === 0' class='choInfo'>请填写表格，然后提交</span>
          <div v-else>
            <span>管理员状态：</span><br />
            <span v-if='targetInfo.admin_agree === 1' class='choInfo'>待处理</span>
            <span v-else-if='targetInfo.admin_agree === 2' class='choInfo'>同意了</span>
            <span v-else class='choInfo'>批驳了</span>
          </div>
          <span></span>
        </div>
        <div v-else-if='targetInfo.admin_agree === 3' class='choInfo'>
          <span>老师拒绝了您的选择</span>
          <el-button type="info" style='display: block;margin: 10px' @click='reCho'>重新选择</el-button>
        </div>
      </Card>
      <Card :class='styles["info-card"]' title='提示' :isFadingOut='isFadingOut'>
        <span style="margin-left: 10px;margin-top: 30px">请联系分配到的老师，完成表格后上传</span>
        <div style="display: flex;justify-content: center;margin-top: 20px">
        <el-button type="info" class='button' @click='download'>点击下载附件</el-button>
        </div>
      </Card>
      <Card title='提交文件' :class='[styles["info-card"],styles["detail-info"]]' :isFadingOut='isFadingOut'>

        <input style="margin-left: 10px;margin-top: 30px" type='file' name='file' @change='fileChange'  />
      <div style="display: flex;justify-content: center">
        <el-button style="margin-top: 30px" type="info" class='button' @click='submit'>提交</el-button>
      </div>

      </Card>
    </div>
    </div>
  </div>
</div>
</template>

<script setup lang='ts'>
import styles from "./index.module.scss";
import { Card } from "@/components/index";
import {reactive, ref, onBeforeMount, computed,} from 'vue'
import routes from '@/router';
import { useMainStore } from "@/stores";
import { ElNotification } from 'element-plus'
import axios from 'axios'
import firstCho from '@/apis/Server/firstCho'

const loginStore = useMainStore().useLoginStore();
const token = loginStore.token;
const isFadingOut = ref<boolean>(false);
let file = null;
const loading = ref<boolean>(false);
const userStore = useMainStore().useUserStore();
const targetInfo = reactive({
  target_name: userStore.userSession.target_name,
  target_agree: userStore.userSession.target_agree,
  teacher_name: userStore.userSession.teacher_name,
  admin_agree: userStore.userSession.admin_agree,
});
const adminTime = ref<string>("");
const check = computed(() => {
  if(targetInfo.target_agree === 1){
    return "待处理"
  }else if(targetInfo.target_agree === 2) {
    return "已同意"
  }
})
onBeforeMount(()=>{
  loading.value = true;
  firstCho.getAdminTime(token).then((res)=>{
    if(res.data.code===200){
      adminTime.value = res.data.data.second_time_by_admin;
      adminTime.value = adminTime.value.substring(0,4)+"年"+adminTime.value.substring(5,7)+"月"+adminTime.value.substring(8,10)+"日"+adminTime.value.substring(11,19);
    }
  })
  firstCho.getStuInfo(token).then((res)=>{
    if(res.data.code === 200){
      userStore.setUserInfo(res.data.data);
      targetInfo.target_name = userStore.userSession.target_name;
      targetInfo.target_agree = userStore.userSession.target_agree;
      targetInfo.teacher_name = userStore.userSession.teacher_name;
      targetInfo.admin_agree = userStore.userSession.admin_agree;
    }else{
      ElNotification({
        title: 'Warning',
        message: res.data.msg,
        type: 'warning',
      })
    }
  }).catch((e:Error)=>{
    ElNotification({
      title: 'Error',
      message: e,
      type: 'error',
    })
  }).finally(()=>{
    loading.value = false;
  })
})

const back = ()=>{
  isFadingOut.value = true;
  setTimeout(()=>{
    routes.push('/home');
  },1000)
}

const download = () => {
  const link = document.createElement('a');
  link.download = "selection_table.docx";
  link.href = "https://phlin.love/static/selection_table.docx";
  link.target = "_blank";
  link.style.display = "none";

  document.body.appendChild( link );
  link.click();
  document.body.removeChild( link );
}

const fileChange = (e) => {
  file = e.target.files[0];
  if(file.type != "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && file.type != "application/msword"){
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

    await axios.post("http://127.0.0.1:4523/m1/3977327-0-default/api/student/post",_formData,{headers:{"Content-Type":"application/x-www-form-urlencoded",'Authorization':`Bearer ${token}`}}).then((res)=>{
      if(res.data.code == 200){
        ElNotification({
          title: 'Success',
          message: '提交成功',
          type: 'success',
        })
        targetInfo.admin_agree = 1;
      }else{
        ElNotification({
          title: 'Error',
          message: res.data.msg,
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

.button{
  margin: 10px;
  width: 100px;
}
.choInfo{
  position: relative;
  right: -80px;
}
.finalTeacher{
  margin: 10px;
  width: 300px;
  position: relative;
}
</style>