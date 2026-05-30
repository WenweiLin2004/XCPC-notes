---
title: "Codeforces Round 1026 (Div. 2)题解"
date: "2025-05-25"
sourceFile: "2025-05-25-Codeforces Round 1026 (Div. 2)题解.md"
category: "contests"
categoryLabel: "竞赛题解"
subcategory: "codeforces"
subcategoryLabel: "Codeforces"
tags: ["竞赛题解", "Codeforces"]
---

<PostMeta />
[题目链接](https://codeforces.com/contest/2110)
# A. Fashionable Array
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/b0d848816c5646e38a32f96645a85b3f.png)
题意既让min和max同奇偶
那么排序一下，分别处理奇偶数的最小坐标和最大坐标即可
```cpp
void solve(){
    int n;
    cin>>n;
    vector<int> a(n);
    for(auto &x:a)cin>>x;
    ranges::sort(a);
    int l[2]={-1,-1},r[2]={-1,-1};
    for(int i=0;i<n;i++){
        r[a[i]%2]=i;
    }
    for(int i=n-1;i>=0;i--){
        l[a[i]%2]=i;
    }
    int ans=0;
    if(l[0]!=-1&&r[0]!=-1)ans=max(ans,r[0]-l[0]+1);
    if(l[1]!=-1&&r[1]!=-1)ans=max(ans,r[1]-l[1]+1);
    cout<<n-ans<<"\n";
}
```
# B. Down with Brackets
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/e4a659ea4df244fd934981e25bd5aecd.png)
发现最简单的情况`()()`拿掉最左和最右的括号就会变得不平衡`)(`
因此直接判断是否可以分成两个平衡括号
```cpp
void solve(){
    string s;
    cin>>s;
    int cnt=0;
    int a=0;
    for(auto c:s){
        if(c=='(')a++;
        else a--;
        if(a==0)cnt++;
    }
    if(cnt>1)cout<<"YES\n";
    else cout<<"NO\n";
}
```
# C. Racing
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/e7e317d6116b41aca016f690827629b4.png)
首先我们先判断合不合法
可以维护每个地方的最小高度和最大高度，这很容易做出来

假设已知每个地方的最大高度为$h$，那么从后往前更新一下$h_i=\min(h_i,h_{i+1}+[a_{i+1}=1])$

然后我们知道了当前的最大高度，以及判断了一定存在答案，所以每一次我们尽可能地升高即可
```cpp
void solve(){
    int n;
    cin>>n;
    vector<int> a(n+1);
    for(int i=1;i<=n;i++)cin>>a[i];
    vector<array<int,2>> seg(n+1);
    int l=0,r=0;
    vector<array<int,2>> b(n+1);
    for(int i=1;i<=n;i++)cin>>b[i][0]>>b[i][1];
    for(int i=1;i<=n;i++){
        auto [ql,qr]=b[i];
        if(a[i]==1)l++,r++;
        else if(a[i]==-1)r++;
        if(r<ql||l>qr){
            cout<<"-1\n";
            return;
        }
        l=max(l,ql);
        r=min(r,qr);
        seg[i]={l,r};
    }
    seg[0]={0,0};
    int h=0;
    for(int i=n-1;i>=1;i--){
        seg[i][1]=min(seg[i][1],seg[i+1][1]-(a[i+1]==1));
    }
    for(int i=1;i<=n;i++){
        if(a[i]==1)h++;
        else if(a[i]==-1){
            if(seg[i][1]>h){
                a[i]=1;
                h++;
            }
            else a[i]=0;
        }
    }
    for(int i=1;i<=n;i++)cout<<a[i]<<" \n"[i==n];
}
```
# D. Fewer Batteries
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/4e55fc98290e46f687c9016688d026cb.png)
一眼题，感觉比C简单多了
很容易想到二分
check就是跑一次最长路看能否到达n即可，因为`s<t`，因此直接线性扫一遍
```cpp
void solve(){
    int n,m;
    cin>>n>>m;
    vector<int> w(n+1);
    for(int i=1;i<=n;i++)cin>>w[i];
    vector<vector<PII>> e(n+1);
    for(int i=0;i<m;i++){
        int s,t,v;
        cin>>s>>t>>v;
        e[s].push_back({t,v});
    }
    vector<int> dis(n+1);
    auto check=[&](int mid){
        for(int i=1;i<=n;i++)dis[i]=-INF;
        dis[1]=min(w[1],mid);
        for(int i=1;i<=n;i++){
            for(auto [t,v]:e[i]){
                if(v>mid||v>dis[i])continue;
                dis[t]=max(dis[t],dis[i]+w[t]);
                dis[t]=min(dis[t],mid);
            }
        }
        return dis[n]!=-INF;
    };
    int l=0,r=1e10;
    while(l<r){
        int mid=l+r>>1;
        if(check(mid))r=mid;
        else l=mid+1;
    }
    cout<<(l==1e10?-1:l)<<"\n";
}
```
# E. Melody(欧拉回路)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/63f0c1f473e74f299e299f9efc9504c0.png)
大概可以变成这样一个问题，$n$个物品两个属性$v,p$问是否存在一个排列使得任意相邻的两个物品$v$相同或$p$相同，相邻的三个物品不能同时$v$相同或者$p$相同

