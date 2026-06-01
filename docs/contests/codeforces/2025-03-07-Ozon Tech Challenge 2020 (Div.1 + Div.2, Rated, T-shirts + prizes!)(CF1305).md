---
title: "Ozon Tech Challenge 2020 (Div.1 + Div.2, Rated, T-shirts + prizes!)(CF1305)"
date: "2025-03-07"
sourceFile: "2025-03-07-Ozon Tech Challenge 2020 (Div.1 + Div.2, Rated, T-shirts + prizes!)(CF1305).md"
category: "contests"
categoryLabel: "竞赛题解"
subcategory: "codeforces"
subcategoryLabel: "Codeforces"
tags: ["竞赛题解", "Codeforces"]
---

<PostMeta />
---

# 前言
这场写下来学到了很多东西，遂记录一下
# A
排序即可
```cpp
#include<bits/stdc++.h>
#include<ext/pb_ds/assoc_container.hpp>
#include<ext/pb_ds/tree_policy.hpp>
using namespace std;
using namespace __gnu_pbds;
#define int long long
#define TR tree<int,null_type,less<int>,rb_tree_tag,tree_order_statistics_node_update>
typedef pair<int,int> PII;
const int N=4e5+10,M=2e5+10;
const int INF=1e18;
const int mod=998244353;
// const int mod=1e9+7;
mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count()); 
void solve(){
    int n;
    cin>>n;
    vector<int> a(n),b(n);
    for(auto &i:a)cin>>i;
    for(auto &i:b)cin>>i;
    ranges::sort(a);
    ranges::sort(b);
    for(auto &i:a)cout<<i<<" ";
    cout<<"\n";
    for(auto &i:b)cout<<i<<" ";
    cout<<"\n";
}  
signed main(){
    cin.tie(0)->sync_with_stdio(0);
    int T=1;
    cin>>T;
    while(T--)solve();
    return 0;
}
```
# B(贪心)
贪心选择最左边的左括号和最右边的右括号
```cpp
#include<bits/stdc++.h>
#include<ext/pb_ds/assoc_container.hpp>
#include<ext/pb_ds/tree_policy.hpp>
using namespace std;
using namespace __gnu_pbds;
#define int long long
#define TR tree<int,null_type,less<int>,rb_tree_tag,tree_order_statistics_node_update>
typedef pair<int,int> PII;
const int N=4e5+10,M=2e5+10;
const int INF=1e18;
const int mod=998244353;
// const int mod=1e9+7;
mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count()); 
void solve(){
    vector<pair<char,int>> v;
    string s;
    cin>>s;
    for(int i=0;i<s.size();i++)v.push_back({s[i],i});
    vector<int> vis(s.size());
    vector<vector<int>> ans;
    while(1){
        int i=0,j=v.size()-1;
        vector<int> res;
        while(i<j){
            while(i<j&&v[i].first!='(')i++;
            while(i<j&&v[j].first!=')')j--;
            if(i>=j)break;
            vis[v[i].second]=1;
            vis[v[j].second]=1;
            res.push_back(v[i].second);
            res.push_back(v[j].second);
            i++,j--;
        }
        sort(res.begin(),res.end());
        if(res.size())ans.push_back(res);
        else break;
        vector<pair<char,int>> tmp;
        for(auto &[c,i]:v){
            if(!vis[i])tmp.push_back({c,i});
        }
        v=tmp;
    }
    cout<<ans.size()<<"\n";
    for(auto &v:ans){
        cout<<v.size()<<"\n";
        for(auto &i:v)cout<<i+1<<" ";
        cout<<"\n";
    }
}  
signed main(){
    cin.tie(0)->sync_with_stdio(0);
    int T=1;
    // cin>>T;
    while(T--)solve();
    return 0;
}
```
# C（思维）
求解$\prod_{1 \leq i \lt j \leq n} |a_i -a_j| \mod m$

$1 \leq n \leq 2e5,1 \leq m \leq 1000$

思路：

 * 如果有两个数模$m$相同，那么值为0
 * 否则亮亮不同，这样的数组长度最多为$m$，直接$m^2$暴力计算
