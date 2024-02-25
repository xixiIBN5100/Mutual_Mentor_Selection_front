<template>
<div :class="styles.background">
  <div :class="styles.contain">
    <card
    :title="userStore.userIdentity + ' - 个人主页'"
    :bold-title="true"
    :class="styles['title-bar']"
    :is-fading-out=isFadingOut
    >
      <div>欢迎使用德育导师双向选择系统</div>
      <div :class="styles.logout" @click="logout" ><el-icon><Upload /></el-icon><span>登出</span></div>
    </card>
    <div v-if="userStore.userIdentity === '学生'" style="display: flex; justify-content:space-between;">
      <card :class="[styles['detail-info'], styles['info-card']]" title="详细个人信息" :is-fading-out=isFadingOut>
        <el-icon :class="styles['background-icon']" :size="200"><Document /></el-icon>
          <div :class="styles['edit-button']" @click="() => jumpPage('/editInfo')">
            <el-icon><Edit /></el-icon>
          </div>
        <div :class="styles['switch-button']" @click="switchDetailInfoDisplay">
          <el-icon v-if="detailInfoDisplay"><View /></el-icon>
          <el-icon v-else><Hide /></el-icon>
        </div>
        <div>姓名: <span v-if="detailInfoDisplay">{{ userStore.userSession.name }}</span> <span v-else>***</span></div>
        <div>学号: <span v-if="detailInfoDisplay">{{ userStore.userSession.studentID }}</span> <span v-else>***</span></div>
        <div>专业班级: <span v-if="detailInfoDisplay">{{ userStore.userSession.class }}</span> <span v-else>***</span></div>
        <div>联系方式: <span v-if="detailInfoDisplay">{{ userStore.userSession.phone }}</span> <span v-else>***</span></div>
        <div>政治面貌: <span v-if="detailInfoDisplay">{{ userStore.userSession.political_status }}</span> <span v-else>***</span></div>
        <div>邮箱: <span v-if="detailInfoDisplay">{{ userStore.userSession.email }}</span> <span v-else>***</span></div>
        <div>家庭住址: <span v-if="detailInfoDisplay">{{ userStore.userSession.address }}</span> <span v-else>***</span></div>
        <div>职业方向: <span v-if="detailInfoDisplay">{{ userStore.userSession.interest }}</span> <span v-else>***</span></div>
        <div>最终导师：<span v-if="detailInfoDisplay">{{ userStore.userSession.teacher_name}}</span> <span v-else>***</span></div>
      </card>
      <card :class="[styles['info-card'], styles.setting]" title="设置" :is-fading-out=isFadingOut>
        <el-icon :class="styles['background-icon']" :size="200"><Setting /></el-icon>
        <hyperlinks @click="() => jumpPage('/password')" color="yellow">修改密码</hyperlinks>
      </card>
      <card :class="[styles['related-info'], styles['info-card']]" title="相关资讯" :is-fading-out=isFadingOut>
        <el-icon :class="styles['background-icon']" :size="200"><Pointer /></el-icon>
        <hyperlinks @click="() => jumpPage('/teacherList')" color="green">教师列表</hyperlinks>
        <hyperlinks @click="jumpDocument" color="green">实施条例</hyperlinks>
      </card>
      <card :class="[styles.communication, styles['info-card']]" title="选择与沟通" :is-fading-out=isFadingOut>
        <el-icon :class="styles['background-icon']" :size="200"><ChatLineRound /></el-icon>
        <hyperlinks @click="() => jumpPage('/firstCho')" color="pink">第一轮选择</hyperlinks>
        <hyperlinks @click="() => jumpPage('/secondCho')" color="pink">第二轮选择</hyperlinks>
        <hyperlinks @click="() => jumpPage('/chat')" color="pink">导师私聊</hyperlinks>
        <hyperlinks @click="() => jumpPage('/suggestion')" color="pink">意见提交</hyperlinks>
        <hyperlinks @click="() => jumpPage('/finishedSuggestion')" color="pink">已反馈意见</hyperlinks>
      </card>
    </div>
    <div v-if="userStore.userIdentity === '教师'" style="display: flex; justify-content: space-between;">
      <card :class="styles['info-card']" title="审核与管理" :is-fading-out=isFadingOut>
        <el-icon :class="styles['background-icon']" :size="200"><User /></el-icon>
        <hyperlinks @click="() => jumpPage('/approval')" color="blue">请求审批</hyperlinks>
        <div>我的学生</div>
        <hyperlinks @click="()=> jumpPage('/finalStu')">最终学生</hyperlinks>
      </card>
      <card :class="[styles['info-card'], styles.setting]" title="设置" :is-fading-out=isFadingOut>
        <el-icon :class="styles['background-icon']" :size="200"><Setting /></el-icon>
        <hyperlinks @click="() => jumpPage('/password')" color="yellow">修改密码</hyperlinks>
        <hyperlinks @click="() => jumpPage('/reasonBase')" color="yellow">管理理由库</hyperlinks>
        <hyperlinks @click='() => jumpPage("/teacherSetTime")' color='yellow'>设置一轮截止时间</hyperlinks>
      </card>
      <card :class="styles['info-card']" title="沟通" :is-fading-out=isFadingOut>
        <el-icon :class="styles['background-icon']" :size="200"><ChatLineRound /></el-icon>
        <hyperlinks @click='() => jumpPage("/chat")' color='pink'>学生私聊</hyperlinks>
      </card>
    </div>
    <div v-if="userStore.userIdentity === '管理员'" style="display: flex; justify-content: space-between;">
      <card :class="styles['info-card']" title="审核与管理" :is-fading-out=isFadingOut>
        <el-icon :class="styles['background-icon']" :size="200"><User /></el-icon>
        <div>请求审批</div>
        <div>我的审批</div>
      </card>
      <card :class="[styles['info-card'], styles.setting]" title="设置" :is-fading-out=isFadingOut>
        <el-icon :class="styles['background-icon']" :size="200"><Setting /></el-icon>
        <hyperlinks @click="() => jumpPage('/password')" color="yellow">修改密码</hyperlinks>
        <hyperlinks @click="() => jumpPage('/reasonBase')" color="yellow">管理理由库</hyperlinks>
        <hyperlinks @click="() => jumpPage('/adminSetTime')" color='yellow'>设置两轮选择的截止时间</hyperlinks>
      </card>
      <card :class="[styles['info-card'], styles.communication]" title="沟通" :is-fading-out=isFadingOut>
        <el-icon :class="styles['background-icon']" :size="200"><ChatLineRound /></el-icon>
        <hyperlinks @click="() => jumpPage('/suggestionFeedback')" color="pink">意见反馈</hyperlinks>
      </card>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import styles from "./index.module.scss";
import { Card, Hyperlinks } from "@/components/index";
import { jumpPage, isFadingOut } from "@/tool";
import { useMainStore } from "@/stores";
import routes from '@/router';

isFadingOut.value = false;

const userStore = useMainStore().useUserStore();
const loginStore = useMainStore().useLoginStore();
const chatStore = useMainStore().useChatStore();
const detailInfoDisplay = ref(false);

const switchDetailInfoDisplay = () => {
  detailInfoDisplay.value = !detailInfoDisplay.value;
};

const logout = () => {
  jumpPage("/login");
  setTimeout(() => {
    userStore.setUserIdentity(undefined);
  userStore.setUserInfo({});
  loginStore.setLogin(false);
  loginStore.setToken(undefined);
  chatStore.resetChatObjects();
  },1000)
}

const jumpDocument = () => {
  window.open("http://47.115.209.120:8080/static/1.doc");
};

</script>