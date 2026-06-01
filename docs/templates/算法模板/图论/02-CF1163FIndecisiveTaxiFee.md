---
title: 'CF1163F Indecisive Taxi Fee'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# CF1163F Indecisive Taxi Fee

题意：

每次改变无向图上的任意一条边，求最短路变化


思路：

* 预处理从1开始和从n开始的最短路$disS,disT$
* 然后剖分出这条最短路径
* 如果当前修改边不在最短路径上，那么答案为$\min(disS_n,disS_u+w+disT_v,disS_v+w+disT_u)$
* 如果在最短路径上，如果数值变小，那么最短路径显然变小；如果数值变大，那么最短路可能会改变
* 我们对最短路径上的边标号，记录在节点末端v从1到cnt，特殊地，节点1前面没有边标号为0
* 对于非最短路边，经过该边的最短路径一定会与原最短路有重合的部分，我们找出来，两条路径刚好相交的左端点和右端点，然后用线段树维护区间min即可
```cpp
struct Node{
	int l,r,mn;
} t[N<<2];
int disS[N],disT[N],pre[N];
int head[N],e[M],ne[M],w[M],eid[M],idx,lp[N],rp[N];
int n,m,q;
bool onPath[N];
int path[M];
int path_cnt;
void addEdge(int a,int b,int c,int id){
	e[idx]=b,ne[idx]=head[a],w[idx]=c,eid[idx]=id,head[a]=idx++;
}
void dijk(int dis[],int st,int op){
	for(int i=1;i<=n;i++)dis[i]=INF;
	priority_queue<PII,vector<PII>,greater<>> pq;
	pq.push({0,st});
	dis[st]=0;
	while(!pq.empty()){
		auto [d,u]=pq.top();
		pq.pop();
		if(d>dis[u])continue;
		for(int i=head[u];~i;i=ne[i]){
			int v=e[i];
			if(dis[v]>d+w[i]){
				dis[v]=d+w[i];
				pre[v]=i;
				if(op==1&&!onPath[v])lp[v]=lp[u];
				if(op==2&&!onPath[v])rp[v]=rp[u];
				pq.push({dis[v],v});
			}
		}
	}
}
void trace(){
	int cur=1;
	lp[1]=rp[1]=0;
	onPath[1]=true;
	while(cur!=n){
		++path_cnt;
		int id=eid[pre[cur]];
		path[id]=path_cnt;
		cur=e[pre[cur]^1];
		onPath[cur]=true;
		lp[cur]=rp[cur]=path_cnt;
	}
}
void build(int p,int l,int r){
	t[p]={l,r,INF};
	if(l==r)return;
	int mid=l+r>>1;
	build(p<<1,l,mid);
	build(p<<1|1,mid+1,r);
}	
void modify(int p,int l,int r,int x){
	if(l>r)return;
	if(l<=t[p].l&&r>=t[p].r){
		t[p].mn=min(t[p].mn,x);
		return;
	}
	int mid=t[p].l+t[p].r>>1;
	if(l<=mid)modify(p<<1,l,r,x);
	if(r>mid)modify(p<<1|1,l,r,x);
}
int query(int p,int x){
	if(t[p].l==t[p].r)return t[p].mn;
	int res=t[p].mn;
	int mid=t[p].l+t[p].r>>1;
	if(x<=mid)return min(res,query(p<<1,x));
	return min(res,query(p<<1|1,x));
}
void solve(){ 
	cin>>n>>m>>q;
	for(int i=1;i<=n;i++)head[i]=-1;
	vector<array<int,3>> edges;
	for(int i=0;i<m;i++){
		int u,v,w;
		cin>>u>>v>>w;
		edges.push_back({u,v,w});
		addEdge(u,v,w,i);
		addEdge(v,u,w,i);
	}
	dijk(disT,n,0);
	trace();
	dijk(disS,1,1);
	dijk(disT,n,2);
	build(1,0,path_cnt);
	for(int i=0;i<m;i++){
		auto [u,v,w]=edges[i];
		if(path[i])continue;
		modify(1,lp[u]+1,rp[v],disS[u]+w+disT[v]);
		modify(1,lp[v]+1,rp[u],disS[v]+w+disT[u]);
	}
	while(q--){
		int t,x;
		cin>>t>>x;
		t--;
		auto [u,v,w]=edges[t];
		int ans;
		if(path[t]){
			ans=disS[n]-w+x;
			ans=min(ans,query(1,path[t]));
		}
		else{
			ans=disS[n];
			ans=min(ans,disS[u]+disT[v]+x);
			ans=min(ans,disS[v]+disT[u]+x);
		}
		cout<<ans<<"\n";
	}
}   
```
