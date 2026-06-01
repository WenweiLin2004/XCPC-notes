---
title: 'FHQ-Treap按值分裂'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# FHQ-Treap按值分裂

```cpp
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
void split(int u,int val,int &x,int &y){
    if(!u){
        x=y=0;
        return;
    }
    if(fhq[u].val>val){
        y=u;
        split(fhq[u].ls,val,x,fhq[u].ls);
    }
    else{
        x=u;
        split(fhq[u].rs,val,fhq[u].rs,y);
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
void insert(int val){
    split(root,val,T1,T2);
    root=merge(merge(T1,newNode(val)),T2);
}
void erase(int x){
    split(root,x,T1,T2);
    split(T1,x-1,T1,T3);
    T3=merge(fhq[T3].ls,fhq[T3].rs);
    root=merge(merge(T1,T3),T2);
}
int find_rank(int x){
    split(root,x-1,T1,T2);
    int res=fhq[T1].sz+1;
    root=merge(T1,T2);
    return res;
}
int kth(int k){
    int u=root;
    while(u){
        int tmp=fhq[fhq[u].ls].sz+1;
        if(tmp==k)break;
        if(k<tmp)u=fhq[u].ls;
        else{
            k-=tmp;
            u=fhq[u].rs;
        }
    }
    return fhq[u].val;
}
int find_prev(int u,int val){
    if(u==0)return -INF;
    if(fhq[u].val<val){
        int res=find_prev(fhq[u].rs,val);
        return res==-INF?fhq[u].val:res;
    }
    return find_prev(fhq[u].ls,val);
}
int find_next(int u,int val){
    if(u==0)return INF;
    if(fhq[u].val>val){
        int res=find_next(fhq[u].ls,val);
        return res==INF?fhq[u].val:res;
    }
    return find_next(fhq[u].rs,val);
}
void solve(){
    int n;
    cin>>n;
    while(n--){
        int op,x;
        cin>>op>>x;
        if(op==1)insert(x);
        else if(op==2)erase(x);
        else if(op==3)cout<<find_rank(x)<<"\n";
        else if(op==4)cout<<kth(x)<<"\n";
        else if(op==5)cout<<find_prev(root,x)<<"\n";
        else cout<<find_next(root,x)<<"\n";
    }
}
```