```cpp
#include<bits/stdc++.h>
#include<ext/pb_ds/assoc_container.hpp>
#include<ext/pb_ds/tree_policy.hpp>
using namespace std;
using namespace __gnu_pbds;
#define int long long
#define TR tree<int,null_type,less<int>,rb_tree_tag,tree_order_statistics_node_update>
typedef pair<int,int> PII;
const int N=4e5+10,M=2e5+10;
const int INF=1e18;
const int mod=998244353;
// const int mod=1e9+7;
mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());
void solve(){
    int n,m;
    cin>>n>>m;
    vector<int> a(n+1),t(m);
    for(int i=1;i<=n;i++){
        cin>>a[i];
        t[a[i]%m]++;
    }
    for(int i=0;i<m;i++){
        if(t[i]>1){
            cout<<"0\n";
            return;
        }
    }
    t.assign(m,0);
    int ans=1;
    for(int i=1;i<=n;i++){
        for(int j=i+1;j<=n;j++)ans=ans*abs(a[i]-a[j])%m;
    }
    cout<<ans<<"\n";
}  
signed main(){
    cin.tie(0)->sync_with_stdio(0);
    int T=1;
    // cin>>T;
    while(T--)solve();
    return 0;
}
```
# D（思维，交互）
交互题，询问最多$\frac{n}{2}$次
* `? u v`询问两个节点的lca
* `! r`回答树的根

一开始树的形态已知(推了20分钟才发现，坐大牢)

* 发现每次询问只要能避免u是v的祖先或者v是u的祖先，每次都能排除两个节点，刚好满足
* 只需要每次都询问叶节点即可，然后把祖先下面的节点全部删除，祖先有可能成为新的叶节点

```cpp
#include<bits/stdc++.h>
#include<ext/pb_ds/assoc_container.hpp>
#include<ext/pb_ds/tree_policy.hpp>
using namespace std;
using namespace __gnu_pbds;
#define int long long
#define TR tree<int,null_type,less<int>,rb_tree_tag,tree_order_statistics_node_update>
typedef pair<int,int> PII;
const int N=4e5+10,M=2e5+10;
const int INF=1e18;
const int mod=998244353;
// const int mod=1e9+7;
mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());
int ask(int x,int y){
    cout<<"? "<<x<<" "<<y<<endl;
    cin>>x;
    return x;
}
void claim(int x){
    cout<<"! "<<x<<endl;
}
void solve(){
    int n;
    cin>>n;
    vector<int> adj[n+1],vis(n+1),din(n+1);
    for(int i=1;i<n;i++){
        int u,v;
        cin>>u>>v;
        adj[u].push_back(v);
        adj[v].push_back(u);
        ++din[u];
        ++din[v];
    }
    set<int> dot;
    for(int i=1;i<=n;i++){
        if(din[i]==1)dot.insert(i);
    }
    auto bfs=[&](int x,int y){
        if(x==y)return 0ll;
        queue<int> q;
        q.push(x);
        vis[x]=1;
        while(!q.empty()){
            auto u=q.front();
            q.pop();
            for(auto v:adj[u]){
                if(vis[v])continue;
                --din[v];
                if(v==y)continue;
                q.push(v);
                vis[v]=1;
            }
        }
        if(din[y]==1)dot.insert(y);
        if(din[y]==0)return y;
        return 0ll;
    };
    auto check=[&](){
        while(vis[*dot.begin()])dot.erase(dot.begin());
    };
    while(dot.size()>1){
        check();
        int x=*dot.begin();
        dot.erase(dot.begin());
        check();
        int y=*dot.begin();
        dot.erase(dot.begin());
        int z=ask(x,y);
        int h=bfs(x,z);
        if(h){
            claim(h);
            return;
        }
        h=bfs(y,z);
        if(h){
            claim(h);
            return;
        }
    }
    claim(*dot.begin());
}  
signed main(){
    cin.tie(0)->sync_with_stdio(0);
    int T=1;
    // cin>>T;
    while(T--)solve();
    return 0;
}
```
# E（思维，构造）
题意：

构造递增序列$[a_1,a_2,....,a_n]$满足$a_i+a_j=a_k(1 \lt i \lt j \lt k)$的个数为$m$
$1 \leq n \leq 5000, 1 \leq m \leq 1e9$
* 对于一个$i$，最多有$\frac{i-1}{2}$对数，因此贪心构造即为$[1,2,3,4,....]$这样得到的个数最多，当放不下下一个数时，可以缩小范围，下一个数为$a_l+a_{i-1}$从而减少产生的对数，可以发现这总是可以完成，只要长度足够
* 如果长度不够，那么输出-1
* 否则如果还有剩余，那么我们需要填充一些数，使得剩下的一部分不产生任何贡献，记前面填过的数的最大值为$mx$，那么接下来的数的间隔都需要大于$mx$，那么我们可以从$1e8$开始填，两个$1e8$相加一定会大于最终数的最大值，后面的就不会产生贡献

