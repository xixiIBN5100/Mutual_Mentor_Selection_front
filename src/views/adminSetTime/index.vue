<template>
<div :class='styles.background' v-loading="loading">
  <div :class='styles.contain'>
    <Card title='设置两轮的截止时间' :boldTitle='true' :isFadingOut='isFadingOut'>
      <el-icon :size='30' class='back' @click='back'><Back /></el-icon>
    </Card>
    <Card title='设置一轮审批的提交时间' :isFadingOut='isFadingOut' :class='[styles["info-card"],styles["detail-info"]]'>
      <div style='margin:10px'>
        <el-date-picker
          v-model="value1"
          type="datetime"
          placeholder="Select date and time"
        />
        <div class='button'>
          <el-button type="info" @click='submit(1)'>设置</el-button>
        </div>
      </div>
      <span style='margin: 10px'>目前设置的日期：{{before_date.first}}</span>
    </Card>
    <Card title='设置二轮审批的提交时间' :isFadingOut='isFadingOut' style='margin-top: 50px' :class='[styles["info-card"],styles["detail-info"]]'>
      <div style='margin:10px'>
        <el-date-picker
          v-model="value2"
          type="datetime"
          placeholder="Select date and time"
        />
        <div class='button'>
          <el-button type="info" @click='submit(2)'>设置</el-button>
        </div>
      </div>
      <span style='margin: 10px'>目前设置的日期：{{before_date.second}}</span>
    </Card>
  </div>
</div>
</template>

<script setup lang='ts'>
import styles from "./index.module.scss";
import { Card } from "@/components/index";
import adminSetTime from '@/apis/Server/adminSetTime';
import { ElNotification } from 'element-plus';
import { ref,onMounted, reactive } from "vue";
import routes from '@/router';

const isFadingOut = ref<boolean>(false);
const value1 = ref("");
const value2 = ref("");
const loading = ref<boolean>(false);
const before_date = reactive({
  first:"未设置",
  second:"未设置",
})

onMounted(()=>{
  adminSetTime.getBefore().then((res)=>{
    // console.log(res.data.code)
    if(res.data.code === 200){
      before_date.first = res.data.data.time_by_admin_1;
      before_date.second = res.data.data.time_by_admin_2;
    }else{
      ElNotification({
        title: 'Warning',
        message: '获取数据失败',
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


const submit = async (type:number) =>{
  // console.log(value1.value)
  loading.value = true;
  let val = type == 1 ? value1 : value2;
  if(val.value ==""){
    loading.value = false;
    ElNotification({
      title: 'Warning',
      message: '还没有选择时间！',
      type: 'warning',
    })
  }else{
    let year = String(val.value.getFullYear());
    let month = val.value.getMonth();
    if(month<10){
      month = "0"+String(month+1);
    }else{
      month = String(month+1);
    }
    let day = val.value.getDate();
    day = day<10 ? "0"+String(day) : String(day);
    let oth = val.value.toString().slice(16,24);
    const data = ref({
      time_by_admin:year+"-"+month+"-"+day+"T"+oth+"Z",
      type:type,
    })
    await adminSetTime.setTime(data.value).then((res)=>{
      // console.log(res.data.code)
      if(res.data.code === 200){
        loading.value = false;
        ElNotification({
          title: 'Success',
          message: '设置成功',
          type: 'success',
        })
      }
    }).catch((e:Error|{errMsg:String})=>{
      loading.value = false;
      ElNotification({
        title: 'Error',
        message: e,
        type: 'error',
      })
    })
  }
}

const back = () => {
  isFadingOut.value=true;
  setTimeout(()=>{
    routes.push('/home')
  },1000)
}
</script>

<style scoped>
.back{
  position: absolute;
  top: 17px;
  right:20px;
}
.button{
  display: inline;
  float: right;
}
</style>