---
title: 'bitset优化传递闭包'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# bitset优化传递闭包

```cpp
for (int k = 1; k <= n; ++k)
  for (int i = 1; i <= n; ++i)
    if (f[i][k]) f[i] |= f[k];
```
