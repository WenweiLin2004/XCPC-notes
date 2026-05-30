---
title: "Educational Codeforces Round 176 (Rated for Div. 2)"
date: "2025-03-21"
sourceFile: "2025-03-21-Educational Codeforces Round 176 (Rated for Div. 2).md"
category: "contests"
categoryLabel: "竞赛题解"
subcategory: "codeforces"
subcategoryLabel: "Codeforces"
tags: ["竞赛题解", "Codeforces"]
---

<PostMeta />
# 前言
[题目链接CF2075](https://codeforces.com/contest/2075)
# 	A - To Zero
签到
```cpp
#include<bits/stdc++.h>
#include<ext/pb_ds/assoc_container.hpp>
#include<ext/pb_ds/tree_policy.hpp>
using namespace std;
using namespace __gnu_pbds;
#define int long long
#define TR tree<int,null_type,less<int>,rb_tree_tag,tree_order_statistics_node_update>
typedef pair<int,int> PII;
const int N=5e5+10,M=2e5+10;
// const int INF=1e18;
// const int mod=998244353;
// const int mod=1e9+7;
mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());
void solve(){ 
    int n,k;
    cin>>n>>k;
    if(n%2==0){
        k--;
        cout<<(n+k-1)/k<<"\n";
        return;
    }
    if(n<=k){
        cout<<1<<"\n";
        return;
    }
    n-=k;
    k--;
    cout<<(n+k-1)/k+1<<"\n";
}   
signed main(){
    cin.tie(0)->sync_with_stdio(0);
    int T=1;
    cin>>T;
    while(T--)solve();
    return 0;
}
```
# B - Array Recoloring
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/3722dea1a2874024a5109256a248daa4.png)
* 选择top k+1个元素即可
* 特判k=1，此时只能中间选一个，然后选两边中的一个；或者两边全选
```cpp
#include<bits/stdc++.h>
#include<ext/pb_ds/assoc_container.hpp>
#include<ext/pb_ds/tree_policy.hpp>
using namespace std;
using namespace __gnu_pbds;
#define int long long
#define TR tree<int,null_type,less<int>,rb_tree_tag,tree_order_statistics_node_update>
typedef pair<int,int> PII;
const int N=5e5+10,M=2e5+10;
// const int INF=1e18;
// const int mod=998244353;
// const int mod=1e9+7;
mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());
void solve(){ 
    int n,k;
    cin>>n>>k;
    vector<int> a(n+1);
    for(int i=1;i<=n;i++)cin>>a[i];
    if(k==1){
        if(n==2)cout<<a[1]+a[2]<<"\n";
        else{
            int mx=0;
            for(int i=2;i<n;i++)mx=max(mx,a[i]);
            cout<<max(mx+max(a[1],a[n]),a[1]+a[n])<<"\n";
        }
        return;
    }
    sort(a.begin()+1,a.end(),greater<int>());
    int ans=0;
    for(int i=1;i<=k+1;i++)ans+=a[i];
    cout<<ans<<"\n";
}   
signed main(){
    cin.tie(0)->sync_with_stdio(0);
    int T=1;
    cin>>T;
    while(T--)solve();
    return 0;
}
```
# C - Two Colors
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/d8f3fa0346ac4b78bba24ba95c097ca5.png)
* 假设两种颜色的数量为$x,y$，那么这两个的方案为$\min(n-1,y)-\max(1,n-x)$,可以用树状数组做维护后面max的总和和数量，就可以转移
```cpp
#include<bits/stdc++.h>
#include<ext/pb_ds/assoc_container.hpp>
#include<ext/pb_ds/tree_policy.hpp>
using namespace std;
using namespace __gnu_pbds;
#define int long long
#define TR tree<int,null_type,less<int>,rb_tree_tag,tree_order_statistics_node_update>
typedef pair<int,int> PII;
const int N=5e5+10,M=2e5+10;
// const int INF=1e18;
// const int mod=998244353;
// const int mod=1e9+7;
mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());
template<typename T,typename F>
struct Fenwick{
    int n;
    vector<T> c;
    T identity;
    F op;
    Fenwick(){}
    Fenwick(int n_,T identity_=0){
        init(n,identity);
    }
    void init(int n_,T identity_=0){
        n=n_;
        c.assign(n,identity);
        identity=identity_;
    }
    void add(int x,T v,int rev=0){
        if(rev)x=n-x+1;
        for(;x<=n;x+=x&-x)c[x]=op(c[x],v);
    }
    T query(int x,int rev=0){
        if(rev)x=n-x+1;
        T res=identity;
        for(;x;x&=x-1)res=op(res,c[x]);
        return res;
    }
};
Fenwick<int,decltype([](const int &a,const int &b){return a+b;})> c,s;
void solve(){ 
    int n,m;
    cin>>n>>m;
    vector<int> a(m);
    for(auto &i:a)cin>>i;
    int mx=*max_element(a.begin(),a.end());
    c.init(mx+1);
    s.init(mx+1);
    int ans=0;
    for(int i=0;i<m;i++){
        int x=min(a[i],n-1);
        // cout<<c.query(x)<<" "<<s.query(x)<<"\n";
        ans+=(c.query(x)*(x+1)-s.query(x))*2;
        int y=max(1ll,n-a[i]);
        c.add(y,1);
        s.add(y,y);
    }
    cout<<ans<<"\n";
}   
signed main(){
    cin.tie(0)->sync_with_stdio(0);
    int T=1;
    cin>>T;
    while(T--)solve();
    return 0;
}
```
# D - Equalization
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/b0aa1875510d47518337f21c26d4083b.png)
* 相当于$x$和$y$右移若干位相等，且每个右移的次数只能用一次
* 每个只能选一次，相当于是个01二维背包问题，先预处理出数组$dp_{i,j}$表示第一个数右移$x$位第二个数右移$j$位的最小代价(这里滚动滚掉第一维了)
* 计算两个数二进制的公共前缀，然后算出$x$需要右移$a$位，$y$需要右移$b$位，那么答案就是$dp_{a,b}$？
* 这个是错的，因为如果$a=b=2$那么$dp_{2,2}$这个状态不存在，因此答案应该为$dp_{a+i,b+i}$？
* 这个还是错的，hack:2 3,答案应该为12，但是$dp_{3,3}=14$，如果我们目标是让两个数都为0，那么不必在意同时加$i$，两维数字可以随便选
* 上面全部情况取最小即可
```cpp
#include<bits/stdc++.h>
#include<ext/pb_ds/assoc_container.hpp>
#include<ext/pb_ds/tree_policy.hpp>
using namespace std;
using namespace __gnu_pbds;
#define int long long
#define TR tree<int,null_type,less<int>,rb_tree_tag,tree_order_statistics_node_update>
typedef pair<int,int> PII;
const int N=5e5+10,M=2e5+10;
const int INF=LLONG_MAX;
// const int mod=998244353;
// const int mod=1e9+7;
mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());
vector<vector<__int128>> dp(63,vector<__int128>(63,INF));
void init(){
    dp[0][0]=0;
    for(int i=1;i<=62;i++){
        vector<vector<__int128>> ndp(63,vector<__int128>(63,INF));
        for(int j=62;j>=0;j--){
            for(int k=62;k>=0;k--){
                ndp[j][k]=min(ndp[j][k],dp[j][k]);
                if(j-i>=0&&dp[j-i][k]!=INF){
                    ndp[j][k]=min(ndp[j][k],dp[j-i][k]+(1ll<<i));
                }
                if(k-i>=0&&dp[j][k-i]!=INF){
                    ndp[j][k]=min(ndp[j][k],dp[j][k-i]+(1ll<<i));
                }
            }
        }
        dp=ndp;
    }
}
void solve(){ 
    int n,m;
    cin>>n>>m;
    if(n==m){
        cout<<"0\n";
        return;
    }
    vector<int> bn,bm;
    while(n)bn.push_back(n%2),n/=2;
    while(m)bm.push_back(m%2),m/=2;
    int i=bn.size()-1,j=bm.size()-1;
    int mxn,mxm;
    if(bn.size()&&bm.size()){
        while(i>=0&&j>=0){
            if(bn[i]!=bm[j])break;
            i--,j--;
        }
        mxn=i+1,mxm=j+1;
    }
    else if(bn.size()){
        mxn=bn.size();
        mxm=0;
    }
    else{
        mxn=0;
        mxm=bm.size();
    }
    // for(int i=0;i<=60;i++){
    //     for(int j=0;j<=60;j++)cout<<format("{} {} {}\n",i,j,dp[i][j]);
    // }
    // cout<<mxn<<" "<<mxm<<"\n";
    __int128 ans=INF;
    for(int i=0;i<=62;i++){
        if(mxn+i<=62&&mxm+i<=62)ans=min(ans,dp[mxn+i][mxm+i]);
        for(int j=0;j<=62;j++){
            if(i>=bn.size()&&j>=bm.size())ans=min(ans,dp[i][j]);
        }
    }
    cout<<format("{}\n",ans);
}   
signed main(){
    cin.tie(0)->sync_with_stdio(0);
    int T=1;
    init();
    cin>>T;
    while(T--)solve();
    return 0;
}
```
# E - XOR Matrix
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/0fc2617c8f074a52b56e2c735ada9323.png)
* 显然,a、b两个数组都不应该存在大于2个不同的数，否则异或出来不同的数必定大于2
* 考虑两边数组都选一个，那么答案显然为$(A+1)(B+1)$
* 如果a有1个，贡献为$A+1$,b有2个，那么从$B+1$个选2个为$\binom{B+1}{2}$，然后每个位置可以任意选两个中的一个，除去全0的状态和全1的状态，有$2^m-2$,因此方案为$(A+1)\binom{B+1}{2}(2^m-2)$
* 同理如果a有2个，b有1个，答案为$(B+1)\binom{A+1}{2}(2^n-2)$
* 最麻烦的是两边数组均2个，此时$a_1 \oplus b_1=a_2 \oplus b_2$（其他情况如$a_1 \oplus b_1=a_1 \oplus b_2$不存在，因为此时$b_1=b_2$了，此时不满足假设条件了，另外一种同理）
* 两边同时异或上$a_2 \oplus b_1$，此时设$a_1 \oplus a_2=b_1 \oplus b_2=x$，假设$0 \leq a_1 \oplus x \lt a_1 \leq A,0 \leq b_1 \oplus x \lt b_2 \leq B$
* 因为有限制可以使用数位dp解决，设$dp_{pos,a,b,c}$表示在低$pos$位，$a=1$表示比pos高的位等于A，否则小于A，同理$b$表示B的，$c=1$表示此时x=0，否则大于0
* 使用记忆化搜索
* 枚举当前位$a_1$和$b_1$选什么，和普通数位dp写法一样
* 特别注意$x$，如果当前$c=1$且a和b有限制，那么此时$x$位只能选0，选1的话就不满组假设条件了。如果c没了限制，说明前面已经判定了$a_1 \oplus x \lt a_1$，当前位已经不是决定位，可以任选0，1
* 没做过几个数的数位dp，实际上三个limit标志只要有一个没有限制了，就可以直接返回已计算的值，这样只有a=1,b=1,c=1这条线不用记搜，而这条线只会走一次，因此复杂度是对的
* 复杂度$O(\log \max(A,B) \cdot 2^4)$
```cpp
#include<bits/stdc++.h>
#include<ext/pb_ds/assoc_container.hpp>
#include<ext/pb_ds/tree_policy.hpp>
using namespace std;
using namespace __gnu_pbds;
#define int long long
#define TR tree<int,null_type,less<int>,rb_tree_tag,tree_order_statistics_node_update>
typedef pair<int,int> PII;
const int N=3e5+10,M=2e5+10;
// const int INF=1e18;
const int mod=998244353;
// const int mod=1e9+7;
mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());
int dp[30][2][2][2],n,m,A,B;
int dfs(int pos,int a,int b,int c){
    if(!pos){
        return dp[pos][a][b][c]=c?0:1;
    }
    if((!a||!b||!c)&&~dp[pos][a][b][c])return dp[pos][a][b][c];
    int upa=a?((A>>pos-1)&1):1;
    int upb=b?((B>>pos-1)&1):1;
    int res=0;
    for(int i=0;i<=upa;i++){
        for(int j=0;j<=upb;j++){
            int na=a&&i==upa;
            int nb=b&&j==upb;
            int upc=c&&(i==0||j==0)?0:1;
            for(int k=0;k<=upc;k++){
                res+=dfs(pos-1,na,nb,c&&!k);
                res%=mod;
            }
        }
    }    
    if(!a||!b||!c)dp[pos][a][b][c]=res;
    return res;
}
int qpow(int a,int b){
    int ans=1;
    for(;b;b>>=1){
        if(b&1)ans=ans*a%mod;
        a=a*a%mod;
    }
    return ans;
}
void solve(){ 
    memset(dp,-1,sizeof dp);
    cin>>n>>m>>A>>B;
    //11
    int res=(A+1)*(B+1)%mod;
    //12
    res+=(B+1)*B/2%mod*(A+1)%mod*(qpow(2,m)+mod-2)%mod;
    res%=mod;
    //21
    res+=(A+1)*A/2%mod*(B+1)%mod*(qpow(2,n)+mod-2)%mod;
    res%=mod;
    //22
    res+=(qpow(2,m)+mod-2)%mod*(qpow(2,n)+mod-2)%mod*dfs(30,1,1,1)%mod;
    res%=mod;
    cout<<res<<"\n";
}   
signed main(){
    cin.tie(0)->sync_with_stdio(0);
    int T=1;
    cin>>T;
    while(T--)solve();
    return 0;
}
```
