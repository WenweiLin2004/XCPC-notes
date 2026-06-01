---
title: 'Dinic算法 $ O(n^2m)(能处理10^4-10^5规模的网络) $'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# Dinic算法 $ O(n^2m)(能处理10^4-10^5规模的网络) $

1. 对EK算法的优化，dfs将所有增广路同时遍历
2. 因为可能有环，因此需要bfs预处理一遍深度，分层遍历
3. 对于一个节点x，当它在DFS中走到了第i条弧时，前i?1条弧到汇点的流一定已经被流满而没有可行的路线了那么当下一次再访问x节点时，前i?1条就没有任何意义了
```cpp
const int N=210,M=10010;
int n,m,S,T;//S为源点,T为汇点
int e[M],h[N],ne[M],idx;//链式前向星
int f[M],d[N],cur[N];//f存流量，d存层数，cur为弧优化，表示当前从哪条节点开始搜
void add(int a,int b,int c){
    e[idx]=b,f[idx]=c,ne[idx]=h[a],h[a]=idx++;
    e[idx]=a,f[idx]=0,ne[idx]=h[b],h[b]=idx++;//反向流量初始为0
}   
bool bfs(){
    queue<int> q;
    memset(d,-1,sizeof d);
    q.push(S);
    d[S]=0,cur[S]=h[S];
    while(!q.empty()){
        auto u=q.front();
        q.pop();
        for(int i=h[u];~i;i=ne[i]){
            int v=e[i];
            if(d[v]==-1&&f[i]){
                d[v]=d[u]+1;
                cur[v]=h[v];//一开始所有边都可以搜
                if(v==T)return true;
                q.push(v);
            }
        }
    }
    return false;
}
int find(int u,int limit){//深搜，limit表示从源点流向u的最多能流的流，flow表示已经流向汇点多少流
    if(u==T)return limit;
    int flow=0;
    for(int i=cur[u];~i&&flow<limit;i=ne[i]){//flow<limit优化很重要，否则易tle
        int v=e[i];
        cur[u]=i;//弧优化更新
        if(d[v]==d[u]+1&&f[i]){
            int t=find(v,min(f[i],limit-flow));
            if(!t)d[v]=-1;//如果到达不了T,标记下次就不会走到
            f[i]-=t,f[i^1]+=t,flow+=t;
        }
    }   
    return flow;
}
int dinic(){
    int r=0,flow;
    while(bfs())
        while(flow=find(S,INF))r+=flow;
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
    cout<<dinic();
}   
```
