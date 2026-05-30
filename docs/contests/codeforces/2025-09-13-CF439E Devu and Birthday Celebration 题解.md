---
title: "CF439E Devu and Birthday Celebration 题解"
date: "2025-09-13"
sourceFile: "2025-09-13-CF439E Devu and Birthday Celebration 题解.md"
category: "contests"
categoryLabel: "竞赛题解"
subcategory: "codeforces"
subcategoryLabel: "Codeforces"
tags: ["竞赛题解", "Codeforces"]
---

<PostMeta />
# 题意
$q$次询问，每次给出$n,f$,求存在多少个长度为$f$的序列$a$满足：
* $a_i \gt 0(1 \leq i \leq f)$
* $\sum_{i=1}^fa_i=n$
* $\gcd(a_1,a_2,a_3,....,a_f)=1$
* $1 \leq q,n,f \leq 10^5$


# 做法一：dp
* 首先考虑没有gcd的条件，根据隔板法可得答案为$P(n,f)=\binom{n-1}{f-1}$
* 正难则反，看看有没有办法求出$\gcd !=1$的答案，考虑枚举gcd，提出来就变成了$g(b_1+b_2+...b_f)=n$且$\gcd(b_1,b_2,....,b_f)=1$,那么可以得出递推式$F(n,f)=P(n,f)-\sum_{g|n,g \ne 1}F(\frac{n}{g},f)$，状态数为$n$的因子数量，而$d(n) \leq 128$，因此可以对于每个$n$记忆化搜索，复杂度为$O(\sum d(n)n)$,最坏为$O(q \cdot 128)$
* 总复杂度：$O(n\log n +128q)$
* 在线做法需要卡常，可以考虑离线对于每个$n$单独算会快很多
```cpp
vector<int> fac[N];
int fz[N],fm[N];
int qpow(int a,int b){
    int ans=1;
    for(;b;b>>=1){
        if(b&1)ans=ans*a%mod;
        a=a*a%mod;
    }
    return ans;
}
void init(){
    for(int i=2;i<N;i++){
        for(int j=i;j<N;j+=i){
            fac[j].push_back(i);
        }
    }
    for(int i=(fz[0]=1);i<N;i++)fz[i]=fz[i-1]*i%mod;
    fm[N-1]=qpow(fz[N-1],mod-2);
    for(int i=N-2;~i;i--)fm[i]=fm[i+1]*(i+1)%mod;
}
int C(int n,int m){
    if(n<m)return 0;
    return fz[n]*fm[m]%mod*fm[n-m]%mod;
}
int dp[N];
void solve(){ 
    init();
    memset(dp,-1,sizeof(dp));
    int q;
    cin>>q;
    while(q--){
        int n,m;
        vector<int> tmp;
        function<int(int)> dfs=[&](int i){
            if(i<m)return 0ll;
            if(~dp[i])return dp[i];
            int x=C(i-1,m-1);
            for(auto p:fac[i])x=(x-dfs(i/p)+mod)%mod;
            tmp.push_back(i);
            return dp[i]=x;
        };
        cin>>n>>m;
        cout<<dfs(n)<<"\n";
        for(auto x:tmp)dp[x]=-1;
    }

}  
```
# 做法二：莫比乌斯反演
* 考虑对式子移项得：$P(n,f)=F(n,f)+\sum_{g|n,g\ne 1}F(\frac{n}{g},f)=\sum_{g|n}F(\frac{n}{g},f)$
* $F(n,f)=\sum_{d|n} \mu(d)P(\frac{n}{d},f)$
* 预处理出因子和莫比乌斯函数，总时间复杂度$O(n\log n +128q)$

```cpp
vector<int> fac[N];
int fz[N],fm[N],mu[N];
int qpow(int a,int b){
    int ans=1;
    for(;b;b>>=1){
        if(b&1)ans=ans*a%mod;
        a=a*a%mod;
    }
    return ans;
}
void init(){
    for(int i=1;i<N;i++){
        for(int j=i;j<N;j+=i){
            fac[j].push_back(i);
        }
    }
    mu[1]=1;
    for(int i=2;i<N;i++){
        int p=fac[i][1];
        if(i/p%p==0)mu[i]=0;
        else mu[i]=-mu[i/p];
    }
    for(int i=(fz[0]=1);i<N;i++)fz[i]=fz[i-1]*i%mod;
    fm[N-1]=qpow(fz[N-1],mod-2);
    for(int i=N-2;~i;i--)fm[i]=fm[i+1]*(i+1)%mod;
}
int C(int n,int m){
    if(n<m)return 0;
    return fz[n]*fm[m]%mod*fm[n-m]%mod;
}
void solve(){ 
    init();
    int q;
    cin>>q;
    while(q--){
        int n,m;
        vector<int> tmp;
        int ans=0;
        cin>>n>>m;
        for(auto d:fac[n]){
            ans=(ans+C(n/d-1,m-1)*mu[d]%mod+mod)%mod;  
        }
        cout<<ans<<"\n";
    }
}  
```
