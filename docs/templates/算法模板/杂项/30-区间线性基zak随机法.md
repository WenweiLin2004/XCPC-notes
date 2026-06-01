---
title: '区间线性基(zak随机法)'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# 区间线性基(zak随机法)

* $S$序列的所有区间和的线性基等价于原区间线性基
```cpp
mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());
uniform_int_distribution<int> dis(0,1);
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
const int S=__lg(50000)+__lg(1000000000)+1;
Fenwick<int,decltype([](const int &a,const int &b){return a^b;})> fw[S],ori;
bool have[S][N];
int a[N];
int n,m;
void solve(){ 
    cin>>n>>m;
    for(int i=1;i<=n;i++)cin>>a[i];
    ori.init(n+1);
    for(int i=n;i>=1;i--)a[i]^=a[i-1],ori.add(i,a[i]);
    for(int i=0;i<S;i++){
        fw[i].init(n+1);
        for(int j=1;j<=n;j++){
            have[i][j]=dis(rng);
            if(have[i][j])fw[i].add(j,a[j]);
        }
    }
    while(m--){
        int op,l,r,v;
        cin>>op>>l>>r>>v;
        if(op==1){
            ori.add(l,v);
            a[l]^=v;
            for(int i=0;i<S;i++){
                if(have[i][l])fw[i].add(l,v);
            }
            if(r<n){
                ori.add(r+1,v);
                a[r+1]^=v;
                for(int i=0;i<S;i++){
                    if(have[i][r+1])fw[i].add(r+1,v);
                }
            }
            continue;
        }
        int x=ori.query(l);
        if(l==r){
            cout<<max(v,x^v)<<"\n";
            continue;
        }
        LinearBasis lb;
        lb.insert(x);
        for(int i=0;i<S;i++)lb.insert(fw[i].query(r)^fw[i].query(l));
        cout<<lb.query_max(v)<<"\n";
    }
}  
```
