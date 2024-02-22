<template>
<div :class='styles.background'>
  <div :class='styles.contain'>
    <Card title='设置学生提交审批时间' :boldTitle='true' :isFadingOut=isFadingOut>
      <el-icon class='back' :size='30' @click='back'><Back /></el-icon>
    </Card>
    <Card :class='styles["set-info"]' :isFadingOut='isFadingOut'>
      <span>管理员设置的一轮截至时间为：{{adminTime}}</span>
      <span>设置的时间需早于管理员设置的时间</span>
      <span style='margin-top: 20px'>截止时间</span>&nbsp;&nbsp;
      <el-date-picker
        v-model="value1"
        type="datetime"
        placeholder="选择一轮的截止时间"
      />
      <div class='button'>
        <el-button type="info" @click='submit'>提交</el-button>
      </div>
      <span>目前已设置的时间：{{beforeSet}}</span>
    </Card>
  </div>
</div>
</template>

<script setup lang='ts'>
import routes from '@/router'
import styles from "./index.module.scss";
import { Card } from "@/components/index";
import { ref, onMounted, reactive} from "vue";
import teacherSetTime from '@/apis/Server/teacherSetTime';
import { ElNotification } from 'element-plus';
import { useMainStore } from '@/stores';

const loginStore = useMainStore().useLoginStore();
const token = loginStore.token;
const adminTime = ref<string>("未设置");
const beforeSet = ref<string>("未设置");

onMounted(()=>{
  teacherSetTime.getAdminTime(token).then((res)=>{
    if(res.data.code === 200){
      // console.log(res.data.data);
      adminTime.value = res.data.data.first_time_by_admin;
      adminTime.value = adminTime.value.substring(0,4)+"年"+adminTime.value.substring(5,7)+"月"+adminTime.value.substring(8,10)+"日"+adminTime.value.substring(11,19);
    }else{
      ElNotification({
        title: 'Warning',
        message: res.data.msg,
        type: 'warning',
      })
    }
  }).catch((e:Error|{errMsg:string})=>{
    ElNotification({
      title: 'Error',
      message: e,
      type: 'error',
    })
  })
})

const value1 = ref('')
const isFadingOut = ref<boolean>(false);

const submit = async () => {
  if(value1.value == ""){
    ElNotification({
      title: 'Warning',
      message: '还没有设置截止时间！',
      type: 'warning',
    })
  }else{
    const year = String(value1.value.getFullYear());
    const mon = value1.value.getMonth()+1;
    const month = ref<string>("")
    if(mon<10){
      month.value = "0" + String(mon);
    }else{
      month.value = String(mon);
    }
    const da = String(value1.value.getDate());
    const day = ref<number>(0);
    if(da<10){
      day.value = "0" + String(da);
    }else{
      day.value = String(da);
    }
    const oth = value1.value.toString().slice(16,24);
    const data = ref({time_by_teacher:year+"-"+month.value+"-"+day.value+"T"+oth+"Z"});
    if(data.value.time_by_teacher > adminTime.value){
      // console.log(data.value.time_by_teacher);
      // console.log(adminTime.value);
      ElNotification({
        title: 'Warning',
        message: '设置的截止时间需早于管理员！！！',
        type: 'warning',
      })
    }else{
      // console.log(data.value)
      await teacherSetTime.setTime(data.value,token).then((res)=>{
        if(res.data.code == 200){
          ElNotification({
            title: 'Success',
            message: '设置成功',
            type: 'success',
          })
        }else{
          ElNotification({
            title: 'Error',
            message: res.data.msg,
            type: 'error',
          })
        }
      }).catch((e: Error | {errMsg:string})=>{
        ElNotification({
          title: 'Error',
          message: e,
          type: 'error',
        })
      });
    }
  }
}
const back = () =>{
  isFadingOut.value = true;
  setTimeout(()=>{
    routes.push("/home");
  },1000);
}
</script>

<style scoped>
.button{
  display:inline;
  float: right;
}
.back{
  position: absolute;
  top: 17px;
  right:20px;
}
span{
  display:block;
  margin:10px;
}
</style>