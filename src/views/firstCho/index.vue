<template>
  <div :class='styles["background"]' v-loading="loading">
    <div :class='styles["contain"]' >
      <Card
        title = "第一轮选择"
        :boldTitle = "true"
        :isFadingOut = "isFadingOut"
      >
        <el-icon :size="30" class='back' @click='back'><Back /></el-icon>
        <span style="margin-left: 12px">总截止时间：{{adminTime}}</span>
      </Card>
      <div style="display: flex; justify-content:space-around;">
      <div v-if='targetInfo.teacher_name!=="无"'>
        <Card title='最终导师：' :class='["finalTeacher",styles["detail-info"]]' :isFadingOut='isFadingOut'>
          <span style='position:relative; right: -60px'>{{targetInfo.teacher_name}}</span>
        </Card>
      </div>
      <div v-else>
        <Card v-show='targetInfo.target_name==="无"' :class='styles["info-card"]' title='选择老师' :isFadingOut='isFadingOut'>
          <div style="display:flex;justify-content: center">
          <el-input style="margin-top: 25px;width: 20vw" v-model="input"  placeholder="请输入想选择的教师的ID" />
          </div>
          <div style='margin-top: 28px;display: flex;justify-content: center'>
            <el-button type="info" @click='confirmChoice'>选择</el-button>
          </div>
        </Card>
        <Card v-show='targetInfo.target_name !=="无"' :class='styles["info-card"]' title='选择信息' :isFadingOut='isFadingOut'>
          <span style="margin-top: 30px;margin-left: 10px">你选择的老师：&ensp;{{targetInfo.target_name}}</span>
          <span style="margin-top: 10px;margin-left: 10px">老师的状态：&ensp;{{ check }}</span>
          <div v-if='targetInfo.target_agree === 2' style='margin-left: 10px;margin-top: 10px'>
            <span v-if='targetInfo.admin_agree === 0' class='choInfo'>请填写表格，然后提交</span>
            <div v-else style='position:relative'>
              <span>管理员状态：</span>
              <span v-if='targetInfo.admin_agree === 1' class='choInfo'>待处理</span>
              <span v-else-if='targetInfo.admin_agree === 2' class='choInfo'>同意了</span>
              <span v-else class='choInfo'>批驳了</span>
            </div>
          </div>
          <div v-if="targetInfo.target_agree === 3 || targetInfo.target_agree===1 " class='choInfo'>
            <div style="display: flex;justify-content: center;margin-top: 12px;">
            <el-button type="info" style='display: block;margin-top: 12px;' @click='reCho'>重新选择</el-button>
            </div>
          </div>
        </Card>
        <Card :class='styles["info-card"]' title='提示：' :isFadingOut='isFadingOut'>
          <span style="margin-top: 30px;margin-left: 10px">请先下载附件，填写完表格后上传</span>
          <div style="display: flex;justify-content: center">
          <el-button style="margin-top: 30px" type="info" class='button' @click='download'>点击下载附件</el-button>
          </div>
        </Card>
        <Card title='提交文件' :class='[styles["info-card"],styles["detail-info"]]' :isFadingOut='isFadingOut'>
          <input style="margin-top: 30px;margin-left: 10px" type='file' name='file' @change='fileChange' />
          <div style="display: flex;justify-content: center;margin-top: 10px">
          <el-button type="info" class='button' @click='submit'>提交</el-button>
          </div>
        </Card>
      </div>
      </div>
      <el-dialog
          v-model="showModleChoice"
          title="确认选择"
          width="500"
      >
        <span>确认你所选择的导师</span>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showModleChoice = false">Cancel</el-button>
            <el-button type="primary" @click="choice">
              Confirm
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { Card, } from '@/components';
import styles from "./index.module.scss";
import { useMainStore } from "@/stores";
import { ElNotification, ElMessageBox } from 'element-plus';
import firstCho from '@/apis/Server/firstCho';
import {ref, h, reactive, onMounted, onBeforeMount, computed} from "vue";
import axios from 'axios';
import routes from '@/router';

const isFadingOut = ref<boolean>(false);
let file = null;
const loading = ref(false)
const input = ref<number>();
const userStore = useMainStore().useUserStore();
const targetInfo = reactive({
  target_name: userStore.userSession.target_name,
  target_agree: userStore.userSession.target_agree,
  teacher_name: userStore.userSession.teacher_name,
  admin_agree: userStore.userSession.admin_agree,
});
const loginStore = useMainStore().useLoginStore();
const token = loginStore.token;
const adminTime = ref<string>("");
const showModleChoice = ref(false);
const check = computed(() => {
  if(targetInfo.target_agree === 1){
    return "待处理"
  }else if(targetInfo.target_agree === 2) {
    return "已同意"
  }else{
    return "未同意"
  }
})
// console.log(is_cho.value);
//http://47.115.209.120:8080/static/selection_table.docx

//加载页面时，请求一次信息
onBeforeMount(()=>{
  loading.value = true;
  firstCho.getAdminTime(token).then((res)=>{
    if(res.data.code === 200){
      adminTime.value = res.data.data.first_time_by_admin;
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
      console.log(targetInfo.admin_agree);
    }else{
      ElNotification({
        title: 'Warning',
        message: '获取数据失败！',
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

const reCho = () => {
  targetInfo.target_name = "无";
}

const confirmChoice = () => {
  showModleChoice.value = true
}
const choice = ()=>{
  if(input.value == undefined){
    ElNotification({
      title: 'Warning',
      message: '还没有选择老师！',
      type: 'warning',
    })
  }else{
    let flag = true;
    for(let i in input.value){
      if(!(input.value[i]>="0" && input.value[i]<="9")){
        flag = false;
        break;
      }
    }
    if(!flag){
      input.value = null;
      ElNotification({
        title: 'Warning',
        message: '请输入正确的格式！',
        type: 'warning',
      })
    }else{
      const data = ref({teacher_id:Number(input.value)});
      firstCho.choice(data.value,token).then((res)=>{
        if(res.data.code === 200){
          // is_not_cho.value = false;
          ElMessageBox.alert('提交成功，等待教师审核','Success', {
            // if you want to disable its autofocus
            // autofocus: false,
            confirmButtonText: 'OK',})
          firstCho.getStuInfo(token).then((res)=>{
            // console.log(res.data.data.target_name);
            targetInfo.target_name = res.data.data.target_name;
            targetInfo.target_agree = res.data.data.target_agree;
          }).catch((e:Error|{errMsg:string})=>{
            ElNotification({
              title: 'Error',
              message: e,
              type: 'error',
            })
          })
        }else{
          ElNotification({
            title: 'Warning',
            message: res.data.msg,
            type: 'warning',
          })
        }
      })
    }
  }
  showModleChoice.value = false
 }

const download = () => {
  let link = document.createElement('a')
  link.download="selection_table.docx";
  link.href = "https://phlin.love/static/selection_table.docx";
  link.target = "_blank";
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const fileChange = (e) => {
  file = e.target.files[0];
  console.log(file);
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
    const _formData = new FormData();
    _formData.append("file",file);

    await axios.post("https://phlin.love/api/student/post",_formData,{headers:{"Content-Type":"application/x-www-form-urlencoded",'Authorization':`Bearer ${token}`}}).then((res)=>{
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
.choInfo{
  position: relative;
}
.finalTeacher{
  margin: 10px;
  width: 300px;
  position: relative;
}
</style>