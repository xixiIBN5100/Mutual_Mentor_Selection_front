<template>
  <div :class="styles.background">
    <div :class="styles.contain">
      <card
      :title="'未通过审批学生'"
      :bold-title="true"
      :class="styles.titleBar"
      :is-fading-out="isFadingOut"
      >
        <el-icon :class="styles.backButton" :size="30" @click="() => jumpPage('/home')"><Back/></el-icon>
      </card>
      <card :is-fading-out="isFadingOut" :class="styles.studentForm" v-if="studentForm">
        <div :class="styles['batch-button']">
            <el-button size="small" @click="isBatch = true" v-if="!isBatch">批量审核</el-button>
            <el-button size="small" @click="isBatch = false" v-if="isBatch">取消批量审核</el-button>
            <el-button size="small" @click="batchManage" v-if="isBatch">确认批量审核</el-button>
        </div>
        <el-table
        :data="filterTableData"
        @selection-change="handleSelectionChange"
        style="width: 100%;border-radius: 10px;"
        table-layout="auto"
        >
          <el-table-column type="selection" width="55" v-if="isBatch"/>
          <el-table-column label="姓名" prop="name" />
          <el-table-column label="学号" prop="student_id" />
          <el-table-column align="right">
            <template #header>
              <el-input v-model="search" size="small" placeholder="查询学号"/>
            </template>
            <template #default="scope">
              <el-button size="small" @click="check(scope.row)">查看双向选择表</el-button>
              <el-button size="small" @click="manage(scope.row)" v-if="!isBatch">审核</el-button>
            </template>
          </el-table-column>
        </el-table>
      </card>
    </div>
  </div>
  <el-dialog
  v-model="showModal"
  title="审核"
  >
    <template #footer>
      <el-button @click="() => singleManage(1)">审核通过</el-button>
      <el-button @click="showRefuseModal = true">审核拒绝</el-button>
      <el-button @click="cancelManage">取消</el-button>
    </template>
    <el-dialog v-model="showRefuseModal" title="审核拒绝">
      <div>理由:</div>
      <el-select placeholder="选择理由库中的理由" v-model="chosenReasonId">
        <el-option
        v-for="reason in reasonData"
        :key="reason.id"
        :label="reason.reason_name"
        :value="reason.id"
        >
          <el-tooltip :content="reason.reason_content">
            <div>{{ reason.reason_name }}</div>
          </el-tooltip>
        </el-option>
      </el-select>
      <template #footer>
        <el-button @click="() => singleManage(2)" :disabled="!chosenReasonId">确认</el-button>
        <el-button @click="showRefuseModal = false">取消</el-button>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup lang="ts">
import styles from "./index.module.scss"
import { Card } from "@/components/index";
import { jumpPage, isFadingOut, closeLoading,startLoading } from '@/tool'
import { ref , computed} from "vue";
import useRequest from "@/apis/useRequest";
import { ElNotification } from 'element-plus'
import { useMainStore } from "@/stores";
isFadingOut.value = false

interface user{
  name: string,
  status: number,
  student_id: string
}

const loginStore = useMainStore().useLoginStore()
const studentForm = ref();
const showModal = ref();
const showRefuseModal = ref();
const reasonData = ref();
const chosenReasonId = ref();
const manageStudentId = ref();
const isBatch = ref(false);
const multipleSelection = ref([]);

useRequest({
    params: {check:1},
    method: "GET",
    url: "/api/admin/check",
    headers: { Authorization: loginStore.token },
    manual: false,
    onBefore: () => startLoading(),
    onSuccess(res) {
      studentForm.value = res.data.data.data;
      console.log(studentForm.value)
    },
    onError(error) {
      console.log(error);
    },
    onFinally: () => closeLoading()
});
const search = ref("")
const filterTableData = computed(() =>
  studentForm.value.filter(
    (data: { student_id: string | string[]; }) =>
      !search.value ||
      data.student_id.includes(search.value)
  )
)

useRequest({
  params: {},
  method: "GET",
  url: "/api/user/reason",
  headers: { Authorization: loginStore.token },
  onBefore: () => startLoading(),
  onSuccess(res) {
    reasonData.value = res.data.data;
    console.log(reasonData.value);
  },
  onError(error) {
    console.log(error);
  },
  onFinally: () => closeLoading()
});

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

const manage = (rowData: { student_id: any; }) => {
  manageStudentId.value = rowData.student_id;
  showModal.value = true;
};

const cancelManage = () => {
  showModal.value = false;
  chosenReasonId.value = undefined;
};

const singleManage = (check: number) => {
  let stuIdList = [];
  if(isBatch){
    stuIdList = multipleSelection.value;
  } else {
    stuIdList.push(manageStudentId.value);
  }
  let reason_id = check === 1 ? 0 : chosenReasonId.value;
  useRequest({
    data: {
      check: check,
      reason_id: reason_id,
      students_id: stuIdList
    },
    method: "POST",
    url: "/api/admin/post",
    headers: { Authorization: loginStore.token },
    onBefore: () => startLoading(),
    onSuccess(res) {
      console.log(res);
      if(res.data.code === 200) {
        ElNotification("审批成功");
      } else {
        ElNotification("审批失败 / 系统错误");
      }
    },
    onError(error) {
      console.log(error);
    },
    onFinally: () => closeLoading()
  });
  showModal.value = false;
  showRefuseModal.value = false;
  isBatch.value = false;
  multipleSelection.value = [];
}

const handleSelectionChange = (val: user[]) => {
  multipleSelection.value = [];
  for(let i=0; i<val.length; i++){
    multipleSelection.value.push(val[i].student_id);
  }
  console.log(multipleSelection.value);
}

const batchManage = () => {
  console.log(multipleSelection.value);
  if(multipleSelection.value.length === 0){
    ElNotification("请选择学生的审批请求")
  } else{
    showModal.value = true;
  }
};

</script>