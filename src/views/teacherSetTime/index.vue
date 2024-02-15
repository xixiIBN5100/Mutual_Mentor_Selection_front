<template>
<div :class='styles.background'>
  <div :class='styles.contain'>
    <Card title='设置学生提交审批时间' :boldTitle='true' :isFadingOut=isFadingOut>
      <el-icon class='back' :size='30' @click='back'><Back /></el-icon>
    </Card>
    <Card :class='styles["set-info"]' :isFadingOut='isFadingOut'>
      <span style='margin-top: 20px'>截至时间</span>&nbsp;&nbsp;
      <el-date-picker
        v-model="value1"
        type="datetime"
        placeholder="Select date and time"
      />
      <div class='button'>
        <el-button type="info" @click='submit'>提交</el-button>
      </div>
    </Card>
  </div>
</div>
</template>

<script setup lang='ts'>
import routes from '@/router'
import styles from "./index.module.scss";
import { Card } from "@/components/index";
import { ref } from "vue";
import teacherSetTime from '@/apis/Server/teacherSetTime';
import { ElNotification } from 'element-plus';

const value1 = ref('')
const isFadingOut = ref<boolean>(false);

const submit = async () => {
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
  // console.log(data.value)
  await teacherSetTime.setTime(data.value).then((res)=>{
    if(res.data.code == 200){
      ElNotification({
        title: 'Success',
        message: '设置成功',
        type: 'success',
      })
    }else{
      ElNotification({
        title: 'Error',
        message: '设置失败',
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
  width: 70px;
  position: absolute;
  top: 17px;
  right:20px;
}
</style>