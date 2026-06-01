---
title: 'bitset优化01矩阵乘法'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# bitset优化01矩阵乘法

```cpp
for (int i = 1; i <= n; ++i)
	for (int j = 1; j <= n; ++j)
		for (int k = 1; k <= n; ++k)
			C[i][j] |= A[i][k] & B[k][j];
```
可以改成
```cpp
std::bitset<N> A[N], B[N], C[N];
for (int i = 1; i <= n; ++i)
	for (int k = 1; k <= n; ++k)
		if (A[i][k])
			C[i] |= B[k];
```
