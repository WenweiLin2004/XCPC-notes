---
title: 'FWT子集卷积'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# FWT子集卷积

* $C_{k}= \sum_{i \& j=0,i|j=k}A_jB_k$
* 定义$C_{x,s}$表示$s$的集合中，$1$的个数是$x$
* 复杂度$O(n \log^2n)$
```cpp
void solve(){
    int m;
    cin>>m;
    n=1<<m;
    vector<int> A(n),B(n);
    vector a(21,vector<int>(n)),b(21,vector<int>(n)),c(21,vector<int>(n));
    for(int i=0;i<n;i++)cin>>A[i],a[__builtin_popcount(i)][i]=A[i];
    for(int i=0;i<n;i++)cin>>B[i],b[__builtin_popcount(i)][i]=B[i];
    for(int i=0;i<21;i++)fwt_or(a[i]),fwt_or(b[i]);
    for(int x=0;x<21;x++){
        for(int i=0;i<=x;i++){
            for(int j=0;j<n;j++){
                c[x][j]+=a[i][j]*b[x-i][j]%mod;
                c[x][j]%=mod;
            }
        }
        ifwt_or(c[x]);
    }
    for(int i=0;i<n;i++)cout<<c[__builtin_popcount(i)][i]<<" ";
}
```
