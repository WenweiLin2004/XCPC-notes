---
title: 'tarjan求强连通分量'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# tarjan求强连通分量

```cpp
int n,m;
int h[N],e[M],ne[M],idx;
int dfn[N],low[N],timestamp,scc_cnt;
int dout[N],id[N],siz[N];
int stk[N],top;
bool in_stack[N];
void add(int a,int b){
    e[idx]=b,ne[idx]=h[a],h[a]=idx++;
}
void tarjan(int u){
    dfn[u]=low[u]=++timestamp;
    stk[++top]=u;
    in_stack[u]=1;
    for(int i=h[u];~i;i=ne[i]){
        int v=e[i];
        if(!dfn[v]){
            tarjan(v);
            low[u]=min(low[u],low[v]);
        }
        else if(in_stack[v]){
            low[u]=min(low[u],dfn[v]);
        }
    }
    if(dfn[u]==low[u]){
        int y;
        scc_cnt++;
        do{
            y=stk[top--];
            in_stack[y]=0;
            id[y]=scc_cnt;
            siz[scc_cnt]++;
        }while(y!=u);
    }
}
```
