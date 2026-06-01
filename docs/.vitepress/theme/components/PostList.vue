<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useData, withBase } from 'vitepress'

const props = withDefaults(defineProps<{ pageSize?: number }>(), { pageSize: 10 })
const { frontmatter, page } = useData()

type Post = { date: string; title: string; link: string }
const items = computed<Post[]>(() => (frontmatter.value.posts as Post[]) || [])

const current = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(items.value.length / props.pageSize)))
const paged = computed(() => {
  const start = (current.value - 1) * props.pageSize
  return items.value.slice(start, start + props.pageSize)
})

function go(p: number) {
  if (p >= 1 && p <= totalPages.value) current.value = p
}

// reset to first page when navigating to another route
watch(() => page.value.relativePath, () => (current.value = 1))

const pageNumbers = computed<(number | string)[]>(() => {
  const t = totalPages.value
  const c = current.value
  const arr: (number | string)[] = []
  if (t <= 7) {
    for (let i = 1; i <= t; i++) arr.push(i)
  } else {
    arr.push(1)
    if (c > 3) arr.push('…')
    for (let i = Math.max(2, c - 1); i <= Math.min(t - 1, c + 1); i++) arr.push(i)
    if (c < t - 2) arr.push('…')
    arr.push(t)
  }
  return arr
})
</script>

<template>
  <div class="post-list">
    <table>
      <thead>
        <tr><th class="pl-date-h">发布时间</th><th>标题</th></tr>
      </thead>
      <tbody>
        <tr v-for="(p, i) in paged" :key="i">
          <td class="pl-date">{{ p.date }}</td>
          <td><a :href="withBase(p.link)">{{ p.title }}</a></td>
        </tr>
      </tbody>
    </table>

    <div v-if="totalPages > 1" class="pl-pager">
      <button class="pl-btn" :disabled="current === 1" @click="go(current - 1)">‹</button>
      <template v-for="(p, i) in pageNumbers" :key="i">
        <button
          v-if="typeof p === 'number'"
          class="pl-btn"
          :class="{ 'pl-active': p === current }"
          @click="go(p)"
        >{{ p }}</button>
        <span v-else class="pl-ellipsis">{{ p }}</span>
      </template>
      <button class="pl-btn" :disabled="current === totalPages" @click="go(current + 1)">›</button>
      <span class="pl-info">共 {{ items.length }} 条 · {{ totalPages }} 页</span>
    </div>
  </div>
</template>
