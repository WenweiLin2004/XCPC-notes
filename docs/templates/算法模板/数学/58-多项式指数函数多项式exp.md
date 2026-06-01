---
title: '多项式指数函数（多项式 exp）'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# 多项式指数函数（多项式 exp）

给出 $n-1$ 次多项式 $A(x)$，求一个 $\bmod{\:x^n}$ 下的多项式 $B(x)$，满足 $B(x) \equiv \text e^{A(x)}$。系数对 $998244353$ 取模。

保证 $a_0 = 0$.

牛顿迭代法，$H(t)=\ln t-F(x)$,$G_1(x)\equiv G_0(x)(1-\ln G_0(x)+F(x))$
```cpp
poly exp(const poly &f,int n){
    if(n==1)return {1};
    poly g=exp(f,n+1>>1);
    g.resize(n);
    poly lng=ln(g);
    init(2*n+1);
    g.resize(tot);
    lng.resize(tot);
    for(int i=0;i<n;i++)lng[i]=(f[i]-lng[i]+P)%P;
    for(int i=n;i<tot;i++)lng[i]=g[i]=0;
    lng[0]++;
    ntt(lng,1);
    ntt(g,1);
    for(int i=0;i<tot;i++)g[i]=g[i]*lng[i]%P;
    ntt(g,-1);
    for(int i=n;i<tot;i++)g[i]=0;
    return g;
}
```
