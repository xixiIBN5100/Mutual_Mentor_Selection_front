<template>
    <div :class="styles.contain">
        <card
        :title="userStore.userSession.name + ' - 个人主页'"
        :bold-title="true"
        ></card>
    </div>
    
</template>

<script setup lang="ts">
import styles from "./index.module.scss";
import { Card } from '@/components/index';

import { useMainStore } from "@/stores";
const userStore = useMainStore().useUserStore();

</script>