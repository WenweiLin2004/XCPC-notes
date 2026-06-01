---
title: 'Edmonds-Karps算法$ O(nm^2)(能处理10^3-10^4规模的网络) $'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# Edmonds-Karps算法$ O(nm^2)(能处理10^3-10^4规模的网络) $

1. bfs找增广路
2. 更新残留网络(正向减去f，反向加f，总流加f)
3. 用链式前向星存图，连续存正反边，则异或即为反边
```cpp
const int N=210,M=10010;
int n,m,S,T;//S为源点,T为汇点
int e[M],h[N],ne[M],idx;//链式前向星
int f[M],d[N],pre[N];//f存流量，d存增广路的最小值，pre求前驱路径的idx
void add(int a,int b,int c){
    e[idx]=b,f[idx]=c,ne[idx]=h[a],h[a]=idx++;
    e[idx]=a,f[idx]=0,ne[idx]=h[b],h[b]=idx++;//反向流量初始为0
}   
bool bfs(){
    queue<int> q;
    memset(vis,0,sizeof vis);
    q.push(S);
    vis[S]=1;
    d[S]=INF;
    while(!q.empty()){
        auto u=q.front();
        q.pop();
        for(int i=h[u];~i;i=ne[i]){
            int v=e[i];
            if(!vis[v]&&f[i]){
                vis[v]=1;
                d[v]=min(d[u],f[i]);
                pre[v]=i;
                if(v==T)return true;
                q.push(v);
            }
        }
    }
    return false;
}
int EK(){
    int r=0;
    while(bfs()){
        r+=d[T];
        for(int i=T;i!=S;i=e[pre[i]^1]){
            f[pre[i]]-=d[T],f[pre[i]^1]+=d[T];
        }
    }
    return r;
}
void solve(){
    cin>>n>>m>>S>>T;
    memset(h,-1,sizeof h);
    for(int i=1;i<=m;i++){
        int u,v,w;
        cin>>u>>v>>w;
        add(u,v,w);
    }
    cout<<EK();
}   
```
