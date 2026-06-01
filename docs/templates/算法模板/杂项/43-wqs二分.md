---
title: 'wqs二分'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# wqs二分

### 模型介绍
* 限制选择$k$个物品，最大化收益；不限制条件的情况下，最大值能快速求出来
* 设恰好选择$k$个物品收益为$g_k$，这是一个上凸壳，即 $g_{k+1}-g_{k} \leq g_{k}-g_{k-1}$
* 二分斜率$c$，$g(x)=cx+b$与凸包相切时，截距$b$最大，$b=g(x)-cx$，可以看成每选一个物品就要多$c$的代价
* 在无限制的情况下求出，最大收益对应的$x$,`x>=k`增大`mid`，否则减少
* 如果`(k,g[k])`在上凸壳左半部分(斜率大于等于0)，那么答案就一定对
* 如果在右半部分(斜率小于0)，需要设定二分边界
* 设下界为$1$，上界根据$g_i-g_{i-1}$的最大值设置，如果二分查找的值严格小于$k$，那么说明交易次数的限制并不是瓶颈，而价格才是
* 如果上凸壳上有若干连续的且斜率相等的线段，会对应多个不同的$k$,此时设定在满足$g_{mid}$最大时，$x$最小，那么即使$x \ne k$，$b+mid \cdot k$，仍然是答案
* 如果是下凸壳(最小化收益)则无需管答案是否合法，因为一定能二分到，此时$b-mid \cdot k$才是答案



### P2619 [国家集训队] Tree I(wqs二分下凸壳板子)
给你一个无向带权连通图，每条边是黑色或白色。求恰好包含$k$条边的最小生成树
```cpp
void solve(){
    int n,m,k;
    cin>>n>>m>>k;
    vector<array<int,4>> e;
    for(int i=0;i<m;i++){
        int u,v,w,c;
        cin>>u>>v>>w>>c;
        e.push_back({w,u,v,c});
    } 
    DSU dsu;
    auto check=[&](int mid){
        dsu.init(n+1);
        for(auto &[w,u,v,c]:e){
            if(c==0)w+=mid;
        }
        ranges::sort(e,[&](auto a,auto b){
            if(a[0]!=b[0])return a[0]<b[0];
            return a[3]<b[3];
        });
        int used=0,ans=0;
        for(auto [w,u,v,c]:e){
            if(dsu.merge(u,v)){
                used+=c==0;
                ans+=w;
            }
        }
        for(auto &[w,u,v,c]:e){
            if(c==0)w-=mid;
        }
        return PII{used,ans};
    };
    int l=-100,r=100;
    while(l<r){
        int mid=l+r+1>>1;
        if(check(mid).F>=k)l=mid;
        else r=mid-1;
    }
    auto [used,ans]=check(l);
    cout<<ans-l*k<<"\n";
}
```
满足$s$编号的点度数为$k$的情况
```cpp
void solve(){
    int n,m,s,k;
    cin>>n>>m>>s>>k;
    vector<array<int,4>> e;
    for(int i=0;i<m;i++){
        int u,v,w,c;
        cin>>u>>v>>w;
        c=!(u==s||v==s);
        e.push_back({w,u,v,c});
    } 
    DSU dsu;
    dsu.init(n+1);
    for(auto [w,u,v,c]:e){
        dsu.merge(u,v);
    }
    if(dsu.size(s)!=n){
        cout<<"Impossible\n";
        return;
    }
    auto check=[&](int mid){
        dsu.init(n+1);
        for(auto &[w,u,v,c]:e){
            if(c==0)w+=mid;
        }
        ranges::sort(e,[&](auto a,auto b){
            if(a[0]!=b[0])return a[0]<b[0];
            return a[3]<b[3];
        });
        int used=0,ans=0;
        for(auto [w,u,v,c]:e){
            if(dsu.merge(u,v)){
                used+=c==0;
                ans+=w;
            }
        }
        for(auto &[w,u,v,c]:e){
            if(c==0)w-=mid;
        }
        return PII{used,ans};
    };
    int l=-1e9,r=1e9;
    while(l<r){
        int mid=l+r+1>>1;
        if(check(mid).F>=k)l=mid;
        else r=mid-1;
    }
    // 优先使用都无法到达k，或者优先不使用超过k，都是不合法的
    if(check(-1e9).F<k||check(1e9).F>k){
        cout<<"Impossible\n";
        return;
    }
    auto [used,ans]=check(l);
    cout<<ans-l*k<<"\n";
}
```
