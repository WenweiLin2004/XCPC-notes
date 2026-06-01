---
title: 'tarjan求点双连通分量'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# tarjan求点双连通分量

* 边双连通分量：极大的不含桥的连通块    
* 点双连通分量：极大的不含割点的连通块     
* 每个割点至少属于两个连通分量    
* 两个割点之间的边不一定是桥    
```cpp
int dfn[N],low[N],dcc_cnt,timestamp;
int h[N],e[M],ne[M],idx;
void add(int a,int b){
    e[idx]=b,ne[idx]=h[a],h[a]=idx++;
}
vector<int> dcc[N],st;
bool cut[N];
int root;
void tarjan(int u){
    dfn[u]=low[u]=++timestamp;
    st.push_back(u);
    if(u==root&&h[u]==-1){
        ++dcc_cnt;
        dcc[dcc_cnt].push_back(u);
        return;
    }
    int cnt=0;
    for(int i=h[u];~i;i=ne[i]){
        int v=e[i];
        if(!dfn[v]){
            tarjan(v);
            low[u]=min(low[u],low[v]);
            if(dfn[u]<=low[v]){
                cnt++;
                if(u!=root||cnt>1)cut[u]=1;
                ++dcc_cnt;
                int y;
                do{
                    y=st.back();
                    st.pop_back();
                    dcc[dcc_cnt].push_back(y);
                }while(y!=v);
                dcc[dcc_cnt].push_back(u);   
            }
        }
        else low[u]=min(low[u],low[v]);
    }
}
```
