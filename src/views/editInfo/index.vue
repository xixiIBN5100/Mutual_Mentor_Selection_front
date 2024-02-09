<template>
  <div :class="styles.background">
    <div :class="styles.contain">
      <card :class="styles['title-bar']" title="学生个人信息编辑" :bold-title="true" :is-fading-out=isFadingOut>
        <el-icon :class="styles['back-button']" :size="30" @click="() => jumpPage('/home')"><Back /></el-icon>
      </card>
      <card :class="styles['info-editer']" title="信息编辑" :is-fading-out=isFadingOut>
        <el-icon :class="styles['background-icon']" :size="200" color="#a0cddf"><EditPen /></el-icon>
        <div :class="styles['info-editer-contain']">
          <div :class="styles['input-div']">
            <div>姓名:     <input :class="styles.Input" v-model="name"/></div>
            <div>专业班级: <input :class="styles.Input" v-model="className"/></div>
            <div>联系方式: <input :class="styles.Input" v-model="phone"/></div>
            <div>政治面貌: <input :class="styles.Input" v-model="political_status"/></div>
            <div>邮箱:     <input :class="styles.Input" v-model="email"/></div>
            <div>家庭住址: <input :class="styles.Input" v-model="address"/></div>
            <div>职业方向: <input :class="styles.Input" v-model="plan"/></div>
          </div>
          <div :class="styles['textarea-div']">
            <div><span>项目实践经历:        </span><br/><textarea :class="styles.Textarea" v-model="experience"></textarea></div>
            <div><span>个人荣誉:            </span><br/><textarea :class="styles.Textarea" v-model="honor"></textarea></div>
            <div><span>个人专业研究兴趣方向: </span><br/><textarea :class="styles.Textarea" v-model="interest"></textarea></div>
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
import { ref } from "vue";
import { useMainStore } from "@/stores";
isFadingOut.value = false;

const userStore = useMainStore().useUserStore();
const name = ref<string|undefined>(userStore.userSession.name);
const className = ref<string|undefined>(userStore.userSession.class);
const phone = ref<number|undefined>(userStore.userSession.phone);
const political_status = ref<string|undefined>(userStore.userSession.political_status);
const email = ref<string|undefined>(userStore.userSession.email);
const address = ref<string|undefined>(userStore.userSession.address);
const plan = ref<string|undefined>(userStore.userSession.plan);
const honor = ref<string|undefined>(userStore.userSession.honor);
const experience = ref<string|undefined>(userStore.userSession.experience);
const interest = ref<string|undefined>(userStore.userSession.interest);

const saveData = () => {
  alert("存储数据成功 *数据仅存储在本地");
  userStore.userSession = {
      "name": name.value,
      "student_id": userStore.userSession.student_id,
      "class": className.value,
      "phone": phone.value,
      "political_status": political_status.value,
      "email": email.value,
      "address": address.value,
      "plan": plan.value,
      "experience": experience.value,
      "honor": honor.value,
      "interest": interest.value,
  }
  jumpPage("/home");
}

</script>