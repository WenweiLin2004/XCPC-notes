<script setup lang="ts">
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>

<template>
  <div v-if="frontmatter.date || frontmatter.sourceFile" class="post-meta">
    <span v-if="frontmatter.date">发布时间：{{ frontmatter.date }}</span>
    <span v-if="frontmatter.sourceFile">源文件：{{ frontmatter.sourceFile }}</span>
  </div>
</template>
