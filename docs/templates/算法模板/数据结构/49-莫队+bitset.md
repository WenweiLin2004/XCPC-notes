---
title: '莫队+bitset'
date: "2025-05-22"
sourceFile: "2025-05-22-补充算法笔记.md"
category: "templates"
---

<PostMeta />

# 莫队+bitset

一个长为$n$的序列，每次询问给出三个区间，去除都出现过的数，问剩下多少个数

$x+cnt[x]-1$的位置表示$x$第$cnt[x]$次出现$x$，用bitset求三个区间的and值即可

由于空间有限开不下$10^5*10^5$的bitset，因此只开$10^5*10^5/3$的空间，分三次运算

注意：莫队四个操作的顺序，先扩大后缩小

```cpp
namespace Mo{
    // 普通莫队
    struct Node{
        int id,l,r;
    };
    // be块编号，[L,R]块边界
    vector<int> be,L,R;
    // block块大小, tot块数量
    int block,tot;

    vector<Node> que; // 询问 
    bool cmp(Node x,Node y){
        return (be[x.l]^be[y.l])?be[x.l]<be[y.l]:((be[x.l]&1)?x.r<y.r:x.r>y.r);
        //奇数块从小到大，偶数块相反
    }
    void init(int n){
        block=sqrt(n);
        // block=max(1ll,sqrt(1.0*n*n/m));
        tot=(n+block-1)/block;
        be.assign(n+1,0);
        L.assign(tot+1,0);
        R.assign(tot+1,0);
        que.clear();
        for(int i=1;i<=tot;i++){
            L[i]=block*(i-1)+1,R[i]=min(block*i,n);
            for(int j=L[i];j<=R[i];j++)be[j]=i;
        }
    }
    void add_query(int l,int r){
        int id=que.size();
        que.push_back({id,l,r});
    }
}
using namespace Mo;
const int N=1e5+10,M=N/3+10;
bitset<N> now,sum[M];
void solve(){
    int n,q;
    cin>>n>>q;
    init(n);
    vector<int> a(n+1),nums;
    for(int i=1;i<=n;i++)cin>>a[i],nums.push_back(a[i]);
    sort(nums.begin(),nums.end());
    for(int i=1;i<=n;i++){
        a[i]=lower_bound(nums.begin(),nums.end(),a[i])-nums.begin();
    }
    vector<vector<PII>> Q(q);
    vector<int> ans(q);
    for(int i=0;i<q;i++){
        for(int j=0;j<3;j++){
            int l,r;
            cin>>l>>r;
            Q[i].push_back({l,r});
            ans[i]+=r-l+1;
        }
    }
    auto work=[&](){
        sort(que.begin(),que.end(),cmp);
        vector<int> cnt(n+1);
        auto add=[&](int x){
            cnt[a[x]]++;
            now.set(a[x]+cnt[a[x]]-1);
        };
        auto del=[&](int x){
            now.reset(a[x]+cnt[a[x]]-1);
            cnt[a[x]]--;
        };
        now.reset();
        int l=1,r=0;
        for(auto [id,ql,qr]:que){
            // 先扩大后缩小
            while(l>ql)add(--l);
            while(r<qr)add(++r);
            while(l<ql)del(l++);
            while(r>qr)del(r--);
            sum[id]&=now;
        }
    };
    int i=0;
    while(i<Q.size()){
        int l=i,r=min((int)Q.size()-1,i+M-1);
        que.clear();
        for(int j=l;j<=r;j++){
            for(int k=0;k<3;k++)que.push_back({j-l,Q[j][k].F,Q[j][k].S});
            sum[j-l].set();
        }
        work();
        for(int j=l;j<=r;j++)ans[j]-=3*sum[j-l].count();
        i=r+1;
    }
    for(auto &x:ans)cout<<x<<"\n";
}   
```
