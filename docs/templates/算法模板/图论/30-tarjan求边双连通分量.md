---
title: 'tarjan求边双连通分量'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# tarjan求边双连通分量

```cpp
int n,m;
int h[N],e[M],ne[M],idx;
int stk[N],top,id[N],dfn[N],low[N],timestamp,dcc_cnt;
bool is_bridge[M];
int d[N];
void add(int a,int b){
    e[idx]=b,ne[idx]=h[a],h[a]=idx++;
}
void tarjan(int u,int from){
    dfn[u]=low[u]=++timestamp;
    stk[++top]=u;
    for(int i=h[u];~i;i=ne[i]){
        int v=e[i];
        if(!dfn[v]){
            tarjan(v,i);
            low[u]=min(low[u],low[v]);
            if(dfn[u]<low[v]){
                is_bridge[i]=is_bridge[i^1]=1;
            }
        }
        else if(i!=(from^1)){
            low[u]=min(low[u],dfn[v]);
        }
    }
    if(dfn[u]==low[u]){
        int y;
        ++dcc_cnt;
        do{
            y=stk[top--];
            id[y]=dcc_cnt;
        }while(y!=u);
    }
}
```
