---
title: 'dilworth定理'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# dilworth定理

### 关于LIS
将序列分成两个不下降的子序列，等价于序列的逆序列的最长上升子序列长度不超过 2
### 关于DAG
给定一个 n 个点，m 条边的简单有向无环图（DAG），求出它的最长反链，并构造方案。    

有向无环图最长反链：一个最大点集，两者不可以互相到达

根据 Dilworth 定理，一个 DAG 中最长反链的大小，等于其最小链划分的大小。
