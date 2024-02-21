<template>
  <div :class='styles.background' v-loading='loading'>
    <div :class='styles.contain'>
      <Card title='最终的学生' :boldTitle='true' :isFadingOut='isFadingOut'>
        <el-icon :size='30' class='back' @click='back'><Back /></el-icon>
      </Card>
      <Card title='姓名学号' :boldTitle='true' :class='[styles["info-card"],"info"]' :isFadingOut='isFadingOut'>
        <div v-for='person in stuInfo'>{{person.name}}<span>{{person.student_id}}</span></div>
        <span v-if='stuNum'>一共{{stuNum}}个学生</span>
        <span v-else>目前还没有学生</span>
      </Card>
    </div>
  </div>
</template>

<script setup lang='ts'>
import styles from "./index.module.scss";
import { Card } from "@/components/index";
import { ref, onMounted, reactive } from "vue";
import finalStu from '@/apis/Server/finalStu';
import { ElNotification } from 'element-plus';
import routes from '@/router';

const loading = ref<boolean>(false);
const isFadingOut = ref<boolean>(false);
const stuInfo = ref<any>();
const stuNum = ref<number>(0);

onMounted(()=>{
  loading.value = true;
  finalStu.getFinalStu().then((res)=>{
    // console.log(res.data);
    if(res.data.code == 200){
      stuInfo.value = res.data.data.data;
      stuNum.value = res.data.data.student_num;
      console.log(stuInfo.value)
    }else{
      ElNotification({
        title: 'Warning',
        message: '数据获取失败！',
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
    routes.push("/home");
  },1000);
}
</script>

<style scoped lang='scss'>
.info{
  position: relative;
  right: -35%;
  bottom: -50px;
}
.back{
  position: absolute;
  right: 20px;
  top: 17px;
}
div span{
  float: right;
}
</style>