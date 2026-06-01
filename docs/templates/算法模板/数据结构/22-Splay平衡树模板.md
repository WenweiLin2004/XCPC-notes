---
title: 'Splay平衡树模板'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# Splay平衡树模板

```cpp
struct Splay{
    static constexpr int INF=LLONG_MAX; 
    struct Node{
        Node *fa,*son[2];
        int val,sz,cnt;
        Node(int _v=0,Node *_fa=nullptr,int _cnt=1):fa(_fa),son{nullptr,nullptr},val(_v),sz(1),cnt(_cnt){}
    } *root;
    #define son(x,y) (x->son[y])
    void pushup(Node *u){
        if(!u)return;
        u->sz=u->cnt;
        if(son(u,0))u->sz+=son(u,0)->sz;
        if(son(u,1))u->sz+=son(u,1)->sz;
    }
    Splay(){
        // 哨兵防止溢出
        root=new Node(INF,nullptr);
        son(root,0)=new Node(-INF,root);
        pushup(root);
    }
    void pushdown(Node *u){}
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
    void splay(Node *x,Node *k=nullptr){
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
        while(u&&u->val!=val){
            pushdown(u);
            p=u,u=son(u,val>u->val);
        }
        if(u)u->cnt++;
        else{
            u=new Node(val,p);
            if(p)son(p,val>p->val)=u;
        }
        splay(u);
    }
    Node* kth(int k){
        k++;
        Node *u=root;
        while(u){
            pushdown(u);
            int lsz=son(u,0)?son(u,0)->sz:0;
            if(k<=lsz)u=son(u,0);
            else{
                lsz+=u->cnt;
                if(k<=lsz){
                    splay(u);
                    return u;
                }
                k-=lsz;
                u=son(u,1);
            }
        }
        return nullptr;
    }
    Node *pred(int val){
        Node *u=root,*p=nullptr;
        while(u){
            pushdown(u);
            if(u->val<val)p=u,u=son(u,1);
            else u=son(u,0);
        }
        if(p)splay(p);
        return p;
    }
    Node *succ(int val){
        Node *u=root,*p=nullptr;
        while(u){
            pushdown(u);
            if(u->val>val)p=u,u=son(u,0);
            else u=son(u,1);
        }
        if(p)splay(p);
        return p;
    }
    int rank(int val){
        Node *u=root,*p=nullptr;
        int rk=0;
        while(u){
            p=u;
            pushdown(u);
            int tmp=son(u,0)?son(u,0)->sz+u->cnt:u->cnt;
            if(u->val<val)rk+=tmp,u=son(u,1);
            else u=son(u,0);
        }
        if(p)splay(p);
        return rk;
    }
    void erase(int val){
        Node *L=pred(val),*R=succ(val);
        splay(L);
        splay(R,L);
        auto now=son(R,0);
        if(now&&now->val==val){
            if(now->cnt>1){
                now->cnt--;
                splay(now);
                return;
            }
            delete now;
            son(R,0)=nullptr;
        }
        pushup(R);
        pushup(L);
    }
    void output(Node *u){
        if(!u)return;
        pushdown(u);
        output(son(u,0));
        if(u->val!=-INF&&u->val!=INF){
            for(int _=0;_<u->cnt;_++)cout<<u->val<<' ';
        }
        output(son(u,1));
    }
    void output(){
        output(root);
    }
    #undef son
};
```
