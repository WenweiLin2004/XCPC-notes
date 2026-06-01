---
title: 'Prufer序列'
date: "2025-05-22"
sourceFile: "2025-05-22-补充算法笔记.md"
category: "templates"
---

<PostMeta />

# Prufer序列

无根树与序列的转化

定义$n$为根

编码：给定一个$n-1$的父亲序列，转化为$n-2$的prufer序列

解码：给定$n-2$的prufer序列，还原无根树

```cpp
struct Prufer{
	// 1-indexed,root=n
	vector<int> par,deg;
	vector<vector<int>> adj;
	int n;
	Prufer(int n):n(n),par(n+1,-1){
		adj.assign(n+1,{});
		deg.assign(n+1,0);
	}
	void addEdge(int u,int v){
		adj[u].push_back(v);
		adj[v].push_back(u);
	}
	void dfs(int u,int fa){
		par[u]=fa;
		for(auto v:adj[u]){
			if(v==fa)continue;
			dfs(v,u);
		}
	}
	vector<int> encode(const vector<int>& Par){
		vector<int> par=Par;
		for(int i=1;i<n;i++)++deg[par[i]];
		vector<int> p(n+1);
		for(int i=1,j=1;i<=n-2;i++,j++){
			while(deg[j])++j;
			p[i]=par[j];
			while(i<=n-2&&!--deg[p[i]]&&p[i]<j)p[i+1]=par[p[i]],i++;
		}
		return p;
	}
	vector<int> encode(){
		clear();
		dfs(n,0);
		return encode(par);
	}
	vector<int> decode(const vector<int>& P){
		clear();
		vector<int> p=P;
		for(int i=1;i<=n-2;i++)++deg[p[i]];
		p[n-1]=n;
		vector<int> par(n+1);
		for(int i=1,j=1;i<n;i++,j++){
			while(deg[j])++j;
			par[j]=p[i];
			while(i<n&&!--deg[p[i]]&&p[i]<j)par[p[i]]=p[i+1],i++;
		}
		return par;
	}
	void clear(){
		for(int i=1;i<=n;i++)adj[i].clear();
		par.assign(n+1,-1);
		deg.assign(n+1,0);
	}
};
```

### 性质

1. Cayley公式:完全图有$n^{n-2}$颗生成树
2. prufer序列与无根树一一对应
3. 度数为$d_i$的点出现$d_i-1$次
4. 给定度数序列$d$，答案是$\frac{(n-2)!}{\prod_{i=1}^n(d_i-1)!}$
    * $n-2$个数全排列，然后有$d_i-1$个相同的数，去重



### 图联通方案数

$n$个点$m$条边的无向图有$k$个连通块，希望添加$k-1$条边使得整个图连通，求方案数

设$s_i$是第$k$个连通块的点数

答案就是$n^{k-2}\prod_{i=1}^ks_i$

感性理解：$k$个连通块缩成一个点，生成树有$n^{k-2}$种，每个连通块任选一个点作为连接点，$n^{k-2}\prod_{i=1}^ks_i$



一些度数已知，一些未知，求生成树方案数

设一直度数有$cnt$个，$s=\sum deg_i-1$

从$n-2$个位置选择$s$个位置，全排列方案为$\binom{n-2}{s}\frac{s!}{\prod(deg_i-1)!}$

剩下$n-2-s$个位置，每个位置有$n-cnt$种可能，总答案$\binom{n-2}{s}\frac{s!}{\prod(deg_i-1)!}(n-cnt)^{n-2-s}$
