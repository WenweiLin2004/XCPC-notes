---
title: '动态树LCT'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# 动态树LCT

```cpp
namespace LCT{
    /*
    记住操作的必须严格是森林
    isroot(x):判断x是否为根节点
    access(x):在x所在连通块上建一条从根到x的路径
    make_root(x):将x所在连通块的根变为x
    findroot(x):找到x所在连通块的根
    split(x,y):将x和y所在连通块的路径建一条splay树
    link(x,y):添加边
    cut(x,y):删边
    */
    static constexpr int INF=LLONG_MAX; 
    struct Node{
        Node *fa,*son[2];
        int val,sz,rev,sum;
        Node(int _v=0,Node *_fa=nullptr):fa(_fa),son{nullptr,nullptr},val(_v),sz(1){
            rev=0;
            sum=val;
        }
    };
    vector<Node*> stk;
    #define son(x,y) (x->son[y])
    void pushrev(Node *u){
        if(u==nullptr)return;
        u->rev^=1;
        swap(son(u,0),son(u,1));
    }
    void pushup(Node *u){
        if(!u)return;
        u->sz=1;
        u->sum=u->val*(u->cnt&1);
        if(son(u,0))u->sz+=son(u,0)->sz,u->sum^=son(u,0)->sum;
        if(son(u,1))u->sz+=son(u,1)->sz,u->sum^=son(u,1)->sum;
    }
    void pushdown(Node *u){
        if(u->rev){
            pushrev(son(u,0));
            pushrev(son(u,1));
            u->rev=0;
        }
    }
    bool isroot(Node *u){
        if(u->fa==nullptr)return true;
        return son(u->fa,0)!=u&&son(u->fa,1)!=u;
    }
    void rotate(Node *x){
        auto y=x->fa,z=y->fa;
        int d=(x==son(y,1));// 0: left, 1: right
        if(z&&y&&!isroot(y))son(z,y==son(z,1))=x;
        x->fa=z;
        if(y)son(y,d)=son(x,d^1),y->fa=x;
        if(son(x,d^1))son(x,d^1)->fa=y;
        x->son[d^1]=y;
        pushup(y);
        pushup(x);
    }
    void splay(Node *x){
        Node *r=x;
        stk.clear();
        stk.push_back(r);
        while(!isroot(r)){
            stk.push_back(r->fa);
            r=r->fa;
        }
        while(stk.size()){
            pushdown(stk.back());
            stk.pop_back();
        }
        while(!isroot(x)){
            Node *y=x->fa,*z=y->fa;
            if(!isroot(y)){
                if((x==son(y,1))==(y==son(z,1)))rotate(y);
                else rotate(x);
            }
            rotate(x);
        }
    }
    void access(Node *x){// 建立从根到x的路径，同时x变成根
        Node *z=x,*y=nullptr;
        while(x){
            splay(x);
            x->son[1]=y;
            pushup(x);
            y=x;
            x=x->fa;
        }
        splay(z);
    }
    void make_root(Node *x){// 使x为根
        access(x);
        pushrev(x);
    }
    Node* findroot(Node *x){// 找到x的根节点，再将原树的根节点变成splay的根节点
        access(x);
        while(son(x,0))pushdown(x),x=son(x,0);
        splay(x);
        return x;
    }
    void split(Node *x,Node *y){// 给x和y的路径建立splay,x为根
        make_root(y);
        access(x);
    }
    void link(Node *x,Node *y){// 连接y->x
        make_root(y);
        if(findroot(x)!=y)y->fa=x;
    }
    void cut(Node *x,Node *y){// 断开x和y的连接
        make_root(x);
        if(findroot(y)==x&&y->fa==x&&son(y,0)==nullptr){
            y->fa=nullptr;
            son(x,1)=nullptr;
            pushup(x);
        }
    }
    #undef son
}
using namespace LCT;
void solve(){
    int n,m;
    cin>>n>>m;
    vector<Node*> a(n+1);
    for(int i=1;i<=n;i++){
        int x;
        cin>>x;
        a[i]=new Node(x);
    }
    while(m--){
        int op,x,y;
        cin>>op>>x>>y;
        if(op==0){
            split(a[x],a[y]);
            cout<<a[x]->sum<<'\n';
        }
        else if(op==1)link(a[x],a[y]);
        else if(op==2)cut(a[x],a[y]);
        else{
            splay(a[x]);
            a[x]->val=y;
            pushup(a[x]);
        }
    }
}
```
