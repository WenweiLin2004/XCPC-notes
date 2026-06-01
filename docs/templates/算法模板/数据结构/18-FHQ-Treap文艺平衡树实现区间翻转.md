---
title: 'FHQ-Treap文艺平衡树实现区间翻转'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# FHQ-Treap文艺平衡树实现区间翻转

```cpp
struct FHQ{
    int ls,rs,key,sz,val;
    bool tag;
} fhq[N];
int root,T1,T2,T3,idx;
int newNode(int val){
    fhq[++idx]={0,0,(int)rnd(),1,val};
    return idx;
}
void pushup(int u){
    fhq[u].sz=fhq[fhq[u].ls].sz+fhq[fhq[u].rs].sz+1;
}
void pushdown(int u){
    if(fhq[u].tag){
        swap(fhq[u].ls,fhq[u].rs);
        if(fhq[u].ls)fhq[fhq[u].ls].tag^=1;
        if(fhq[u].rs)fhq[fhq[u].rs].tag^=1;
        fhq[u].tag=0;
    }
}
void split(int u,int k,int &x,int &y){
    if(!u){
        x=y=0;
        return;
    }
    pushdown(u);
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
        pushdown(x);
        fhq[x].rs=merge(fhq[x].rs,y);
        pushup(x);
        return x;
    }
    pushdown(y);
    fhq[y].ls=merge(x,fhq[y].ls);
    pushup(y);
    return y;
}
void reverse(int l,int r){
    split(root,l-1,T1,T2);
    split(T2,r-l+1,T2,T3);
    fhq[T2].tag^=1;
    root=merge(merge(T1,T2),T3);
}
void dfs(int u){
    if(!u)return;
    pushdown(u);
    dfs(fhq[u].ls);
    cout<<fhq[u].val<<" ";
    dfs(fhq[u].rs);
}
void solve(){
    int n,m;
    cin>>n>>m;
    for(int i=1;i<=n;i++){
        root=merge(root,newNode(i));
    }
    while(m--){
        int l,r;
        cin>>l>>r;
        reverse(l,r);
    }
    dfs(root);
}
```