```cpp
#include<bits/stdc++.h>
#include<ext/pb_ds/assoc_container.hpp>
#include<ext/pb_ds/tree_policy.hpp>
using namespace std;
using namespace __gnu_pbds;
#define int long long
#define TR tree<int,null_type,less<int>,rb_tree_tag,tree_order_statistics_node_update>
typedef pair<int,int> PII;
const int N=4e5+10,M=2e5+10;
const int INF=1e18;
const int mod=998244353;
// const int mod=1e9+7;
mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());
void solve(){
    int n,m;
    cin>>n>>m;
    vector<int> a;
    int x=0;
    while(m&&a.size()<n){
        if(x/2<=m){
            m-=x/2;
            a.push_back(++x);
        }
        else{
            a.push_back(x-2*m+1+x);
            m=0;
        }
    }
    if(m){
        cout<<"-1\n";
        return;
    }
    int mx=0;
    if(a.size())mx=*max_element(a.begin(),a.end());
    mx++; 
    if(a.size()<n)a.push_back((int)1e8+mx);
    while(a.size()<n)a.push_back(a.back()+mx);
    for(int i:a)cout<<i<<' ';
    cout<<'\n';
}  
signed main(){
    cin.tie(0)->sync_with_stdio(0);
    int T=1;
    // cin>>T;
    while(T--)solve();
    return 0;
}
```
# F（思维，随机）
每次可以对数组一个数加1或减1，求最小操作次数使得数组gcd不为1

$1 \leq n \leq 2e5 ,1 \leq a_i \leq 10^{12}$

* 首先想到最简单的方法就是把奇数全部加1变成偶数，最多操作数不超过$n$
* 假设我们要把$gcd$变成$p$，那么对于一个数$x$，贡献为$\min(abs(x-\lfloor\frac{x}{p}\rfloor \cdot p),abs(x-\lceil \frac{x}{p} \rceil \cdot p))$
* 直接暴力分解质因数会超时，考虑其他的方向
* 接下来就是本题最妙的地方，因为最多答案不会超过$n$，因此$x$的变化不会超过1的至少有$\frac{n}{2}$个，否则$2x \gt 2 \cdot \frac{n}{2} \gt n$，那么这种方案一定不优
* 因此假设$x$为这$\frac{n}{2}$个数的其中一个，$\{x-1,x,x+1\}$的质因数就是答案对应的质因数，因此我们随机选取$C$个数，每次选不到的概率最大为$\frac{1}{2}$，全部选不中的概率为$\frac{1}{2^C}$
* 选择$C=30$觉得不够保险可以选更多，在复杂度范围内即可
* 筛选质因数的复杂度为$O(90\sqrt {\max a_i})$，每个数最多有11个质因数，因此质因数最多有990个，总复杂度为$O(90\sqrt {\max a_i}+990n)$
```cpp
#include<bits/stdc++.h>
#include<ext/pb_ds/assoc_container.hpp>
#include<ext/pb_ds/tree_policy.hpp>
using namespace std;
using namespace __gnu_pbds;
#define int long long
#define TR tree<int,null_type,less<int>,rb_tree_tag,tree_order_statistics_node_update>
typedef pair<int,int> PII;
const int N=1e6+10,M=2e5+10;
const int INF=1e18;
const int mod=998244353;
// const int mod=1e9+7;
mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());
void solve(){
    int n;
    cin>>n;
    vector<int> a(n);
    for(auto &i:a)cin>>i;
    set<int> s;
    auto cal=[&](int x){
        for(int i=2;i*i<=x;i++){
            if(x%i==0){
                s.insert(i);
                while(x%i==0)x/=i;
            }
        }
        if(x>1)s.insert(x);
    };
    for(int _=0;_<30;_++){
        int x=a[rng()%n];
        cal(x);
        cal(x-1);
        cal(x+1);
    }
    int ans=INF;
    for(auto p:s){
        int cnt=0;
        for(auto &x:a){
            int c=llabs((x+p-1)/p*p-x);
            if(x/p*p!=0)c=min(c,llabs(x/p*p-x));
            cnt+=c;
        }
        ans=min(ans,cnt);
    }
    cout<<ans<<"\n";
}  
signed main(){
    cin.tie(0)->sync_with_stdio(0);
    int T=1;
    // cin>>T;
    while(T--)solve();
    return 0;
}
```
# G（最大生成树，blouvka，SOSDP）
![在这里插入图片描述](/assets/img/remote/17861ba48f.png)
钦定$a_{n+1}=0$并且已染色，让边权为$a_i+a_j$，那么答案即为最大生成树-a的总和

