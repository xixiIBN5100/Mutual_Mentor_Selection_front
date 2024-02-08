<template>
  <div :class="styles.background">
    <div :class="styles.contain">
      <card :class="styles['title-bar']" title="学生个人信息编辑" :bold-title="true" :is-fading-out=isFadingOut>
        <el-icon :class="styles['back-button']" :size="30" @click="() => jumpPage('/home')"><Back /></el-icon>
      </card>
      <card :class="styles['info-editer']" title="信息编辑" :is-fading-out=isFadingOut>
        
        <div :class="styles['save-button']">
          <dark-button  inner="保存编辑" size="small" color="blue" @click="saveData"/>
        </div>
      </card>
    </div>
  </div>
</template>

<script setup lang="ts">
import styles from "./index.module.scss";
import { Card, DarkButton } from "@/components/index";
import { jumpPage, isFadingOut } from "@/tool";
isFadingOut.value = false;

const saveData = () => {
  alert("成功提交");
  /* --- 提交数据代码 --- */
  jumpPage("/home");
}

</script>