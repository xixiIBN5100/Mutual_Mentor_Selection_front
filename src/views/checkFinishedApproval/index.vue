<template>
    <div :class="styles.background">
    <div :class="styles.contain">
        <card
        :title="'已审批学生'"
        :bold-title="true"
        :class="styles.titleBar"
        :is-fading-out="isFadingOut"
      >
          <el-button style="position: absolute;
			top: 14px;
			left: 125px;
    " @click="pushPage">查看未审批学生</el-button>
        <el-icon :class="styles.backButton" :size="30" @click="() => jumpPage('/home')"
          ><Back
        /></el-icon>

      </card>
      <card :is-fading-out="isFadingOut" :class="styles.studentForm" v-if="studentForm">
        <el-table :data="filterTableData" style="width: 100%;border-radius: 10px;" >
    <el-table-column label="姓名" prop="name" />
    <el-table-column label="学号" prop="student_id" />
    <el-table-column align="right">
      <template #header>
        <el-input v-model="search" size="small" placeholder="查询学号" />
      </template>
      <template #default="scope">
        <el-button size="small" @click="check(scope.row)"
          >查看双向选择表</el-button
        >
        <el-button size="small" type="danger" @click="undoCheck(scope.row)"
        >撤回审批</el-button
        >
      </template>
    </el-table-column>
  </el-table>

      </card>
    </div>
    </div>
</template>

<script setup lang="ts">
import styles from "./index.module.scss"
import { Card, DarkButton } from "@/components/index";
import { jumpPage, isFadingOut, closeLoading,startLoading } from '@/tool'
import { ref , computed} from "vue";
import useRequest from "@/apis/useRequest";
import { ElNotification } from 'element-plus'
import { useMainStore } from "@/stores";
const loginStore = useMainStore().useLoginStore()
const studentForm = ref();
isFadingOut.value = false
const getForm = () => {
  useRequest({
    params: {check: 2},
    method: "GET",
    url: "/api/admin/check",
    headers: {Authorization: loginStore.token},
    manual: false,
    onBefore: () => startLoading(),
    onSuccess(res) {
      studentForm.value = res.data.data.data
      studentForm.value.forEach((item) => {
        if(item.status === 1){
          item.name += " (通过)"
        }else{
          item.name += " (未通过)"
        }
      })
      console.log(studentForm.value)
    },
    onError(error) {
      console.log(error);
    },
    onFinally: () => closeLoading()
  });
}
getForm();
const search = ref("")
const filterTableData = computed(() =>
  studentForm.value.filter(
    (data: { student_id: string | string[]; }) =>
      !search.value ||
      data.student_id.includes(search.value)
  )
)
const undoCheck = (rowData: { student_id: any; }) => {
  useRequest({
    data: {student_id: rowData.student_id},
    method: "DELETE",
    url: "/api/admin/post",
    headers: {Authorization: loginStore.token},
    manual: false,
    onBefore: () => startLoading(),
    onSuccess(res) {
      if(res.data.code === 200 && res.data.msg === 'OK'){
        ElNotification.success("撤回成功");
      }else {
        ElNotification.error(res.data.msg);
      }
    },
    onError(error) {
      console.log(error);
    },
    onFinally: () => closeLoading()
  });
setTimeout(() =>  getForm() ,1000);
}
const check = (rowData: { student_id: any; }) => {
    useRequest({
    params: {student_id: rowData.student_id},
    method: "GET",
    url: "/api/admin/post",
    headers: { Authorization: loginStore.token },
    manual: false,
    onBefore: () => startLoading(),
    onSuccess(res) {
      const url = res.data.data.selection_table
      ElNotification.success("下载成功")
      window.open(url);
    },
    onError(error) {
      console.log(error);
    },
    onFinally: () => closeLoading()
  });

}
const pushPage = () => {
  jumpPage("/checkWaitApproval")
}
</script>