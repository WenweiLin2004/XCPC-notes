---
title: '欧几里得求GCD $ O(logN) $'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# 欧几里得求GCD $ O(logN) $

```cpp
int gcd(int a, int b)
{
    return b ? gcd(b, a % b) : a;
}
```
