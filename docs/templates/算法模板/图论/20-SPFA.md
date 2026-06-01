---
title: 'SPFA'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# SPFA

```cpp
void spfa(){
    memset(d,0x3f,sizeof d);
    memset(vis,0,sizeof vis);
    d[1]=0;
    vis[1]=1;
    q.push(1);
    while(!q.empty()){
        int u=q.front();
        q.pop();
        vis[u]=0;
        for(auto [v,c]:adj[u]){
            if(d[v]>d[u]+c){
                d[v]=d[u]+c;
                if(!vis[v]){
                    q.push(v);
                    vis[v]=1;
                }
            }
        } 
    }
}
```
