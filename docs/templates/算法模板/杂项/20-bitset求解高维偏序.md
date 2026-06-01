---
title: 'bitset求解高维偏序'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# bitset求解高维偏序

时间和空间复杂度：$O(\frac{n^2k}{\omega})$, $k$为维度
```cpp
void solve(){
    int n,K;
    cin>>n>>K;
    bitset<N> f[n];
    vector<array<int,4>> a(n);
    for(int i=0;i<n;i++)cin>>a[i][0]>>a[i][1]>>a[i][2],a[i][3]=i;
    bitset<N> g;
    for(int k=0;k<3;k++){
        g.reset();
        sort(a.begin(),a.end(),[&](auto x,auto y){return x[k]<y[k];});
        for(int i=0,j;i<n;i++){
            j=i;
            g.set(a[i][3]);
            while(j+1<n&&a[j+1][k]==a[i][k])g.set(a[++j][3]);
            for(int x=i;x<=j;x++){
                g.reset(a[x][3]);
                if(!k)f[a[x][3]]=g;
                else f[a[x][3]]&=g;
                g.set(a[x][3]);
            }
            i=j;
        }
    }
    vector<int> d(n+1);
    for(int i=0;i<n;i++)d[f[i].count()]++;
    for(int i=0;i<n;i++)cout<<d[i]<<"\n";
}
```
分块空间优化
时间复杂度不变，空间复杂度变成 $\frac{n^{1.5}k}{\omega}$
```cpp
void solve(){
    int n,K;
    cin>>n>>K;
    int block=sqrt(n);
    int idx=(n+block-1)/block;
    vector<int> be(n+1);
    for(int i=1;i<=idx;i++){
        int l=(i-1)*block+1,r=min(i*block,n);
        for(int j=l;j<=r;j++){
            be[j]=i;
        }
    }
    bitset<N> f[3][idx+1];
    vector<array<int,4>> a(n+1);
    for(int i=1;i<=n;i++)cin>>a[i][0]>>a[i][1]>>a[i][2],a[i][3]=i;
    vector rank(3,vector<int>(n+1)),val(3,vector<int>(n+1));
    for(int k=0;k<3;k++){
        sort(a.begin()+1,a.end(),[&](auto x,auto y){return x[k]<y[k];});
        for(int i=n;i>=1;i--){
            val[k][i]=a[i][3];
            if(i==n||a[i][k]!=a[i+1][k])rank[k][a[i][3]]=i;// 排名，若不为等号则需要修改
            else rank[k][a[i][3]]=rank[k][a[i+1][3]];
        }
        for(int i=1;i<=idx;i++){
            int r=min(i*block,n);
            for(int j=1;j<=r;j++)f[k][i].set(a[j][3]);//预处理小于等于块的所有编号
        }
    }
    vector<int> ans(n+1),d(n+1);
    bitset<N> g,tmp;
    for(int i=1;i<=n;i++){
        g.set();
        for(int k=0;k<3;k++){
            int rk=rank[k][i];
            tmp=f[k][be[rk]-1];//把前面的块答案直接拿来用
            int l=(be[rk]-1)*block+1,r=min(be[rk]*block,n);
            for(int j=l;j<=rk;j++)tmp.set(val[k][j]);// 遍历多余的长度
            tmp.reset(i);
            g&=tmp;
        }
        g[0]=0;
        ans[i]=g.count();
        d[ans[i]]++;
    }
    for(int i=0;i<n;i++)cout<<d[i]<<"\n";
}
```
