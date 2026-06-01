---
title: 'LCA'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# LCA

```cpp
vector<int> adj[N];
void dfs(int u,int fa){
	dep[u]=dep[fa]+1;
	par[u][0]=fa;
	for(int i=1;i<=__lg(dep[u]);i++)par[u][i]=par[par[u][i-1]][i-1];
	for(auto v:adj[u]){
		if(v==fa)continue;
		dfs(v,u);
	}
}
int lca(int u,int v){
	if(dep[u]<dep[v])swap(u,v);
	while(dep[u]>dep[v]){
		u=par[u][(int)__lg(dep[u]-dep[v])];
	}
	if(u==v)return u;
	for(int i=log2(dep[u]);i>=0;i--){
		if(par[u][i]!=par[v][i])u=par[u][i],v=par[v][i];
	}
	return par[u][0];
}
```
