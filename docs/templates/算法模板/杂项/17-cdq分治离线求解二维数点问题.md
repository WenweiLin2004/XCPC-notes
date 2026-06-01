---
title: 'cdq分治离线求解二维数点问题'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# cdq分治离线求解二维数点问题

* 多加一维z，原图的点z=0，查询点z=1
```cpp
struct Node{
    int x,y,z,p,id,op,res;
    bool operator<(const Node&tmp)const{
        if(x!=tmp.x)return x<tmp.x;
        if(y!=tmp.y)return y<tmp.y;
        return z<tmp.z;
    }
};
vector<Node> a,b;
void msort(int l,int r){
    if(l==r)return;
    int mid=l+r>>1;
    msort(l,mid),msort(mid+1,r);
    int i=l,j=mid+1,k=l;
    int sum=0;
    while(i<=mid&&j<=r){
        if(a[i].y<=a[j].y)sum+=a[i].p,b[k++]=a[i++];
        else a[j].res+=sum,b[k++]=a[j++];
    }
    while(i<=mid)sum+=a[i].p,b[k++]=a[i++];
    while(j<=r)a[j].res+=sum,b[k++]=a[j++];
    for(int i=l;i<=r;i++)a[i]=b[i];
}
void solve(){
    int n,m;
    cin>>n>>m;
    for(int i=1;i<=n;i++){
        int x,y,p;
        cin>>x>>y>>p;
        a.push_back({x,y,0,p,0,0,0});
    }
    for(int i=1;i<=m;i++){
        int x1,y1,x2,y2;
        cin>>x1>>y1>>x2>>y2;
        a.push_back({x2,y2,1,0,i,1,0});
        a.push_back({x2,y1-1,1,0,i,-1,0});
        a.push_back({x1-1,y2,1,0,i,-1,0});
        a.push_back({x1-1,y1-1,1,0,i,1,0});
    }
    sort(a.begin(),a.end());
    b=a;
    msort(0,a.size()-1);
    vector<int> ans(m+1);
    for(auto [x,y,z,p,id,op,res]:a){
        if(id)ans[id]+=op*res;
    }
    for(int i=1;i<=m;i++)cout<<ans[i]<<"\n";
}
```
