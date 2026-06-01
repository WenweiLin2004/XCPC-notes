---
title: 'CDQ分治'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# CDQ分治

```cpp
int t[N],n,k;
void add(int x,int y){
    for(int i=x;i<=k;i+=i&-i)t[i]+=y;
}
int query(int x){
    int ans=0;
    for(int i=x;i;i&=i-1)ans+=t[i];
    return ans;
}
struct Node{
    int a,b,c,cnt,res=0;
    bool operator<(const Node&tmp)const{
        if(a!=tmp.a)return a<tmp.a;
        if(b!=tmp.b)return b<tmp.b;
        return c<tmp.c;
    }
    bool operator==(const Node&tmp)const{
        return a==tmp.a&&b==tmp.b&&c==tmp.c;
    }
} a[N],b[N];
void msort(int l,int r){
    if(l==r)return;
    int mid=l+r>>1;
    msort(l,mid),msort(mid+1,r);
    int i=l,j=mid+1,k=l;
    while(i<=mid&&j<=r){
        if(a[i].b<=a[j].b)add(a[i].c,a[i].cnt),b[k++]=a[i++];
        else a[j].res+=query(a[j].c),b[k++]=a[j++];
    }
    while(i<=mid)add(a[i].c,a[i].cnt),b[k++]=a[i++];
    while(j<=r)a[j].res+=query(a[j].c),b[k++]=a[j++];
    for(int i=l;i<=mid;i++)add(a[i].c,-a[i].cnt);
    for(int i=l;i<=r;i++)a[i]=b[i];
}
void solve(){
    cin>>n>>k;
    for(int i=1;i<=n;i++)cin>>a[i].a>>a[i].b>>a[i].c,a[i].cnt=1;
    sort(a+1,a+n+1);
    int j=1;
    for(int i=1;i<=n;i++){
        if(a[i]==a[j-1])a[j-1].cnt++;
        else a[j++]=a[i];
    }
    msort(1,j-1);
    map<int,int> ans;
    for(int i=1;i<j;i++)ans[a[i].res+a[i].cnt-1]+=a[i].cnt;
    for(int i=0;i<n;i++)cout<<ans[i]<<"\n";
}
```
