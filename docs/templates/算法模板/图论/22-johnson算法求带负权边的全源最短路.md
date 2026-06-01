---
title: 'johnson算法求带负权边的全源最短路'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# johnson算法求带负权边的全源最短路

```cpp
int n,m;
vector<PII> adj[N];
int dis[N],h[N],cnt[N];
bool vis[N];
bool spfa(){
    for(int i=0;i<=n;i++)h[i]=INF;
    queue<int> q;
    h[0]=0;
    q.push(0);
    vis[0]=1;
    while(!q.empty()){
        auto u=q.front();
        q.pop();
        vis[u]=0;
        for(auto [v,w]:adj[u]){
            if(h[v]>h[u]+w){
                h[v]=h[u]+w;
                cnt[v]=cnt[u]+1;
                if(cnt[v]>=n+1)return false;
                if(!vis[v]){
                    q.push(v);
                    vis[v]=1;
                }
            }
        }
    }
    return true;
}
void dijk(int st){
    for(int i=1;i<=n;i++)vis[i]=0,dis[i]=INF;
    priority_queue<PII,vector<PII>,greater<>> pq;
    dis[st]=0;
    pq.push({dis[st],st});
    while(!pq.empty()){
        auto [d,u]=pq.top();
        pq.pop();
        if(vis[u])continue;
        vis[u]=1;
        for(auto [v,w]:adj[u]){
            if(dis[v]>dis[u]+w+h[u]-h[v]){
                dis[v]=dis[u]+w+h[u]-h[v];
                pq.push({dis[v],v});
            }
        }
    }   
}
void solve(){   
    cin>>n>>m;
    for(int i=1;i<=m;i++){
        int u,v,w;
        cin>>u>>v>>w;
        adj[u].push_back({v,w});
    }
    for(int i=1;i<=n;i++)adj[0].push_back({i,0});
    if(!spfa()){
        cout<<"-1\n";
        return;
    }
    for(int i=1;i<=n;i++){
        dijk(i);
        int res=0;
        for(int j=1;j<=n;j++)res+=dis[j]==INF?INF*j:(dis[j]-h[i]+h[j])*j;
        cout<<res<<"\n";
    }
}   
```
