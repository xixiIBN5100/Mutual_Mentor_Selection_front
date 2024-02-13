<template>
  <div :class="styles.background">
    <div :class="styles.contain">
      <card :class="styles['title-bar']" title="学生意见反馈" :bold-title="true" :is-fading-out=isFadingOut>
            <el-icon :class="styles['back-button']" :size="30" @click="() => jumpPage('/home')"><Back /></el-icon>
      </card>
      <card :class="styles['info-editer']" :is-fading-out=isFadingOut>
        <el-icon :class="styles['background-icon']" :size="200" color="#d89dac"><ChatLineRound /></el-icon>
        <div :class="styles['sug-body']">
          <div>学生姓名</div>
          <div>反馈内容</div>
          <div>反馈时间</div>
        </div>
        <hr>
        <div :key="sug.name" v-for="sug in sugData">
          <div :class="styles['sug-body']">
            <div>{{ sug.name === undefined ? "佚名" : sug.name }}</div>
            <div>{{ sug.advice }}</div>
            <div>{{ sug.created_time }}</div>
          </div>
          <hr>
        </div>
        <div v-if="sugData.length === 0">暂无数据</div>
      </card>
    </div>
  </div>
</template>

<script setup lang="ts">
import styles from "./index.module.scss";
import { Card } from "@/components/index";
import { jumpPage, isFadingOut } from "@/tool";
import useRequest from "@/apis/useRequest";
import { useMainStore } from "@/stores";
import { ref } from "vue";
isFadingOut.value = false;

const loginStore = useMainStore().useLoginStore();
const sugData = ref();
// const sugData = ref([
//     {
//         "name": undefined,
//         "advice": "string",
//         "created_time": "string"
//     }
// ]);

const { data: resData } = useRequest({
  data: {},
  method: "GET",
  url: "/api/admin/suggest",
  headers: { Authorization: loginStore.token },
});

if("code" in resData && resData.code === 200){
  sugData.value = "data" in resData ? resData.data : [];
} else {
  alert("信息获取失败");
  sugData.value = [];
}

</script>