<template>
<div :class="styles.background" v-loading='loading'>
  <div :class="styles.contain">
    <card title='老师信息列表' :boldTitle = "true" :isFadingOut='isFadingOut_t'>
      <el-icon :size="30" class='back' @click='back'><Back /></el-icon>
    </card>
    <div class='flex'>
      <div v-for='(data,index) in datas' :class='[styles["info-card"],styles["detail-info"]]'>
        <card :isFadingOut='isFadingOut'>
          <div>老师ID<span>{{data.teacher_id}}</span></div>
          <div>老师姓名<span>{{data.teacherName}}</span></div>
          <div>部门<span>{{data.section}}</span></div>
          <div>办公室<span>{{data.office}}</span></div>
          <div>电话号码<span>{{data.phone}}</span></div>
          <div>电子邮件<span>{{data.email}}</span></div>
    <!-- 分页组件 -->
        </card>
      </div>
      <card class='pagin' :isFadingOut='isFadingOut_pagin'>
        <div class='pagination'>
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :small="small"
            :disabled="disabled"
            layout="total, prev, pager, next, jumper"
            :total="total*8"
            :size='8'
            :background="background"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </card>
    </div>
  </div>
</div>
</template>

<script setup lang='ts'>
import styles from "./index.module.scss";
import {Card} from '@/components';
import getTeacherInfo from '@/apis/Server/getTeacherInfo';
import routes from '@/router';
import {ref , reactive , onBeforeMount} from "vue";
import { ElNotification } from 'element-plus';

const currentPage = ref<number>(1);
const pageSize = ref<number>(8);
const datas = ref();
const total = ref<number>();
const isFadingOut = ref<boolean>(false);
const loading = ref<boolean>(false);
const isFadingOut_t = ref<boolean>(false);
const isFadingOut_pagin = ref<boolean>(false);

/** 挂载完组件，请求一次 */
onBeforeMount(()=>{
  handleCurrentChange(1);
});

const handleCurrentChange = async (val) => {
  currentPage.value = val;
  isFadingOut.value = true;
  setTimeout(async ()=>{
    loading.value = true;
    isFadingOut.value = false;
    await getTeacherInfo.getInfo({page_num:currentPage.value ,page_size:pageSize.value}).then((res)=>{
      if(res.data.code === 200){
        datas.value = res.data.data.data;
        total.value = res.data.data.total_page_num;
        loading.value = false;
      }else{
        ElNotification({
          title: 'Warning',
          message: '数据请求出错！',
          type: 'warning',
        })
      }
    }).catch((e:Error|{errMsg:string})=>{
      ElNotification({
        title: 'Error',
        message: e,
        type: 'error',
      })
    }).finally(()=>{
      loading.value = false;
    });
  },1000)
}

const back = () => {
  isFadingOut.value = true;
  isFadingOut_t.value = true;
  isFadingOut_pagin.value = true;
  setTimeout(()=>{
    routes.push('/home');
  },1000)
}
</script>

<style scoped>
.flex{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;

}
.pagin{
  position: fixed;
  right: 35vw;
  bottom: 5vh;
}
.back{
  position: absolute;
  right: 20px;
  top: 17px;
}
</style>