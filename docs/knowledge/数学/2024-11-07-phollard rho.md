---
title: "phollard rho"
date: "2024-11-07"
sourceFile: "2024-11-07-phollard rho.md"
category: "knowledge"
categoryLabel: "知识点"
subcategory: "数学"
subcategoryLabel: "数学"
tags: ["知识点", "数学"]
---

<PostMeta />
# phollard rho

## Miller-Rabin
* 定理一：$ a^{p-1} \equiv 1(mod\ p) $
* 定理二：$ x^2 \equiv 1(mod\ p)的解为1或p-1 $
* 令 $ x=a^{\frac{p-1}{2}},a^{\frac{p-1}{4}},... $
* 只要有一个x满足定理二则为质数
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
## Pollard-Rho
```cpp
namespace PollardRho{
    template<class T>
    T randint(T l,T r=0){
        static mt19937 rng(chrono::steady_clock::now().time_since_epoch().count());
        if(l>r)swap(l,r);
        uniform_int_distribution<T> dis(l,r);
        return dis(rng);
    }
    int gcd(int x,int y){
        int z;
        while(y){
            z=x;
            x=y;
            y=z%y;
        }
        return x;
    }
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
    int pollard_rho(int n){
        if(n==4)return 2;
        if(MillerRabin(n))return n;
        int s=0,t=0,c=randint<int>(1,n-1);
        auto f=[&](int x){
            return ((__int128)x*x+c)%n;
        };
        int stp=0,goal=1,val=1;
        for(goal=1;;goal<<=2,s=t,val=1){
            for(stp=1;stp<=goal;stp++){
                t=f(t);
                val=(__int128)val*abs(t-s)%n;
                if(stp%127==0){
                    int d=gcd(val,n);
                    if(d>1)return d;
                }
            }
            int d=gcd(val,n);
            if(d>1)return d;
        }
    }
    int max_factor;
    void fac(int n){
        if(n<=max_factor||n<2)
            return;
        if(MillerRabin(n)){
            max_factor=max_factor>n?max_factor:n;
            return;		
        }
        int p=n;
        while(p>=n)p=pollard_rho(n);
        while((n%p)==0)n/=p;
        fac(n),fac(p);
    }
    int get(int x){
        max_factor=0;
        fac(x);
        return max_factor;
    }
};
```
