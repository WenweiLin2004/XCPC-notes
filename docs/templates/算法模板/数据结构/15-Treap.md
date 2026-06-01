---
title: 'Treap'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# Treap

```cpp
struct Node{
    int l,r;//左右儿子
    int key,val;//key为二叉搜索树的权值，val为堆的权值
    int cnt,size;//cnt为当前为key的个数，size为子树大小
} t[N];
int root,idx;
void pushup(int p){
    t[p].size=t[t[p].l].size+t[t[p].r].size+t[p].cnt;
}
int newNode(int key){
    t[++idx].key=key;
    t[idx].val=rand();
    t[idx].cnt=t[idx].size=1;
    return idx;
}
void build(){
    newNode(-INF),newNode(INF);
    root=1,t[1].r=2;//赋值哨兵，防止越界访问
    pushup(root);
}
void zig(int &p){//右旋
    int q=t[p].l;
    t[p].l=t[q].r,t[q].r=p,p=q;
    pushup(t[p].r);
    pushup(p);
}
void zag(int &p){//左旋
    int q=t[p].r;
    t[p].r=t[q].l,t[q].l=p,p=q;
    pushup(t[p].l);
    pushup(p);
}
void insert(int &p,int key){
    if(!p)p=newNode(key);
    else if(t[p].key==key)t[p].cnt++;
    else if(t[p].key>key){
        insert(t[p].l,key);
        if(t[t[p].l].val>t[p].val)zig(p);
    }
    else{
        insert(t[p].r,key);
        if(t[t[p].r].val>t[p].val)zag(p);
    }
    pushup(p);
}
void remove(int &p,int key){
    if(!p)return;
    if(t[p].key==key){
        if(t[p].cnt>1)t[p].cnt--;
        else if(t[p].l||t[p].r){
            if(!t[p].r||t[t[p].l].val>t[t[p].r].val){
                zig(p);//右旋之后的p为左儿子,p->t[p].r
                remove(t[p].r,key);
            }
            else{
                zag(p);
                remove(t[p].l,key);
            }
        }
        else p=0;
    }
    else if(t[p].key>key)remove(t[p].l,key);
    else remove(t[p].r,key);
    pushup(p);
}
int get_rank_by_key(int p,int key){
    if(!p)return 1;
    if(t[p].key==key)return t[t[p].l].size+1;
    if(t[p].key>key)return get_rank_by_key(t[p].l,key);
    return t[t[p].l].size+t[p].cnt+get_rank_by_key(t[p].r,key);
}
int get_key_by_rank(int p,int rank){
    if(!p)return INF;
    if(t[t[p].l].size>=rank)return get_key_by_rank(t[p].l,rank);
    if(t[t[p].l].size+t[p].cnt>=rank)return t[p].key;
    return get_key_by_rank(t[p].r,rank-t[t[p].l].size-t[p].cnt); 
}
int get_prev(int p,int key){//找到严格小于key的最大值
    if(!p)return -INF;
    if(t[p].key>=key)return get_prev(t[p].l,key);
    return max(t[p].key,get_prev(t[p].r,key));
}
int get_next(int p,int key){//找到严格大于key的最小值
    if(!p)return INF;
    if(t[p].key<=key)return get_next(t[p].r,key);
    return min(t[p].key,get_next(t[p].l,key));
}
void solve(){
    build();
    int q;
    cin>>q;
    while(q--){
        int op,x;
        cin>>op>>x;
        if(op==1)insert(root,x);
        else if(op==2)remove(root,x);
        else if(op==3)cout<<get_rank_by_key(root,x)-1<<"\n";//有一个负无穷，需要减一，下面同理
        else if(op==4)cout<<get_key_by_rank(root,x+1)<<"\n";
        else if(op==5)cout<<get_prev(root,x)<<"\n";
        else cout<<get_next(root,x)<<"\n";
    }
}
```
