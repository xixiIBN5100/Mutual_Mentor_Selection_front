<template>
<div :class="styles.background">
    <div :class="styles.contain">
        <card
        :title="userStore.userIdentity + ' - 个人主页'"
        :bold-title="true"
        :class="styles['title-bar']"
        >
            <div>欢迎 {{ userStore.userSession.name }} 使用德育导师双向选择系统</div>
        </card>
        <card :class="styles['detail-info']" title="详细个人信息">
            <div :class="styles['edit-button']">
                <el-icon><Edit /></el-icon>
            </div>
            <div :class="styles['switch-button']" @click="switchDetailInfoDisplay">
                <el-icon v-if="detailInfoDisplay"><View /></el-icon>
                <el-icon v-else><Hide /></el-icon>
            </div>
            <div>姓名: <span v-if="detailInfoDisplay">{{ userStore.userSession.name }}</span> <span v-else>***</span></div>
            <div>学号: <span v-if="detailInfoDisplay">{{ userStore.userSession.student_id }}</span> <span v-else>***</span></div>
            <div>专业班级: <span v-if="detailInfoDisplay">{{ userStore.userSession.class }}</span> <span v-else>***</span></div>
            <div>联系方式: <span v-if="detailInfoDisplay">{{ userStore.userSession.phone }}</span> <span v-else>***</span></div>
            <div>政治面貌: <span v-if="detailInfoDisplay">{{ userStore.userSession.political_status }}</span> <span v-else>***</span></div>
            <div>邮箱: <span v-if="detailInfoDisplay">{{ userStore.userSession.email }}</span> <span v-else>***</span></div>
            <div>家庭住址: <span v-if="detailInfoDisplay">{{ userStore.userSession.address }}</span> <span v-else>***</span></div>
            <div>职业方向: <span v-if="detailInfoDisplay">{{ userStore.userSession.interest }}</span> <span v-else>***</span></div>
        </card>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import styles from "./index.module.scss";
import { Card } from '@/components/index';
import { useMainStore } from "@/stores";

const userStore = useMainStore().useUserStore();
const detailInfoDisplay = ref(false);

const switchDetailInfoDisplay = () => {
    detailInfoDisplay.value = !detailInfoDisplay.value;
}

</script>