---
title: "Codeforces Round #1014 (Div. 2)"
date: "2025-03-31"
sourceFile: "2025-03-31-Codeforces Round #1014 (Div. 2).md"
category: "contests"
categoryLabel: "竞赛题解"
subcategory: "codeforces"
subcategoryLabel: "Codeforces"
tags: ["竞赛题解", "Codeforces"]
---

<PostMeta />
# C - Asuna and the Mosquitoes
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/8a1947ed899f46fab329eaf990055619.png)
* 选定一个奇数，可以吃掉所有偶数，对于一个偶数，可以将剩余的其他奇数吃掉只剩1
* 答案就是$sum-odd+1$


# E - She knows...
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/380020bcfe6242b684a1db12b0a569cb.png)
* 题意可以转化为只考虑黑色单元格，他和白色的接触边数是多少，假设黑色连通块不连接边界，显然该连通块贡献必定为偶数。因此$1 \lt i  \lt n,1 \lt j \lt m$可以随便选，剩余的格子，四个角落的格子接触的边数也是偶数，贡献忽略不计，那么剩下的格子$2(n-2)+2(m-2)$就是决定性因素
* 假设填满了，如果为黑色格子数是偶数，那么接触边也是偶数，答案为$2^{nm-k}$,否则$0$
* 否则的话$nm-k-1$个格子可以乱填，剩余一个格子可以用来决定是黑色还是白色，答案为$2^{nm-k-1}$ 
```cpp
#include<bits/stdc++.h>
#include<ext/pb_ds/assoc_container.hpp>
#include<ext/pb_ds/tree_policy.hpp>
using namespace std;
using namespace __gnu_pbds;
#define int long long
#define F first
#define S second
#define TR tree<int,null_type,less<int>,rb_tree_tag,tree_order_statistics_node_update>
typedef pair<int,int> PII;
const int N=1e5+10,M=2e5+10;
const int INF=1e18;
// const int mod=998244353;
const int mod=1e9+7;
mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());
int qpow(int a,int b){
    int ans=1;
    for(;b;b>>=1){
        if(b&1)ans=ans*a%mod;
        a=a*a%mod;
    }
    return ans;
}
void solve(){
    int n,m,k;
    cin>>n>>m>>k;
    int all=(n-2)*2+(m-2)*2;
    int cnt=0;
    for(int i=0;i<k;i++){
        int x,y,c;
        cin>>x>>y>>c;
        if((x==1)^(x==n)^(y==1)^(y==m)){
            cnt+=c;
            all--;
        }
    }
    if(!all){
        if(cnt%2==0)cout<<qpow(2,n*m-k)<<"\n";
        else cout<<"0\n";
    }
    else cout<<qpow(2,n*m-k-1)<<"\n";

}  
signed main(){
    cin.tie(0)->sync_with_stdio(0);
    int T=1;
    cin>>T;
    while(T--)solve();
    return 0;
}
```
# F. Andryusha and CCB
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/91cafccd8fcc45459df4552376279aed.png)
* 假设为`01010101`这种，那么美丽值为$m$的子串，即长度为$m+1$的子串
* 将原字符串分块，分为长度大于1和等于1的，比如`00010111`变成`2112`
* 那么就可以得出一种解法，对于一个确定的美丽值$m \geq 1$,分成$k$个部分，他的范围在$[l,r]$内
* 证明：
	* $k=1$,$l=m+1,r=m+1$
	* $k \rightarrow k+1$	,假设$i$是原合法索引，那么只需要再多$m+1$个位置即可分出$k+1$块，$i \rightarrow i+m+1$
	* 如果$type_i=2$，说明当前块长度大于1，那么只需要从当前块分成两部分，那么就可以少用一块，$i \rightarrow i+m$ 
	* 因此每个$k$对应的索引都在一个范围内
* 对于一个$m$，假设新字符串长度为$N$,那么最多分出$\frac{N}{m}$个
* 那么$\sum \frac{N}{i}=N\log N$，总复杂度为$O(n \log n)$
* 特殊地考虑$m=0$,假设当前地位置为$j$，之前有$i$个切割点，那么需要保证没有横跨两个块的部分，因此每个切割点都要切一刀，则至少分为$i+1$部分，最多有$j$部分，因此答案为$j-(i+1)+1$

```cpp
void solve(){
    int n;
    cin>>n;
    string s;
    cin>>s;
    vector<int> L(n+1),R(n+1),type(n+1);
    int idx=0;
    for(int i=0,j;i<n;i++){
        j=i;
        while(j+1<n&&s[j+1]==s[i])j++;
        idx++;
        if(j-i+1>1)type[idx]=2;
        else type[idx]=1;
        L[idx]=i,R[idx]=j;
        i=j;
    }
    vector<int> ans(n); 
    for(int i=1;i<=idx;i++){
        for(int j=L[i];j<=R[i];j++)ans[j]+=j-i+2;
    }
    vector<int> b(idx+1);
    for(int m=1;m<idx;m++){
        int l=m+1,r=m+1;
        while(l<=idx){
            b[l]++;
            if(r+1<=idx)b[r+1]--;
            if(type[l]==2)l+=m;
            else l+=m+1;
            r+=m+1;
        }
    }
    int res=0;
    for(int i=1;i<=idx;i++){
        res+=b[i];
        for(int j=L[i];j<=R[i];j++)ans[j]+=res;
    }
    for(int i=0;i<n;i++)cout<<ans[i]<<" \n"[i==n-1];
}  
```