只考虑前面的限制，看[UVA10129](https://www.luogu.com.cn/problem/UVA10129)这道题，基本就一模一样了，将物品看成一条边，连接$v,p$，转化为找到一条欧拉回路

再看后面的限制，相当于三条连续边会共用一个点，显然欧拉回路本身就没这个问题

```cpp
void solve(){
    int n;
    cin>>n;
    vector<int> v(n+1),p(n+1);
    vector<int> numsv,numsp;
    for(int i=1;i<=n;i++)cin>>v[i]>>p[i],numsv.push_back(v[i]),numsp.push_back(p[i]);
    sort(numsv.begin(),numsv.end());
    numsv.resize(unique(numsv.begin(),numsv.end())-numsv.begin());
    sort(numsp.begin(),numsp.end());
    numsp.resize(unique(numsp.begin(),numsp.end())-numsp.begin());
    int all=numsv.size()+numsp.size();
    vector<vector<PII>> adj(all+10);
    for(int i=1;i<=n;i++){
        v[i]=lower_bound(numsv.begin(),numsv.end(),v[i])-numsv.begin();
        p[i]=lower_bound(numsp.begin(),numsp.end(),p[i])-numsp.begin()+numsv.size();
        adj[v[i]].push_back({p[i],i});
        adj[p[i]].push_back({v[i],i});
    }
    int odd=0;
    int st=-1;
    for(int i=0;i<all;i++){
        if(adj[i].size()%2)odd++;
        if(adj[i].size())st=i;
    }
    if(st==-1){
        cout<<"NO\n";
        return;
    }
    if(odd>2){
        cout<<"NO\n";
        return;
    }   
    vector<bool> vis(all+1);
    queue<int> q;
    q.push(st);
    vis[st]=1;
    while(!q.empty()){
        auto u=q.front();
        q.pop();
        for(auto [v,id]:adj[u]){
            if(!vis[v]){
                vis[v]=1;
                q.push(v);
            }
        }
    }
    for(int i=0;i<all;i++){
        if(!vis[i]&&adj[i].size()){
            cout<<"NO\n";
            return;
        }
    }
    vector<bool> used(n+1);
    vector<int> path;
    vector<int> del(all);
    auto dfs=[&](auto dfs,int u)->void{
        for(int &i=del[u];i<adj[u].size();i++){
            auto [v,id]=adj[u][i];
            if(used[id])continue;
            used[id]=1;
            dfs(dfs,v);
            path.push_back(id);
        }
    };
    for(int i=0;i<all;i++){
        if(adj[i].size()%2){
            st=i;
            break;
        }
    }
    dfs(dfs,st);
    cout<<"YES\n";
    for(int i=path.size()-1;i>=0;i--){
        cout<<path[i]<<" ";
    }
    cout<<"\n";
}
```
# F. Faculty(数学)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/3f8f12a89cf14cbd9b047f39bfeb7b0a.png)
