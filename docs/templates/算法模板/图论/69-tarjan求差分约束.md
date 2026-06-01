---
title: 'tarjan求差分约束'
date: "2025-06-03"
sourceFile: "2025-06-03-补充算法笔记2.md"
category: "templates"
---

<PostMeta />

# tarjan求差分约束

在差分约束中提到本题跑最长路求最小值，当时使用的是spfa，但是数据大一点就会被卡，本题可以使用tarjan算法线性求解

* 第一步是缩点
* 第二步判断正环：因为所有边权大于等于0，因此在一个强连通分量中只要有一条边大于0则有正环；如果没有正环，那么当前强连通分量的边均为0
* 第三步拓扑序求最长路即可

```cpp
int dfn[N],low[N],in_st[N],id[N],idx,scc_cnt;
vector<array<int,2>> adj[N],g[N];
stack<int> st;
int dis[N],siz[N];
void tarjan(int u){
    dfn[u]=low[u]=++idx;
    st.push(u);
    in_st[u]=1;
    for(auto [v,c]:adj[u]){
        if(!dfn[v]){
            tarjan(v);
            low[u]=min(low[u],low[v]);
        }
        else if(in_st[v]){
            low[u]=min(low[u],dfn[v]);
        }
    }
    if(dfn[u]==low[u]){
        ++scc_cnt;
        int y;
        do{
            y=st.top();
            st.pop();
            in_st[y]=0;
            id[y]=scc_cnt;    
            siz[scc_cnt]++;        
        }while(y!=u);
    }
}
void solve(){
    int n,m;
    cin>>n>>m;
    while(m--){
        int x,a,b;
        cin>>x>>a>>b;
        if(x==1)adj[a].push_back({b,0}),adj[b].push_back({a,0});
        else if(x==2)adj[a].push_back({b,1});
        else if(x==3)adj[b].push_back({a,0});
        else if(x==4)adj[b].push_back({a,1});
        else adj[a].push_back({b,0});
    }
    for(int i=1;i<=n;i++)adj[0].push_back({i,1});
    tarjan(0);
    for(int u=0;u<=n;u++){
        for(auto [v,c]:adj[u]){
            int a=id[u],b=id[v];
            if(a==b){
                if(c>0){
                    cout<<"-1\n";
                    return;
                }
            }
            else g[a].push_back({b,c});
        }
    }
    for(int u=scc_cnt;u>=1;u--){
        for(auto [v,c]:g0[u]){
            dis[v]=max(dis[v],dis[u]+c);
        }
    }
    int res=0;
    for(int i=1;i<=scc;i++)res+=siz[i]*dis[i];
    cout<<res<<"\n";
}
```
