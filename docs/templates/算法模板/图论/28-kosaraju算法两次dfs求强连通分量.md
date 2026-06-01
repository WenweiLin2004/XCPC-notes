---
title: 'kosaraju算法(两次dfs求强连通分量)'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# kosaraju算法(两次dfs求强连通分量)

$O(n+m)$做法   
```cpp
int id[N],n,m,scc;
bool vis[N];
vector<int> adj[N],adj_r[N],s;//adj_r是反图
void dfs1(int u){
    vis[u]=1;
    for(auto v:adj[u]){
        if(!vis[v])dfs1(v);
    }
    s.push_back(u);
}
void dfs2(int u){
    id[u]=scc;
    for(auto v:adj_r[u]){
        if(!id[v])dfs2(v);
    }
}
void kosaraju(){
    scc=0;
    for(int i=1;i<=n;i++){
        if(!vis[i])dfs1(i);
    }
    for(int i=s.size()-1;i>=0;i--){
        if(!id[s[i]]){
            scc++;
            dfs2(s[i]);
        }
    }
}
```
* 如果是稠密图，$n$很小$m$很大，并且带修就不好做了   
* 使用**bitset**做邻接表，复杂度 $O(\frac{n^2}{\omega})$
```cpp
int id[N],n,m,scc;
vector<int> s;
bitset<10001> adj[10001],adj_r[10001],vis,now;
void dfs1(int u){
    vis.reset(u);
    for(now=adj[u]&vis;now.any();now=adj[u]&vis){
        dfs1(now._Find_first());
    }
    s.push_back(u);
}
void dfs2(int u){
    id[u]=scc;
    vis.reset(u);
    for(now=adj_r[u]&vis;now.any();now=adj_r[u]&vis){
        dfs2(now._Find_first());
    }
}
void kosaraju(){
    scc=0;
    vis.set();
    for(int i=1;i<=n;i++){
        if(vis.test(i))dfs1(i);
    }
    vis.set();
    for(int i=s.size()-1;i>=0;i--){
        if(vis.test(s[i])){
            scc++;
            dfs2(s[i]);
        }
    }
}
```
