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
        <editReason :reason-id="-1" @update-list="reload"></editReason>
      </card>
      <card :class="styles['info-editer']" :is-fading-out=isFadingOut v-if="!noReason">
        <el-icon :class="styles['background-icon']" :size="200" color="#dfbf67"><Setting /></el-icon>
        <div :class="styles['top-bar']">
          <div>理由名称</div>
          <div>理由内容</div>
        </div>
        <div :class="styles.reasons" v-for="li in reasonList_" :key="li.id">
          <hr/>
          <el-text :class="styles['reason-text']" truncated>{{ li.reason_name }}</el-text>
          <el-text :class="styles['reason-text']" truncated>{{ li.reason_content }}</el-text>
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
import { ElNotification } from "element-plus";
isFadingOut.value = false;

const loginStore = useMainStore().useLoginStore();
const noReason = ref<boolean>(true);
const reasonList = ref();

useRequest({
  params: {},
  url: "/api/user/reason",
  method: "GET",
  headers: { Authorization: loginStore.token },
  onSuccess(response) {
    reasonList.value = response.data.data;
    updataReasonList();
    console.log(reasonList);
    noReason.value = false;
  },
  onError(error) {
    console.log(error);
    noReason.value = true;
  },
});

const reasonList_ = ref();
const updataReasonList = () => {
  reasonList_.value = [];
  for(let i=0; i<reasonList.value.length; i++){
    reasonList_.value.push({
      id: reasonList.value[i].id,
      reason_name: reasonList.value[i].reason_name,
      reason_content: reasonList.value[i].reason_content,
      editReasonComponent: false,
      deleteReasonComponent: false
    })
  }
  console.log(reasonList_);
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
  useRequest({
    data: { reason_id: reasonId },
    url: "/api/user/reason",
    method: "DELETE",
    headers: { Authorization: loginStore.token },
    onSuccess(){
      ElNotification("成功删除理由");
      reload();
    },
    onError(error) {
      console.log(error);
      ElNotification("删除失败");
    },
  });
}

const reload = () => {
  location.reload();
}

</script>