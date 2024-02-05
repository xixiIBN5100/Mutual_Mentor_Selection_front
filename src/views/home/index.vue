<template>
    <div :class="styles.contain">
        <card title="this is a card title"></card>
    </div>
    
</template>

<script setup lang="ts">
import styles from "./index.module.scss";
import { Card } from '@/components/index';
</script>