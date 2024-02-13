<template>
  <div :class="styles.background">
    <div :class="styles.contain">
      <card :class="styles['title-bar']" title="密码修改" :bold-title="true" :is-fading-out=isFadingOut>
            <el-icon :class="styles['back-button']" :size="30" @click="() => jumpPage('/home')"><Back /></el-icon>
      </card>
      <card :class="styles['reason-creater']" :is-fading-out=isFadingOut>
        <div :class="styles['top-bar']">
          <div>理由名称</div>
          <div>理由内容</div>
        </div>
        <hr>
        <editReason :reason-id="-1"></editReason>
      </card>
      <card :class="styles['info-editer']" :is-fading-out=isFadingOut v-if="!noReason">
        <el-icon :class="styles['background-icon']" :size="200" color="#dfbf67"><Setting /></el-icon>
        <div :class="styles['top-bar']">
          <div>理由名称</div>
          <div>理由内容</div>
        </div>
        <div :class="styles.reasons" v-for="li in reasonList_" :key="li.id">
          <hr/>
          <el-text :class="styles['reason-text']" truncated>{{ li.reason }}</el-text>
          <el-text :class="styles['reason-text']" truncated>{{ li.advice }}</el-text>
          <dark-button :class="styles.DarkButton" size="small" color="yellow" inner="编辑理由" @click="() => reasonEdit(li.id)" />
          <dark-button v-if="!li.deleteReasonComponent" :class="styles.DarkButton" size="small" color="pink" inner="删除理由" @click="() => reasonDelete(li.id)" />
          <dark-button v-if="li.deleteReasonComponent" :class="styles.DarkButton" size="small" color="blue" inner="取消删除" @click="() => denyDelete(li.id)" />
          <dark-button v-if="li.deleteReasonComponent" :class="styles.DarkButton" size="small" color="red" inner="确认删除" @click="() => confirmDelete(li.id)" />
          <editReason v-if="li.editReasonComponent" :reason-id="li.id"></editReason>
          </div>
      </card>
    </div>
  </div>
</template>

<script setup lang="ts">
import styles from "./index.module.scss";
import { Card, DarkButton } from "@/components/index";
import editReason from "./editReason/index.vue";
import { jumpPage, isFadingOut } from "@/tool";
import { ref } from "vue";
import useRequest from "@/apis/useRequest";
import { useMainStore } from "@/stores";
isFadingOut.value = false;

const loginStore = useMainStore().useLoginStore();
const noReason = ref<boolean>(false);
const reasonList = ref();

const { data: resData } = useRequest({
  data: {},
  url: "/api/user/reason",
  method: "GET",
  headers: { Authorization: loginStore.token }
});
if("code" in resData && resData.code === 200){
  console.log("msg" in resData ? resData.msg : "no_msg");
  reasonList.value = "data" in resData ? resData.data : "no_data";
} else {
  noReason.value = true;
}

// const reasonList = ref([{
//   "id": 1,
//   "reason": "haha",
//   "advice": "菜就多练，输不起就别玩"
// },{
//   "id": 2,
//   "reason": "666",
//   "advice": "好好好"
// }]);

const reasonList_ = ref<any>([]);
if(!noReason){
  for(let i=0; i<reasonList.value.length; i++){
    reasonList_.value.push({
      id: reasonList.value[i].id,
      reason: reasonList.value[i].reason,
      advice: reasonList.value[i].advice,
      editReasonComponent: false,
      deleteReasonComponent: false
    })
  }
}


const reasonEdit = (reasonId: number) => {
  for(let i=0; i<reasonList_.value.length; i++){
    if(reasonList_.value[i].id === reasonId){
      reasonList_.value[i].editReasonComponent = !reasonList_.value[i].editReasonComponent;
    }
  }
};

const reasonDelete = (reasonId: number) => {
  for(let i=0; i<reasonList_.value.length; i++){
    if(reasonList_.value[i].id === reasonId){
      reasonList_.value[i].deleteReasonComponent = !reasonList_.value[i].deleteReasonComponent;
    }
  }
};

const denyDelete = (reasonId: number) => {
  for(let i=0; i<reasonList_.value.length; i++){
    if(reasonList_.value[i].id === reasonId){
      reasonList_.value[i].deleteReasonComponent = !reasonList_.value[i].deleteReasonComponent;
    }
  }
};

const confirmDelete = (reasonId: number) => {
  const { data: confirmDeleteData } = useRequest({
    data: { reason_id: reasonId },
    url: "/api/user/reason",
    method: "DELETE",
    headers: { Authorization: loginStore.token }
  });
  if("code" in confirmDeleteData && confirmDeleteData.code === 200){
    alert("已经成功删除 请刷新页面");
  } else {
    alert("删除失败 请寻求管理员帮助");
  }
}

</script>