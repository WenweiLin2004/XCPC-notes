---
title: '堆优化的dijk'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# 堆优化的dijk

```cpp
void dijk(){
    priority_queue<pair<int,int>> q;
    memset(d,0x3f,sizeof d);
    memset(vis,0,sizeof vis);
    d[1]=0;
    q.push({0,1});
    while(!q.empty()){
        int u=q.top().second;
        q.pop();
        if(vis[u])continue;
        vis[u]=1;
        for(auto [v,c]:adj[u]){
            if(d[v]>d[u]+c){
                d[v]=d[u]+c;
                q.push({-d[v],v});
            }
        }
    }
}
```
