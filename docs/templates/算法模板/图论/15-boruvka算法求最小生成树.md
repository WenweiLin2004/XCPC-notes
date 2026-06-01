---
title: 'boruvka算法求最小生成树'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# boruvka算法求最小生成树

```cpp
vector<array<int,3>> edges;
int mn[N],id[N],vis[M],n,m;
void boruvka(){
    DSU dsu(n+1);
    int ans=0,cnt=0;
    while(1){
        fill(mn,mn+n+1,INF);
        fill(id,id+n+1,-1);
        for(int i=0;i<m;i++){
            if(vis[i])continue;
            auto &[u,v,w]=edges[i];
            int fu=dsu.find(u),fv=dsu.find(v);
            if(fu==fv)continue;
            if(w<mn[fu])mn[fu]=w,id[fu]=i;
            if(w<mn[fv])mn[fv]=w,id[fv]=i;
        }
        bool flag=false;
        for(int i=1;i<=n;i++){
            if(mn[i]==INF)continue;
            if(dsu.merge(edges[id[i]][0],edges[id[i]][1])){
                ans+=mn[i];
                vis[id[i]]=1;
                cnt++;
                flag=true;
            }
        }
        if(!flag)break;
    }
    if(cnt==n-1)cout<<ans<<"\n";
    else cout<<"orz\n";
}
```
