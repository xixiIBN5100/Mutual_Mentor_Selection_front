<template>
    <div :class="styles.background">
    <div :class="styles.contain">
        <card
        :title="'已通过审批学生'"
        :bold-title="true"
        :class="styles.titleBar"
        :is-fading-out="isFadingOut"
      >
        <el-icon :class="styles.backButton" :size="30" @click="() => jumpPage('/home')"
          ><Back
        /></el-icon>
      </card>
      <card :is-fading-out="isFadingOut" :class="styles.studentForm">
        <el-table :data="filterTableData" style="width: 100% color: #6e6e6e47;;">
    <el-table-column label="姓名" prop="date" />
    <el-table-column label="学号" prop="name" />
    <el-table-column align="right">
      <template #header>
        <el-input v-model="search" size="small" placeholder="查询学号" />
      </template>
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
          >Edit</el-button
        >
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
          >Delete</el-button
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
import { jumpPage, isFadingOut } from "@/tool";
import { ref } from "vue";
import useRequest from "@/apis/useRequest";
import { ElNotification } from 'element-plus'
import { useMainStore } from "@/stores";

isFadingOut.value = false

</script>