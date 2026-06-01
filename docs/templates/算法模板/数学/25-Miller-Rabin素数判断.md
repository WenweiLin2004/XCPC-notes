---
title: 'Miller-Rabin素数判断'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# Miller-Rabin素数判断

```cpp
__int128 qpow(__int128 a,int b,int mod){
    if(mod==1)return 0;
    __int128 ans=1;
    for(;b;b>>=1){
        if(b&1)ans=ans*a%mod;
        a=a*a%mod;
    }
    return ans;
}
bool MillerRabin(int n){
    if(n<=1)return false;
    if(n%2==0&&n!=2)return false;
    static constexpr int base[9]={2,3,5,7,11,13,17,37,61};
    for(auto &a:base){
        if(n==a)return true;
    }
    int d=n-1;
    while(d%2==0)d/=2;
    for(auto &a:base){
        int t=d;
        __int128 y=qpow(a,t,n);
        while(t!=n-1&&y!=1&&y!=n-1){
            y=y*y%n;
            t<<=1;
        }
        if(y!=n-1&&t%2==0)return false;
    }
    return true;
} 
```
