---
title: '线段树( 区间取max+维护异或和)'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# 线段树( 区间取max+维护异或和)

```cpp
int a[N];
struct SegmentTree{
	static constexpr int BIT_COUNT=31;
	struct Node{
		int l,r,mn,se,cnt,tag;//tag是区间最小值的标记
		int sum;// 异或和
		array<int,BIT_COUNT> bit;
	};
	vector<Node> t;
	void init(int n){
		t.assign(n<<2,Node());
		build(1,1,n);
	}
	void pushup(int p){
		auto &u=t[p],&ls=t[p<<1],&rs=t[p<<1|1];
		u.sum=ls.sum^rs.sum;
		for(int i=0;i<BIT_COUNT;i++)u.bit[i]=ls.bit[i]+rs.bit[i];	
		if(ls.mn==rs.mn){
			u.mn=ls.mn;
			u.se=min(ls.se,rs.se);
			u.cnt=ls.cnt+rs.cnt;
		}
		else if(ls.mn<rs.mn){
			u.mn=ls.mn;
			u.se=min(ls.se,rs.mn);
			u.cnt=ls.cnt;
		}
		else{
			u.mn=rs.mn;
			u.se=min(ls.mn,rs.se);
			u.cnt=rs.cnt;
		}
	}
	void pushtag(int p,int tag){
		if(t[p].mn>=tag)return;
		if(t[p].cnt&1)t[p].sum^=t[p].mn^tag;
		for(int i=0;i<BIT_COUNT;i++){
			if(t[p].mn>>i&1)t[p].bit[i]-=t[p].cnt;
			if(tag>>i&1)t[p].bit[i]+=t[p].cnt;
		}
		t[p].mn=t[p].tag=tag;
	}
	void pushdown(int p){
		if(t[p].tag!=-1){
			pushtag(p<<1,t[p].tag);
			pushtag(p<<1|1,t[p].tag);
			t[p].tag=-1;
		}
	}
	void build(int p,int l,int r){
		t[p]={l,r,INF,INF,0,-1,0};
		if(l==r){
			t[p].mn=t[p].sum=a[l];
			t[p].cnt=1;
			for(int i=0;i<BIT_COUNT;i++)t[p].bit[i]=a[l]>>i&1;
			return;
		}
		int mid=l+r>>1;
		build(p<<1,l,mid);
		build(p<<1|1,mid+1,r);
		pushup(p);
	}
	void modify_max(int p,int l,int r,int k){
		if(t[p].mn>=k||l>t[p].r||r<t[p].l)return;
		if(l<=t[p].l&&r>=t[p].r&&t[p].se>k){
			pushtag(p,k);
			return;
		}
		pushdown(p);
		int mid=t[p].l+t[p].r>>1;
		if(l<=mid)modify_max(p<<1,l,r,k);
		if(r>mid)modify_max(p<<1|1,l,r,k);
		pushup(p);
	}
	int query_sum(int p,int l,int r){
		if(l<=t[p].l&&r>=t[p].r)return t[p].sum;
		pushdown(p);
		int mid=t[p].l+t[p].r>>1,res=0;
		if(l<=mid)res^=query_sum(p<<1,l,r);
		if(r>mid)res^=query_sum(p<<1|1,l,r);
		return res;
	}
	int query_bit(int p,int l,int r,int x){
		if(l<=t[p].l&&r>=t[p].r)return t[p].bit[x];
		pushdown(p);
		int mid=t[p].l+t[p].r>>1,res=0;
		if(l<=mid)res+=query_bit(p<<1,l,r,x);
		if(r>mid)res+=query_bit(p<<1|1,l,r,x);
		return res;
	}
};
void solve(){
	int n,m;
	cin>>n>>m;
	SegmentTree seg;
	for(int i=1;i<=n;i++)cin>>a[i];
	seg.init(n);
	while(m--){
		int op,l,r,x;
		cin>>op>>l>>r>>x;
		if(op==1)seg.modify_max(1,l,r,x);
		else{
			int s=seg.query_sum(1,l,r)^x;
			int mx=-1;
			for(int i=30;i>=0;i--){
				if(s>>i&1){
					mx=i;
					break;
				}
			}
			if(mx==-1)cout<<"0\n";
			else cout<<seg.query_bit(1,l,r,mx)+(x>>mx&1)<<"\n";
		}
	}
}   
```
