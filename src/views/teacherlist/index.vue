<template>
<div :class="styles.background">
  <div :class="styles.contain">
    <card
      title='老师信息列表'
      :boldTitle = "true"
    ></card>
    <div class='flex'>
      <div v-for='(data,index) in datas' :class='[styles["info-card"],styles["detail-info"]]'>
        <card>
          <div>老师姓名<span>{{data.teacherName}}</span></div>
          <div>部门<span>{{data.section}}</span></div>
          <div>办公室<span>{{data.office}}</span></div>
          <div>电话号码<span>{{data.phone}}</span></div>
          <div>电子邮件<span>{{data.email}}</span></div>
    <!-- 分页组件 -->
        </card>
      </div>
      <card class='pagin'>
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
import {Card} from '@/components'
import getTeacherInfo from '@/apis/Server/getTeacherInfo'
import {ref , reactive , onMounted} from "vue";
import number = CSS.number

const currentPage = ref<number>(1);
const pageSize = ref<number>(8);
const datas = ref();
const total = ref<number>();

/** 挂载完组件，请求一次 */
onMounted(async ()=>{
  const res = await getTeacherInfo.getInfo([currentPage.value,pageSize.value]);
  datas.value = res.data.data.data;
  total.value = res.data.data.total_page_num;
})

const handleCurrentChange = async (val) => {
  currentPage.value = val;
  const res = await getTeacherInfo.getInfo([currentPage.value,pageSize.value]);
  datas.value = res.data.data.data;
  alert(currentPage.value)
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
</style>