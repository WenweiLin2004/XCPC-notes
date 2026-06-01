<script setup lang="ts">
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>

<template>
  <div v-if="frontmatter.date" class="post-meta">
    <span>发布时间：{{ frontmatter.date }}</span>
  </div>
</template>
