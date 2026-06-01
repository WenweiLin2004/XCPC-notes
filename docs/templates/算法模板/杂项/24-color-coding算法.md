---
title: 'color-coding算法'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# color-coding算法

题意：

求包含任意k个点的最大生成树

$ 1 \leq n,m  \leq 5 \cdot 10^4  ,1 \leq k \leq 6$

思路：

* 随机染色跑状压dp
* 一次成功的概率为 $ \frac{k!}{k^k} $，跑200次

```cpp
int n,m,k;
int dp[1<<6][N];
array<int,3> e[N];
int w[N];
mt19937_64 rng(time(0));
int cal(){
    for(int s=1;s<1<<k;s++){
        for(int i=1;i<=m;i++){
            auto [u,v,c]=e[i];
            if(s&w[u])dp[s][u]=max(dp[s][u],dp[s^w[u]][v]+c);
            if(s&w[v])dp[s][v]=max(dp[s][v],dp[s^w[v]][u]+c);
        }
    }
    int ans=0;
    for(int i=1;i<=n;i++)ans=max(ans,dp[(1<<k)-1][i]);
    return ans;
}
void solve(){
    cin>>n>>m>>k;
    for(int i=1;i<=m;i++){
        int u,v,w;
        cin>>u>>v>>w;
        e[i]={u,v,w};
    }
    int ans=-1e18;
    for(int _=0;_<300;_++){
        for(int i=0;i<1<<k;i++){
            for(int j=0;j<=n;j++)dp[i][j]=-1e18;
        }
        for(int i=1;i<=n;i++){
            w[i]=1<<(rng()%k);
            dp[w[i]][i]=0;
        }
        ans=max(ans,cal());
    }
    if(ans)cout<<ans<<"\n";
    else cout<<"impossible\n";
}
```
题意：

三个长度为n的数组a,b,c,选出m个下标，要求a对应的数是单调不减的，b对应的数是两两不同的，最大化c的选值

思路：

* 定义 $ f_{i,S,j} $ 表示考虑了前i个数，S为当前选的bi的不可重集，子序列最后一个数为j的最大值
* bi取值很多，随机染色，然后跑300次
* 第三维可以用树状数组优化掉
* 复杂度:$ O(Tn2^mlogn) $

```cpp
#include<bits/stdc++.h>
#define int long long
using namespace std;
typedef pair<int,int> PII;
const int N=3010,M=N*2;
const int mod=998244353;
mt19937_64 rng(chrono::system_clock::now().time_since_epoch().count());
int a[N],b[N],c[N],d[N],e[N];
struct BIT{
    vector<int> c;
    void init(){
        c=vector<int>(N,-1e9);
    }
    void add(int x,int y){
        for(int i=x;i<N;i+=i&-i)c[i]=max(c[i],y);
    }
    int query(int x){
        int ans=-1e9;
        for(int i=x;i;i&=i-1)ans=max(ans,c[i]);
        return ans;
    }
} t[32];
void solve(){
    int n,m;
    cin>>n>>m;
    for(int i=1;i<=n;i++)cin>>a[i];
    for(int i=1;i<=n;i++)cin>>b[i];
    for(int i=1;i<=n;i++)cin>>c[i];
    int ans=-1e9;
    for(int _=1;_<=300;_++){
        for(int i=0;i<1<<m;i++)t[i].init();
        for(int i=1;i<=n;i++)d[i]=rng()%m;
        for(int i=1;i<=n;i++)e[i]=d[b[i]];
        t[0].add(1,0);
        for(int i=1;i<=n;i++){
            int k=e[i];
            for(int j=0;j<1<<m;j++){
                if(j>>k&1)continue;
                t[j|1<<k].add(a[i],t[j].query(a[i])+c[i]);
            }
        }
        ans=max(ans,t[(1<<m)-1].query(n));
    }
    cout<<(ans>0?ans:-1)<<"\n";
}
signed main(){
    cin.tie(0)->sync_with_stdio(0);
    int T=1;
    // cin>>T;
    while(T--)solve();
    return 0;
}
```
