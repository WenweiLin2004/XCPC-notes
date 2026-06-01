---
title: 'BSGS(Baby Step Grant Step)'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# BSGS(Baby Step Grant Step)

$ a^x \equiv b(mod\ p) 已知a，b求最小非负数x，保证a，p互质$
欧拉函数：$ a^{\phi(p)} \equiv 1(mod\ p) $    
因此 $ a^t \equiv a^{x \cdot \phi (p)} $     
$ x范围为[0,\phi(p)-1],分块求解块长k=\lceil \sqrt p \rceil $
令 $ t=kx-y，x∈[1,k]，y∈[0,k-1] ,a^{kx} \equiv b \cdot a^y(mod\ p) $
先用哈希表存$ b \cdot a^y(mod\ p) $的值，再遍历左边
```cpp
int bsgs(int a,int b,int p){
    if(1%p==b%p)return 0;//特判x=0
    int k=sqrt(p)+1;
    vector<int> pw(k+1);
    unordered_map<int,int> mp;
    pw[0]=1;
    for(int i=1;i<=k;i++)pw[i]=pw[i-1]*a%p;
    for(int i=0;i<k;i++)mp[b*pw[i]%p]=i;
    for(int i=1,j=pw[k];i<=k;i++,j=j*pw[k]%p){
        if(mp.count(j))return k*i-mp[j];
    }
    return -1;
}
```
