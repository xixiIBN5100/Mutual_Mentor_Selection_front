<template>
  <div :class="styles.background">
    <div :class="styles.contain">
      <card :class="styles['title-bar']" title="学生个人信息编辑" :bold-title="true" :is-fading-out=isFadingOut>
        <el-icon :class="styles['back-button']" :size="30" @click="() => jumpPage('/home')"><Back /></el-icon>
      </card>
      <card :class="styles['info-editer']" title="信息编辑" :is-fading-out=isFadingOut>
        <el-icon :class="styles['background-icon']" :size="200"><EditPen /></el-icon>
        <div :class="styles['info-editer-contain']">
          <div :class="styles['input-div']">
            <div
            :key="content"
            v-for="content in inputContent"
            >
              <span>{{ content }}: </span><input/>
            </div>
          </div>
          <div :class="styles['textarea-div']">
            <div
            :key="textarea"
            v-for="textarea in textareaContent"
            >
              <span>{{ textarea }}: </span><br/><textarea></textarea>
            </div>
          </div>
        </div>
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

const inputContent = ["姓名", "专业班级", "联系方式", "政治面貌", "邮箱", "家庭住址", "职业方向"];
const textareaContent = ["项目实践经历", "个人荣誉", "个人专业研究兴趣方向"];

const saveData = () => {
  alert("成功提交");
  /* --- 提交数据代码 --- */
  jumpPage("/home");
}

</script>