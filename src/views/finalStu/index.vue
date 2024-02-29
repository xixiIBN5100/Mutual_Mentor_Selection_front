<template>
  <div :class='styles.background' v-loading='loading'>
    <div :class='styles.contain'>
      <Card title='最终的学生' :boldTitle='true' :isFadingOut='isFadingOut'>
        <el-icon :size='30' class='back' @click='back'><Back /></el-icon>
      </Card>
      <div style="display:flex;justify-content: center">
      <Card title='您最终的学生是:' :boldTitle='true' :class='styles["info-card"]' :isFadingOut='isFadingOut'>

        <div v-for='person in stuInfo' style="margin-left: 10px;font-size: 1.4rem;margin-top: 30px">姓名:&ensp;{{person.name}}<span >学号:&ensp;{{person.student_id}}</span></div>
        <div v-if='stuNum' style="display: flex;justify-content: center">
        <span  style="margin-left: 10px;margin-top: 30px;font-size: 1.2rem">一共{{stuNum}}个学生</span>
        </div>
        <span  style="margin-left: 10px" v-else>目前还没有成功双向选择的学生</span>
      </Card>
      </div>
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
import { useMainStore } from '@/stores'

const loading = ref<boolean>(false);
const isFadingOut = ref<boolean>(false);
const stuInfo = ref<any>();
const stuNum = ref<number>(0);
const loginStore = useMainStore().useLoginStore();
const token = loginStore.token;

onMounted(()=>{
  loading.value = true;
  finalStu.getFinalStu(token).then((res)=>{
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