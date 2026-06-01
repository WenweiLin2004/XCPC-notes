---
title: 'Dinic封装版'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# Dinic封装版

```cpp
struct MaxFlow{
    vector<int> e,h,ne;//链式前向星
    int n,idx,S,T;//S为源点,T为汇点
    vector<int> f,d,cur;//f存流量，d存层数，cur为弧优化，表示当前从哪条节点开始搜
    MaxFlow(){}
    MaxFlow(int n){
        init(n);
    }
    void init(int n,int S=0,int T=0){
        h.assign(n+1,-1);
        d.assign(n+1,0);
        cur.assign(n+1,0);
        e.clear();
        ne.clear();
        f.clear();
        idx=0;
        this->n=n;
        this->S=S;
        this->T=T==0?n:T;
    }
    void newEdge(int x=2){
        for(int i=0;i<x;i++){
            e.emplace_back();
            ne.emplace_back();
            f.emplace_back();
        }
    }
    void addEdge(int a,int b,int c){
        newEdge();
        e[idx]=b,f[idx]=c,ne[idx]=h[a],h[a]=idx++;
        e[idx]=a,f[idx]=0,ne[idx]=h[b],h[b]=idx++;//反向流量初始为0
    }
    bool bfs(){
        queue<int> q;
        d.assign(n+1,-1);
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
};
```
