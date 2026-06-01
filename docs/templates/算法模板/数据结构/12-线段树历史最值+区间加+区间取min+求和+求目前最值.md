---
title: '线段树(历史最值+区间加+区间取min+求和+求目前最值)'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# 线段树(历史最值+区间加+区间取min+求和+求目前最值)

```cpp
struct SegmentTree{
	struct Node{
		int l,r,mx,_mx,se,cnt,sum;// 最大值，次大值，最大值的数量，和
		int tmx,_tmx,tnmx,_tnmx;// 加法标记：最大值标记，最大值历史最大值标记，非最大值标记，非最大值历史最大值标记
	};
	vector<Node> t;
	void init(int n){
		t.assign(n<<2,Node());
		build(1,1,n);
	}
	void pushup(int p){
		auto &u=t[p],&ls=t[p<<1],&rs=t[p<<1|1];
		u.sum=ls.sum+rs.sum;
		u._mx=max(ls._mx,rs._mx);
		if(ls.mx==rs.mx){
			u.mx=ls.mx;
			u.se=max(ls.se,rs.se);
			u.cnt=ls.cnt+rs.cnt;
		}
		else if(ls.mx>rs.mx){
			u.mx=ls.mx;
			u.se=max(ls.se,rs.mx);
			u.cnt=ls.cnt;
		}
		else{
			u.mx=rs.mx;
			u.se=max(ls.mx,rs.se);
			u.cnt=rs.cnt;
		}
	}
	void pushtag(int p,int tmx,int _tmx,int tnmx,int _tnmx){
		auto &u=t[p];
		u.sum+=tmx*u.cnt+tnmx*(u.r-u.l+1-u.cnt);
		u._mx=max(u._mx,u.mx+_tmx);
		u._tmx=max(u._tmx,u.tmx+_tmx);
		u.mx+=tmx,u.tmx+=tmx;
		u._tnmx=max(u._tnmx,u.tnmx+_tnmx);
		if(u.se!=-INF)u.se+=tnmx;
		u.tnmx+=tnmx;
	}
	void pushdown(int p){
		auto &u=t[p],&ls=t[p<<1],&rs=t[p<<1|1];
		int mx=max(ls.mx,rs.mx);
		if(mx==ls.mx)pushtag(p<<1,u.tmx,u._tmx,u.tnmx,u._tnmx);
		else pushtag(p<<1,u.tnmx,u._tnmx,u.tnmx,u._tnmx);
		if(mx==rs.mx)pushtag(p<<1|1,u.tmx,u._tmx,u.tnmx,u._tnmx);
		else pushtag(p<<1|1,u.tnmx,u._tnmx,u.tnmx,u._tnmx);	
		u.tmx=u._tmx=u.tnmx=u._tnmx=0;
	}
	void build(int p,int l,int r){
		t[p]={l,r,-INF,-INF,-INF,0,0,0,0,0,0};
		if(l==r){
			t[p].mx=t[p]._mx=t[p].sum=a[l];
			t[p].cnt=1;
			return;
		}
		int mid=l+r>>1;
		build(p<<1,l,mid);
		build(p<<1|1,mid+1,r);
		pushup(p);
	}
	void modify_add(int p,int l,int r,int x){
		if(l<=t[p].l&&r>=t[p].r){
			pushtag(p,x,x,x,x);
			return;
		}
		pushdown(p);
		int mid=t[p].l+t[p].r>>1;
		if(l<=mid)modify_add(p<<1,l,r,x);
		if(r>mid)modify_add(p<<1|1,l,r,x);
		pushup(p);
	}
	void modify_min(int p,int l,int r,int k){
		if(t[p].mx<=k||l>t[p].r||r<t[p].l)return;
		if(l<=t[p].l&&r>=t[p].r&&k>t[p].se){
			pushtag(p,k-t[p].mx,k-t[p].mx,0,0);
			return;
		}
		if(t[p].l==t[p].r)return;
		pushdown(p);
		int mid=t[p].l+t[p].r>>1;
		if(l<=mid)modify_min(p<<1,l,r,k);
		if(r>mid)modify_min(p<<1|1,l,r,k);
		pushup(p);
	}
	int query_sum(int p,int l,int r){
		if(l<=t[p].l&&r>=t[p].r)return t[p].sum;
		pushdown(p);
		int mid=t[p].l+t[p].r>>1,res=0;
		if(l<=mid)res+=query_sum(p<<1,l,r);
		if(r>mid)res+=query_sum(p<<1|1,l,r);
		return res;
	}
	int query_max(int p,int l,int r){
		if(l<=t[p].l&&r>=t[p].r)return t[p].mx;
		pushdown(p);
		int mid=t[p].l+t[p].r>>1,res=-INF;
		if(l<=mid)res=max(res,query_max(p<<1,l,r));
		if(r>mid)res=max(res,query_max(p<<1|1,l,r));
		return res;
	}
	int query_hmax(int p,int l,int r){
		if(l<=t[p].l&&r>=t[p].r)return t[p]._mx;
		pushdown(p);
		int mid=t[p].l+t[p].r>>1,res=-INF;
		if(l<=mid)res=max(res,query_hmax(p<<1,l,r));
		if(r>mid)res=max(res,query_hmax(p<<1|1,l,r));
		return res;
	}
};
```
