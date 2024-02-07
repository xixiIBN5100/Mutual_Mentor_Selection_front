<template>
<div :class="styles.background">
  <div :class='styles.contain'>
    <card
      title='第一轮选择'
      boldTitle='true'
    ></card>
  </div>
</div>
</template>

<script setup lang='ts'>
import styles from "./index.module.scss";
import {Card} from '@/components'
import useRequest from "@/apis/useRequest"
import {ref , reactive , onMounted} from "vue";

const config = reactive({
  onBefore:()=>{
    alert("正在加载")
  },
  url:"/api/student/teacher",
  headers:{"Content-Type":"application/json",},
  method:"get",
  data:{page_num:3,page_size:3}
})

const data = useRequest(config).data;
console.log(data.value)

</script>

<style scoped>

</style>