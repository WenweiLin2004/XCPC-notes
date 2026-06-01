---
title: 'kruskal算法'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# kruskal算法

```cpp
struct edge{
	int u,v,c;
	bool operator<(const edge&tmp)const{
		return c<tmp.c;
	}
};
void solve(){
	int n,m;
	cin>>n>>m;
	vector<edge> edges(m);
	vector<int> par(n+1);
	for(int i=1;i<=n;i++)par[i]=i;
	function<int(int)> find=[&](int x){
		return par[x]==x?x:par[x]=find(par[x]);
	};
	for(int i=0;i<m;i++){
		cin>>edges[i].u>>edges[i].v>>edges[i].c;
	}
	sort(edges.begin(),edges.end());
	int cnt=0;
	ll sum=0;
	for(int i=0;i<m;i++){
		int fx=find(edges[i].u),fy=find(edges[i].v);
		if(fx==fy)continue;
		par[fy]=fx;
		cnt++;
		sum+=edges[i].c;
		if(cnt==n-1)break;
	}
	if(cnt!=n-1){
		puts("orz");
		return;
	}
	cout<<sum<<"\n";
}
```
