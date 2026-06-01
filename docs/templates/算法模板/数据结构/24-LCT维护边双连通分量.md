---
title: 'LCT维护边双连通分量'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# LCT维护边双连通分量

```cpp
namespace LCT{
    struct DSU{
        vector<int> par,siz;
        DSU(){}
        DSU(int n){init(n);}
        void init(int n){
            par.resize(n);
            iota(par.begin(),par.end(),0);
            siz.assign(n,1);
        }
        int find(int x){return par[x]==x?x:par[x]=find(par[x]);}
        bool merge(int x,int y){
            x=find(x),y=find(y);
            if(x==y)return false;
            siz[x]+=siz[y];
            par[y]=x;
            return true;
        }
        int size(int x){return siz[find(x)];}
        bool same(int x,int y){return find(x)==find(y);}
    } dcc;
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
        int val,sz,rev;
        Node(int _v=0,Node *_fa=nullptr,int _cnt=1):fa(_fa),son{nullptr,nullptr},val(_v),sz(1){
            rev=0;
        }
    };
    vector<Node*> stk,a;
    #define son(x,y) (x->son[y])
    void pushrev(Node *u){
        if(u==nullptr)return;
        u->rev^=1;
        swap(son(u,0),son(u,1));
    }
    void pushup(Node *u){
        if(!u)return;
        u->sz=1;    
        if(son(u,0))u->sz+=son(u,0)->sz;
        if(son(u,1))u->sz+=son(u,1)->sz;
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
            if(x->fa){
                x=x->fa=a[dcc.find(x->fa->val)];// 重要改变
            }
            else x=x->fa;
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
    void del(Node *x,Node *y){
        if(!x)return;
        dcc.par[x->val]=y->val;
        dcc.siz[y->val]+=dcc.siz[x->val];
        del(son(x,0),y);
        del(son(x,1),y);
    }
    void link(Node *x,Node *y){// 连接y->x
        if(dcc.same(x->val,y->val))return;
        x=a[dcc.find(x->val)],y=a[dcc.find(y->val)];
        make_root(y);
        if(findroot(x)!=y)y->fa=x;
        else{
            del(son(y,1),y);
            son(y,1)=nullptr;
            pushup(y);
        }
    }
    void cut(Node *x,Node *y){// 断开x和y的连接
        make_root(x);
        if(findroot(y)==x&&y->fa==x&&son(y,0)==nullptr){
            y->fa=nullptr;
            son(x,1)=nullptr;
            pushup(x);
        }
    }
    void init(int n){
        dcc.init(n+1);
    }
    #undef son
}
using namespace LCT;
void solve(){
    int n,m;
    cin>>n>>m;
    init(n);
    a.assign(n+1,nullptr);
    for(int i=1;i<=n;i++)a[i]=new Node(i);
    vector<array<int,3>> e;
    for(int i=1;i<=m;i++){
        int u,v;
        cin>>u>>v;
        if(u>v)swap(u,v);
        e.push_back({u,v,0});
    }
    vector<array<int,3>> que;
    vector<int> ans;
    ranges::sort(e);
    while(1){
        int op,u,v;
        cin>>op;
        if(op==-1)break;
        cin>>u>>v;
        if(u>v)swap(u,v);
        que.push_back({op,u,v});
        if(!op){
            auto it=lower_bound(e.begin(),e.end(),array<int,3>{u,v,0});
            (*it)[2]=1;
        }
    }
    for(auto [u,v,op]:e){
        if(!op)link(a[u],a[v]);
    }
    ranges::reverse(que);
    for(auto [op,u,v]:que){
        auto fu=a[dcc.find(u)],fv=a[dcc.find(v)];
        if(op==1){
            split(fu,fv);
            ans.push_back(fu->sz-1);
        }
        else{
            link(fu,fv);
        }
    }
    ranges::reverse(ans);
    for(auto x:ans){
        cout<<x<<'\n';
    }
} 
```