* 方法一：直接枚举每一个权值的子集，连边，$O(3^{18}n)$，2800-2900ms，非常极限，实现不好会t
* 方法二：blouvka，使用SOS DP维护子集的最大边权，$O(18\cdot 2^{18}n)$
```cpp
#include<bits/stdc++.h>
#include<ext/pb_ds/assoc_container.hpp>
#include<ext/pb_ds/tree_policy.hpp>
using namespace std;
using namespace __gnu_pbds;
#define int long long
#define TR tree<int,null_type,less<int>,rb_tree_tag,tree_order_statistics_node_update>
typedef pair<int,int> PII;
const int N=3e6+10,M=2e5+10;
const int INF=1e18;
// const int mod=998244353;
const int mod=1e9+7;
mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());
const int LIMIT=1<<18;
struct DSU {
    std::vector<int> f, siz;
    
    DSU() {}
    DSU(int n) {
        init(n);
    }
    
    void init(int n) {
        f.resize(n);
        std::iota(f.begin(), f.end(), 0);
        siz.assign(n, 1);
    }
    
    int find(int x) {
        while (x != f[x]) {
            x = f[x] = f[f[x]];
        }
        return x;
    }
    
    bool same(int x, int y) {
        return find(x) == find(y);
    }
    
    bool merge(int x, int y) {
        x = find(x);
        y = find(y);
        if (x == y) {
            return false;
        }
        siz[x] += siz[y];
        f[y] = x;
        return true;
    }
    
    int size(int x) {
        return siz[find(x)];
    }
} dsu;
int n,a[N];
struct Node{
    int val,id;
} best[LIMIT][2],large[N];
void trans(Node x[2],Node y[2]){
    for(int i=0;i<2;i++){
        if(x[0].val<y[i].val||(x[0].val==y[i].val&&x[0].id!=y[i].id)){
            if(x[0].id!=y[i].id)x[1]=x[0];
            x[0]=y[i];
        }
        else if(x[1].val<y[i].val&&y[i].id!=x[0].id)x[1]=y[i];
    }
}
void solve(){ 
    cin>>n;
    int ans=0;
    for(int i=1;i<=n;i++)cin>>a[i],ans-=a[i];
    dsu.init(n+2);
    while(1){
        for(int i=0;i<LIMIT;i++)best[i][0]=best[i][1]={-1,-1};
        for(int i=1;i<=n+1;i++){
            int id=dsu.find(i);
            int x=a[i];
            if(best[x][0].val==-1)best[x][0]={x,id};
            else if(best[x][1].val==-1&&best[x][0].id!=id)best[x][1]={x,id};
        }
        for(int i=0;i<18;i++){
            for(int j=0;j<LIMIT;j++){
                if(j>>i&1){
                    trans(best[j],best[j^(1<<i)]);
                }
            }
        }
        for(int i=1;i<=n+1;i++)large[i]={-1,-1};
        for(int i=1;i<=n+1;i++){
            int s=(LIMIT-1)^a[i];
            int id=dsu.find(i);
            Node tmp;
            if(id==best[s][0].id)tmp=best[s][1];
            else tmp=best[s][0];
            if(tmp.val!=-1&&tmp.val+a[i]>large[id].val)large[id]={tmp.val+a[i],tmp.id};
        }
        bool flag=false;
        for(int i=1;i<=n+1;i++){
            if(dsu.find(i)==i&&large[i].val!=-1&&dsu.merge(i,large[i].id)){
                ans+=large[i].val;
                flag=true;
            }
        }
        if(!flag)break;
    }
    cout<<ans<<"\n";
}   
signed main(){
    cin.tie(0)->sync_with_stdio(0);
    int T=1;
    // cin>>T;
    while(T--)solve();
    return 0;
}
```
