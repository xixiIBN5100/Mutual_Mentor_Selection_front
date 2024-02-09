<template>
<div :class="styles.background">
        <card
        :title="'学生审批'"
        :bold-title="true"
        :class="styles.title">
        </card>
        <div :class="styles.approvalContain">
        <card
        :title="'待审批学生'"
        :bold-title="true"
        :class="styles.waitApproval">
        <el-scrollbar height="50vh" :class="styles.waitStudentBox">
    <p v-for="item in 20" :key="item" :class="styles.student">我是一个学生
    <dark-button inner="查看信息" size="small" color="blue"></dark-button></p>
  </el-scrollbar>
        </card>
        <card
        :title="'已审批学生'"
        :bold-title="true"
        :class="styles.finishApproval">
        <el-scrollbar height="50vh" :class="styles.waitStudentBox">
    <p v-for="item in 20" :key="item" :class="styles.student">我是一个学生
    <dark-button inner="撤销" size="small" color="red"></dark-button></p>
  </el-scrollbar>
        </card>
        </div>
        </div>
</template>

<script setup lang="ts">
import styles from "./index.module.scss";
import { Card,DarkButton } from '@/components/index';
import { ref } from "vue";
</script>