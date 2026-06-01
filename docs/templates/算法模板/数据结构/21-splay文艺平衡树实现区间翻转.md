---
title: 'splay文艺平衡树实现区间翻转'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# splay文艺平衡树实现区间翻转

```cpp
struct Splay{
    static constexpr int INF=INT_MAX; 
    struct Node{
        Node *fa,*son[2];
        int val,sz;
        bool rev;
        Node(int _v=0,Node *_fa=nullptr):fa(_fa),son{nullptr,nullptr},val(_v),sz(1),rev(0){}
    } *root;
    #define son(x,y) (x->son[y])
    void pushup(Node *u){
        if(!u)return;
        u->sz=1;
        if(son(u,0))u->sz+=son(u,0)->sz;
        if(son(u,1))u->sz+=son(u,1)->sz;
    }
    Splay(){
        // 哨兵防止溢出
        root=new Node(INF,nullptr);
        son(root,0)=new Node(-INF,root);
        pushup(root);
    }
    void pushtag(Node *u,bool rev){
        u->rev^=rev;
        swap(son(u,0),son(u,1));
    }
    void pushdown(Node *u){
        if(u->rev){
            if(son(u,0))pushtag(son(u,0),1);
            if(son(u,1))pushtag(son(u,1),1);
            u->rev=0;
        }
    }
    void rotate(Node *x){
        auto y=x->fa,z=y->fa;
        int d=(x==son(y,1));// 0: left, 1: right
        if(z)son(z,y==son(z,1))=x;
        x->fa=z;
        if(y)son(y,d)=son(x,d^1),y->fa=x;
        if(son(x,d^1))son(x,d^1)->fa=y;
        x->son[d^1]=y;
        pushup(y);
        pushup(x);
    }
    void splay(Node *x,Node *k){
        while(x->fa!=k){
            Node *y=x->fa,*z=y->fa;
            if(z!=k){
                (son(y,1)==x)^(son(z,1)==y)?rotate(x):rotate(y);
            }
            rotate(x);
        }
        if(!k)root=x;
    }
    void insert(int val){
        Node *u=root,*p=nullptr;
        while(u)p=u,u=u->son[val>u->val];
        u=new Node(val,p);
        if(p)p->son[val>p->val]=u;
        splay(u,nullptr);
    }
    Node* kth(int k){
        Node *u=root;
        while(1){
            pushdown(u);
            int tmp=son(u,0)?son(u,0)->sz+1:1;
            if(tmp==k)return u;
            if(tmp>k)u=son(u,0);
            else k-=tmp,u=son(u,1);
        }
        return nullptr;
    }
    void reverse(int l,int r){
        if(l>r)return;
        Node *L=kth(l),*R=kth(r+2);
        splay(L,nullptr);
        splay(R,L);
        if(son(R,0))pushtag(son(R,0),1);
    }
    void output(Node *u){
        if(!u)return;
        pushdown(u);
        output(son(u,0));
        if(u->val!=-INF&&u->val!=INF)cout<<u->val<<' ';
        output(son(u,1));
    }
    void output(){
        output(root);
    }
    #undef son
};
```
