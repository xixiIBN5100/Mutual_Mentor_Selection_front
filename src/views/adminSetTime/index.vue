<template>
<div :class='styles.background' v-loading="loading">
  <div :class='styles.contain'>
    <Card title='设置两轮的截止时间' :boldTitle='true' :isFadingOut='isFadingOut'>
      <el-icon :size='30' class='back' @click='back'><Back /></el-icon>
    </Card>
    <div style="display: flex;justify-content: space-evenly;margin-top: 10vh">
    <Card title='设置一轮审批的提交时间' :isFadingOut='isFadingOut' bold-title :class='[styles["info-card"],styles["detail-info"]]'style="padding: 30px;">
      <div style='margin-top: 40px;margin-left: 10px'>
        <el-date-picker
          v-model="value1"
          type="datetime"
          placeholder="Select date and time"
        />
        <span >
          <el-button type="info" @click='submit(1)'>设置</el-button>
        </span>
      </div>
      <span style='margin-top: 20px;margin-left: 10px'>目前设置的日期：{{before_date.first}}</span>
    </Card>
    <Card title='设置二轮审批的提交时间' :isFadingOut='isFadingOut' bold-title :class='[styles["info-card"],styles["detail-info"]]' style="padding: 30px">
      <div style='margin-top: 40px;margin-left: 10px'>
        <el-date-picker
          v-model="value2"
          type="datetime"
          placeholder="Select date and time"
        />
        <div class='button'>
          <el-button type="info" @click='submit(2)'>设置</el-button>
        </div>
      </div>
      <span style='margin-left: 10px;margin-top: 20px'>目前设置的日期：{{before_date.second}}</span>
    </Card>
    </div>
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
import { useMainStore} from '@/stores';

const loginStore = useMainStore().useLoginStore();
const isFadingOut = ref<boolean>(false);
const value1 = ref("");
const value2 = ref("");
const loading = ref<boolean>(false);
const before_date = reactive({
  first:"未设置",
  second:"未设置",
})
const token = loginStore.token;
console.log(token);

console.log(before_date.first);

onMounted(()=>{
  adminSetTime.getBefore(token).then((res)=>{
    // console.log(res.data.code)
    if(res.data.code === 200){
      console.log(res.data.data);
      before_date.first = res.data.data.first_time_by_admin;
      before_date.second = res.data.data.second_time_by_admin;
      before_date.first = before_date.first.substring(0,4)+"年"+before_date.first.substring(5,7)+"月"+before_date.first.substring(8,10)+"日"+before_date.first.substring(11,19);
      before_date.second = before_date.second.substring(0,4)+"年"+before_date.second.substring(5,7)+"月"+before_date.second.substring(8,10)+"日"+before_date.second.substring(11,19);
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
    await adminSetTime.setTime(data.value,token).then((res)=>{
      // console.log(res.data.code)
      if(res.data.code === 200){
        loading.value = false;
        ElNotification({
          title: 'Success',
          message: '设置成功',
          type: 'success',
        })
      }else{
        ElNotification({
          title: 'Warning',
          message: res.data.msg,
          type: 'warning',
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