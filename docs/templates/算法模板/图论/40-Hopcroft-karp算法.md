---
title: 'Hopcroft-karp 算法'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# Hopcroft-karp 算法

```cpp
using namespace Elaina;

const int maxn=500;
const int maxm=5e4;
const int inf=0x3f3f3f3f;

struct edge{int to,nxt;}e[maxm+5];
int tail[maxn+5],ecnt;

int x,y,m;


inline void add_edge(const int u,const int v){
    e[++ecnt]=edge{v,tail[u]};tail[u]=ecnt;
}

inline void input(){
    x=readin(1),y=readin(1),m=readin(1);
    int u,v;
    rep(i,1,m){
        u=readin(1),v=readin(1);
        add_edge(u,v);
    }
}

int xtoy[maxn+5],ytox[maxn+5];
int dx[maxn+5],dy[maxn+5];
queue<int>Q;
// the length of the shortest augmented road
int dis;
/** @return whether have found the augmented road*/
inline int bfs(){
    dis=inf;
    memset(dx+1,-1,x<<2);memset(dy+1,-1,y<<2);
    while(!Q.empty())Q.pop();
    rep(i,1,x)if(!xtoy[i])Q.push(i),dx[i]=0;
    while(!Q.empty()){
        int u=Q.front();Q.pop();
        // ensure the augmented road is the shortest
        if(dx[u]>dis)break;
        for(int i=tail[u],v;i;i=e[i].nxt){
            v=e[i].to;
            if(dy[v]==-1){
                dy[v]=dx[u]+1;
                // have found the shortest augmented road
                if(!ytox[v])dis=dy[v];
                else dx[ytox[v]]=dy[v]+1,Q.push(ytox[v]);
            }
        }
    }
    return dis!=inf;
}

int vis[maxn+5];
int dfs(const int u){
    for(int i=tail[u],v;i;i=e[i].nxt)if(!vis[v=e[i].to]){
        if(dy[v]==dx[u]+1){
            vis[v]=1;
            // length limited
            if(ytox[v] && dy[v]==dis)continue;
            if(!ytox[v] || dfs(ytox[v])){
                ytox[v]=u,xtoy[u]=v;
                return 1;
            }
        }
    }
    return 0;
}

inline int HK(){
    int ret=0;
    while(bfs()){
        memset(vis+1,0,y<<2);
        rep(i,1,x)if(!xtoy[i] && dfs(i))
            ++ret;
    }
    return ret;
}

signed main(){
    input();
    writc(HK(),'\n');
    return 0;
}
```
