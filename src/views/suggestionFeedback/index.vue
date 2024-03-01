<template>
  <div :class="styles.background">
    <div :class="styles.contain">
      <card :class="styles['title-bar']" title="学生意见反馈" :bold-title="true" :is-fading-out=isFadingOut>
            <el-icon :class="styles['back-button']" :size="30" @click="() => jumpPage('/home')"><Back /></el-icon>
      </card>
      <card :class="styles['info-editer']" :is-fading-out=isFadingOut style="margin-top: 10vh;background: transparent;">
        <el-icon :class="styles['background-icon']" :size="200" color="#d89dac"><ChatLineRound /></el-icon>
        <el-table style="border-radius: 20px;" v-model:data="sugData" :class="styles['sug-table']" >
          <el-table-column prop="name" label="name" width="180"/>
          <el-table-column prop="created_time" label="created_time" />
          <el-table-column prop="advice" label="advice" />
        </el-table>
        <el-pagination style="margin-top: 20px" layout="prev, pager, next" :page-count="total_page_num" v-model:current-page="page_num" :class="styles['pagination']"/>
      </card>
    </div>
  </div>
</template>

<script setup lang="ts">
import styles from "./index.module.scss";
import { Card } from "@/components/index";
import { jumpPage, isFadingOut } from "@/tool";
import useRequest from "@/apis/useRequest";
import { ElNotification } from "element-plus";
import { useMainStore } from "@/stores";
import { ref, watch } from "vue";
isFadingOut.value = false;

const loginStore = useMainStore().useLoginStore();
const sugData = ref();
const page_num = ref(1);
const total_page_num = ref();
sugData.value = [];

const updateSugData = () => {
  useRequest({
    params: {
      page_num: page_num.value,
      page_size: 10,
    },
    method: "GET",
    url: "/api/admin/advice",
    headers: { Authorization: loginStore.token },
    onSuccess(response) {
      sugData.value = response.data.data.data;
      total_page_num.value = response.data.data.total_page_num;
      console.log(sugData.value);
    },
    onError(error) {
      console.log(error);
      ElNotification("暂无数据 或 信息获取失败");
    },
  });
}

updateSugData();

watch(page_num, () => {
  updateSugData();
});

</script>