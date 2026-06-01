---
title: 'prim算法'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# prim算法

```cpp
int prim(){
    memset(d,0x3f,sizeof d);
    d[1]=0;
    int res=0;
    for(int i=1;i<=n;i++){
        int x=-1;
        for(int j=1;j<=n;j++){
            if(vis[x])continue;
            if(x==-1||d[j]<d[x])x=j;
        }
        vis[x]=1;
        res+=d[x];
        for(int y=1;y<=n;y++)d[y]=min(d[y],a[x][y]);
    }
    return res;
}
```
