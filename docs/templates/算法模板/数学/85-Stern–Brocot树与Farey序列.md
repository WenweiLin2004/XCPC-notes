---
title: 'Stern–Brocot 树与 Farey 序列'
date: "2025-05-22"
sourceFile: "2025-05-22-补充算法笔记.md"
category: "templates"
---

<PostMeta />

# Stern–Brocot 树与 Farey 序列

![image-20250524205015390](/assets/img/typora/image-20250524205015390.png)

每一次迭代在$\frac{a}{b},\frac{c}{d}$之间插入$\frac{a+c}{b+d}$

### 性质

单调性：每一层的数单调增

最简性：每个分数都是最简的

完全性：包含了所有最简分数

### 求最接近一个实数的分数

```py
from fractions import Fraction 
fr = Fraction(input())
n = int(input())
print(*(fr - Fraction("1e-100")).limit_denominator(n).as_integer_ratio())
```
