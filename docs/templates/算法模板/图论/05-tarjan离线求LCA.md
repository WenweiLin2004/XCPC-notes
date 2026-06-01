---
title: 'tarjan离线求LCA'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# tarjan离线求LCA

```cpp
int par[N];
vector<int> adj[N];
vector<PII> query[N];
bool vis[N];
int ans[N];
int find(int x){
    return par[x]==x?x:par[x]=find(par[x]);
}
void tarjan(int u,int fa){
    vis[u]=true;
    for(auto v:adj[u]){
        if(v==fa)continue;
        tarjan(v,u);
        par[v]=u;
    }
    for(auto [id,v]:query[u]){
        if(vis[v])ans[id]=find(v);
    }
}
```
### 三个点到一个点的最小花费最小  
* 三个点的lca必有两个相同
* 两个相同，那么就是另一个点
* 三个相同，就是当前点
### 树上差分
```cpp
//点差分
w[u]+=x,w[v]+=x,w[lca(u,v)]-=x,w[fa[lca(u,v)]]-=x;
//边差分
w[u]+=x,w[v]+=x,w[lca(u,v)]-=2*x;
```
