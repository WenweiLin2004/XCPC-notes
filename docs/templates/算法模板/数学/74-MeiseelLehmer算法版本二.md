---
title: 'Meiseel Lehmer算法(版本二)'
date: "2025-05-22"
sourceFile: "2025-05-22-补充算法笔记.md"
category: "templates"
---

<PostMeta />

# Meiseel Lehmer算法(版本二)

复杂度$O(\frac{n^{\frac{2}{3}}}{\log^2 n})$

```cpp
struct MeisselLehmer {
    T N;
    T v, n4, TT, K, B; // v=n^{1/2}, n4=n^{1/4}, T=小质数上限, K=大质数上限, B=N/K
    vector<T> l;      // l[i] = 剩余数估计: ⌊N/i⌋-1 筛去小质数后的剩余数
    vector<int> s;      // Fenwick Tree 底层: 已筛掉的数数量
    vector<bool> e;     // 标记数组: e[i]=true 表示 i 被筛为合数
    vector<int> w;      // e 的前缀和, 亦可当作 Fenwick Tree 数据
    vector<int> roughs; // 存放未被筛除的 candidates (<= B)

    // 返回 π(N)
    T count(T N){
        if(N<=1)return 0;
        this->N=N;
        v=sqrt(N+0.5);
        n4=sqrt(v+0.5);
        TT=min((int)sqrt(n4)*2,n4);
        K=pow(N,0.625)/log(N);
        K=max(K,v);
        K=min<T>(K,N);
        B=N/K;
        B=N/(N/B);
        B=min<T>(N/(N/B),K);
        l.assign(v+1,0);
        s.assign(K+1,0);
        e.assign(K+1,0);
        w.assign(K+1,0);
        for(int i=1;i<=v;i++)l[i]=N/i-1;
        for(int i=1;i<=v;i++)s[i]=i-1;
        const auto div=[](T n,int d){return (T)(1.0*n/d);};
        int p;
        for(p=2;p<=TT;p++){
            if(s[p]!=s[p-1]){
                T M=N/p;
                int t=v/p,t0=s[p-1];
                for(int i=1;i<=t;i++)l[i]-=l[i*p]-t0;
                for(int i=t+1;i<=v;i++)l[i]-=s[div(M,i)]-t0;
                for(int i=v,j=t;j>=p;j--){
                    for(int l=j*p;i>=l;i--)s[i]-=s[j]-t0;
                }
                for(int i=p*p;i<=K;i+=p)e[i]=1;
            }
        }
        
        e[1]=1;
        int cnt=1;
        roughs.assign(B+1,0);
        for(int i=1;i<=B;i++){
            if(!e[i])roughs[cnt++]=i;
        }
        roughs[cnt]=INT_MAX;
        for(int i=1;i<=K;i++)w[i]=w[i-1]+e[i];
        for(int i=1;i<=K;i++)s[i]=w[i]-w[i-(i&-i)];
        const auto query=[&](int x){
            int ans=x;
            for(int i=x;i;i&=i-1)ans-=s[i];
            return ans;
        };
        const auto add=[&](int x){
            e[x]=1;
            for(int i=x;i<=K;i+=i&-i)s[i]++;
        };
        cnt=1;
        for(;p<=n4;p++){
            if(!e[p]){
                T q=1ll*p*p,M=N/p;
                while(cnt<q)w[cnt++]=query(cnt);
                int t1=B/p,t2=min<T>(B,M/q),t0=query(p-1);
                int id=1,i=1;
                for(;i<=t1;i=roughs[++id])l[i]-=l[i*p]-t0;
                for(;i<=t2;i=roughs[++id])l[i]-=query(div(M,i))-t0;
                for(;i<=B;i=roughs[++id])l[i]-=w[div(M,i)]-t0;
                for(int i=q;i<=K;i+=p){
                    if(!e[i])add(i);
                }
            }
        }
        while(cnt<=v)w[cnt++]=query(cnt);
        vector<int> prime;
        prime.push_back(1);
        for(int i=2;i<=v;i++){
            if(!e[i])prime.push_back(i);
        }
        l[1]+=1ll*(w[v]+w[n4]-1)*(w[v]-w[n4])/2;
        for(int i=w[n4]+1;i<=w[B];i++)l[1]-=l[prime[i]];
        for(int i=w[B]+1;i<=w[v];i++)l[1]-=query(N/prime[i]);
        for(int i=w[n4]+1;i<=w[v];i++){
            T q=prime[i],M=N/q;
            int e=w[M/q];
            if(e<=i)break;
            l[1]+=e-i;
            T t=0;
            int m=w[(int)sqrt(M+0.5)];
            for(int k=i+1;k<=m;k++)t+=w[div(M,prime[k])];
            l[1]+=2*t-1ll*(i+m)*(m-i);
        }
        return l[1];
    }
};
```
