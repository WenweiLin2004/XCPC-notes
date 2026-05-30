---
title: "CF1866题解(COMPFEST 15 - Preliminary Online Mirror (Unrated, ICPC Rules, Teams Preferred))"
date: "2023-09-04"
sourceFile: "2023-09-04-CF1866题解(COMPFEST 15 - Preliminary Online Mirror (Unrated, ICPC Rules, Teams Preferred)).md"
category: "contests"
categoryLabel: "竞赛题解"
subcategory: "icpc"
subcategoryLabel: "ICPC"
tags: ["竞赛题解", "ICPC"]
---

<PostMeta />
# [CF1866](https://mirror.codeforces.com/contest/1866)
## A - Ambitious Kid
题意：每次操作能使数组一个数减1或加1，问最小操作数使 $a_1 \cdot a_2 \cdot .... \cdot a_n=0$  
思路：求最小绝对值
```cpp
void solve(){
	int n;
	int ans=INF;
	cin>>n;
	for(int i=1,x;i<=n;i++){
		cin>>x;
		ans=min(ans,abs(x));
	}
	cout<<ans<<'\n';
}
```
## B - Battling with Numbers
题意：  
$X=a_1^{b_1}\cdot a_2^{b_2}\cdot......$  
$Y=c_1^{d_1}\cdot c_2^{d_2}\cdot......$  
求多少对p,q使 $LCM(p,q)=X$    ,   $GCD(p,q)=Y$  
思路：LCM必定大于等于GCD，X必定包含Y的质因数且指数比Y大，否则输出0  
利用 $LCM\cdot GCD=p\cdot q$ ，所以 $X\cdot Y=p\cdot q$  
只需要求其中一个数有多少种可能，易想到第一个数为Y本身  
设Z=X/Y,题目转化为从Z中取若干个质因数（包括次数）与Y相乘得到的数有多少种  
假设Z有n个质因数，则种类为  ( $ C_{n}^{0}+C_{n}^{1}+...+C_{n}^{n}=2^n$)  
    
注意：用快速幂算 $ 2^n $,每次取模
```cpp
struct node{
	int a,b;
	bool operator<(const node&tmp){
		return a<tmp.a;
	}
};
ll ksm(ll a,ll b){
	ll ans=1;
	for(;b;b>>=1){
		if(b&1)ans=(ans*a)%mod;
		a=(a*a)%mod;
	}
	return ans%mod;
}
//bool solve(){
void solve(){
	int n;
	cin>>n;
	vector<node> a(n+1);
	unordered_map<int,int> vis;
	for(int i=1;i<=n;i++)cin>>a[i].a;
	for(int i=1;i<=n;i++)cin>>a[i].b,vis[a[i].a]=a[i].b;
	int m;
	cin>>m;
	vector<node> b(m+1);
	ll ans=0;
	for(int i=1;i<=m;i++)cin>>b[i].a;
	for(int i=1;i<=m;i++)cin>>b[i].b;
	if(n<m){
		cout<<"0\n";
		return;
	}
	bool g=0;
	for(int i=1;i<=m;i++){
		if(vis[b[i].a]<b[i].b){
			cout<<"0\n";
			return;
		}
		if(vis[b[i].a]>b[i].b)ans=(ans+1)%mod;
	}
	ans=(ans+n-m)%mod;
 
	cout<<ksm(2,ans)<<'\n';
}
```
