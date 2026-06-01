---
title: '双向DFS'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# 双向DFS

* 可以使复杂度 $ O(a^b) \rightarrow O(a^{b/2}) $
`n`个礼物，有重量`g[i]`，求最多拿起的不超过`w`的重量    
$ 1 \leq n \leq 46 $    
$ 1 \leq g_i,w \leq 2^{31}-1 $    
* 对于前半部分,$ 2^k 预处理出全部的能组成的数，然后排序去重 ，时间复杂度O(2^klog2^k)=O(k \cdot 2^k) $
* $ 后半部分，O(2^{n-k})处理出后半部分，然后二分查找小于等于w-sum的前半部分的最大值，时间复杂度O(k \cdot 2^k) $  
* 均衡二者复杂度，$ k=\frac{n}{2} $  
```cpp
int n,k;
int pre[1<<25];
int a[50],w,ans,cnt;
void dfs1(int u,LL sum){
	if(u==k+1){
        pre[cnt++]=sum;
		return;
	}
	dfs1(u+1,sum);
	if(sum+a[u]<=w)dfs1(u+1,sum+a[u]);
}
void dfs2(int u,int sum){
	if(u==n+1){
        int l=0,r=cnt-1;
        while(l<r){
            int mid=l+r+1>>1;
            if(pre[mid]<=w-sum)l=mid;
            else r=mid-1;
        }
		ans=max(ans,sum+pre[l]);
		return;
	}
	dfs2(u+1,sum);
	if(sum+a[u]<=w)dfs2(u+1,sum+a[u]);
}
void solve(){
	cin>>w>>n;
	k=n/2;
	for(int i=1;i<=n;i++)cin>>a[i];
	dfs1(1,0);
	sort(pre,pre+cnt);
	cnt=unique(pre,pre+cnt)-pre;
	dfs2(k+1,0);
	cout<<ans<<"\n";
}
```
