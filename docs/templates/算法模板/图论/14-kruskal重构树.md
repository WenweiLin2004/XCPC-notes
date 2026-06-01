---
title: 'kruskal重构树'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# kruskal重构树

### 模板
* 如果是最小生成树，那么u,v之间路径的最小边权最大值，即为lca(u,v)的权值
* 如果是最大生成树，那么为最大边权最小值
```cpp
void Ex_kruskal(){
    sort(e.begin(),e.end());
    dsu.init(2*n+1);
    for(auto [u,v,c]:e){
        if(dsu.same(u,v))continue;
        ++idx;
        u=dsu.find(u),v=dsu.find(v);
        adj[idx].push_back(u);
        adj[idx].push_back(v);
        dsu.merge(idx,u);
        dsu.merge(idx,v);
        w[idx]=c;
    }
}
```
