---
title: 'FHQ-Treap按排名分裂'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# FHQ-Treap按排名分裂

```cpp
#include<bits/stdc++.h>
#define int long long
using namespace std;
const int N=2e6+10,M=6010;
const int mod=1e9+7;
const int INF=1e18;
typedef pair<int,int> PII;
mt19937_64 rnd(114514);
struct FHQ{
    int ls,rs,key,sz,val;
} fhq[N];
int root,T1,T2,T3,idx;
int newNode(int val){
    fhq[++idx]={0,0,(int)rnd(),1,val};
    return idx;
}
void pushup(int u){
    fhq[u].sz=fhq[fhq[u].ls].sz+fhq[fhq[u].rs].sz+1;
}
void split(int u,int k,int &x,int &y){
    if(!u){
        x=y=0;
        return;
    }
    int tmp=fhq[fhq[u].ls].sz+1;
    if(k==tmp){
        x=u;
        y=fhq[u].rs;
        fhq[u].rs=0;
    }
    else if(k<tmp){
        y=u;
        split(fhq[u].ls,k,x,fhq[u].ls);
    }
    else{
        x=u;
        split(fhq[u].rs,k-tmp,fhq[u].rs,y);
    }
    pushup(u);
}
int merge(int x,int y){
    if(!x||!y)return x+y;
    if(fhq[x].key>fhq[y].key){
        fhq[x].rs=merge(fhq[x].rs,y);
        pushup(x);
        return x;
    }
    fhq[y].ls=merge(x,fhq[y].ls);
    pushup(y);
    return y;
}
void solve(){
    int n;
    cin>>n;
    for(int i=1;i<=n;i++){
        root=merge(root,newNode(i));
    }
    for(int i=1;i<=n;i++){
        int x;
        cin>>x;
        x%=fhq[root].sz;
        split(root,x,T1,T2);
        split(T2,1,T2,T3);
        root=merge(T3,T1);
        cout<<fhq[T2].val<<"\n";
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
