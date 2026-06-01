---
title: 'LGV引理(有向无环图不相交路径计数)'
date: "2025-05-22"
sourceFile: "2025-05-22-补充算法笔记.md"
category: "templates"
---

<PostMeta />

# LGV引理(有向无环图不相交路径计数)

![image-20250530000248821](/assets/img/typora/image-20250530000248821.png)

### 模板(含取模高斯消元)

$n \times m$的棋盘，每次只能往下或往右走，第$i$个棋子在$(a_i,1)$，最终走到$(n,b_i)$，问所有走过路径不相交的方案

$a_1 \leq a_2 \leq ...\leq a_n$,$b$也一样，因此如果路径不相交那么一定有对应$(a_i,1) \rightarrow (n,b_i)$

$(a,b) \rightarrow (c,d)$的方案为$\binom{c-a+d-b}{c-a}$

构造矩阵高斯消元即可

```cpp
int a[110][110];
int qpow(int a,int b){
	int res=1;
	for(;b;b>>=1){
		if(b&1)res=res*a%mod;
		a=a*a%mod;
	}
	return res;
}
struct Comb{
    vector<int> fac,inv;
    int qpow(int a,int b){
        int res=1;
        for(;b;b>>=1){
            if(b&1)res=res*a%mod;
            a=a*a%mod;
        }
        return res;
    }   
    void init(int n){
        fac.assign(n+1,1);
        inv.assign(n+1,1);
        for(int i=1;i<=n;i++)fac[i]=fac[i-1]*i%mod;
        inv[n]=qpow(fac[n],mod-2);
        for(int i=n-1;i>=0;i--)inv[i]=inv[i+1]*(i+1)%mod;
    }
    int binom(int n,int m){
        if(n<m||m<0)return 0;
        return fac[n]*inv[m]%mod*inv[n-m]%mod;
    }
};
inline int det(int m){
	int res=1;
	bool flag_neg=false;
	for(int i=1;i<=m;++i){
		int k=i;
		while(k<=m&&!a[k][i])++k;
		if(k>m)return 0;
		if(k!=i){
			for(int j=i;j<=m;++j)swap(a[i][j],a[k][j]);
			flag_neg^=1;
		}
		res=1ll*res*(a[i][i]+mod)%mod;
		int t=qpow(a[i][i],mod-2);
		for(int k=i+1;k<=m;++k){
			int t0=1ll*t*a[k][i]%mod;
			for(int j=i;j<=m;++j)a[k][j]=(a[k][j]-1ll*a[i][j]*t0)%mod;
		}
	}
	return flag_neg?mod-res:res; 
}
void solve(){
	int n,m;
	cin>>n>>m;
	vector<int> A(m),B(m);
	for(int i=0;i<m;i++){
		cin>>A[i]>>B[i];
	}
	Comb comb;
	comb.init(2e6+10);
	for(int i=0;i<m;i++){
		for(int j=0;j<m;j++)a[i+1][j+1]=A[i]<=B[j]?comb.binom(B[j]-A[i]+n-1,n-1):0;
	}
	cout<<det(m)<<"\n";
}
```

### 从$(1,1) \rightarrow (n,m)$的不相交路径对数

发现起点一定经过$(1,2),(2,1)$，终点一定经过$(n-1,m),(n,m-1)$
$$
\begin{pmatrix}
f(a_1,b_1) & f(a_1,b_2)\\
f(a_2,b_1) & f(a_2,b_2)
\end{pmatrix}=
f(a_1,b_1)f(a_2,b_2)-f(a_1,b_2)f(a_2,b_1)
$$

### 范德蒙德行列式优化矩阵+NTT计算

![在这里插入图片描述](/assets/img/remote/8a4fe2dffa.png)
![在这里插入图片描述](/assets/img/remote/eba2880c87.png)
![在这里插入图片描述](/assets/img/remote/0370e5c508.png)
![在这里插入图片描述](/assets/img/remote/19ac8570fc.png)



$\prod (a_j-a_i)$用ntt计算，构造$f(x)=\sum x^{-a_i},g(x)=\sum x^{a_j}，(f*g)[i]$就是差值为$i$的个数

```cpp
void solve(){
	int n;
	cin>>n;
	vector<int> a(n+1);
	Comb comb;
	const int N=1e6;
	comb.init(N);
	int ans=1;
	vector<int> A(N+1),B(N+1);
	for(int i=1;i<=n;i++){
		cin>>a[i];
		ans=ans*(a[i]+1)%mod*comb.inv[i]%mod;
		A[a[i]]++;
		B[N-a[i]]++;
	}
	NTT::mul(A,B,2*N+1,2*N+1);
	for(int i=N+1;i<=2*N;i++){
		if(A[i])ans=ans*qpow(i-N,A[i])%mod;
	}
	cout<<ans<<"\n";
}
```

### 例题3

给定n个点m条边的有向无环图，其中没有入度的点被视为源点，没有出度的点被视为汇点。 保证源点和汇点数目相同。 考虑所有把源汇点两两配对，并用两两不相交的路径把它们两两连接起来的所有方案。 如果这个方案中，把源点按标号1到n排序后，得到的对应汇点序列的逆序数对的个数是奇数，那么A给B一块钱，否则B给A一块钱。 问最后A的收益，对大质数取模。 n ≤ 600

这符合LGV的定义，因此直接求行列式的值即可

```cpp
void solve(){
	int n,m,p;
	cin>>n>>m>>mod;
	vector<vector<int>> adj(n+1),dp(n+1,vector<int>(n+1));
	vector<int> in(n+1),out(n+1);
	for(int i=1;i<=m;i++){
		int u,v;
		cin>>u>>v;
		adj[u].push_back(v);
		in[v]++;
		out[u]++;
	}
	int idx=0;
	queue<int> q;
	for(int i=1;i<=n;i++){
		if(in[i]==0){
			dp[++idx][i]=1;
			q.push(i);
		}
	}
	while(!q.empty()){
		auto u=q.front();
		q.pop();
		for(auto v:adj[u]){
			for(int i=1;i<=idx;i++){
				dp[i][v]=(dp[i][v]+dp[i][u])%mod;
			}
			if(--in[v]==0){
				q.push(v);
			}
		}
	}
	int t=0;
	for(int i=1;i<=n;i++){
		if(out[i]==0){
			++t;
			for(int j=1;j<=idx;j++)a[j][t]=dp[j][i];
		}
	}
	cout<<det(t)<<"\n";
}
```

### 例题4

P7736，偶数交点-奇数交点答案也是矩阵的行列式，路径交点的奇偶性就是起点对应终点的排列\(p_i\)的逆序对数量的奇偶性。
