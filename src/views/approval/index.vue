<template>
<div :class="styles.background">
    <div :class="styles.contain">
        <card
        :title="'学生审批'"
        :bold-title="true">
        </card>
        <card
        :title="'待审批学生'"
        :bold-title="true"
        :class="styles.waitApproval">
        </card>
        <card
        :title="'已审批学生'"
        :bold-title="true"
        :class="styles.finishApproval">
        </card>
        </div>
        </div>
</template>

<script setup lang="ts">
import styles from "./index.module.scss";
import { Card } from '@/components/index';
import { ref } from "vue";
</script>